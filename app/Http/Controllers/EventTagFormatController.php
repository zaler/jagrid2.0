<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventTagFormat;
use App\Models\EventTagFormatRelationship;

class EventTagFormatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $eventTagsFormat = EventTagFormat::all();
        return response()->json($eventTagsFormat);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $eventTagFormatRelationship = new EventTagFormatRelationship;
        $eventTagFormatRelationship->event_id = $request->event_id;
        $eventTagFormatRelationship->event_tag_format_id = $request->tag_format_id;
        return $eventTagFormatRelationship->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $eventTagFormatRelationship = EventTagFormatRelationship::where([
            'event_id' => $request->event_id,
            'event_tag_format_id' => $request->tag_format_id
        ]);
        return $eventTagFormatRelationship->delete();
    }
}
