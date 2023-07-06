<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Services\AccountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Account\StoreAccountRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Http\Requests\Account\AddUserAccountRequest;
use App\Http\Requests\Account\RemoveUserAccountRequest;

class AccountController extends Controller
{

    protected $accountService;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(AccountService $accountService)
    {
        $this->accountService = $accountService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('/jagrid/accounts/index', [
            'pageConfigs' => $this->accountService->getPageConfigs(), 
            'accounts' => $this->accountService->getAccounts(),
            'isAdminOnCurrentTeam' => $this->accountService->isAdminOnCurrentTeam()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(!$this->accountService->isAdminOnCurrentTeam()){
            return redirect()->route('accounts.index')->with('statusDanger', 'Not Authorized');
        }

        return view('/jagrid/accounts/create', [
            'pageConfigs' => $this->accountService->getPageConfigs(), 
            'teams' => $this->accountService->getTeams(),
            'currentTeam' => $this->accountService->getCurrentTeam()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreAccountRequest $request)
    {
        try {
            $validated = $request->validated();
            $this->accountService->create($validated);

            return redirect()->route('accounts.index')->with('statusSuccess', 'Account created!');
        } catch (\Throwable $th) {

            return redirect()->route('accounts.index')->with('statusDanger', $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function show(Account $account)
    {
        if($this->accountService->existsUserInAccount($account) || $this->accountService->isAdminOnCurrentTeam()){
            return view('/jagrid/accounts/show', [
                'pageConfigs' => $this->accountService->getPageConfigs(),
                'usersInAccount' => $this->accountService->getUsersInAccount($account),
                'usersToAdd' => $this->accountService->getUsersToAdd($account),
                'isAdminOnCurrentTeam' => $this->accountService->isAdminOnCurrentTeam(),
                'account' => $account
            ]);
        }else{
            return redirect()->route('accounts.index')->with('statusDanger', 'Not Authorized');
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function edit(Account $account)
    {
        if(!$this->accountService->isAdminOnCurrentTeam()){
            return redirect()->route('accounts.index')->with('statusDanger', 'Not Authorized');
        }
        
        return view('/jagrid/accounts/edit', [
            'pageConfigs' => $this->accountService->getPageConfigs(),
            'account' => $account,
            'teams' => $this->accountService->getTeams(),
            'currentTeam' => $this->accountService->getCurrentTeam()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAccountRequest $request, Account $account)
    {
        try {
            $validated = $request->validated();

            $this->accountService->update($validated, $account->id);
    
            return redirect()->route('accounts.index')->with('statusSuccess', 'Account updated!');
        } catch (\Throwable $th) {
            return redirect()->route('accounts.index')->with('statusDanger', $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function destroy(Account $account)
    {
        if( $this->accountService->isAdminOnCurrentTeam() ){
            $this->accountService->delete($account->id);
            return redirect()->route('accounts.index')->with('statusSuccess', 'Account deleted!');
        }else{
            return redirect()->route('accounts.index')->with('statusDanger', 'Not Authorized');
        }
    }

    /**
     * Add user to account.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addUser(AddUserAccountRequest $request){
        $validated = $request->validated();

        if($this->accountService->existsUserInAccount($validated)){
            return redirect()->route('accounts.show', $validated['account_id'])->with('statusSuccess', 'User was already added!');
        }else{
            $this->accountService->addUserToAccount($validated);
            return redirect()->route('accounts.show', $validated['account_id'])->with('statusSuccess', 'User added!');
        }
    }

    /**
     * Remove user from account.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function removeUser(RemoveUserAccountRequest $request){
        $validated = $request->validated();
        $this->accountService->removeUserFromAccount($validated);
        return redirect()->route('accounts.show', $validated['account_id'])->with('statusSuccess', 'User removed!');
    }

    public function getAccountsUser(Request $request){
        if(isset($request->except_this_account)){
            return response()->json($this->accountService->getAccountsOfUser($request->except_this_account));
        }else{
            return response()->json($this->accountService->getAccountsOfUser());
        }
    }

    public function getAccountsMentions(Request $request){
        return response()->json($this->accountService->getUsersInAccountForMention($request->account_id));
    }
}
