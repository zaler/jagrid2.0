<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventTag;
use App\Models\EventTagRelationship;

class EventTagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $eventTags = EventTag::all();
        return response()->json($eventTags);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $eventTagRelationship = new EventTagRelationship;
        $eventTagRelationship->event_id = $request->event_id;
        $eventTagRelationship->event_tag_id = $request->tag_id;
        return $eventTagRelationship->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $eventTagRelationship = EventTagRelationship::where([
            'event_id' => $request->event_id,
            'event_tag_id' => $request->tag_id
        ]);
        return $eventTagRelationship->delete();
    }
}
