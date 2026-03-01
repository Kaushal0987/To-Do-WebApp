<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create demo user with known credentials
        $demoUser = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'password' => 'password', // Will be hashed by User model
        ]);

        // Create 8 tasks for demo user
        Task::factory()->count(8)->create([
            'user_id' => $demoUser->id,
        ]);

        // Create 4 additional test users
        $testUsers = User::factory()->count(4)->create();

        // Create 8 tasks for each test user
        foreach ($testUsers as $user) {
            Task::factory()->count(8)->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
