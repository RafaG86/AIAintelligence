<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceContract;
use App\Models\SupportTicket;
use App\Models\TicketReply;
use App\Models\EtlExecutionLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Display administrative KPIs and metrics overview.
     */
    public function index()
    {
        $totalClients = User::where('role', 'cliente')->count();
        $activeContracts = ServiceContract::where('status', 'active')->count();
        $openTickets = SupportTicket::where('status', 'open')->count();
        $totalLogs = EtlExecutionLog::where('status', 'success')->count();

        // Calculate simulated MRR (Monthly Recurring Revenue)
        $mrr = ServiceContract::join('services', 'service_contracts.service_id', '=', 'services.id')
            ->where('service_contracts.status', 'active')
            ->sum('services.monthly_cost');

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_clients' => $totalClients,
                'active_contracts' => $activeContracts,
                'open_tickets' => $openTickets,
                'total_logs' => $totalLogs,
                'mrr' => $mrr,
            ]
        ]);
    }

    /**
     * CRUD: Display all services for management.
     */
    public function servicesIndex()
    {
        $services = Service::all();
        return Inertia::render('Admin/Services', [
            'services' => $services,
        ]);
    }

    /**
     * CRUD: Store a new service in catalog.
     */
    public function servicesStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:ETL,DataCleaning,AIAgent,IntegracionN8N',
            'description' => 'required|string',
            'monthly_cost' => 'required|numeric|min:0',
            'one_time_cost' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
        ]);

        Service::create($request->all());

        return redirect()->route('admin.services.index')->with('success', 'Solución digital añadida al catálogo con éxito.');
    }

    /**
     * CRUD: Update a service details.
     */
    public function servicesUpdate(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:ETL,DataCleaning,AIAgent,IntegracionN8N',
            'description' => 'required|string',
            'monthly_cost' => 'required|numeric|min:0',
            'one_time_cost' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
        ]);

        $service->update($request->all());

        return redirect()->route('admin.services.index')->with('success', 'Solución digital actualizada con éxito.');
    }

    /**
     * CRUD: Delete a service from catalog.
     */
    public function servicesDestroy($id)
    {
        $service = Service::findOrFail($id);
        
        // Prevent deleting a service if there are active client contracts on it
        if ($service->contracts()->where('status', 'active')->exists()) {
            return back()->with('error', 'No se puede eliminar la solución. Existen contratos activos vinculados a ella.');
        }

        $service->delete();

        return redirect()->route('admin.services.index')->with('success', 'Solución digital eliminada del catálogo.');
    }

    /**
     * Manage all active customer licenses (contracts).
     */
    public function contractsIndex()
    {
        $contracts = ServiceContract::with(['client', 'service'])->get();
        $clients = User::where('role', 'cliente')->get();
        $services = Service::where('is_active', true)->get();

        return Inertia::render('Admin/Contracts', [
            'contracts' => $contracts,
            'clients' => $clients,
            'services' => $services,
        ]);
    }

    /**
     * Manually assign an AI contract to a client.
     */
    public function contractsStore(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'payment_type' => 'required|in:one_time,monthly',
        ]);

        $service = Service::findOrFail($request->service_id);

        ServiceContract::create([
            'client_id' => $request->client_id,
            'service_id' => $request->service_id,
            'status' => 'active',
            'start_date' => Carbon::now(),
            'end_date' => $request->payment_type === 'monthly' ? Carbon::now()->addMonth() : null,
            'config_metadata' => [
                'webhook_url' => 'https://n8n.aiaintelligence.com/webhook/client-' . $request->client_id,
                'api_token' => bin2hex(random_bytes(16)),
                'custom_instructions' => 'Asignado manualmente por Administrador.',
            ],
        ]);

        return redirect()->route('admin.contracts.index')->with('success', 'Contrato asignado y activado manualmente con éxito.');
    }

    /**
     * Direct update of client configuration metadata JSON.
     */
    public function contractsUpdate(Request $request, $id)
    {
        $contract = ServiceContract::findOrFail($id);

        $request->validate([
            'webhook_url' => 'required|url',
            'api_token' => 'required|string',
            'custom_instructions' => 'nullable|string',
            'status' => 'required|in:active,paused,terminated',
        ]);

        $contract->status = $request->status;
        $contract->config_metadata = [
            'webhook_url' => $request->webhook_url,
            'api_token' => $request->api_token,
            'custom_instructions' => $request->custom_instructions,
        ];
        $contract->save();

        return redirect()->route('admin.contracts.index')->with('success', 'Configuración de integración de cliente actualizada.');
    }

    /**
     * Helpdesk: Display all open and closed tickets from all users.
     */
    public function ticketsIndex()
    {
        $tickets = SupportTicket::with('user')
            ->orderBy('status', 'asc')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Admin/Tickets', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Helpdesk: Display specific client ticket thread.
     */
    public function ticketsShow($id)
    {
        // OPTIMIZATION: Eager loading replies.user and user to prevent N+1 queries!
        $ticket = SupportTicket::with(['user', 'replies.user'])->findOrFail($id);

        return Inertia::render('Admin/TicketThread', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Helpdesk: Reply to customer ticket and update status.
     */
    public function ticketsReply(Request $request, $id)
    {
        $ticket = SupportTicket::findOrFail($id);

        $request->validate([
            'message' => 'required|string|max:5000',
            'status' => 'required|in:open,in_progress,resolved,closed',
        ]);

        // 1. Create the reply
        TicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        // 2. Update the ticket header
        $ticket->status = $request->status;
        $ticket->save();

        return back()->with('success', 'Respuesta técnica enviada con éxito.');
    }
}
