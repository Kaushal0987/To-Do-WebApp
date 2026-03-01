<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tasks = [
            'Complete project documentation',
            'Review pull requests',
            'Schedule team meeting',
            'Update personal website',
            'Buy groceries',
            'Call dentist for appointment',
            'Prepare presentation slides',
            'Fix bugs in production',
            'Write unit tests',
            'Update dependencies',
            'Plan sprint retrospective',
            'Send weekly report',
            'Review code changes',
            'Organize workspace',
            'Book flight tickets',
            'Pay utility bills',
            'Renew gym membership',
            'Learn new framework',
            'Backup important files',
            'Schedule car maintenance',
        ];

        // 40% Ongoing, 30% Complete, 30% Due
        $flags = array_merge(
            array_fill(0, 4, 'Ongoing'),
            array_fill(0, 3, 'Complete'),
            array_fill(0, 3, 'Due')
        );

        return [
            'title' => fake()->randomElement($tasks),
            'flag' => fake()->randomElement($flags),
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
