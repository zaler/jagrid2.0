<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AccountService;
use App\Services\EventService;
use App\Services\CardService;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Team;
use App\Models\CustomerLink;

class CardsController extends Controller
{

  protected $accountService;
  protected $eventService;
  protected $cardService;

  public function __construct(
      AccountService $accountService,
      EventService $eventService,
      CardService $cardService
  )
  {
      $this->accountService = $accountService;
      $this->eventService = $eventService;
      $this->cardService = $cardService;
  }

  public function index(){
    return view('/jagrid/cards/index', [
        'accounts' => $this->accountService->getAccounts()
    ]);
  }

  public function show(Request $request){
    if($this->accountService->existsCurrentUserInAccount($request->account_url)){
      return view('/jagrid/cards/show', [
          'events' => $this->eventService->getEventsByAccountUrl($request->account_url),
          'account' => $this->eventService->getAccountByUrl($request->account_url)->first(),
          'user_id' => Auth::id(),
          'user_role' => $this->accountService->getTeamRoleOfUser()
      ]);
    }
    abort(403);
  }

  public function generateLink(Request $request){
    try {
      $account_id = $request->account_id;
      $customersToNotify = $request->customersToNotify;
      $url = $request->url;
      $account_name = $request->account_name;
      $sendNotification = $request->sendNotification;
  
      $emails = $this->cardService->createUsers($customersToNotify, $account_id);
      $data = $this->cardService->notifyToCustomers($emails, $url, $account_name, $account_id, $sendNotification);
      return [
        'success' => true,
        'data' => $data
      ];
    } catch (\Throwable $th) {
      return [
        'success' => false,
        'message' => $th->getMessage()
      ];
    }
  }

  public function getCustomers(Request $request){
    return $this->accountService->getCustomers($request->account_id);
  }

  public function generatedLinkHash(Request $request){
    $hash = request('hash');
    $user = $this->accountService->getUser();
    $customerLink = CustomerLink::where('hash', $hash)->first();

    if($customerLink){
      if($user){
        if($user->id === $customerLink->user_id){
          return redirect($customerLink->url);
        }
        abort(403);
      }
  
      $user = User::find($customerLink->user_id);
      Auth::login($user);
      $user->switchTeam(Team::find($customerLink->team_id));
      return redirect($customerLink->url);
    }

    abort(404);
  }
  
}
