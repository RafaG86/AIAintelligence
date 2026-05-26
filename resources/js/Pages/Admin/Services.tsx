import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Cpu, Terminal, Settings, HelpCircle, LogOut, Globe, Users, Plus, Edit2, Trash2, X, Save, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    type: string;
    description: string;
    monthly_cost: string;
    one_time_cost: string;
    is_active: boolean;
}

interface ServicesProps {
    services: Service[];
    auth: {
        user: any;
    };
}

export default function Services({ services, auth }: ServicesProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        type: 'AIAgent',
        description: '',
        monthly_cost: '',
        one_time_cost: '',
        is_active: 1,
    });

    const openCreateModal = () => {
        setEditingService(null);
        reset();
        setModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setData({
            name: service.name,
            type: service.type,
            description: service.description,
            monthly_cost: service.monthly_cost,
            one_time_cost: service.one_time_cost,
            is_active: service.is_active ? 1 : 0,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            put(route('admin.services.update', editingService.id), {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.services.store'), {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta solución de IA de tu catálogo comercial?')) {
            destroy(route('admin.services.destroy', id));
        }
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] flex flex-col md:flex-row font-sans">
            <Head title="Gestión de Catálogo IA - AIAIntelligence" />

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
                            className="w-full text-left py-2.5 px-3 rounded-xl bg-[#121b30] text-cyan-400 font-bold text-xs flex items-center gap-2 border border-cyan-500/10"
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
                            Catálogo de Productos
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">
                            Soluciones Digitales AIAIntelligence
                        </h2>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Añadir Nueva Solución</span>
                    </button>
                </div>

                {/* Services Table List */}
                <div className="bg-[#0c1221] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-950/40 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
                                    <th className="py-4 px-6">ID</th>
                                    <th className="py-4 px-6">Solución</th>
                                    <th className="py-4 px-6">Tipo</th>
                                    <th className="py-4 px-6 text-right">Pago Único</th>
                                    <th className="py-4 px-6 text-right">Mensualidad</th>
                                    <th className="py-4 px-6 text-center">Estado</th>
                                    <th className="py-4 px-6 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-300">
                                {services.map((service) => (
                                    <tr key={service.id} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="py-3.5 px-6 font-mono text-cyan-400 font-semibold">
                                            #{service.id}
                                        </td>
                                        <td className="py-3.5 px-6 font-medium text-white max-w-[220px] truncate">
                                            {service.name}
                                        </td>
                                        <td className="py-3.5 px-6 font-mono font-semibold uppercase text-cyan-400/80">
                                            {service.type}
                                        </td>
                                        <td className="py-3.5 px-6 text-right font-mono font-bold">
                                            ${service.one_time_cost}
                                        </td>
                                        <td className="py-3.5 px-6 text-right font-mono font-bold text-cyan-400">
                                            ${service.monthly_cost}
                                        </td>
                                        <td className="py-3.5 px-6 text-center">
                                            {service.is_active ? (
                                                <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full uppercase font-bold text-[8px]">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-400 border border-white/5 px-2 py-0.5 rounded-full uppercase font-bold text-[8px]">
                                                    Pausado
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(service)}
                                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-300 hover:text-red-400 transition cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

            {/* Modal CRUD Service (Create & Edit) */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm">
                    <div className="w-full max-w-xl glass-panel rounded-2xl overflow-hidden border border-cyan-500/50 shadow-2xl neon-glow-cyan">
                        <div className="bg-[#0b101d] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-cyan-400" />
                                <span>{editingService ? 'Editar Solución IA' : 'Añadir Nueva Solución al Catálogo'}</span>
                            </span>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-slate-400 hover:text-white transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Nombre del Producto
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Agente IA de Ventas Avanzado..."
                                    className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Tecnología Core
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                                    >
                                        <option value="AIAgent">AIAgent (Conversacional)</option>
                                        <option value="ETL">ETL (Procesamiento Pandas)</option>
                                        <option value="IntegracionN8N">Integración n8n / APIs</option>
                                        <option value="DataCleaning">DataCleaning (Limpieza)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Estado de Publicación
                                    </label>
                                    <select
                                        value={data.is_active}
                                        onChange={(e) => setData('is_active', parseInt(e.target.value))}
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                                    >
                                        <option value={1}>Activo (Visible en Tienda)</option>
                                        <option value={0}>Pausado (Oculto)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Licencia Única (Costo de descarga)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.one_time_cost}
                                        onChange={(e) => setData('one_time_cost', e.target.value)}
                                        placeholder="299.00"
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition font-mono"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Hosting Cloud (Costo Mensual)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.monthly_cost}
                                        onChange={(e) => setData('monthly_cost', e.target.value)}
                                        placeholder="49.00"
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Descripción del Producto
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    placeholder="Detalla los beneficios comerciales de tu flujo inteligente..."
                                    className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition"
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
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
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Guardar Cambios</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
