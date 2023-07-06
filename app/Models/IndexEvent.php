<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndexEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'date',
        'year',
        'month',
        'week',
        'day',
        'account_id',
        'is_temporary',
        'color'
    ];
}
