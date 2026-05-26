import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Cpu, Terminal, Settings, LogOut, Globe, Users, FileText, HelpCircle, DollarSign, Activity, ChevronRight, BarChart3, Plus } from 'lucide-react';

interface Metrics {
    total_clients: number;
    active_contracts: number;
    open_tickets: number;
    total_logs: number;
    mrr: number;
}

interface AdminDashboardProps {
    metrics: Metrics;
    auth: {
        user: any;
    };
}

export default function Dashboard({ metrics, auth }: AdminDashboardProps) {
    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] flex flex-col md:flex-row font-sans">
            <Head title="Admin Dashboard - AIAIntelligence" />

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
                            className="w-full text-left py-2.5 px-3 rounded-xl bg-[#121b30] text-cyan-400 font-bold text-xs flex items-center gap-2 border border-cyan-500/10"
                        >
                            <BarChart3 className="w-4 h-4" />
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
                            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#121b30] hover:text-cyan-400 text-xs font-semibold text-slate-400 flex items-center gap-2"
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
                            Administración Global
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">
                            Panel de Control AIAIntelligence
                        </h2>
                    </div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: MRR */}
                    <div className="bg-[#0c1221] p-6 rounded-2xl border border-white/5 shadow-md flex justify-between items-center group hover:border-cyan-500/10 transition">
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Ingreso Recurrente (MRR)
                            </span>
                            <h3 className="text-2xl font-extrabold text-cyan-400 mt-2 font-mono">
                                ${metrics.mrr} <span className="text-xs font-normal">USD</span>
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-800/30">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 2: Clients */}
                    <div className="bg-[#0c1221] p-6 rounded-2xl border border-white/5 shadow-md flex justify-between items-center group hover:border-cyan-500/10 transition">
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Clientes Activos
                            </span>
                            <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">
                                {metrics.total_clients}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-950/40 text-indigo-400 border border-indigo-800/30">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 3: Active integrations */}
                    <div className="bg-[#0c1221] p-6 rounded-2xl border border-white/5 shadow-md flex justify-between items-center group hover:border-cyan-500/10 transition">
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Contratos / Licencias
                            </span>
                            <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">
                                {metrics.active_contracts}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-300">
                            <Cpu className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 4: Executed runs */}
                    <div className="bg-[#0c1221] p-6 rounded-2xl border border-white/5 shadow-md flex justify-between items-center group hover:border-cyan-500/10 transition">
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Corridas Sandbox Exitosas
                            </span>
                            <h3 className="text-2xl font-extrabold text-green-400 mt-2 font-mono">
                                {metrics.total_logs}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-green-950/40 text-green-400 border border-green-800/30">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Operations Menu Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {/* Link Card: Service Catalog */}
                    <Link
                        href={route('admin.services.index')}
                        className="bg-[#0c1221] p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all flex flex-col justify-between gap-8 group"
                    >
                        <div>
                            <Cpu className="w-8 h-8 text-cyan-400 mb-4" />
                            <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                                Catálogo de Soluciones IA
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Gestiona los productos, descripciones, tecnologías internas y costos (mensuales y únicos) de tus soluciones de IA de AIAIntelligence.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-cyan-400 text-xs font-bold font-mono">
                            <span>Gestionar Catálogo</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                    </Link>

                    {/* Link Card: Integration settings */}
                    <Link
                        href={route('admin.contracts.index')}
                        className="bg-[#0c1221] p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all flex flex-col justify-between gap-8 group"
                    >
                        <div>
                            <Settings className="w-8 h-8 text-indigo-400 mb-4" />
                            <h4 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                                Licencias e Integración
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Controla las variables técnicas de n8n/Python de tus clientes. Edita credenciales cifradas y asigna manualmente contratos nuevos.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-indigo-400 text-xs font-bold font-mono">
                            <span>Administrar Conexiones</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                    </Link>

                    {/* Link Card: Helpdesk tickets */}
                    <Link
                        href={route('admin.tickets.index')}
                        className="bg-[#0c1221] p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all flex flex-col justify-between gap-8 group"
                    >
                        <div>
                            <HelpCircle className="w-8 h-8 text-slate-300 mb-4" />
                            <h4 className="font-bold text-white text-base group-hover:text-white transition-colors">
                                Helpdesk (Soporte Técnico)
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Revisa la bandeja de entrada de tickets. Chatea con tus clientes, cambia estados (Abierto, Resolviendo) y bríndales soporte técnico premium.
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="inline-flex items-center gap-1 text-slate-300 text-xs font-bold font-mono">
                                <span>Ver Bandeja de Entrada</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                            {metrics.open_tickets > 0 && (
                                <span className="bg-red-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                                    {metrics.open_tickets} Pendientes
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

            </main>
        </div>
    );
}
