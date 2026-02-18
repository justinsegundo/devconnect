<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Discussion;
use App\Models\Comment;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@devconnect.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'reputation_score' => 150,
        ]);

        $moderator = User::create([
            'name' => 'Moderator',
            'email' => 'mod@devconnect.com',
            'password' => Hash::make('password'),
            'role' => 'moderator',
            'reputation_score' => 75,
        ]);

        $user1 = User::create([
            'name' => 'John Developer',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'reputation_score' => 45,
        ]);

        $user2 = User::create([
            'name' => 'Sarah Coder',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'reputation_score' => 30,
        ]);

        $discussions = [
            [
                'user_id' => $user1->id,
                'title' => 'Best practices for React Hooks?',
                'body' => 'I am working on a React project and wondering what are the community best practices for using hooks effectively. Should I create custom hooks for everything?',
                'category' => 'question',
                'upvotes' => 15,
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Feature Request: Dark Mode Support',
                'body' => 'It would be great if DevConnect had a dark mode option for those of us who code late at night. This would reduce eye strain significantly.',
                'category' => 'feature-request',
                'upvotes' => 23,
            ],
            [
                'user_id' => $admin->id,
                'title' => 'Welcome to DevConnect!',
                'body' => 'Welcome to our developer community! Feel free to ask questions, share knowledge, and help each other grow. Please be respectful and follow our community guidelines.',
                'category' => 'general',
                'upvotes' => 50,
            ],
            [
                'user_id' => $user1->id,
                'title' => 'How to optimize Laravel query performance?',
                'body' => 'I have a Laravel application with slow queries. What are some strategies to improve performance? I am already using eager loading.',
                'category' => 'question',
                'upvotes' => 12,
            ],
        ];

        foreach ($discussions as $discussionData) {
            $discussion = Discussion::create($discussionData);

            Comment::create([
                'discussion_id' => $discussion->id,
                'user_id' => $moderator->id,
                'body' => 'Great question! Here are some thoughts...',
                'upvotes' => 5,
            ]);
        }
    }
}