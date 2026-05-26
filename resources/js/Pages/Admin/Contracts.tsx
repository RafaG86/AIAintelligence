import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Cpu, Terminal, Settings, HelpCircle, LogOut, Globe, Users, Edit2, Plus, X, Save, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Service {
    id: number;
    name: string;
    type: string;
}

interface Contract {
    id: number;
    client_id: number;
    service_id: number;
    status: string;
    start_date: string;
    end_date: string | null;
    config_metadata: {
        webhook_url: string;
        api_token: string;
        custom_instructions: string;
    };
    client: User;
    service: Service;
}

interface ContractsProps {
    contracts: Contract[];
    clients: User[];
    services: Service[];
    auth: {
        user: any;
    };
}

export default function Contracts({ contracts, clients, services, auth }: ContractsProps) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);

    // Form for manual contract provisioning
    const createForm = useForm({
        client_id: clients[0]?.id || '',
        service_id: services[0]?.id || '',
        payment_type: 'one_time',
    });

    // Form for contract integration editing
    const editForm = useForm({
        webhook_url: '',
        api_token: '',
        custom_instructions: '',
        status: 'active',
    });

    const openCreateModal = () => {
        createForm.reset();
        setCreateModalOpen(true);
    };

    const openEditModal = (contract: Contract) => {
        setEditingContract(contract);
        editForm.setData({
            webhook_url: contract.config_metadata?.webhook_url || '',
            api_token: contract.config_metadata?.api_token || '',
            custom_instructions: contract.config_metadata?.custom_instructions || '',
            status: contract.status,
        });
        setEditModalOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.contracts.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
            }
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingContract) return;

        editForm.put(route('admin.contracts.update', editingContract.id), {
            onSuccess: () => {
                setEditModalOpen(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] flex flex-col md:flex-row font-sans">
            <Head title="Licencias e Integraciones - Admin" />

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
                            className="w-full text-left py-2.5 px-3 rounded-xl bg-[#121b30] text-cyan-400 font-bold text-xs flex items-center gap-2 border border-cyan-500/10"
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
                            Licencias Activas
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">
                            Suscripciones e Integraciones de Clientes
                        </h2>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Asignar Licencia Manual</span>
                    </button>
                </div>

                {/* Table */}
                <div className="bg-[#0c1221] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-950/40 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
                                    <th className="py-4 px-6">Cliente</th>
                                    <th className="py-4 px-6">Solución Contratada</th>
                                    <th className="py-4 px-6">Webhook de Conexión</th>
                                    <th className="py-4 px-6 text-center">Estado</th>
                                    <th className="py-4 px-6 text-right">Caducidad</th>
                                    <th className="py-4 px-6 text-center">Editar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-300">
                                {contracts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-6 px-6 text-center text-slate-500">
                                            No existen licencias ni suscripciones registradas en la base de datos.
                                        </td>
                                    </tr>
                                ) : (
                                    contracts.map((contract) => (
                                        <tr key={contract.id} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="py-3.5 px-6 font-medium text-white">
                                                {contract.client.name}
                                                <span className="block text-[10px] text-slate-500">{contract.client.email}</span>
                                            </td>
                                            <td className="py-3.5 px-6 truncate font-medium text-slate-200 max-w-[180px]">
                                                {contract.service.name}
                                            </td>
                                            <td className="py-3.5 px-6 font-mono text-cyan-400/80 truncate max-w-[200px]">
                                                {contract.config_metadata?.webhook_url || 'Sin webhook'}
                                            </td>
                                            <td className="py-3.5 px-6 text-center">
                                                {contract.status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full uppercase font-bold text-[8px]">
                                                        Activo
                                                    </span>
                                                ) : contract.status === 'paused' ? (
                                                    <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full uppercase font-bold text-[8px]">
                                                        Pausado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full uppercase font-bold text-[8px]">
                                                        Terminado
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-6 text-right font-mono text-slate-400">
                                                {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Licencia Única'}
                                            </td>
                                            <td className="py-3.5 px-6 text-center">
                                                <button
                                                    onClick={() => openEditModal(contract)}
                                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

            {/* Modal: Manual License Provisioning */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm">
                    <div className="w-full max-w-lg glass-panel rounded-2xl overflow-hidden border border-cyan-500/50 shadow-2xl neon-glow-cyan">
                        <div className="bg-[#0b101d] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                                <Plus className="w-4 h-4 text-cyan-400" />
                                <span>Proveer Licencia Manual a Cliente</span>
                            </span>
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                className="text-slate-400 hover:text-white transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                            {clients.length === 0 ? (
                                <div className="text-slate-400 text-xs py-4 text-center">
                                    No existen clientes registrados para poder asignarles una licencia.
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Seleccionar Cliente
                                        </label>
                                        <select
                                            value={createForm.data.client_id}
                                            onChange={(e) => createForm.setData('client_id', e.target.value)}
                                            className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                                        >
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name} ({client.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Seleccionar Solución IA
                                        </label>
                                        <select
                                            value={createForm.data.service_id}
                                            onChange={(e) => createForm.setData('service_id', e.target.value)}
                                            className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                                        >
                                            {services.map(service => (
                                                <option key={service.id} value={service.id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Modelo de Contratación
                                        </label>
                                        <select
                                            value={createForm.data.payment_type}
                                            onChange={(e) => createForm.setData('payment_type', e.target.value)}
                                            className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                                        >
                                            <option value="one_time">Pago Único (Licencia Descargable)</option>
                                            <option value="monthly">Mensualidad Cloud ( Hosting + Mantenimiento )</option>
                                        </select>
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
                                            disabled={createForm.processing}
                                            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/60 disabled:text-slate-400 text-slate-950 font-bold py-2 px-5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-cyan-500/10"
                                        >
                                            {createForm.processing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            <span>Asignar Licencia</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Integration credentials of a client */}
            {editModalOpen && editingContract && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm">
                    <div className="w-full max-w-xl glass-panel rounded-2xl overflow-hidden border border-cyan-500/50 shadow-2xl neon-glow-cyan">
                        <div className="bg-[#0b101d] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                                <Settings className="w-4 h-4 text-cyan-400" />
                                <span>Ajustes Técnicos de Cliente: {editingContract.client.name}</span>
                            </span>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="text-slate-400 hover:text-white transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Estado de la Suscripción
                                    </label>
                                    <select
                                        value={editForm.data.status}
                                        onChange={(e) => editForm.setData('status', e.target.value)}
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                                    >
                                        <option value="active">Activo (Habilitado)</option>
                                        <option value="paused">Pausado (Temporalmente)</option>
                                        <option value="terminated">Terminado (Vencido)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Token de Acceso Cifrado
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.api_token}
                                        onChange={(e) => editForm.setData('api_token', e.target.value)}
                                        className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50 transition font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Webhook de Conexión
                                </label>
                                <input
                                    type="url"
                                    value={editForm.data.webhook_url}
                                    onChange={(e) => editForm.setData('webhook_url', e.target.value)}
                                    className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition font-mono"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Instrucciones de Personalización del Prompt (Overrides)
                                </label>
                                <textarea
                                    value={editForm.data.custom_instructions}
                                    onChange={(e) => editForm.setData('custom_instructions', e.target.value)}
                                    rows={4}
                                    placeholder="Modifica las directrices del LLM del cliente..."
                                    className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-4 rounded-xl text-xs transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/60 disabled:text-slate-400 text-slate-950 font-bold py-2 px-5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-cyan-500/10"
                                >
                                    {editForm.processing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Guardar Integración</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
