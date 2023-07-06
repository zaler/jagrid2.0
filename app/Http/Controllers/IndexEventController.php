<?php

namespace App\Http\Controllers;

use App\Models\IndexEvent;
use Illuminate\Http\Request;
use Carbon\Carbon;

class IndexEventController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = [];
        $date = new Carbon($request->date);

        $validated = (object) $request->validate([
            'account_id' => 'required'
        ]);

        $filter[] = ['account_id', '=', $validated->account_id];

        if ($request->type == 'month') {
            $filter[] = ['date', 'LIKE', $date->format('Y-m-') . '%'];
        }

        if ($request->type == 'day') {
            $filter[] = ['type', '=', $request->type];
            $filter[] = ['day', '=', $date->format('d')];
        }

        if ($request->type == 'week') {
            $filter[] = ['type', '=', $request->type];
            $filter[] = ['week', '=', $request->numberOfWeek];
        }

        $indexEvents = IndexEvent::where($filter)->orWhere([
            ['account_id', '=', $validated->account_id],
            ['is_temporary', '=', false]
        ])->get();

        return response()->json($indexEvents);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $response['success'] = false;

        $validated = (object) $request->validate([
            'title' => 'required',
            'type' => 'required',
            'date' => 'required',
            'account_id' => 'required'
        ]);

        $title = $validated->title;
        $type = $validated->type;
        $date = $validated->date;
        $account_id = $validated->account_id;
        $year = $request->year;
        $month = $request->month;
        $week = $request->week;
        $day = $request->day;
        $is_temporary = $request->is_temporary;
        $color = '#000';

        if (isset($request->color) && $request->color != '') {
            $color = $request->color;
        }

        if (!$is_temporary) {
            $type = 'permanent';
            $date = null;
            $year = null;
            $month = null;
            $week = null;
            $day = null;
        }

        $indexEvent = IndexEvent::create([
            'title' => $title,
            'type' => $type,
            'date' => $date,
            'account_id' => $account_id,
            'year' => $year,
            'month' => $month,
            'week' => $week,
            'day' => $day,
            'is_temporary' => $is_temporary,
            'color' => $color
        ]);

        if ($indexEvent) {
            $response['success'] = true;
            $response['data'] = $indexEvent;
        }

        return response()->json($response);
    }

    public function show($id)
    {
        return response()->json(IndexEvent::find($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\IndexEvent  $indexEvent
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $response['success'] = false;

        $validated = (object) $request->validate([
            'id' => 'required',
            'title' => 'required',
            'type' => 'required',
            'date' => 'required',
            'account_id' => 'required'
        ]);

        $id = $request->id;
        $title = $validated->title;
        $type = $validated->type;
        $date = $validated->date;
        $account_id = $validated->account_id;
        $year = $request->year;
        $month = $request->month;
        $week = $request->week;
        $day = $request->day;
        $is_temporary = $request->is_temporary;
        $color = '#000';

        if (!$is_temporary) {
            $type = 'permanent';
            /*
            $date = null;
            $year = null;
            $month = null;
            $week = null;
            $day = null;
            */
        }

        if (isset($request->color) && $request->color != '') {
            $color = $request->color;
        }

        $indexEvent = IndexEvent::find($id);

        $indexEvent->update([
            'title' => $title,
            'type' => $type,
            'date' => $date,
            'account_id' => $account_id,
            'year' => $year,
            'month' => $month,
            'week' => $week,
            'day' => $day,
            'is_temporary' => $is_temporary,
            'color' => $color
        ]);

        if ($indexEvent) {
            $response['success'] = true;
            $response['data'] = $indexEvent;
        }

        return response()->json($response);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\IndexEvent  $indexEvent
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return IndexEvent::find($id)->delete();
    }
}
