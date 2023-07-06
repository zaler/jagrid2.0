<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    //
    public function index(){
      $pageConfigs = ['pageHeader' => true];
  
      return view('/jagrid/notifications', ['pageConfigs' => $pageConfigs, 'notifications' => $this->getNotifications()]);
    }

    public function getNotifications(){
        $raw = DB::table('notifications')
            ->join('users', 'users.id', '=', 'notifications.from_user_id')
            ->join('accounts', 'accounts.id', '=', 'notifications.account_id')
            ->join('events', 'events.id', '=', 'notifications.event_id')
            ->join('comments', 'comments.id', '=', 'notifications.comment_id')
            ->select('users.name as from_user_name', 'users.profile_photo_path', 'accounts.name as account_name', 'accounts.url as account_url', 'events.url as event_url', 'comments.id as comment_id', 'notifications.id', 'notifications.created_at')
            ->where('notifications.to_user_id', Auth::id())
            ->orderBy('notifications.created_at', 'desc')
            ->paginate(100);
        return $raw;
    }
}
