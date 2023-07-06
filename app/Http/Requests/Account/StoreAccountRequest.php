<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;
use App\Services\AccountService;

class StoreAccountRequest extends FormRequest
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
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->accountService->isAdminOnCurrentTeam();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|max:60',
            'url' => 'required|max:40|alpha_dash',
            'enabled' => 'required',
            'team_id' => 'required'
        ];
    }
}
