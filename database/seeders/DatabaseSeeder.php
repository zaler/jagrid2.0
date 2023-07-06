<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Laravel\Jetstream\Jetstream;
use App\Models\Team;
use App\Models\User;
use App\Models\Account;
use App\Models\Event;
use App\Models\EventType;
use App\Models\EventTag;
use App\Models\EventTagRelationship;
use App\Models\EventTagFormat;
use App\Models\EventTagFormatRelationship;
use App\Models\EventStatus;
use App\Models\ExternalEvent;
use App\Models\IndexEvent;
use App\Models\EventAccount;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        $superUser = new User;
        $superUser->name = 'Ben Aguilar';
        $superUser->email = 'ben@magosdigitales.net';
        $superUser->password = Hash::make('admin123');
        $superUser->save();

        $superUser->ownedTeams()->save(Team::forceCreate([
            'user_id' => $superUser->id,
            'name' => $superUser->name."'s Team",
            'personal_team' => true,
        ]));

        $superUser->switchTeam($team = $superUser->ownedTeams()->create([
            'name' => 'TMC Digital',
            'personal_team' => true,
        ]));

        $usersData = [
            array('name' => 'Mayling Carranza', 'email' => 'mayling@tmcagenciacreativa.com', 'role' => 'admin'),
            array('name' => 'Diego Zepeda', 'email' => 'diego@tmcagenciacreativa.com', 'role' => 'agency'),
            array('name' => 'Katherine Hernández', 'email' => 'katherine@tmcagenciacreativa.com', 'role' => 'agency'),
        ];

        foreach ($usersData as $userData) {
            $user = new User;
            $user->name = $userData['name'];
            $user->email = $userData['email'];
            $user->password = Hash::make('admin123');
            $user->save();
    
            $user->ownedTeams()->save(Team::forceCreate([
                'user_id' => $user->id,
                'name' => explode(' ', $user->name, 2)[0]."'s Team",
                'personal_team' => true,
            ]));

            $newTeamMember = Jetstream::findUserByEmailOrFail($user->email);

            $superUser->currentTeam->users()->attach(
                $newTeamMember, ['role' => $userData['role']]
            );
        }

        $accountsData = [
            array('name' => 'Mary Kay', 'url' => 'mary-kay', 'team_id' => $superUser->currentTeam->id),
            array('name' => 'ABC Britanica', 'url' => 'abc-britanica', 'team_id' => $superUser->currentTeam->id),
            array('name' => 'Divesa', 'url' => 'divesa', 'team_id' => $superUser->currentTeam->id),
        ];

        foreach ($accountsData as $accountData) {
            $account = new Account;
            $account->name = $accountData['name'];
            $account->url = $accountData['url'];
            $account->team_id = $accountData['team_id'];
            $account->save();
        }

        $eventType = new EventType;
        $eventType->name = 'RRSS';
        $eventType->save();

        $eventType = new EventType;
        $eventType->name = 'To Do';
        $eventType->save();

        $eventType = new EventType;
        $eventType->name = 'Pauta';
        $eventType->save();

        $eventType = new EventType;
        $eventType->name = 'Other';
        $eventType->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Facebook';
        $eventTag->icon = '/storage/events/tags/facebook.png';
        $eventTag->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Instagram';
        $eventTag->icon = '/storage/events/tags/instagram.png';
        $eventTag->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Twitter';
        $eventTag->icon = '/storage/events/tags/twitter.png';
        $eventTag->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Youtube';
        $eventTag->icon = '/storage/events/tags/youtube.png';
        $eventTag->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Tik Tok';
        $eventTag->icon = '/storage/events/tags/tiktok.png';
        $eventTag->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Mailchimp';
        $eventTag->icon = '/storage/events/tags/mailchimp.png';
        $eventTag->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Pauta';
        $eventTag->icon = '/storage/events/tags/pauta.png';
        $eventTag->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Landing/Web';
        $eventTag->icon = '/storage/events/tags/web.png';
        $eventTag->save();

        $eventTag = new EventTag;
        $eventTag->name = 'Otros';
        $eventTag->icon = '/storage/events/tags/other.png';
        $eventTag->save();

        $eventTagFormat = new EventTagFormat;
        $eventTagFormat->name = 'Feed';
        $eventTagFormat->icon = '/storage/events/format/feed.png';
        $eventTagFormat->save();

        $eventTagFormat = new EventTagFormat;
        $eventTagFormat->name = 'Story';
        $eventTagFormat->icon = '/storage/events/format/story.png';
        $eventTagFormat->save();

        $eventTagFormat = new EventTagFormat;
        $eventTagFormat->name = 'Reel';
        $eventTagFormat->icon = '/storage/events/format/reel.png';
        $eventTagFormat->save();

        $eventTagFormat = new EventTagFormat;
        $eventTagFormat->name = 'Carousel';
        $eventTagFormat->icon = '/storage/events/format/carousel.png';
        $eventTagFormat->save();

        $eventTagFormat = new EventTagFormat;
        $eventTagFormat->name = 'Live';
        $eventTagFormat->icon = '/storage/events/format/live.png';
        $eventTagFormat->save();

        $eventTagFormat = new EventTagFormat;
        $eventTagFormat->name = 'Video';
        $eventTagFormat->icon = '/storage/events/format/video.png';
        $eventTagFormat->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Idea';
        $eventStatus->color = '#FB9F44';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Edición';
        $eventStatus->color = '#FB9F44';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Diseño';
        $eventStatus->color = '#36CFE8';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Dummie Diseño';
        $eventStatus->color = '#36CFE8';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Correción';
        $eventStatus->color = '#EA5455';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Aprobación TMC';
        $eventStatus->color = '#F1C40F';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Aprobación Cliente';
        $eventStatus->color = '#33C76F';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Correción Cliente';
        $eventStatus->color = '#EA5455';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Aprobado';
        $eventStatus->color = '#004C9E';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Publicado';
        $eventStatus->color = '#7367F0';
        $eventStatus->save();

        $eventStatus = new EventStatus;
        $eventStatus->name = 'Rechazado';
        $eventStatus->color = '#82868B';
        $eventStatus->save();

        $event = new Event;
        $event->user_id = 1;
        $event->title = 'Hola Mundo';
        $event->start = now();
        $event->url = 'qwertyuiop';
        $event->event_type_id = 1;
        $event->event_status_id = 1;
        $event->save();

        $eventAccount = new EventAccount;
        $eventAccount->event_id = $event->id;
        $eventAccount->account_id = 1;
        $eventAccount->save();

        $eventTagRelationship = new EventTagRelationship;
        $eventTagRelationship->event_id = 1;
        $eventTagRelationship->event_tag_id = 1;
        $eventTagRelationship->save();

        $eventTagRelationship = new EventTagFormatRelationship;
        $eventTagRelationship->event_id = 1;
        $eventTagRelationship->event_tag_format_id = 1;
        $eventTagRelationship->save();

        $eventExternal = new ExternalEvent;
        $eventExternal->title = 'External Event 1';
        $eventExternal->account_id = 1;
        $eventExternal->save();

        $eventExternal = new ExternalEvent;
        $eventExternal->title = 'External Event 2';
        $eventExternal->account_id = 1;
        $eventExternal->save();

        $indexEvent = new IndexEvent;
        $indexEvent->title = 'Index Event 1';
        $indexEvent->account_id = 1;
        $indexEvent->color = '#ff9f43';
        $indexEvent->save();

        $indexEvent = new IndexEvent;
        $indexEvent->title = 'Index Event 2';
        $indexEvent->account_id = 1;
        $indexEvent->color = '#ff9f43';
        $indexEvent->save();

        $faker = \Faker\Factory::create();

        for ($i=0; $i < 1000; $i++) { 
            $event = new Event;
            $event->user_id = 1;
            $event->title = $faker->name;
            $fecha_actual = date("Y-m-d");
            $event->start = date("Y-m-d",strtotime($fecha_actual."+ ".$i." days")); 
            $event->url = Str::random(40);
            $event->event_type_id = rand(1, 4);
            $event->event_status_id = rand(1, 11);
            $event->save();

            $eventAccount = new EventAccount;
            $eventAccount->event_id = $event->id;
            $eventAccount->account_id = rand(1, 3);
            $eventAccount->save();

            $eventTagRelationship = new EventTagRelationship;
            $eventTagRelationship->event_id = $event->id;
            $eventTagRelationship->event_tag_id = rand(1, 6);
            $eventTagRelationship->save();
    
            $eventTagRelationship = new EventTagFormatRelationship;
            $eventTagRelationship->event_id = $event->id;
            $eventTagRelationship->event_tag_format_id = rand(1, 6);
            $eventTagRelationship->save();

            $event = new Event;
            $event->user_id = 1;
            $event->title = $faker->name;
            $fecha_actual = date("Y-m-d");
            $event->start = date("Y-m-d",strtotime($fecha_actual."- ".$i." days")); 
            $event->url = Str::random(40);
            $event->event_type_id = rand(1, 4);
            $event->event_status_id = rand(1, 11);
            $event->save();

            $eventAccount = new EventAccount;
            $eventAccount->event_id = $event->id;
            $eventAccount->account_id = rand(1, 3);
            $eventAccount->save();

            $eventTagRelationship = new EventTagRelationship;
            $eventTagRelationship->event_id = $event->id;
            $eventTagRelationship->event_tag_id = rand(1, 6);
            $eventTagRelationship->save();

            $eventTagRelationship = new EventTagFormatRelationship;
            $eventTagRelationship->event_id = $event->id;
            $eventTagRelationship->event_tag_format_id = rand(1, 6);
            $eventTagRelationship->save();
        }
        
    }
}
