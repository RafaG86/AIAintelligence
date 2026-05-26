import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Cpu, Terminal, Settings, HelpCircle, LogOut, Globe, Users, MessageSquare, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Eye } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Ticket {
    id: number;
    user_id: number;
    subject: string;
    category: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    user: User;
}

interface TicketsProps {
    tickets: Ticket[];
    auth: {
        user: any;
    };
}

export default function Tickets({ tickets, auth }: TicketsProps) {
    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] flex flex-col md:flex-row font-sans">
            <Head title="Helpdesk Central - Admin" />

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
                            <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-800/30 flex items-center justify-center">
                                <Users className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{auth.user.name}</h3>
                                <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-800/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                                    Super Admin
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 space-y-2">
                        <Link
                            href={route('admin.dashboard')}
                            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#121b30] hover:text-cyan-400 text-xs font-semibold text-slate-400 flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            <span>Métricas Generales</span>
                        </Link>
                        <Link
                            href={route('admin.services.index')}
                            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#121b30] hover:text-cyan-400 text-xs font-semibold text-slate-400 flex items-center gap-2"
                        >
                            <Cpu className="w-4 h-4" />
                            <span>Catálogo de Soluciones</span>
                        </Link>
                        <Link
                            href={route('admin.contracts.index')}
                            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#121b30] hover:text-cyan-400 text-xs font-semibold text-slate-400 flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Contratos e Integración</span>
                        </Link>
                        <Link
                            href={route('admin.tickets.index')}
                            className="w-full text-left py-2.5 px-3 rounded-xl bg-[#121b30] text-cyan-400 font-bold text-xs flex items-center gap-2 border border-cyan-500/10"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span>Helpdesk de Soporte</span>
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 space-y-2">
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

            {/* Main Area */}
            <main className="flex-grow p-6 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full overflow-y-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0c1221] p-6 rounded-2xl border border-white/5">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                            Helpdesk Central
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">
                            Bandeja de Consultas e Incidencias Técnicas
                        </h2>
                    </div>
                </div>

                {/* Ticket List grid */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <span>Tickets de Clientes</span>
                    </h3>

                    {tickets.length === 0 ? (
                        <div className="bg-[#0c1221] p-12 rounded-2xl border border-white/5 text-center text-slate-500 text-xs">
                            No existen tickets de soporte de clientes registrados.
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
                                            <div>
                                                <span className="font-mono text-cyan-400 font-bold text-xs">
                                                    #{ticket.id}
                                                </span>
                                                <span className="text-slate-400 block text-xs font-semibold mt-1">
                                                    {ticket.user.name}
                                                </span>
                                                <span className="text-[10px] text-slate-600 font-mono block">
                                                    {ticket.user.email}
                                                </span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <span className="text-[9px] bg-cyan-950/40 text-cyan-400 border border-cyan-850 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                    {ticket.category}
                                                </span>
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
                                            Actualizado: {new Date(ticket.updated_at).toLocaleString()}
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
                                            href={route('admin.tickets.show', ticket.id)}
                                            className="bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-400 font-semibold py-1.5 px-3 rounded-lg transition duration-200 text-xs flex items-center gap-1.5"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Soportar</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
