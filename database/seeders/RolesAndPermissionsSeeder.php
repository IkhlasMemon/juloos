<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view dashboard',
            'manage volunteers',
            'manage events',
            'manage purposes',
            'manage lookups',
            'manage users',
            'manage roles',
            'view activity logs',
            'manage reports',
            'view reports',
            'export reports',
            'import volunteers',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions($permissions);

        $manager = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'web']);
        $manager->syncPermissions([
            'view dashboard',
            'manage volunteers',
            'manage events',
            'manage purposes',
            'manage lookups',
            'view activity logs',
            'view reports',
            'export reports',
        ]);

        $staff = Role::firstOrCreate(['name' => 'Staff', 'guard_name' => 'web']);
        $staff->syncPermissions([
            'view dashboard',
            'manage volunteers',
            'manage events',
        ]);
    }
}
