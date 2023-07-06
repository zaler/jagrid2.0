<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\FeedbackFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $feedbacks = Feedback::with(['files'])->where('user_id', Auth::id())->paginate(10);

        return view('/jagrid/feedbacks/index', [
            'pageConfigs' => [],
            'feedbacks' => $feedbacks
        ]);
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
        $validated = $request->validate([
            'description' => 'required'
        ]);

        $feedback = new Feedback;
        $feedback->description = $validated['description'];
        $feedback->user_id = Auth::id();
        $feedback->save();

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->storePublicly('feedbacks', 'public');
                $feedbackFile = new FeedbackFile;
                $feedbackFile->feedback_id = $feedback->id;
                $feedbackFile->path = $path;
                $feedbackFile->mime = $file->extension();
                $feedbackFile->save();
            }
        }

        return true;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function show(Feedback $feedback)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function edit(Feedback $feedback)
    {
        if(Auth::id() != $feedback->user_id){
            abort(403);
        }
        return view('/jagrid/feedbacks/edit', [
            'pageConfigs' => [],
            'feedback' => $feedback
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Feedback $feedback)
    {
        if(Auth::id() != $feedback->user_id){
            abort(403);
        }
        try {
            $feedback->description = $request->description;
            $feedback->solved = $request->solved;
            $feedback->save();
            return redirect()->route('feedbacks.index')->with('statusSuccess', 'Feedback updated!');
        } catch (\Throwable $th) {
            return redirect()->route('feedbacks.index')->with('statusDanger', $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function destroy(Feedback $feedback)
    {
        if(Auth::id() != $feedback->user_id){
            abort(403);
        }
        $feedback->delete();
        return redirect()->route('feedbacks.index')->with('statusSuccess', 'Feedback removed!');
    }
}
