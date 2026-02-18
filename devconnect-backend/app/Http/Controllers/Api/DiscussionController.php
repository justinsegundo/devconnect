<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use Illuminate\Http\Request;

class DiscussionController extends Controller
{
    public function index(Request $request)
    {
        $query = Discussion::where('status', 'active')
            ->withCount('comments');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('body', 'like', '%' . $request->search . '%');
            });
        }

        $sort = $request->get('sort', 'latest');
        
        switch ($sort) {
            case 'popular':
                $query->orderByRaw('(upvotes - downvotes) DESC');
                break;
            case 'oldest':
                $query->oldest();
                break;
            default:
                $query->latest();
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string|min:10',
            'category' => 'required|string|in:general,question,feature-request,bug-report,best-practice',
        ]);

        $discussion = $request->user()->discussions()->create($validated);

        return response()->json($discussion->load('user'), 201);
    }

    public function show(Discussion $discussion)
    {
        return response()->json(
            $discussion->load(['user', 'comments.user'])
        );
    }

    public function update(Request $request, Discussion $discussion)
    {
        if ($request->user()->id !== $discussion->user_id && !$request->user()->isModerator()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string|min:10',
            'category' => 'sometimes|string|in:general,question,feature-request,bug-report,best-practice',
        ]);

        $discussion->update($validated);

        return response()->json($discussion->load('user'));
    }

    public function destroy(Request $request, Discussion $discussion)
    {
        if ($request->user()->id !== $discussion->user_id && !$request->user()->isModerator()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $discussion->delete();

        return response()->json(['message' => 'Discussion deleted'], 200);
    }
}