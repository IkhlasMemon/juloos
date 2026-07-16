<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Volunteer>
 */
class VolunteerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->firstName().' '.fake()->lastName(),
            'father_name' => fake()->firstName('male').' '.fake()->lastName(),
            'phone' => fake()->unique()->numerify('03##-#######'),
            'cnic' => fake()->unique()->numerify('#####-#######-#'),
            'photo_path' => null,
            'status' => fake()->randomElement(['active', 'active', 'active', 'inactive']),
            'joined_date' => fake()->dateTimeBetween('-2 years', 'now'),
        ];
    }
}
