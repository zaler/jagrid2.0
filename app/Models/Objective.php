<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Objective extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'date',
        'year',
        'month',
        'week',
        'day',
        'account_id',
    ];
}
