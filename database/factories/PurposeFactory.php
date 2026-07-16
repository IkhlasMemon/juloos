<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Purpose>
 */
class PurposeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Disaster Relief',
            'Education & Tutoring',
            'Environmental Cleanup',
            'Elderly Care',
            'Food Distribution',
            'Health Outreach',
            'Youth Mentorship',
            'Animal Welfare',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::random(6),
            'description' => fake()->sentence(12),
            'is_active' => true,
        ];
    }
}
