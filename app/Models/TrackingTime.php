<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrackingTime extends Model
{
    use HasFactory;

    protected $fillable = [
        'seconds',
        'path',
        'user_id'
    ];
}
