<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    public function type()
    {
        return $this->hasOne(EventType::class, 'id', 'event_type_id');
    }

    public function files()
    {
        return $this->hasMany(EventFile::class);
    }

    public function tags()
    {
        return $this->belongsToMany(EventTag::class, 'event_tag_relationships');
    }

    public function tagsFormat()
    {
        return $this->belongsToMany(EventTagFormat::class, 'event_tag_format_relationships');
    }

    public function status()
    {
        return $this->hasOne(EventStatus::class, 'id', 'event_status_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function accounts()
    {
        return $this->belongsToMany(Account::class, 'event_accounts');
    }
}
