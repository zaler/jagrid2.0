<?php

namespace App\Services;

use App\Models\User;
use App\Models\Team;
use App\Models\Account;
use App\Models\UserAccount;
use App\Models\CustomerLink;
use App\Mail\GeneratedLink;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Laravel\Jetstream\Jetstream;

class CardService {

    //Start Generator Link
    public function getUserByEmail($email){
        return User::where('email', $email)->first();
    }

    public function createUsers($usersData, $account_id){
        $emails = [];
        foreach ($usersData as $userData) {
            $email = $userData['email'];
            $user = $this->getUserByEmail($email);
            if( !$user ){
                $user = $this->createUser($email);
            }
            if(!$this->existsUserInTeam($user)){
                $this->addUserToTeam($user);
            }
            if(!$this->existsUserInAccount($user->id, $account_id)){
                $this->addUserToAccount($user->id, $account_id);
            }
            $this->switchTeamUser($user);
            $emails[] = $email;
        }
        return $emails;
    }

    public function createUser($email){
        $user = new User;
        $user->name = 'Guest User';
        $user->email = $email;
        $user->password = Hash::make('admin123');
        $user->email_verified_at = now();
        $user->save();
        $user->ownedTeams()->save(Team::forceCreate([
            'user_id' => $user->id,
            'name' => 'Guest User Team',
            'personal_team' => true,
        ]));
        return $user;
    }

    public function addUserToTeam($user){
        $team = $this->getCurrentTeam();
        $newTeamMember = Jetstream::findUserByEmailOrFail($user->email);
        $team->users()->attach(
            $newTeamMember, ['role' => 'customer']
        );
    }

    public function addUserToAccount($user_id, $account_id){
        $userAccount = new UserAccount;
        $userAccount->user_id = $user_id;
        $userAccount->account_id = $account_id;
        $userAccount->save();
    }

    public function notifyToCustomers($emails, $url, $account_name, $account_id, $sendNotification){
        $rawdata = [];
        foreach ($emails as $email) {
            $hash = Str::random(40);
            $data = new \stdClass();
            $data->url = URL::to('/') . '/cards/link/' . $hash;
            $data->account_name = $account_name;
            
            if($sendNotification){
                Mail::to($email)->send(new GeneratedLink($data));
                if( count(Mail::failures()) == 0 ) {

                }
            }

            $customerLink = new CustomerLink;
            $customerLink->hash = $hash;
            $customerLink->url = $url;
            $customerLink->user_id = User::where('email', $email)->first()->id;
            $customerLink->team_id = Account::with(['team'])->where('id', $account_id)->first()->team->id;
            $customerLink->save();
            $rawdata[] = array('user_email' => $email, 'url' => $data->url);
        }
        return $rawdata;
    }

    public function existsUserInTeam($user){
        $team = $this->getCurrentTeam();
        return $user->belongsToTeam($team);
    }

    public function getCurrentTeam(){
        $team = Auth::user()->currentTeam;
        return $team;
    }

    public function existsUserInAccount($user_id, $account_id){
        $userAccount = UserAccount::where([
            'user_id' => $user_id,
            'account_id' => $account_id
        ]);
        return $userAccount->exists();
    }

    public function switchTeamUser($user){
        $team = $this->getCurrentTeam();
        $user->switchTeam($team);
    }

    //End Generator Link

}