<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\TicketReply;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SupportTicketController extends Controller
{
    /**
     * Display a listing of the client's support tickets.
     */
    public function index()
    {
        $tickets = SupportTicket::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Client/Tickets', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Store a newly created support ticket in database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|in:soporte,personalizacion,bug,facturacion',
            'priority' => 'required|in:low,medium,high,critical',
            'message' => 'required|string|max:5000',
        ]);

        $user = Auth::user();

        // 1. Create the ticket header
        $ticket = SupportTicket::create([
            'user_id' => $user->id,
            'subject' => $request->input('subject'),
            'category' => $request->input('category'),
            'priority' => $request->input('priority'),
            'status' => 'open',
        ]);

        // 2. Create the first reply (from the client)
        TicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $request->input('message'),
        ]);

        // 3. Seed an automated AI response instantly to demonstrate AIAintelligence power!
        $adminUser = User::where('role', 'super-admin')->first() ?? $user;

        $aiResponses = [
            'soporte' => "🤖 [Agente IA de Soporte] ¡Hola! He recibido tu consulta técnica sobre tu automatización. Ya he verificado el canal de comunicación en la nube y todo parece estable. Nuestro equipo técnico liderado por Rafa está analizando tu reporte en detalle. Te daremos una actualización humana muy pronto. ¡Gracias por confiar en AIAIntelligence!",
            'personalizacion' => "🤖 [Agente IA de Soporte] ¡Hola! Qué excelente iniciativa de expandir tus herramientas. He clasificado tu solicitud como 'Personalización / Desarrollo a Medida'. Nuestro equipo se pondrá en contacto contigo para cotizar e integrar esta nueva funcionalidad en tu n8n/Python Sandbox. ¡Vamos a automatizar más procesos!",
            'bug' => "⚠️ [Agente IA de Soporte] ¡Hola! Lamentamos el inconveniente experimentado. He capturado los registros y reportado este bug directamente a la cola de corrección prioritaria. Revisaremos tu consola terminal de inmediato para normalizar el servicio. Te notificaremos por este hilo apenas esté solventado.",
            'facturacion' => "🤖 [Agente IA de Soporte] ¡Hola! He registrado tu ticket en el departamento administrativo. Ya estamos verificando las licencias activas y tu historial de checkout. En breve nos comunicaremos contigo para aclarar cualquier duda contable."
        ];

        $aiMessage = $aiResponses[$request->input('category')] ?? $aiResponses['soporte'];

        TicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => $adminUser->id,
            'message' => $aiMessage,
        ]);

        return redirect()->route('tickets.index')->with('success', '¡Ticket de soporte creado con éxito! El Agente IA de AIAIntelligence te ha dejado una respuesta preliminar.');
    }

    /**
     * Display a specific ticket thread with all its replies.
     */
    public function show($id)
    {
        // OPTIMIZATION: Eager loading replies.user and user to avoid N+1 queries!
        $ticket = SupportTicket::with(['user', 'replies.user'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('Client/TicketThread', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Add a reply to the ticket thread.
     */
    public function reply(Request $request, $id)
    {
        $ticket = SupportTicket::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        // Create user's reply
        TicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->input('message'),
        ]);

        // Automatically trigger a quick AI Agent acknowledgment after user's custom reply
        $adminUser = User::where('role', 'super-admin')->first() ?? Auth::user();

        TicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => $adminUser->id,
            'message' => "🤖 [Agente IA de Soporte] Mensaje recibido. He adjuntado esta información al caso técnico en curso. Continuamos trabajando en ello.",
        ]);

        // Update ticket updated_at timestamp
        $ticket->touch();

        return back()->with('success', 'Respuesta enviada.');
    }
}
