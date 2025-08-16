<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plans = [
            [
                'id' => 1,
                'slug' => 'oferta-unica',
                'name' => 'OFERTA UNICA',
                'active' => 1,
                'price' => 500.00,
                'currency' => 'ARS',
                'text' => '<strong>Si solo necesitas acceder a una oferta en especial, esta opción te puede servir.</strong><br /><br />
<strong style="color: #49DA8B">1 oferta</strong><br /><br />
<span style="color: #49DA8B">Observar todas las publicaciones existentes</span><br /><br />
<span style="color: #49DA8B">Filtrar publicaciones según interés</span><br /><br />
<span style="color: #49DA8B">Chatear con usuarios que acepten tus ofertas</span><br /><br />
<span style="color: #CD4B51">Personalizar mi perfil para recibir alertas de materiales</span><br /><br />
<span style="color: #CD4B51">Acceso a Re-ofertar si te rechazan tu primera oferta</span><br /><br />',
                'trial_period' => 7,
                'trial_interval' => 'day',
                'invoice_period' => 1,
                'invoice_interval' => 'month',
            ],
            [
                'id' => 2,
                'slug' => 'starter',
                'name' => 'STARTER',
                'active' => 1,
                'price' => 2000.00,
                'currency' => 'ARS',
                'text' => '<strong>Una opción ideal  para quienes recién comienzan en el reciclado.</strong><br /><br />
<strong style="color: #49DA8B">5 oferta</strong><br /><br />
<span style="color: #49DA8B">Observar todas las publicaciones existentes</span><br /><br />
<span style="color: #49DA8B">Filtrar publicaciones según interés</span><br /><br />
<span style="color: #49DA8B">Chatear con usuarios que acepten tus ofertas</span><br /><br />
<span style="color: #CD4B51">Personalizar mi perfil para recibir alertas de materiales</span><br /><br />
<span style="color: #CD4B51">Acceso a Re-ofertar si te rechazan tu primera oferta</span>',
                'trial_period' => 7,
                'trial_interval' => 'day',
                'invoice_period' => 1,
                'invoice_interval' => 'month',
            ],
            [
                'id' => 3,
                'slug' => 'basic',
                'name' => 'BASIC',
                'active' => 1,
                'price' => 3500.00,
                'currency' => 'ARS',
                'text' => '<strong>Recomendado para quienes quieren dar un paso más en el mundo del reciclaje.</strong><br /><br />
<strong style="color: #49DA8B">15 oferta</strong><br /><br />
<span style="color: #49DA8B">Observar todas las publicaciones existentes</span><br /><br />
<span style="color: #49DA8B">Filtrar publicaciones según interés</span><br /><br />
<span style="color: #49DA8B">Chatear con usuarios que acepten tus ofertas</span><br /><br />
<span style="color: #49DA8B">Personalizar mi perfil para recibir alertas de materiales</span><br /><br />
<span style="color: #CD4B51">Acceso a Re-ofertar si te rechazan tu primera oferta</span><br /><br />',
                'trial_period' => 7,
                'trial_interval' => 'day',
                'invoice_period' => 1,
                'invoice_interval' => 'month',
            ],
            [
                'id' => 4,
                'slug' => 'premium',
                'name' => 'PREMIUM',
                'active' => 1,
                'price' => 5000.00,
                'currency' => 'ARS',
                'text' => '<strong>Para scrapers de tiempo completo que quieren sacar el máximo provecho de scrapy.</strong><br /><br />
<strong style="color: #49DA8B">ofertas ilimitadas</strong><br /><br />
<span style="color: #49DA8B">Observar todas las publicaciones existentes</span><br /><br />
<span style="color: #49DA8B">Filtrar publicaciones según interés</span><br /><br />
<span style="color: #49DA8B">Chatear con usuarios que acepten tus ofertas</span><br /><br />
<span style="color: #49DA8B">Personalizar mi perfil para recibir alertas de materiales</span><br /><br />
<span style="color: #49DA8B">Acceso a Re-ofertar si te rechazan tu primera oferta</span><br /><br />',
                'trial_period' => 7,
                'trial_interval' => 'day',
                'invoice_period' => 1,
                'invoice_interval' => 'month',
            ],
        ];

        DB::table('plans')->upsert($plans, ['id'], ['slug', 'name', 'active', 'price', 'currency', 'text',
            'trial_period', 'trial_interval', 'invoice_period', 'invoice_interval']);
    }
}
