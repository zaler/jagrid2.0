<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AccountService;
use Illuminate\Support\Facades\DB;

class TrackingProjectController extends Controller
{
    protected $accountService;

    public function __construct(
        AccountService $accountService
    ) {
        $this->accountService = $accountService;
    }

    public function index()
    {
        return view('/jagrid/tracking/projects/index', [
            'accounts' => $this->accountService->getAccounts()
        ]);
    }

    public function show(Request $request)
    {
        if ($this->accountService->existsCurrentUserInAccount($request->account_url)) {
            $events = DB::table('events')
                ->join('event_accounts', 'events.id', '=', 'event_accounts.event_id')
                ->join('accounts', 'accounts.id', '=', 'event_accounts.account_id')
                ->select('events.*', 'accounts.url as account_url')
                ->where('accounts.url', $request->account_url)
                ->where('events.isIndex', true)
                ->orderBy('start', 'DESC')
                ->paginate(10);
            //Event::where('isIndex', true)->orderBy('id', 'DESC')->paginate(20);

            return view('/jagrid/tracking/projects/show', ['events' => $events]);
        }
        abort(404);
    }

    public function getEvents(Request $request)
    {
        $events = DB::table('events')
            ->join('event_accounts', 'events.id', '=', 'event_accounts.event_id')
            ->join('accounts', 'accounts.id', '=', 'event_accounts.account_id')
            ->select('events.*', 'accounts.url as account_url')
            ->where('accounts.id', $request->account_id)
            ->where('events.isIndex', true)
            ->whereBetween('start', [$request->start, $request->end])
            ->orderBy('start', 'DESC')
            ->get();

        return $events;
    }
}
