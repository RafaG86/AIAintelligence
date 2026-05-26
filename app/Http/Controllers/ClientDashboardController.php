<?php

namespace App\Http\Controllers;

use App\Models\ServiceContract;
use App\Models\EtlExecutionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ClientDashboardController extends Controller
{
    /**
     * Display the client dashboard with active contracts and execution histories.
     */
    public function index()
    {
        $user = Auth::user();

        // Get contracts with their linked service details
        $contracts = ServiceContract::with('service')
            ->where('client_id', $user->id)
            ->where('status', 'active')
            ->get();

        // Get past execution logs of these contracts
        $contractIds = $contracts->pluck('id');
        $logs = EtlExecutionLog::whereIn('contract_id', $contractIds)
            ->orderBy('started_at', 'desc')
            ->take(15)
            ->get();

        return Inertia::render('Client/Dashboard', [
            'contracts' => $contracts,
            'logs' => $logs,
        ]);
    }

    /**
     * Update the integration configurations (JSON config_metadata) of a contract.
     */
    public function updateConfig(Request $request, $id)
    {
        $contract = ServiceContract::where('client_id', Auth::id())->findOrFail($id);

        $request->validate([
            'webhook_url' => 'required|url',
            'api_token' => 'required|string|max:255',
            'custom_instructions' => 'nullable|string|max:1000',
        ]);

        $contract->config_metadata = [
            'webhook_url' => $request->input('webhook_url'),
            'api_token' => $request->input('api_token'),
            'custom_instructions' => $request->input('custom_instructions'),
        ];

        $contract->save();

        return back()->with('success', 'Configuración de integración actualizada con éxito.');
    }

    /**
     * Trigger a simulated pipeline run.
     * Inserts a 'running' log entry and returns custom console outputs.
     */
    public function runSimulatedPipeline(Request $request, $id)
    {
        $contract = ServiceContract::with('service')->where('client_id', Auth::id())->findOrFail($id);

        // Create initial execution log
        $log = EtlExecutionLog::create([
            'contract_id' => $contract->id,
            'pipeline_name' => $contract->service->name,
            'trigger_source' => 'manual',
            'status' => 'running',
            'processed_records' => 0,
            'started_at' => Carbon::now(),
        ]);

        // Deliver logs customized for the product type
        $type = $contract->service->type;

        $steps = [
            'AIAgent' => [
                ['text' => 'Initializing AIAintelligence Sandbox environment...', 'type' => 'info'],
                ['text' => 'Reading API settings and credential metadata...', 'type' => 'info'],
                ['text' => 'Configured Token: ' . substr($contract->config_metadata['api_token'] ?? 'N/A', 0, 8) . '...', 'type' => 'info'],
                ['text' => 'Connecting to WhatsApp Cloud gateway webhook: ' . ($contract->config_metadata['webhook_url'] ?? 'N/A') . '...', 'type' => 'info'],
                ['text' => 'Invoking n8n workflow execution node: [WhatsApp_Router]...', 'type' => 'success'],
                ['text' => 'Passing context instructions: "' . ($contract->config_metadata['custom_instructions'] ?? 'Ninguna') . '"...', 'type' => 'info'],
                ['text' => 'Calling Gemini 3.5 Flash Model via API...', 'type' => 'info'],
                ['text' => 'Gemini Token usage: Prompt: 1,024, Completion: 180.', 'type' => 'success'],
                ['text' => 'Agent responded: "¡Mensaje analizado y procesado exitosamente por la IA!"', 'type' => 'success'],
                ['text' => 'Simulated message dispatched to WhatsApp client gateway... HTTP 200 OK', 'type' => 'success'],
                ['text' => 'Execution finished in 4.5 seconds.', 'type' => 'info'],
            ],
            'ETL' => [
                ['text' => 'Initializing Python runtime environment in sandbox...', 'type' => 'info'],
                ['text' => 'Loading cleaning data parameters...', 'type' => 'info'],
                ['text' => 'Fetching webhook stream: ' . ($contract->config_metadata['webhook_url'] ?? 'N/A') . '...', 'type' => 'info'],
                ['text' => 'Starting clean_members_data.py execution thread...', 'type' => 'info'],
                ['text' => 'Pandas execution: Dropping duplicates and filling NaN values...', 'type' => 'success'],
                ['text' => 'Applying custom prompt overrides: "' . ($contract->config_metadata['custom_instructions'] ?? 'Default') . '"...', 'type' => 'info'],
                ['text' => 'Gemini API call to clean names: 100% complete.', 'type' => 'success'],
                ['text' => 'Exporting clean dataframe to MySQL database table `members`...', 'type' => 'success'],
                ['text' => 'Sync completed: 350 records imported, 12 duplicates dropped.', 'type' => 'success'],
                ['text' => 'Pipeline executed successfully in 4.5 seconds.', 'type' => 'info'],
            ],
            'IntegracionN8N' => [
                ['text' => 'Initializing social media scheduler cron triggers...', 'type' => 'info'],
                ['text' => 'Reading API integration token...', 'type' => 'info'],
                ['text' => 'Connecting to social media nodes on webhook: ' . ($contract->config_metadata['webhook_url'] ?? 'N/A') . '...', 'type' => 'info'],
                ['text' => 'Gemini 3.5 Flash: Auto-generating post content based on trends...', 'type' => 'info'],
                ['text' => 'LinkedIn API post: "AIAIntelligence automatizando el mañana..." Status: 201 Created', 'type' => 'success'],
                ['text' => 'Twitter API post: "AIAIntelligence automation in action!" Status: 201 Created', 'type' => 'success'],
                ['text' => 'Facebook API post: "Automatiza tus ventas hoy mismo..." Status: 201 Created', 'type' => 'success'],
                ['text' => 'All channels scheduled and executed.', 'type' => 'success'],
                ['text' => 'Scheduler completed successfully in 4.5 seconds.', 'type' => 'info'],
            ]
        ];

        $lines = $steps[$type] ?? $steps['AIAgent'];

        return response()->json([
            'log_id' => $log->id,
            'lines' => $lines,
        ]);
    }

    /**
     * Mark a running log as completed/success.
     */
    public function completeLog($log_id)
    {
        $log = EtlExecutionLog::findOrFail($log_id);

        // Ensure this log belongs to a contract of the current user
        $contract = ServiceContract::where('client_id', Auth::id())->findOrFail($log->contract_id);

        $log->status = 'success';
        $log->processed_records = $contract->service->type === 'ETL' ? 350 : 1;
        $log->ended_at = Carbon::now();
        $log->save();

        return response()->json(['status' => 'success']);
    }
}
