<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Carbon\Carbon;

class MassActionsController extends Controller
{
    public function changeEventDates(Request $request){
        $ids = $request->ids;
        $qty = $request->data['qty'];
        $criteria = $request->data['criteria'];

        $events = Event::whereIn('id', $ids)->get();

        foreach ($events as $event) {

            $id = $event->id;
            $start = $event->start;
            $end = $event->end;

            $newStart = '';
            $newEnd = '';

            if(!is_null($end)){
                $newStart = new Carbon($start);
                $newEnd = new Carbon($end);
            }else{
                $newStart = new Carbon($start);
                $newEnd = new Carbon($start);
            }

            $eventToUpdate = Event::find($id);
            switch ($criteria) {
                case 'days':
                    $eventToUpdate->start = $newStart->addDays($qty);
                    $eventToUpdate->end = $newEnd->addDays($qty);
                    break;
                case 'weeks':
                    $eventToUpdate->start = $newStart->addWeeks($qty);
                    $eventToUpdate->end = $newEnd->addWeeks($qty);
                    break;
                case 'months':
                    $eventToUpdate->start = $newStart->addMonths($qty);
                    $eventToUpdate->end = $newEnd->addMonths($qty);
                    break;
                default:
                    break;
            }
            $eventToUpdate->save();
        }
        return response()->json($events);
    }
}
