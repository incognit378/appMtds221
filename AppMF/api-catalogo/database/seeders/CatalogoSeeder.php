<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Producto;
use Illuminate\Support\Facades\Hash;

class CatalogoSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario de prueba institucional (Estudiante)
        User::updateOrCreate(
            ['email' => 'adiel@itca.edu.sv'],
            [
                'name' => 'Adiel Benjamín Benítez',
                'password' => Hash::make('itca2026'),
            ]
        );

        // Usuario Administrador (Gestión de solicitudes)
        User::updateOrCreate(
            ['email' => 'admin@itca.edu.sv'],
            [
                'name' => 'Administrador ITCA',
                'password' => Hash::make('admin2026'),
            ]
        );

        $productos = [
            [
                'nombre' => 'Kit Arduino Uno R3 Completo',
                'categoria' => 'Electrónica',
                'descripcion' => 'Placa Arduino Uno R3 con protoboard, cables jumper, resistencias, sensores ultrasónicos y LEDs para prácticas de laboratorio.',
                'precio' => 28.50,
                'stock' => 15,
                'imagen' => 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500&q=80',
            ],
            [
                'nombre' => 'Préstamo Laptop Dell Latitude i7',
                'categoria' => 'Equipo Cómputo',
                'descripcion' => 'Laptop institucional con 16GB RAM y SSD 512GB preconfigurada con Android Studio, VS Code y XAMPP para desarrollo móvil.',
                'precio' => 0.00,
                'stock' => 8,
                'imagen' => 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80',
            ],
            [
                'nombre' => 'Camisa Polo Institucional ITCA',
                'categoria' => 'Indumentaria',
                'descripcion' => 'Camisa polo oficial color vino/blanco con escudo bordado de la Escuela Especializada en Ingeniería ITCA-FEPADE.',
                'precio' => 16.00,
                'stock' => 30,
                'imagen' => 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80',
            ],
            [
                'nombre' => 'Curso Intensivo Cloud & AWS',
                'categoria' => 'Servicios Académicos',
                'descripcion' => 'Taller práctico de 20 horas sobre despliegue de servidores Linux, contenedores Docker y arquitectura en la nube.',
                'precio' => 35.00,
                'stock' => 25,
                'imagen' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80',
            ],
            [
                'nombre' => 'Router Mikrotik hEX S',
                'categoria' => 'Redes',
                'descripcion' => 'Router Gigabit Ethernet de 5 puertos con puerto SFP para laboratorios de enrutamiento y configuración de VLANs.',
                'precio' => 65.00,
                'stock' => 6,
                'imagen' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80',
            ],
            [
                'nombre' => 'Manual Técnico Ingeniería de Software',
                'categoria' => 'Bibliografía',
                'descripcion' => 'Compendio impreso sobre metodologías ágiles Scrum, diagramas UML, DFD y arquitectura cliente-servidor.',
                'precio' => 12.00,
                'stock' => 20,
                'imagen' => 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80',
            ],
        ];

        foreach ($productos as $prod) {
            Producto::create($prod);
        }
    }
}