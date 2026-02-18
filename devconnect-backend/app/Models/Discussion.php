<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'body',
        'category',
        'upvotes',
        'downvotes',
        'status',
    ];

    protected $with = ['user'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function votes()
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    public function flags()
    {
        return $this->morphMany(Flag::class, 'flaggable');
    }

    public function updateVoteCounts()
    {
        $this->upvotes = $this->votes()->where('vote_type', 'up')->count();
        $this->downvotes = $this->votes()->where('vote_type', 'down')->count();
        $this->save();
    }
}