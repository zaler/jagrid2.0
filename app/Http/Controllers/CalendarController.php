<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Event;
use App\Services\AccountService;
use App\Services\EventService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    protected $accountService;
    protected $eventService;
    protected $notificationService;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        AccountService $accountService,
        EventService $eventService,
        NotificationService $notificationService
    )
    {
        $this->accountService = $accountService;
        $this->eventService = $eventService;
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($this->accountService->existsCurrentUserInAccount($request->account_url)){
            if(isset($request->notify)){
                $this->notificationService->markAsRead($request->notify);
            }
            return view('/jagrid/calendar', [
                'account' => $this->accountService->getAccountByUrl($request->account_url)->first(),
                'event_id' => '',
                'isSingleEvent' => 0,
                'user_id' => Auth::id(),
                'user_role' => $this->accountService->getTeamRoleOfUser()
            ]);
        }
        abort(404);
    }

    /**
     * Display single event
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        if($this->accountService->existsCurrentUserInAccount($request->account_url)){
            if($this->eventService->existsEventInAccount($request->account_url, $request->event_url)){
                if(isset($request->notify)){
                    $this->notificationService->markAsRead($request->notify);
                }
                return view('/jagrid/calendar', [
                    'account' => $this->accountService->getAccountByUrl($request->account_url)->first(),
                    'event_id' => $this->eventService->getEventIdByUrl($request->event_url),
                    'isSingleEvent' => 1,
                    'user_id' => Auth::id(),
                    'user_role' => $this->accountService->getTeamRoleOfUser()
                ]);
            }
        }
        abort(404);
    }

    public function list(){
        return view('/jagrid/calendars', [
            'accounts' => $this->accountService->getAccounts()
        ]);
    }
}
