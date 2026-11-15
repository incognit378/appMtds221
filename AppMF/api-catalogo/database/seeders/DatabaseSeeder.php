<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'adiel@itca.edu.sv'],
            [
                'name' => 'Adiel Benjamín Benítez Bermúdez',
                'password' => Hash::make('password'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@itca.edu.sv'],
            [
                'name' => 'Administrador ITCA',
                'password' => Hash::make('password'),
            ]
        );
    }
}