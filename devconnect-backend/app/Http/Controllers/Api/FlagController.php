<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Flag;
use App\Models\Discussion;
use Illuminate\Http\Request;

class FlagController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flaggable_type' => 'required|in:App\Models\Discussion,App\Models\Comment',
            'flaggable_id' => 'required|integer',
            'reason' => 'required|string|max:500',
        ]);

        $existingFlag = Flag::where('user_id', $request->user()->id)
            ->where('flaggable_type', $validated['flaggable_type'])
            ->where('flaggable_id', $validated['flaggable_id'])
            ->where('status', 'pending')
            ->first();

        if ($existingFlag) {
            return response()->json(['message' => 'Already flagged'], 400);
        }

        $flag = Flag::create([
            'user_id' => $request->user()->id,
            'flaggable_type' => $validated['flaggable_type'],
            'flaggable_id' => $validated['flaggable_id'],
            'reason' => $validated['reason'],
        ]);

        if ($validated['flaggable_type'] === 'App\Models\Discussion') {
            $discussion = Discussion::find($validated['flaggable_id']);
            if ($discussion) {
                $discussion->update(['status' => 'flagged']);
            }
        }

        return response()->json($flag, 201);
    }

    public function index(Request $request)
    {
        if (!$request->user()->isModerator()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $flags = Flag::with(['user', 'flaggable'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return response()->json($flags);
    }

    public function review(Request $request, Flag $flag)
    {
        if (!$request->user()->isModerator()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        if ($validated['action'] === 'approve') {
            $flaggable = $flag->flaggable;
            
            if ($flag->flaggable_type === 'App\Models\Discussion') {
                $flaggable->update(['status' => 'removed']);
            } else {
                $flaggable->delete();
            }

            $flag->update([
                'status' => 'reviewed',
                'reviewed_by' => $request->user()->id,
            ]);
        } else {
            if ($flag->flaggable_type === 'App\Models\Discussion') {
                $discussion = Discussion::find($flag->flaggable_id);
                if ($discussion && $discussion->status === 'flagged') {
                    $discussion->update(['status' => 'active']);
                }
            }

            $flag->update([
                'status' => 'rejected',
                'reviewed_by' => $request->user()->id,
            ]);
        }

        return response()->json($flag->load('reviewer'));
    }
}