import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Cpu, Terminal, HelpCircle, User, LogOut, ArrowRight, MessageSquare, Plus, CheckCircle2, AlertTriangle, RefreshCw, X, ShieldAlert, Loader2 } from 'lucide-react';

interface Ticket {
    id: number;
    subject: string;
    category: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
}

interface TicketsProps {
    tickets: Ticket[];
    auth: {
        user: any;
    };
}

export default function Tickets({ tickets, auth }: TicketsProps) {
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        category: 'soporte',
        priority: 'medium',
        message: '',
    });

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tickets.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                reset();
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] flex flex-col md:flex-row font-sans">
            <Head title="Mis Tickets de Soporte - AIAIntelligence" />

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-80 bg-[#0c1221] border-r border-white/5 flex flex-col justify-between shrink-0">
                <div>
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

                    <div className="p-4 space-y-2">
                        <Link
                            href={route('client.dashboard')}
                            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#121b30] hover:text-cyan-400 text-xs font-semibold text-slate-400 flex items-center gap-2"
                        >
                            <Terminal className="w-4 h-4" />
                            <span>Mi Sandbox Consola</span>
                        </Link>
                        <Link
                            href={route('tickets.index')}
                            className="w-full text-left py-2.5 px-3 rounded-xl bg-[#121b30] text-cyan-400 font-bold text-xs flex items-center gap-2 border border-cyan-500/10"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span>Tickets de Soporte</span>
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link
                        href="/"
                        className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 hover:text-white transition duration-200 text-xs font-semibold text-slate-400 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
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

            {/* Main Content */}
            <main className="flex-grow p-6 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full overflow-y-auto">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0c1221] p-6 rounded-2xl border border-white/5">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                            Helpdesk Inteligente
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">
                            Mis Solicitudes de Soporte
                        </h2>
                    </div>

                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Crear Nuevo Ticket</span>
                    </button>
                </div>

                {/* Tickets grid/table */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <span>Historial de Consultas</span>
                    </h3>

                    {tickets.length === 0 ? (
                        <div className="bg-[#0c1221] p-12 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center gap-4">
                            <HelpCircle className="w-12 h-12 text-slate-500" />
                            <h4 className="font-bold text-white">¿Tienes alguna duda técnica o comercial?</h4>
                            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                                No posees tickets de soporte abiertos. Puedes crear un ticket ahora y nuestro equipo técnico y el bot IA te atenderán de inmediato.
                            </p>
                            <button
                                onClick={() => setCreateModalOpen(true)}
                                className="bg-cyan-950 border border-cyan-800 text-cyan-400 hover:border-cyan-500 font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer"
                            >
                                Abrir Mi Primer Ticket
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="bg-[#0c1221] rounded-2xl p-6 border border-white/5 flex flex-col justify-between hover:border-cyan-500/20 transition-all shadow-md"
                                >
                                    <div>
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <span className="font-mono text-cyan-400 font-bold text-xs">
                                                #{ticket.id}
                                            </span>
                                            
                                            <div className="flex gap-2">
                                                {/* Category Badge */}
                                                <span className="text-[9px] bg-cyan-950/40 text-cyan-400 border border-cyan-850 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                    {ticket.category}
                                                </span>
                                                {/* Priority Badge */}
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${
                                                    ticket.priority === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
                                                    ticket.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    ticket.priority === 'medium' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border-white/5'
                                                }`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                        </div>

                                        <h4 className="font-bold text-white text-sm mb-2 truncate">
                                            {ticket.subject}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-mono">
                                            Creado: {new Date(ticket.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                                        {/* Status Badge */}
                                        {ticket.status === 'open' ? (
                                            <span className="inline-flex items-center gap-1 text-green-400 font-bold text-[10px] uppercase font-mono">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                                                <span>Abierto</span>
                                            </span>
                                        ) : ticket.status === 'in_progress' ? (
                                            <span className="inline-flex items-center gap-1 text-yellow-400 font-bold text-[10px] uppercase font-mono">
                                                <RefreshCw className="w-3 h-3 animate-spin" />
                                                <span>En Curso</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase font-mono">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Resuelto</span>
                                            </span>
                                        )}

                                        <Link
                                            href={route('tickets.show', ticket.id)}
                                            className="bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-400 font-semibold py-1.5 px-3 rounded-lg transition duration-200 text-xs flex items-center gap-1.5"
                                        >
                                            <span>Chat</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Create Ticket Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm">
                    <div className="w-full max-w-xl glass-panel rounded-2xl overflow-hidden border border-cyan-500/50 shadow-2xl neon-glow-cyan">
                        <div className="bg-[#0b101d] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-cyan-400" />
                                <span>Abrir Solicitud de Soporte Técnico</span>
                            </span>
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                className="text-slate-400 hover:text-white transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Asunto / Título
                                </label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder="Ej: Problema al conectar token en n8n..."
                                    className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Categoría
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                                    >
                                        <option value="soporte">Soporte Técnico</option>
                                        <option value="personalizacion">Personalización / IA Custom</option>
                                        <option value="bug">Reportar Fallo (Bug)</option>
                                        <option value="facturacion">Dudas Administrativas</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Prioridad
                                    </label>
                                    <select
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                                    >
                                        <option value="low">Baja</option>
                                        <option value="medium">Media</option>
                                        <option value="high">Alta</option>
                                        <option value="critical">Crítica</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Detalle del Reporte
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    rows={5}
                                    placeholder="Describe detalladamente el comportamiento observado o la nueva personalización de IA que deseas agregar..."
                                    className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition"
                                    required
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs">
                                <ShieldAlert className="w-5 h-5 shrink-0" />
                                <span>Al enviar este ticket, un Bot IA generará una respuesta técnica automatizada en segundos para darte asistencia instantánea.</span>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-4 rounded-xl text-xs transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/60 disabled:text-slate-400 text-slate-950 font-bold py-2 px-5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-cyan-500/10"
                                >
                                    {processing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <span>Enviar Ticket</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
