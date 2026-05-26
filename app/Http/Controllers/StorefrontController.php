<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class StorefrontController extends Controller
{
    /**
     * Display the public storefront catalog on the landing page.
     */
    public function index()
    {
        $services = Service::where('is_active', true)->get();

        return Inertia::render('Welcome', [
            'services' => $services,
            'canLogin' => true,
            'canRegister' => true,
        ]);
    }

    /**
     * Get simulated steps for the Guest Live Demo Console.
     */
    public function getDemoSteps(Request $request)
    {
        $type = $request->input('type', 'AIAgent');

        $steps = [
            'AIAgent' => [
                ['text' => 'Initializing AIAintelligence Sandbox environment...', 'delay' => 600, 'type' => 'info'],
                ['text' => 'Connecting to WhatsApp Cloud API gateway...', 'delay' => 1200, 'type' => 'info'],
                ['text' => 'Retrieving conversation history context buffer...', 'delay' => 1800, 'type' => 'info'],
                ['text' => 'Invoking n8n workflow execution node: [WhatsApp_Router]...', 'delay' => 2400, 'type' => 'success'],
                ['text' => 'Calling Gemini 3.5 Flash Model via API...', 'delay' => 3000, 'type' => 'info'],
                ['text' => 'Gemini Response: "Hola! Soy tu asistente de AIAIntelligence. ¿En qué puedo ayudarte hoy?"', 'delay' => 3600, 'type' => 'success'],
                ['text' => 'Sending message package to WhatsApp API... HTTP 200 OK', 'delay' => 4200, 'type' => 'success'],
                ['text' => 'Execution finished in 4.2 seconds.', 'delay' => 4600, 'type' => 'info'],
            ],
            'ETL' => [
                ['text' => 'Initializing Python runtime virtual environment...', 'delay' => 600, 'type' => 'info'],
                ['text' => 'Loading file package: input_contacts_dirty.xlsx (1,250 records)...', 'delay' => 1200, 'type' => 'info'],
                ['text' => 'Invoking clean_members_data.py execution thread...', 'delay' => 1800, 'type' => 'info'],
                ['text' => 'Pandas execution: Dropping duplicates and filling NaN values...', 'delay' => 2400, 'type' => 'success'],
                ['text' => 'Calling Gemini API for NLP text cleaning on names...', 'delay' => 3000, 'type' => 'info'],
                ['text' => 'Exporting clean dataframe to MySQL database table `members`...', 'delay' => 3600, 'type' => 'success'],
                ['text' => 'Sync completed: 1,212 records imported, 38 duplicates cleaned.', 'delay' => 4200, 'type' => 'success'],
                ['text' => 'Pipeline executed successfully in 4.2 seconds.', 'delay' => 4600, 'type' => 'info'],
            ],
            'IntegracionN8N' => [
                ['text' => 'Initializing social media automation cron trigger...', 'delay' => 600, 'type' => 'info'],
                ['text' => 'Scraping Google Trends and sector news feeds...', 'delay' => 1200, 'type' => 'info'],
                ['text' => 'Sending text prompt payload to Gemini 3.5 Flash node...', 'delay' => 1800, 'type' => 'info'],
                ['text' => 'Gemini generated 3 highly persuasive SEO posts...', 'delay' => 2400, 'type' => 'success'],
                ['text' => 'Invoking n8n LinkedIn API connection channel...', 'delay' => 3000, 'type' => 'info'],
                ['text' => 'Posting LinkedIn updates: "El futuro de la IA empresarial..." Status: 201 Created', 'delay' => 3600, 'type' => 'success'],
                ['text' => 'Invoking n8n Twitter API connection channel...', 'delay' => 4200, 'type' => 'info'],
                ['text' => 'Posting Twitter updates... Status: 201 Created', 'delay' => 4500, 'type' => 'success'],
                ['text' => 'Cron scheduler completed successfully.', 'delay' => 4800, 'type' => 'info'],
            ]
        ];

        return response()->json($steps[$type] ?? $steps['AIAgent']);
    }

    /**
     * Show the checkout simulator page for a specific service.
     */
    public function checkout($service_id)
    {
        $service = Service::findOrFail($service_id);

        return Inertia::render('Storefront/Checkout', [
            'service' => $service,
        ]);
    }

    /**
     * Process the mock payment simulation and activate the client contract.
     */
    public function processCheckout(Request $request, $service_id)
    {
        $request->validate([
            'card_name' => 'required|string|max:255',
            'card_number' => 'required|string|min:16|max:19',
            'payment_type' => 'required|in:one_time,monthly',
        ]);

        $user = Auth::user();
        $service = Service::findOrFail($service_id);

        // Ensure user has 'cliente' role when they make their first purchase
        if ($user->role === 'miembro') {
            $user->role = 'cliente';
            $user->save();
        }

        // Create the Service Contract
        $contract = ServiceContract::create([
            'client_id' => $user->id,
            'service_id' => $service->id,
            'status' => 'active',
            'start_date' => Carbon::now(),
            'end_date' => $request->payment_type === 'monthly' ? Carbon::now()->addMonth() : null,
            'config_metadata' => [
                'webhook_url' => 'https://n8n.aiaintelligence.com/webhook/client-' . $user->id,
                'api_token' => bin2hex(random_bytes(16)),
                'custom_instructions' => 'Ejecutar bajo parámetros por defecto.',
            ],
        ]);

        return redirect()->route('dashboard')->with('success', '¡Solución digital contratada con éxito! Bienvenido a tu panel de AIAIntelligence.');
    }
}
