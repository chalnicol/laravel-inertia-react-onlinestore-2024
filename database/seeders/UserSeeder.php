<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::create([
            'name' => 'Charlou',
            'email' => 'admin@example.com',
            'password' => Hash::make('asdfasdf'), // Secure password hashing
            'is_admin' => true, // Custom flag to identify admin (or use roles if available)
        ]);
        User::create([
            'name' => 'Nong',
            'email' => 'editor@example.com',
            'password' => Hash::make('asdfasdf'), // Secure password hashing
            'is_admin' => false, // Custom flag to identify admin (or use roles if available)
        ]);
    }
}
