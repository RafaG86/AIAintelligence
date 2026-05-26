import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Cpu, Terminal, Settings, Play, CheckCircle2, AlertTriangle, History, ArrowRight, Save, LogOut, Code, Globe, Lock, FileText, ChevronRight, Zap, HelpCircle, Loader2, RefreshCw, User } from 'lucide-react';
import axios from 'axios';

interface Service {
    id: number;
    name: string;
    type: string;
    description: string;
    monthly_cost: string;
}

interface Contract {
    id: number;
    service_id: number;
    status: string;
    start_date: string;
    end_date: string | null;
    config_metadata: {
        webhook_url: string;
        api_token: string;
        custom_instructions: string;
    };
    service: Service;
}

interface ExecutionLog {
    id: number;
    contract_id: number;
    pipeline_name: string;
    trigger_source: string;
    status: string;
    processed_records: number;
    error_message: string | null;
    started_at: string;
    ended_at: string | null;
}

interface DashboardProps {
    contracts: Contract[];
    logs: ExecutionLog[];
    auth: {
        user: any;
    };
}

export default function Dashboard({ contracts, logs, auth }: DashboardProps) {
    const [selectedContract, setSelectedContract] = useState<Contract | null>(contracts[0] || null);
    const [activeTab, setActiveTab] = useState<'console' | 'config' | 'logs'>('console');
    
    // Terminal state
    const [terminalLines, setTerminalLines] = useState<Array<{ text: string; type: string }>>([]);
    const [terminalRunning, setTerminalRunning] = useState(false);
    const [terminalProgress, setTerminalProgress] = useState(0);

    // Form for config metadata
    const configForm = useForm({
        webhook_url: selectedContract?.config_metadata?.webhook_url || '',
        api_token: selectedContract?.config_metadata?.api_token || '',
        custom_instructions: selectedContract?.config_metadata?.custom_instructions || '',
    });

    useEffect(() => {
        if (selectedContract) {
            configForm.setData({
                webhook_url: selectedContract.config_metadata?.webhook_url || '',
                api_token: selectedContract.config_metadata?.api_token || '',
                custom_instructions: selectedContract.config_metadata?.custom_instructions || '',
            });
            setTerminalLines([
                { text: `AIAintelligence Terminal v1.0.0 initialized for [${selectedContract.service.name}]`, type: 'info' },
                { text: 'Type "$ help" or click "Ejecutar Automatización" to start testing.', type: 'info' }
            ]);
            setTerminalRunning(false);
        }
    }, [selectedContract]);

    // Handle interactive simulated console runs
    const handleRunConsole = async () => {
        if (!selectedContract || terminalRunning) return;

        setTerminalRunning(true);
        setTerminalLines([{ text: 'Connecting with AIAIntelligence API sandbox environment...', type: 'info' }]);
        setTerminalProgress(0);

        try {
            // 1. Fire execution in database
            const response = await axios.post(`/client/contracts/${selectedContract.id}/run`);
            const { log_id, lines } = response.data;

            let stepIdx = 0;
            const runInterval = setInterval(async () => {
                if (stepIdx < lines.length) {
                    setTerminalLines(prev => [...prev, lines[stepIdx]]);
                    setTerminalProgress(Math.floor(((stepIdx + 1) / lines.length) * 100));
                    stepIdx++;
                } else {
                    clearInterval(runInterval);
                    // 2. Mark log completed in database
                    await axios.post(`/client/logs/${log_id}/complete`);
                    setTerminalRunning(false);
                    // Refresh data using Inertia to update log table
                    router.reload({ only: ['logs'] });
                }
            }, 500);

        } catch (error) {
            setTerminalLines(prev => [...prev, { text: 'CRITICAL ERROR: Connection to gateway lost.', type: 'error' }]);
            setTerminalRunning(false);
        }
    };

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContract) return;

        configForm.put(route('client.contracts.config', selectedContract.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Flash alert in component
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] flex flex-col md:flex-row font-sans">
            <Head title="Mi Portal AIAIntelligence" />

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-80 bg-[#0c1221] border-r border-white/5 flex flex-col justify-between shrink-0">
                <div>
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
                                <Cpu className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-extrabold tracking-wider text-white text-base">
                                AIAIntelligence
                            </span>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-800/30 flex items-center justify-center">
                                <User className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{auth.user.name}</h3>
                                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                                    Cliente Portal
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Active Services Menu */}
                    <div className="p-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block px-2 mb-3">
                            Mis Soluciones Activas
                        </span>
                        
                        {contracts.length === 0 ? (
                            <div className="text-slate-500 text-xs px-2 py-4">
                                No posees automatizaciones contratadas. Adquiere una en nuestra página de inicio.
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {contracts.map((contract) => (
                                    <button
                                        key={contract.id}
                                        onClick={() => setSelectedContract(contract)}
                                        className={`w-full text-left py-3 px-3.5 rounded-xl transition duration-200 flex items-center justify-between text-xs cursor-pointer ${
                                            selectedContract?.id === contract.id
                                                ? 'bg-[#121b30] border border-cyan-500/20 text-cyan-400 font-bold'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            <Terminal className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{contract.service.name}</span>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link
                        href={route('tickets.index')}
                        className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 hover:text-white transition duration-200 text-xs font-semibold text-slate-400 flex items-center gap-2"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span>Tickets de Soporte</span>
                    </Link>
                    <Link
                        href="/"
                        className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 hover:text-white transition duration-200 text-xs font-semibold text-slate-400 flex items-center gap-2"
                    >
                        <Globe className="w-4 h-4" />
                        <span>Ver Tienda</span>
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full text-left py-2.5 px-3 rounded-xl text-red-400 hover:bg-red-500/10 transition duration-200 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-6 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full overflow-y-auto">
                
                {selectedContract ? (
                    <>
                        {/* Page Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0c1221] p-6 rounded-2xl border border-white/5">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                                    Consola de Control
                                </span>
                                <h2 className="text-xl font-bold text-white mt-1">
                                    {selectedContract.service.name}
                                </h2>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('console')}
                                    className={`py-2 px-4 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                                        activeTab === 'console'
                                            ? 'bg-cyan-500 text-slate-950'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    <Terminal className="w-3.5 h-3.5 inline mr-1.5" />
                                    Terminal Sandbox
                                </button>
                                <button
                                    onClick={() => setActiveTab('config')}
                                    className={`py-2 px-4 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                                        activeTab === 'config'
                                            ? 'bg-cyan-500 text-slate-950'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    <Settings className="w-3.5 h-3.5 inline mr-1.5" />
                                    Integración
                                </button>
                            </div>
                        </div>

                        {/* Tab Content 1: Console Sandbox */}
                        {activeTab === 'console' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                                        <Code className="w-4 h-4 text-cyan-400" />
                                        <span>Sandbox de Pruebas de Flujo</span>
                                    </h3>
                                    <button
                                        onClick={handleRunConsole}
                                        disabled={terminalRunning}
                                        className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/60 disabled:text-slate-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl text-xs transition duration-200 flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                                        <span>{terminalRunning ? 'Ejecutando...' : 'Ejecutar Automatización'}</span>
                                    </button>
                                </div>

                                {/* Monospace glowing terminal mockup */}
                                <div className="rounded-2xl border border-cyan-500/40 overflow-hidden shadow-xl neon-glow-cyan">
                                    {/* Terminal Header */}
                                    <div className="bg-[#0b101c] px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono select-none">
                                        <span>aiaintelligence_sandbox://{selectedContract.service.type.toLowerCase()}_process</span>
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
                                        </div>
                                    </div>
                                    {/* Console display area */}
                                    <div className="bg-[#040711] p-6 h-[320px] overflow-y-auto terminal-font text-cyan-400 text-xs leading-relaxed select-text">
                                        {terminalLines.map((line, idx) => (
                                            <div
                                                key={idx}
                                                className={`mb-1.5 font-mono ${
                                                    line.type === 'success' ? 'text-green-400' :
                                                    line.type === 'error' ? 'text-red-400' : 'text-cyan-400'
                                                }`}
                                            >
                                                <span className="text-slate-600 select-none mr-2">$</span>
                                                {line.text}
                                            </div>
                                        ))}

                                        {terminalRunning && (
                                            <div className="flex items-center gap-2 text-cyan-600 font-mono mt-3 select-none">
                                                <span className="animate-spin">⌛</span>
                                                <span>Ejecutando nodo... {terminalProgress}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content 2: Integration settings editor */}
                        {activeTab === 'config' && (
                            <form onSubmit={handleSaveConfig} className="bg-[#0c1221] p-8 rounded-2xl border border-white/5 flex flex-col gap-6">
                                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base border-b border-white/5 pb-4">
                                    <Settings className="w-5 h-5 text-cyan-400" />
                                    <span>Configuraciones de la API e Integración</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>Webhook de Conexión (n8n API Endpoint)</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={configForm.data.webhook_url}
                                            onChange={(e) => configForm.setData('webhook_url', e.target.value)}
                                            className="bg-[#090d16] border border-white/5 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition font-mono"
                                            required
                                        />
                                        {configForm.errors.webhook_url && <span className="text-xs text-red-500">{configForm.errors.webhook_url}</span>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Lock className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>Token de Seguridad (API HMAC Key)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={configForm.data.api_token}
                                            onChange={(e) => configForm.setData('api_token', e.target.value)}
                                            className="bg-[#090d16] border border-white/5 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition font-mono"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>Instrucciones Personalizadas del Prompt IA (System overrides)</span>
                                    </label>
                                    <textarea
                                        value={configForm.data.custom_instructions}
                                        onChange={(e) => configForm.setData('custom_instructions', e.target.value)}
                                        rows={4}
                                        placeholder="Ej: Responder siempre de forma formal y saludar indicando el nombre comercial..."
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={configForm.processing}
                                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/60 disabled:text-slate-400 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs transition duration-200 self-end flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10"
                                >
                                    {configForm.processing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Guardar Parámetros de Integración</span>
                                </button>
                            </form>
                        )}

                        {/* Historic Execution Log List */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2 mt-4">
                                <History className="w-4 h-4 text-cyan-400" />
                                <span>Historial de Ejecuciones del Pipeline</span>
                            </h3>

                            <div className="bg-[#0c1221] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-slate-950/40 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
                                                <th className="py-4 px-6">ID Run</th>
                                                <th className="py-4 px-6">Solución</th>
                                                <th className="py-4 px-6">Disparador</th>
                                                <th className="py-4 px-6 text-center">Estado</th>
                                                <th className="py-4 px-6 text-right">Registros</th>
                                                <th className="py-4 px-6 text-right">Iniciado En</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-300">
                                            {logs.filter(log => log.contract_id === selectedContract.id).length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="py-6 px-6 text-center text-slate-500">
                                                        No existen ejecuciones registradas para esta solución. Dispara tu primera prueba.
                                                    </td>
                                                </tr>
                                            ) : (
                                                logs
                                                    .filter(log => log.contract_id === selectedContract.id)
                                                    .map((log) => (
                                                        <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                                                            <td className="py-3.5 px-6 font-mono text-cyan-400 font-semibold">
                                                                #{log.id}
                                                            </td>
                                                            <td className="py-3.5 px-6 truncate font-medium text-white max-w-[200px]">
                                                                {log.pipeline_name}
                                                            </td>
                                                            <td className="py-3.5 px-6 font-mono capitalize">
                                                                {log.trigger_source}
                                                            </td>
                                                            <td className="py-3.5 px-6 text-center">
                                                                {log.status === 'success' ? (
                                                                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full uppercase font-bold text-[9px]">
                                                                        <CheckCircle2 className="w-3 h-3" />
                                                                        <span>Completado</span>
                                                                    </span>
                                                                ) : log.status === 'failed' ? (
                                                                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full uppercase font-bold text-[9px]">
                                                                        <AlertTriangle className="w-3 h-3" />
                                                                        <span>Fallido</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full uppercase font-bold text-[9px] animate-pulse">
                                                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                                                        <span>Corriendo</span>
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-3.5 px-6 text-right font-mono font-medium">
                                                                {log.processed_records}
                                                            </td>
                                                            <td className="py-3.5 px-6 text-right font-mono text-slate-400">
                                                                {new Date(log.started_at).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-[#0c1221] p-12 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center gap-4 flex-grow my-auto max-w-md mx-auto">
                        <Cpu className="w-12 h-12 text-slate-500 animate-pulse" />
                        <h2 className="text-xl font-bold text-white">Ningún Servicio Activo</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            AIAIntelligence te da la bienvenida. Ve a nuestro catálogo e introduce tu primer sandbox contratando una solución digital para tu negocio.
                        </p>
                        <Link
                            href="/"
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10"
                        >
                            <span>Ir al Catálogo</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

            </main>
        </div>
    );
}
