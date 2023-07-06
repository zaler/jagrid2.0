<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;
use App\Models\Notification;
use App\Services\AccountService;
use App\Services\EventService;
use App\Services\NotificationService;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
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
        $comments = Comment::with('user')
        ->where([
            ['entity', '=', $request->entity],
            ['entity_id', '=', $request->entity_id]
        ])->get();
        return response()->json($comments);
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
        $comment = new Comment;
        $comment->data = $request->data;
        $comment->user_id = Auth::id();
        $comment->entity = $request->entity;
        $comment->entity_id = $request->entity_id;
        $comment->is_private = $request->is_private;
        $comment->save();

        $comment->user = User::find($comment->user_id);

        $this->notifyCommentMention($request->account_id, $comment);

        if($comment->entity == 'events'){
            $this->eventService->updateStatusByRole($comment->entity_id);
        }

        return response()->json($comment);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Comment $comment)
    {
        $comment = Comment::find($comment->id);

        $comment->solved = $request->solved;
        $comment->is_private = $request->is_private;
        $comment->save();

        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();
    }

    public function notifyCommentMention($account_id, $comment){
        $ids = [];

        $blocks = json_decode($comment->data);
        $entityMap = $blocks->entityMap;

        foreach ($entityMap as $em) {
            if($em->type == 'mention'){
                $id = $em->data->mention->id;
                if (!in_array($id, $ids)) {
                    $ids[] = $em->data->mention->id;
                }
            }
        }
        
        if(count($ids) > 0){
            foreach ($ids as $id) {
                if($id != Auth::id()){
                    $notification = new Notification;
                    $notification->type = 'mention';
                    $notification->account_id = $account_id;
                    $notification->event_id = $comment->entity_id;
                    $notification->comment_id = $comment->id;
                    $notification->from_user_id = $comment->user_id;
                    $notification->to_user_id = $id;
                    $notification->save();
                }
            }
        }
    }
}
