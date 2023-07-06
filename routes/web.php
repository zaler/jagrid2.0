<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\LanguageController;
use App\Http\Controllers\CardsController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventTagController;
use App\Http\Controllers\EventTagFormatController;
use App\Http\Controllers\ExternalEventController;
use App\Http\Controllers\IndexEventController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MassActionsController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ObjectiveController;
use App\Http\Controllers\TrackingTimeController;
use App\Http\Controllers\TrackingProjectController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Main Page Route
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    //Route::get('/', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/', [CalendarController::class, 'list'])->name('calendar.list');

    Route::resources([
        'accounts' => AccountController::class,
        'events' => EventController::class,
        'comments' => CommentController::class,
        'feedbacks' => FeedbackController::class,
        'objectives' => ObjectiveController::class,
        'external/events' => ExternalEventController::class,
        'index/events' => IndexEventController::class,
        'tag/events' => EventTagController::class,
        'tag-format/events' => EventTagFormatController::class,
    ]);

    Route::get('/events/{event_url}/url/', [EventController::class, 'getByUrl']);

    Route::get('/event-types', [EventController::class, 'getEventTypes']);
    Route::get('/event-statuses', [EventController::class, 'getEventStatuses']);

    Route::post('/events-files', [EventController::class, 'uploadFiles']);
    Route::delete('/events-files/{file_id}', [EventController::class, 'deleteFile']);
    Route::put('/events-dates', [EventController::class, 'updateDates']);
    Route::put('/events-dates/milliseconds', [EventController::class, 'updateDatesMilliseconds']);

    Route::post('/events-accounts', [EventController::class, 'addToAccount']);
    Route::delete('/events-accounts', [EventController::class, 'deleteFromAccount']);

    Route::post('/duplicate-event', [EventController::class, 'duplicateEvent']);

    Route::get('/event-history-status', [EventController::class, 'getEventHistoryStatus']);

    Route::get('/accounts-user', [AccountController::class, 'getAccountsUser']);
    Route::post('/accounts/add-user', [AccountController::class, 'addUser'])->name('accounts.add-user');
    Route::post('/accounts/remove-user', [AccountController::class, 'removeUser'])->name('accounts.remove-user');
    Route::get('/accounts-mentions', [AccountController::class, 'getAccountsMentions']);

    Route::get('/calendar/{account_url}', [CalendarController::class, 'index']);
    Route::get('/calendar/{account_url}/{event_url}', [CalendarController::class, 'show']);
    Route::get('/calendars', [CalendarController::class, 'list'])->name('calendar.list');

    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::post('/mass-actions/changeEventDates', [MassActionsController::class, 'changeEventDates']);

    Route::get('/cards', [CardsController::class, 'index'])->name('cards.index');
    Route::get('/cards/{account_url}', [CardsController::class, 'show']);
    Route::get('/cards-customers', [CardsController::class, 'getCustomers']);
    Route::post('/cards-generate-link', [CardsController::class, 'generateLink']);

    Route::get('/tracking/time', [TrackingTimeController::class, 'index']);
    Route::post('/tracking/time', [TrackingTimeController::class, 'storageTrackingTime']);

    Route::get('/tracking/projects/', [TrackingProjectController::class, 'index']);
    Route::get('/tracking/projects/{account_url}', [TrackingProjectController::class, 'show']);

    Route::get('/tracking-projects', [TrackingProjectController::class, 'getEvents']);
});

Route::get('/cards/link/{hash}', [CardsController::class, 'generatedLinkHash']);

//Route::get('/', [DashboardController::class, 'dashboardEcommerce'])->name('dashboard-ecommerce');

// locale Route
Route::get('lang/{locale}', [LanguageController::class, 'swap']);

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::get('/test', function(Request $request){
    return view('jagrid.test');
});