<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventHistoryStatus extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fromStatus()
    {
        return $this->belongsTo(EventStatus::class);
    }

    public function toStatus()
    {
        return $this->belongsTo(EventStatus::class);
    }
}
