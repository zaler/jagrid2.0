<?php

namespace App\Http\Controllers;

use App\Models\TrackingTime;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TrackingTimeController extends Controller
{
    //
    public function index(){
        return view('jagrid.tracking.time.index', [
            'trackingTime' => TrackingTime::where('user_id', Auth::id())->orderBy('id', 'DESC')->paginate(10)
        ]);
    }
    
    public function storageTrackingTime(Request $request){
        $validated = $request->validate([
            'path' => 'required'
        ]);

        $trackingTime = TrackingTime::where('path', $validated['path'])
        ->where('created_at', 'LIKE', Carbon::now()->toDateString() . '%')
        ->where('user_id', Auth::id())
        ->first();        

        if(isset($trackingTime->seconds)){
            $trackingTime->seconds = intval($trackingTime->seconds) + 1;
            $trackingTime->save(); 
        }else{
            $trackingTime = TrackingTime::create([
                'seconds' => 1,
                'path' => $validated['path'],
                'user_id' => Auth::id()
            ]);
        }
        
        return $trackingTime;
    }
}
