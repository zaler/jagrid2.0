<?php

namespace App\Http\Controllers;

use App\Models\Objective;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ObjectiveController extends Controller
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
        $filter[] = ['month', '=', intval($date->format('m'))];
        $filter[] = ['year', '=', $date->format('Y')];

        if($request->type == 'day'){
            $filter[] = ['type', '=', $request->type];
            $filter[] = ['day', '=', $date->format('d')];
        }
        
        if($request->type == 'week'){
            $filter[] = ['type', '=', $request->type];
            $filter[] = ['week', '=', $request->numberOfWeek];
        }

        $objectives = Objective::where($filter)->get();
        
        return response()->json($objectives);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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

        $objective = Objective::create([
            'title' => $validated->title,
            'type' => $validated->type,
            'date' => $validated->date,
            'account_id' => $validated->account_id,
            'description' => $request->description,
            'year' => $request->year,
            'month' => $request->month,
            'week' => $request->week,
            'day' => $request->day,
        ]);

        if($objective){
            $response['success'] = true;
            $response['data'] = $objective;
        }

        return response()->json($response);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Objective  $objective
     * @return \Illuminate\Http\Response
     */
    public function show(Objective $objective)
    {
        return response()->json($objective);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Objective  $objective
     * @return \Illuminate\Http\Response
     */
    public function edit(Objective $objective)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Objective  $objective
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Objective $objective)
    {
        $response['success'] = false;

        $validated = (object) $request->validate([
            'title' => 'required',
            'type' => 'required',
            'date' => 'required',
            'account_id' => 'required'
        ]);

        $objectiveToUpdate = Objective::where('id', $objective->id);

        $objectiveToUpdate->update([
            'title' => $validated->title,
            'type' => $validated->type,
            'date' => $validated->date,
            'account_id' => $validated->account_id,
            'description' => $request->description,
            'year' => $request->year,
            'month' => $request->month,
            'week' => $request->week,
            'day' => $request->day,
        ]);

        if($objective){
            $response['success'] = true;
            $response['data'] = $objectiveToUpdate->first();
        }

        return response()->json($response);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Objectives  $objectives
     * @return \Illuminate\Http\Response
     */
    public function destroy(Objective $objective)
    {
        $objective->delete();
    }
}
