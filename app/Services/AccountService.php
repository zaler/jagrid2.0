<?php

namespace App\Services;

use App\Models\Account;
use App\Models\UserAccount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AccountService
{

    public function getPageConfigs()
    {
        return ['pageHeader' => true,];
    }

    public function getUser()
    {
        return Auth::user();
    }

    public function getUserId()
    {
        return $this->getUser()->id;
    }

    public function getTeams()
    {
        return $this->getUser()->allTeams();
    }

    public function getCurrentTeam()
    {
        return $this->getUser()->currentTeam;
    }

    public function getAccounts()
    {
        if ($this->isAdminOnCurrentTeam()) {
            $team_id = $this->getCurrentTeam()->id;
            return Account::where('team_id', $team_id)->orderBy('id', 'desc')->paginate(20);
        } else {
            return $this->getUser()->accounts()->orderBy('id', 'desc')->paginate(20);
        }
    }

    public function getUsersInAccount($account)
    {
        return Account::find($account->id)->users()->paginate(20);
    }

    public function getUsersToAdd($account)
    {
        return $this->getCurrentTeam()->allUsers();
    }

    public function addUserToAccount($data)
    {
        return UserAccount::create($data);
    }

    public function removeUserFromAccount($data)
    {
        return UserAccount::where([
            'user_id' => $data['user_id'],
            'account_id' => $data['account_id']
        ])->delete();
    }

    public function existsUserInAccount($data)
    { //verify if specific user is not in account, then, add to account
        $userAccount = UserAccount::where([
            'user_id' => $data['user_id'],
            'account_id' => $data['account_id'],
        ]);
        return $userAccount->exists();
    }

    public function existsCurrentUserInAccount($account_url)
    { //verify if current user belongs to the account
        $account = Account::where('url', $account_url);
        if ($account->exists()) {
            $account = $account->first();
            if ($account->team->id == $this->getCurrentTeam()->id && $this->isAdminOnCurrentTeam()) {
                return true;
            }
            $userAccount = UserAccount::where([
                'user_id' => $this->getUserId(),
                'account_id' => $account->id,
            ]);
            return $userAccount->exists();
        }
        return false;
    }

    public function getAccountByUrl($account_url)
    {
        return Account::where('url', $account_url);
    }

    public function create($data)
    {
        $accounts = Account::where('url', 'like', $data['url'] . '%')->get();
        $accounts_count = count($accounts);
        if ($accounts_count > 0) {
            $data['url'] = $data['url'] . '-' . ($accounts_count++);
        }
        return Account::create($data);
    }

    public function update($data, $id)
    {
        return Account::where('id', $id)->update($data);
    }

    public function delete($id)
    {
        return Account::find($id)->delete();
    }

    public function isAdminOnCurrentTeam()
    {
        return $this->getUser()->hasTeamRole($this->getCurrentTeam(), 'admin');
    }

    public function getAccountsOfUser($except_this_account = null)
    {
        if ($this->isAdminOnCurrentTeam()) {
            $team_id = $this->getCurrentTeam()->id;
            if (!is_null($except_this_account)) {
                return Account::select(['id as value', 'name as label'])->whereNotIn('accounts.id', [$except_this_account])->where('team_id', $team_id)->get();
            }
            return Account::select(['id as value', 'name as label'])->where('team_id', $team_id)->get();
        } else {
            if (!is_null($except_this_account)) {
                return $this->getUser()->accounts()->whereNotIn('accounts.id', [$except_this_account])->get(['accounts.id as value', 'accounts.name as label']);
            }
            return $this->getUser()->accounts()->get(['accounts.id as value', 'accounts.name as label']);
        }
    }

    public function getUsersInAccountForMention($account_id)
    {
        $users = Account::find($account_id)->users()->select(['users.id as id', 'users.name as name', 'users.profile_photo_path as avatar'])->get();
        foreach ($users as $user) {
            if (!is_null($user->avatar)) {
                $user->avatar = '/storage/' . $user->avatar;
            } else {
                $user->avatar = 'https://ui-avatars.com/api/?name=' . $user->name . '&color=7F9CF5&background=EBF4FF';
            }
        }
        return $users;
    }

    public function getCustomers($account_id)
    {
        return DB::table('users')
            ->join('user_accounts', 'users.id', '=', 'user_accounts.user_id')
            ->join('team_user', 'users.id', '=', 'team_user.user_id')
            ->where('team_user.role', 'customer')
            ->where('user_accounts.account_id', $account_id)
            ->get();
    }

    public function getTeamRoleOfUser()
    {
        return $this->getUser()->teamRole($this->getCurrentTeam())->key;
    }
}
