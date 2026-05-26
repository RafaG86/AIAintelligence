<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Super Admin User safely
        User::firstOrCreate(
            ['email' => 'admin@nexusflow.com'],
            [
                'name' => 'Rafa AIAIntelligence',
                'password' => Hash::make('secret123'),
                'role' => 'super-admin',
                'phone' => '+34600123456'
            ]
        );

        // 2. Seed Test Client User safely
        User::firstOrCreate(
            ['email' => 'cliente@aiaintelligence.com'],
            [
                'name' => 'Cliente Demo',
                'password' => Hash::make('secret123'),
                'role' => 'cliente',
                'phone' => '+34600987654'
            ]
        );

        // 3. Seed the 4 Premium AI Products
        Service::updateOrCreate(
            ['name' => 'Agente IA de Atención y Ventas (WhatsApp & Web)'],
            [
                'type' => 'AIAgent',
                'description' => 'Un agente autónomo inteligente que atiende consultas en WhatsApp o tu sitio web 24/7. Califica prospectos, responde preguntas frecuentes a partir de tu PDF corporativo y agenda citas en tiempo real.',
                'monthly_cost' => 49.00,
                'one_time_cost' => 299.00,
                'is_active' => true,
            ]
        );

        Service::updateOrCreate(
            ['name' => 'Pipeline de ETL e IA para Procesamiento de Datos'],
            [
                'type' => 'ETL',
                'description' => 'Sube archivos Excel o CSV desordenados y deja que nuestra IA con Pandas limpie los datos, detecte duplicados, enriquezca la información y guarde todo ordenadamente en tu base de datos de forma automática.',
                'monthly_cost' => 39.00,
                'one_time_cost' => 199.00,
                'is_active' => true,
            ]
        );

        Service::updateOrCreate(
            ['name' => 'Asistente IA de Soporte Técnico y Helpdesk Inteligente'],
            [
                'type' => 'AIAgent',
                'description' => 'Se integra con tu base de conocimientos corporativa (RAG Vector Database). Lee, analiza e intenta auto-resolver hasta el 70% de tus tickets y correos de soporte técnico de forma inmediata.',
                'monthly_cost' => 59.00,
                'one_time_cost' => 349.00,
                'is_active' => true,
            ]
        );

        Service::updateOrCreate(
            ['name' => 'Automatización de Marketing y Generador SEO de Redes'],
            [
                'type' => 'IntegracionN8N',
                'description' => 'Genera y programa contenido dinámico en LinkedIn, Twitter y Facebook de forma 100% autónoma. Analiza tendencias de tu sector diariamente para redactar copys persuasivos.',
                'monthly_cost' => 45.00,
                'one_time_cost' => 249.00,
                'is_active' => true,
            ]
        );
    }
}
