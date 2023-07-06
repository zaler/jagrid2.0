<?php

namespace App\Services;

use App\Models\Account;
use App\Models\UserAccount;
use App\Models\Event;
use App\Models\EventHistoryStatus;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Auth;

class EventService {

    public function existsEventInAccount($account_url, $event_url){
        $account = $this->getAccountByUrl($account_url);
        $event = $this->getEventByUrl($event_url);
        if($account->exists() && $event->exists()){
            foreach ($event->first()->accounts as $accountOfEvent) {
                if($account->first()->id == $accountOfEvent->id){
                    return true;
                }
            }
        }
        return false;
    }

    public function getEventByUrl($event_url){
        return Event::where('url', $event_url);
    }

    public function getAccountByUrl($account_url){
        return Account::where('url', $account_url);
    }

    public function getEventIdByUrl($event_url){
        return $this->getEventByUrl($event_url)->first()->id;
    }

    public function getEventsByAccountUrl($account_url){
        $rawdata = [];
        $account = $this->getAccountByUrl($account_url)->first();
        $events = Event::with(['type', 'files', 'tags', 'tagsFormat', 'status', 'user', 'accounts']);
        foreach ($events->get() as $event) {
            $_accounts = $event->accounts;
            foreach ($_accounts as $_account) {
                if($_account->id == $account->id){
                    $rawdata[] = $event;
                }
            }
        }
        return $rawdata;
    }

    public function getUser(){
        return Auth::user();
    }

    public function getCurrentTeam(){
        return $this->getUser()->currentTeam;
    }

    public function getTeamRoleOfUser(){
        return $this->getUser()->teamRole($this->getCurrentTeam())->key;
    }

    public function updateStatusByRole($event_id){
        $user_role            = $this->getTeamRoleOfUser();
        $event                = Event::find($event_id);
        $old_event_status_id  = $event->event_status_id;
        $new_event_status_id  = 8; //correcion cliente por default

        switch ($user_role) {
            case 'owner':
            case 'admin':
            case 'agency':
                $new_event_status_id = 5;
                break;
            default:
                break;
        }

        $event->event_status_id = $new_event_status_id;
        if($event->save()){
            $this->addEventHistoryStatus($old_event_status_id, $new_event_status_id, $event_id);
        }
    }

    public function addEventHistoryStatus($old_event_status_id, $new_event_status_id, $event_id){
        if($new_event_status_id != $old_event_status_id){
            $eventHistoryStatus = new EventHistoryStatus;
            $eventHistoryStatus->user_id = Auth::id();
            $eventHistoryStatus->event_id = $event_id;
            $eventHistoryStatus->from_status_id = $old_event_status_id;
            $eventHistoryStatus->to_status_id = $new_event_status_id;
            $eventHistoryStatus->save();
        }
    }

    /* Start Recurrent Events */
    public function calculateDelta($date, $delta){
        $newDate = new Carbon($date);

        if($delta->milliseconds != 0){
            if($delta->milliseconds > 0){
                $seconds = $delta->milliseconds / 1000;
                $newDate->addSeconds($seconds);
            }else if($delta->milliseconds < 0){
                $seconds = abs($delta->milliseconds) / 1000;
                $newDate->subSeconds($seconds);
            }
        }

        if($delta->days != 0){
            if($delta->days > 0){
                $days = $delta->days;
                $newDate->addDays($days);
            }else if($delta->days < 0){
                $days = abs($delta->days);
                $newDate->subDays($days);
            }
        }

        if($delta->months != 0){
            if($delta->months > 0){
                $months = $delta->months;
                $newDate->addMonths($months);
            }else if($delta->months < 0){
                $months = abs($delta->months);
                $newDate->subMonths($months);
            }
        }

        if($delta->years != 0){
            if($delta->years > 0){
                $years = $delta->years;
                $newDate->addYears($years);
            }else if($delta->years < 0){
                $years = abs($delta->years);
                $newDate->subYears($years);
            }
        }

        return $newDate;

    }

    public function calculateDeltaMilliseconds($date, $delta){
        $newDate = new Carbon($date);

        if($delta != 0){
            if($delta > 0){
                $seconds = $delta / 1000;
                $newDate->addSeconds($seconds);
            }else if($delta < 0){
                $seconds = abs($delta) / 1000;
                $newDate->subSeconds($seconds);
            }
        }

        return $newDate;

    }
    /* End Recurrent Events */
}