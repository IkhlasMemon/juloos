<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        $admin = User::firstOrCreate(
            ['email' => 'ikhlasmemon@gmail.com'],
            ['name' => 'Muhammad Ikhlas', 'password' => bcrypt('3AnPxVvGRlv41Km2nT3Y')]
        );
        $admin->assignRole('Super Admin');
    }
}
