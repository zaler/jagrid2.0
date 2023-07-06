<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService {

    public function markAsRead($id){
        $notification = Notification::find($id);
        if(!$notification->view){
            $notification->view = true;
            $notification->save();
        }
    }

}