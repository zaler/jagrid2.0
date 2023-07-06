<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

use App\Models\Event;
use App\Models\EventAccount;
use App\Models\EventType;
use App\Models\EventFile;
use App\Models\EventTagRelationship;
use App\Models\EventTagFormatRelationship;
use App\Models\EventStatus;
use App\Models\EventHistoryStatus;
use App\Models\RecurrentEvent;

use App\Services\EventService;

class EventController extends Controller
{
    protected $eventService;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        EventService $eventService
    )
    {
        $this->eventService = $eventService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $calendars = explode(',', $request->calendars);

        $events = Event::with(['type', 'files', 'tags', 'tagsFormat', 'status', 'user', 'accounts']);

        $events->whereHas('accounts', function ($query) use($calendars) {
            $query->whereIn('accounts.id', $calendars);
        });

        if(isset($request->eventTypeId)){
            $eventTypeIds = explode(',', $request->eventTypeId);
            $events->whereHas('type', function($query) use($eventTypeIds){
                return $query->whereIn('id', $eventTypeIds);
            });
        }

        if(isset($request->eventStatusId)){
            $eventStatusIds = explode(',', $request->eventStatusId);
            $events->whereHas('status', function($query) use($eventStatusIds){
                return $query->whereIn('id', $eventStatusIds);
            });
        }

        if(isset($request->tagsFormat)){
            $tagsFormats = explode(',', $request->tagsFormat);
            $events->whereHas('tagsFormat', function($query) use($tagsFormats){
                return $query->whereIn('event_tag_format_relationships.event_tag_format_id', $tagsFormats);
            });
        }

        if(isset($request->startDate) && isset($request->endDate)){
            $events->whereBetween('start', [$request->startDate, $request->endDate]);
        }else{
            if(isset($request->startDate)){
                $startDate = $request->startDate;
                $events->whereDate('start', '>', $startDate);
            }
    
            if(isset($request->endDate)){
                $endDate = $request->endDate;
                $events->whereDate('end', '<', $endDate);
            }
        }

        if(!isset($request->startDate) && !isset($request->endDate)){
            if(isset($request->currentViewCalendarStartDate) && isset($request->currentViewCalendarEndDate)){
                $tmpStart = new Carbon($request->currentViewCalendarStartDate);
                $tmpEnd = new Carbon($request->currentViewCalendarEndDate);
                //$events->whereBetween('start', [$tmpStart->subDays(60), $tmpEnd->addDays(60)]);
                $events->whereBetween('start', [$tmpStart, $tmpEnd]);
            }else{
                $events->where('start', 'LIKE', Carbon::now()->format('Y-m-') . '%');
            }
        }

        if(isset($request->indexes) && isset($request->externalEventId)){
            $indexes = explode(',', $request->indexes);
            $externalEventId = explode(',', $request->externalEventId);
            $events->where(function($query) use($indexes, $externalEventId){
                for ($i=0; $i < count($indexes); $i++) {
                    $query->orWhere('indexes', 'LIKE', '%' . $indexes[$i] . '%');
                }
                for ($i=0; $i < count($externalEventId); $i++) {
                    $query->orWhere('external_event_id', $externalEventId[$i]);
                }
            });
        }else{
            if(isset($request->indexes)){
                $indexes = explode(',', $request->indexes);
                $events->where(function($query) use($indexes){
                    for ($i=0; $i < count($indexes); $i++) {
                        $query->orWhere('indexes', 'LIKE', '%' . $indexes[$i] . '%');
                    }
                });
            }
    
            if(isset($request->externalEventId)){
                $externalEventId = explode(',', $request->externalEventId);
                $events->where(function($query) use($externalEventId){
                    for ($i=0; $i < count($externalEventId); $i++) {
                        $query->orWhere('external_event_id', $externalEventId[$i]);
                    }
                });
            }
        }

        return response()->json($events->orderBy('start', 'ASC')->limit(200)->get());
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $is_recurrent = false;

        if(isset($request->isRecurringEvent)){
            if($request->isRecurringEvent == "1"){
                $is_recurrent = true;
                $validated = $request->validate([
                    'title' => 'required',
                    'start' => 'required',
                    'event_type_id' => 'required',
                    'recurringEventEnd' => 'required',
                    'recurringEventRepeat' => 'required'
                ]);
            }
        }

        $validated = $request->validate([
            'title' => 'required',
            'start' => 'required',
            'event_type_id' => 'required'
        ]);

        $event = new Event;
        $event->title = $validated['title'];
        $event->start = new Carbon($validated['start']);
        $event->user_id = Auth::id();

        if( isset($request->url) ){
            $event->url = $request->url;
        }else{
            $event->url = Str::random(15);
        }

        if( isset($request->end) ){
            $event->end = new Carbon($request->end);
        }

        if( isset($request->allDay) ){
            $event->allDay = $request->allDay;
            if($request->allDay){
                $newStart = new Carbon($event->start);
                $newEnd = new Carbon($event->end);
                $newStart->startOfDay();
                $newEnd->startOfDay();
                $event->start = $newStart;
                $event->end = $newEnd;
            }
        }

        if( isset($request->event_type_id) ){
            $event->event_type_id = $request->event_type_id;
        }

        $defaultEventStatusId = 1;

        $event->event_status_id = $defaultEventStatusId;

        if(isset($request->isIndex) && $request->isIndex){
            $event->isIndex = $request->isIndex;
            $event->indexes = implode(',', $request->indexes);
        }

        if(isset($request->isExternalEvent)){
            $event->isExternalEvent = $request->isExternalEvent;
            $event->external_event_id = $request->external_event_id;
        }

        $event->is_recurrent = $is_recurrent;
        $event->save();

        foreach($request->accounts as $account){
            $eventAccount = new EventAccount;
            $eventAccount->event_id = $event->id;
            $eventAccount->account_id = $account['id'];
            $eventAccount->save();
        }

        if($is_recurrent){
            if(
                isset($request->recurringEventStart) &&
                isset($request->recurringEventEnd) &&
                isset($request->recurringEventRepeat)
            ){

                RecurrentEvent::create([ //parent recurrent event
                    'parent_id' => $event->id,
                    'child_id' => $event->id
                ]);

                $start = $request->recurringEventStart;
                $end = $request->recurringEventEnd;
                $repeat = $request->recurringEventRepeat;

                $period = CarbonPeriod::create($start, $repeat . ' days', $end);
                $i = 1;
                foreach ($period as $key => $date) {
                    if($i != 1){ //la primera vez no lo recorre. Arriba ya se ha guardado.
                        $eventDuplicate = $event->replicate();
                        $eventDuplicate->start = new Carbon($date->format('Y-m-d H:i:s'));
                        $tmpEnd = new Carbon($date->format('Y-m-d H:i:s'));
                        $eventDuplicate->end = $tmpEnd->addDay();
                        $eventDuplicate->url = Str::random(15);
                        $eventDuplicate->save();

                        RecurrentEvent::create([ //child recurrent event
                            'parent_id' => $event->id,
                            'child_id' => $eventDuplicate->id
                        ]);

                        foreach($request->accounts as $account){
                            $ea = new EventAccount;
                            $ea->event_id = $eventDuplicate->id;
                            $ea->account_id = $account['id'];
                            $ea->save();
                        }
                    }
                    $i++;
                }
            }
        }

        $event = Event::with(['type', 'files', 'tags', 'tagsFormat', 'status', 'user', 'accounts'])->where('id', $event->id)->first();
        return response()->json($event);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Http\Response
     */
    public function show(Event $event)
    {
        $event = Event::where('id', $event->id)->with(['type', 'files', 'tags', 'tagsFormat', 'status', 'accounts'])->first();
        return $event;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Event $event)
    {
        $is_recurrent = false;

        if(isset($request->isRecurringEvent)){
            if($request->isRecurringEvent == "1"){
                $is_recurrent = true;
                $validated = $request->validate([
                    'title' => 'required',
                    'start' => 'required',
                    'event_type_id' => 'required',
                    'recurringEventEnd' => 'required',
                    'recurringEventRepeat' => 'required'
                ]);
            }
        }

        $event = Event::find($event->id);

        $validated = $request->validate([
            'title' => 'required',
            'start' => 'required'
        ]);

        if( isset($validated['title']) ){
            $event->title = $validated['title'];
        }

        if( isset($validated['start']) ){
            $event->start = new Carbon($validated['start']);
        }

        if( isset($request->end) ){
            $event->end = new Carbon($request->end);
        }

        if( isset($request->allDay) ){
            $event->allDay = $request->allDay;
            if($request->allDay){
                $newStart = new Carbon($event->start);
                $newEnd = new Carbon($event->end);
                $newStart->startOfDay();
                $newEnd->startOfDay();
                $event->start = $newStart;
                $event->end = $newEnd;
            }
        }

        if( isset($request->description) ){
            $event->description = $request->description;
        }

        if( isset($request->event_type_id) ){
            $event->event_type_id = $request->event_type_id;
        }

        if( isset($request->objective) ){
            $event->objective = $request->objective;
        }

        if( isset($request->copy) ){
            $event->copy = $request->copy;
        }

        if( isset($request->copy_image) ){
            $event->copy_image = $request->copy_image;
        }

        if( isset($request->instructions) ){
            $event->instructions = $request->instructions;
        }

        if( isset($request->event_status_id) ){
            if($request->event_status_id != $event->event_status_id){
                $eventHistoryStatus = new EventHistoryStatus;
                $eventHistoryStatus->user_id = Auth::id();
                $eventHistoryStatus->event_id = $event->id;
                $eventHistoryStatus->from_status_id = $event->event_status_id;
                $eventHistoryStatus->to_status_id = $request->event_status_id;
                $eventHistoryStatus->save();
            }
            $event->event_status_id = $request->event_status_id;
        }

        if( isset($request->indexes) && count($request->indexes) > 0){
            $event->isIndex = true;
            $event->indexes = implode(',', $request->indexes);
        }else{
            $event->isIndex = false;
            $event->indexes = null;
        }
        
        $event->save();

        if($is_recurrent){
            if(
                isset($request->recurringEventStart) &&
                isset($request->recurringEventEnd) &&
                isset($request->recurringEventRepeat)
            ){

                $event->is_recurrent = true;
                $event->save();
                RecurrentEvent::create([ //parent recurrent event
                    'parent_id' => $event->id,
                    'child_id' => $event->id
                ]);

                $start = $request->recurringEventStart;
                $end = $request->recurringEventEnd;
                $repeat = $request->recurringEventRepeat;

                $period = CarbonPeriod::create($start, $repeat . ' days', $end);
                $i = 1;
                foreach ($period as $key => $date) {
                    if($i != 1){ //la primera vez no lo recorre. Arriba ya se ha guardado.
                        $eventDuplicate = $event->replicate();
                        $eventDuplicate->start = new Carbon($date->format('Y-m-d H:i:s'));
                        $tmpEnd = new Carbon($date->format('Y-m-d H:i:s'));
                        $eventDuplicate->end = $tmpEnd->addDay();
                        $eventDuplicate->url = Str::random(15);
                        $eventDuplicate->save();

                        RecurrentEvent::create([ //child recurrent event
                            'parent_id' => $event->id,
                            'child_id' => $eventDuplicate->id
                        ]);

                        foreach($request->accounts as $account){
                            $ea = new EventAccount;
                            $ea->event_id = $eventDuplicate->id;
                            $ea->account_id = $account['id'];
                            $ea->save();
                        }
                    }
                    $i++;
                }
            }
        }
        
        return $event;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Http\Response
     */
    public function destroy(Event $event)
    {
        $event->delete();
    }

    public function uploadFiles(Request $request){

        try {
            if(isset($request->format) && $request->format === 'link'){
                $eventFile = new EventFile;
                $eventFile->event_id = $request->event_id;
                $eventFile->path = $request->link;
                $eventFile->format = 'link';
                $eventFile->type = $request->type;
                if($eventFile->save()){
                    return response()->json($eventFile);
                }
            }else{
                $file = $request->file('file')->storePublicly('events/' . $request->type, 'public');
    
                $eventFile = new EventFile;
                $eventFile->event_id = $request->event_id;
                $eventFile->path = $file;
                $eventFile->format = $request->file('file')->extension();
                $eventFile->type = $request->type;
                if($eventFile->save()){
                    return response()->json($eventFile);
                }
            }
        } catch (\Throwable $th) {
            return response()->json($th->getMessage());
        }
    }

    public function deleteFile(Request $request){
        EventFile::find($request->file_id)->delete();
    }

    public function getEventTypes(){
        $eventTypes = EventType::all();
        return response()->json($eventTypes);
    }

    public function getEventStatuses(){
        $eventStatuses = EventStatus::all();
        return response()->json($eventStatuses);
    }

    public function updateDates(Request $request){

        //en vista semana, si NO es de todo el dia, es decir,
        //tiene hora para empezar, y dura mas de 1 dia, (pueden ser 2 o mas), 
        //y se pasa a todo el dia, el plugin fullcalendar, muestra que dura 1 hora un solo dia.
        //pero si se pasa a la vista mes, el evento se alarga y se ubica en el enddate que tenia

        $id = $request->id;
        $allDay = $request->allDay;
        $delta = $request->delta;
        $startDelta = $request->startDelta;
        $endDelta = $request->endDelta;
        $allEvents = $request->allEvents;

        if(isset($delta)){

            $delta = (object) $delta;

            $event = Event::find($id);

            $newStart = $this->eventService->calculateDelta($event->start, $delta);
            $newEnd = $this->eventService->calculateDelta($event->end, $delta);

            if($allDay){
                $newStart->startOfDay();
                $newEnd->startOfDay();
            }else{
                if($event->allDay && !$request->allDay){ //hack for event allday when pass to not all day. range 1 hour
                    /*$newEnd = $this->eventService->calculateDelta($event->start, $delta);
                    $newEnd = $newEnd->addHours(1);*/
                }
            }

            $event->start = $newStart;
            $event->end = $newEnd;
            $event->allDay = $allDay;
            $event->save();

        }

        if(isset($endDelta)){

            $endDelta = (object) $endDelta;

            $event = Event::find($id);

            $newEnd = $this->eventService->calculateDelta($event->end, $endDelta);

            if($allDay){
                $newEnd->startOfDay();
            }

            $event->end = $newEnd;
            $event->save();

        }

        if($allEvents){
            $parent_id = RecurrentEvent::where('child_id', $id)->first()->parent_id;
            $childrens = RecurrentEvent::where('parent_id', $parent_id)->get();

            foreach ($childrens as $child) {
                if($child->child_id != $id){
                    $childrenEvent = Event::find($child->child_id);

                    if(isset($delta)){
    
                        $delta = (object) $delta;
            
                        $newStart = $this->eventService->calculateDelta($childrenEvent->start, $delta);
                        $newEnd = $this->eventService->calculateDelta($childrenEvent->end, $delta);
            
                        if($allDay){
                            $newStart->startOfDay();
                            $newEnd->startOfDay();
                        }
            
                        $childrenEvent->start = $newStart;
                        $childrenEvent->end = $newEnd;
                        $childrenEvent->allDay = $allDay;            
                    }
            
                    if(isset($endDelta)){
            
                        $endDelta = (object) $endDelta;
            
                        $newEnd = $this->eventService->calculateDelta($childrenEvent->end, $endDelta);
            
                        if($allDay){
                            $newEnd->startOfDay();
                        }
            
                        $childrenEvent->end = $newEnd;        
                    }
    
                    $childrenEvent->save();
                }
            }
        }
    }

    public function updateDatesMilliseconds(Request $request){

        $id = $request->id;
        $allDay = $request->allDay;
        $startDelta = $request->startDelta;
        $endDelta = $request->endDelta;
        $allEvents = $request->allEvents;

        $event = Event::find($id);

        $newStart = $this->eventService->calculateDeltaMilliseconds($event->start, $startDelta);
        $newEnd = $this->eventService->calculateDeltaMilliseconds($event->end, $endDelta);

        if($allDay){
            $newStart->startOfDay();
            $newEnd->startOfDay();
        }

        $event->start = $newStart;
        $event->end = $newEnd;
        $event->allDay = $allDay;
        $event->save();

        if($allEvents){
            $parent_id = RecurrentEvent::where('child_id', $id)->first()->parent_id;
            $childrens = RecurrentEvent::where('parent_id', $parent_id)->get();

            foreach ($childrens as $child) {
                if($child->child_id != $id){
                    $childrenEvent = Event::find($child->child_id);

                    $newStart = $this->eventService->calculateDeltaMilliseconds($childrenEvent->start, $startDelta);
                    $newEnd = $this->eventService->calculateDeltaMilliseconds($childrenEvent->end, $endDelta);
        
                    if($allDay){
                        $newStart->startOfDay();
                        $newEnd->startOfDay();
                    }
        
                    $childrenEvent->start = $newStart;
                    $childrenEvent->end = $newEnd;
                    $childrenEvent->allDay = $allDay;  
    
                    $childrenEvent->save();
                }
            }
        }

        return $event;
    }

    public function duplicateEvent(Request $request){
        $event = Event::find($request->id);
        $eventDuplicate = $event->replicate();
        $eventDuplicate->title = $request->title;
        $eventDuplicate->url = Str::random(15);
        $eventDuplicate->save();

        $eventAccounts = EventAccount::where('event_id', $event->id)->get();
        foreach ($eventAccounts as $eventAccount) {
            $ea = new EventAccount;
            $ea->event_id = $eventDuplicate->id;
            $ea->account_id = $eventAccount->account_id;
            $ea->save();
        }

        $eventRelations = Event::with(['tags', 'tagsFormat'])->where('events.id', $request->id)->get();
        foreach ($eventRelations as $eventRelation) {
            foreach ($eventRelation->tags as $eventRelationTag) {
                $eventTagRelationship = new EventTagRelationship;
                $eventTagRelationship->event_id = $eventDuplicate->id;
                $eventTagRelationship->event_tag_id = $eventRelationTag->pivot->event_tag_id;
                $eventTagRelationship->save();
            }
            foreach ($eventRelation->tagsFormat as $eventRelationTagFormat) {
                $eventTagFormatRelationship = new EventTagFormatRelationship;
                $eventTagFormatRelationship->event_id = $eventDuplicate->id;
                $eventTagFormatRelationship->event_tag_format_id = $eventRelationTagFormat->pivot->event_tag_format_id;
                $eventTagFormatRelationship->save();
            }
        }
        $eventDuplicated = Event::where('id', $event->id)->with(['type', 'files', 'tags', 'tagsFormat', 'status', 'accounts'])->first();
        return response()->json($eventDuplicated);
    }

    public function addToAccount(Request $request){
        $eventAccount = new EventAccount;
        $eventAccount->event_id = $request->event_id;
        $eventAccount->account_id = $request->account_id;
        $eventAccount->save();
        return $eventAccount;
    }

    public function deleteFromAccount(Request $request){

        foreach ($request->removedValues as $removedValue) {
            $eventAccount = EventAccount::where([
                ['event_id', '=', $request->event_id],
                ['account_id', '=', $removedValue['value']]
            ]);
            $eventAccount->delete();
        }
        
    }

    public function getEventHistoryStatus(Request $request){
        $historyStatus = EventHistoryStatus::with(['user', 'fromStatus', 'toStatus'])->where('event_id', $request->event_id)->get();
        return response()->json($historyStatus);
    }
}
