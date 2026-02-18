<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(User $user)
    {
        return response()->json(
            $user->load([
                'badges',
                'discussions' => function ($query) {
                    $query->where('status', 'active')->latest()->take(5);
                },
                'comments' => function ($query) {
                    $query->latest()->take(5);
                },
            ])->loadCount(['discussions', 'comments'])
        );
    }

    public function leaderboard()
    {
        $users = User::with('badges')
            ->where('reputation_score', '>', 0)
            ->orderBy('reputation_score', 'desc')
            ->take(10)
            ->get();

        return response()->json($users);
    }
}