<?php

namespace Database\Factories;

use App\Models\Purpose;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->catchPhrase();
        $start = fake()->dateTimeBetween('-2 months', '+2 months');
        $status = $start < now() ? fake()->randomElement(['completed', 'completed', 'cancelled']) : 'upcoming';

        return [
            'purpose_id' => Purpose::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::random(6),
            'description' => fake()->paragraph(),
            'location' => fake()->city(),
            'start_date' => $start,
            'end_date' => (clone $start)->modify('+4 hours'),
            'status' => $status,
        ];
    }
}
