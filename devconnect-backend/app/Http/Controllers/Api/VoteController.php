<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\User;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function vote(Request $request)
    {
        $validated = $request->validate([
            'votable_type' => 'required|in:App\Models\Discussion,App\Models\Comment',
            'votable_id' => 'required|integer',
            'vote_type' => 'required|in:up,down',
        ]);

        $existingVote = Vote::where('user_id', $request->user()->id)
            ->where('votable_type', $validated['votable_type'])
            ->where('votable_id', $validated['votable_id'])
            ->first();

        if ($existingVote) {
            if ($existingVote->vote_type === $validated['vote_type']) {
                $existingVote->delete();
                $this->updateVoteCounts($validated['votable_type'], $validated['votable_id']);
                $this->updateUserReputation($validated['votable_type'], $validated['votable_id']);
                
                return response()->json(['message' => 'Vote removed']);
            }
            
            $existingVote->update(['vote_type' => $validated['vote_type']]);
        } else {
            Vote::create([
                'user_id' => $request->user()->id,
                'votable_type' => $validated['votable_type'],
                'votable_id' => $validated['votable_id'],
                'vote_type' => $validated['vote_type'],
            ]);
        }

        $this->updateVoteCounts($validated['votable_type'], $validated['votable_id']);
        $this->updateUserReputation($validated['votable_type'], $validated['votable_id']);

        return response()->json(['message' => 'Vote recorded']);
    }

    private function updateVoteCounts($type, $id)
    {
        $votable = $type::find($id);
        if ($votable) {
            $votable->updateVoteCounts();
        }
    }

    private function updateUserReputation($type, $id)
    {
        $votable = $type::find($id);
        if (!$votable) return;

        $user = User::find($votable->user_id);
        
        $discussionScore = Vote::where('votable_type', 'App\Models\Discussion')
            ->whereIn('votable_id', $user->discussions()->pluck('id'))
            ->selectRaw('SUM(CASE WHEN vote_type = "up" THEN 1 ELSE -1 END) as score')
            ->value('score') ?? 0;

        $commentScore = Vote::where('votable_type', 'App\Models\Comment')
            ->whereIn('votable_id', $user->comments()->pluck('id'))
            ->selectRaw('SUM(CASE WHEN vote_type = "up" THEN 1 ELSE 0 END) as score')
            ->value('score') ?? 0;

        $user->update(['reputation_score' => $discussionScore + $commentScore]);

        $this->assignBadges($user);
    }

    private function assignBadges(User $user)
    {
        $badges = [
            ['name' => 'New Member', 'threshold' => 0, 'description' => 'Welcome to DevConnect'],
            ['name' => 'Active Contributor', 'threshold' => 10, 'description' => 'Earned 10+ reputation'],
            ['name' => 'Trusted Member', 'threshold' => 50, 'description' => 'Earned 50+ reputation'],
            ['name' => 'Community Expert', 'threshold' => 100, 'description' => 'Earned 100+ reputation'],
        ];

        foreach ($badges as $badge) {
            if ($user->reputation_score >= $badge['threshold']) {
                $user->badges()->firstOrCreate(
                    ['name' => $badge['name']],
                    ['description' => $badge['description']]
                );
            }
        }
    }
}