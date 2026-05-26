import React, { useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Cpu, Terminal, HelpCircle, ArrowLeft, Send, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    role: string;
}

interface Reply {
    id: number;
    support_ticket_id: number;
    user_id: number;
    message: string;
    created_at: string;
    user: User;
}

interface Ticket {
    id: number;
    subject: string;
    category: string;
    status: string;
    priority: string;
    created_at: string;
    user: User;
    replies: Reply[];
}

interface TicketThreadProps {
    ticket: Ticket;
    auth: {
        user: any;
    };
}

export default function TicketThread({ ticket, auth }: TicketThreadProps) {
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, reset } = useForm({
        message: '',
        status: ticket.status,
    });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket.replies]);

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.tickets.reply', ticket.id), {
            onSuccess: () => {
                reset('message');
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] flex flex-col md:flex-row font-sans">
            <Head title={`Soportando #${ticket.id} - ${ticket.subject}`} />

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

                    <div className="p-4 space-y-2">
                        <Link
                            href={route('admin.dashboard')}
                            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#121b30] hover:text-cyan-400 text-xs font-semibold text-slate-400 flex items-center gap-2"
                        >
                            <Cpu className="w-4 h-4" />
                            <span>Métricas Generales</span>
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
            </aside>

            {/* Main Chat Thread */}
            <main className="flex-grow flex flex-col justify-between h-screen overflow-hidden">
                
                {/* Chat Header */}
                <div className="bg-[#0c1221] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.tickets.index')}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-cyan-400 font-bold text-xs">#{ticket.id}</span>
                                <h2 className="font-bold text-white text-sm truncate max-w-[260px] sm:max-w-md">
                                    {ticket.subject}
                                </h2>
                            </div>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[8px] bg-slate-800 text-slate-300 border border-white/5 px-1.5 py-0.5 rounded font-semibold">
                                    Cliente: {ticket.user.name}
                                </span>
                                <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-850 px-1.5 py-0.5 rounded uppercase font-semibold">
                                    {ticket.category}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Display Board */}
                <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-[#070b13] scrollbar-thin select-text">
                    {ticket.replies.map((reply) => {
                        const isMe = reply.user_id === auth.user.id;
                        const isAi = reply.message.startsWith('🤖') || reply.message.includes('[Agente IA]');

                        return (
                            <div
                                key={reply.id}
                                className={`flex flex-col max-w-[80%] ${
                                    isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                                }`}
                            >
                                <span className="text-[10px] text-slate-500 mb-1 select-none font-mono">
                                    {reply.user.name} • {new Date(reply.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>

                                {isMe ? (
                                    /* Admin Message Bubble (Cyan/Blue) */
                                    <div className="bg-cyan-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm shadow-md font-medium leading-relaxed">
                                        {reply.message}
                                    </div>
                                ) : isAi ? (
                                    /* AI Bot Message Bubble (Glow Purple) */
                                    <div className="bg-gradient-to-tr from-purple-950 via-[#1e1336] to-indigo-950 border border-purple-500/40 text-purple-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-lg shadow-purple-500/10 leading-relaxed relative overflow-hidden neon-glow-purple">
                                        <div className="absolute top-2 right-2 text-purple-400">
                                            <Sparkles className="w-3.5 h-3.5 fill-purple-400" />
                                        </div>
                                        <div className="font-semibold text-purple-300 text-xs mb-1.5 flex items-center gap-1 uppercase tracking-wider select-none">
                                            <span>Soporte IA Autónomo</span>
                                        </div>
                                        {reply.message}
                                    </div>
                                ) : (
                                    /* Client Message Bubble (Slate) */
                                    <div className="bg-[#121929] border border-white/5 text-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-md leading-relaxed">
                                        {reply.message}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Message Write Form with Status selector */}
                <div className="bg-[#0c1221] border-t border-white/5 p-4 z-10">
                    <form onSubmit={handleSendReply} className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto items-end">
                        
                        {/* Status selector */}
                        <div className="flex flex-col gap-1 w-full sm:w-44 shrink-0 text-left">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                Cambiar Estado
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="bg-[#090d16] border border-white/5 rounded-xl py-2.5 px-3 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50 transition cursor-pointer"
                            >
                                <option value="open">Abierto (Open)</option>
                                <option value="in_progress">En Curso (In Progress)</option>
                                <option value="resolved">Resuelto (Resolved)</option>
                                <option value="closed">Cerrado (Closed)</option>
                            </select>
                        </div>

                        {/* Text box */}
                        <textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            rows={1}
                            placeholder="Escribe la respuesta técnica de soporte para el cliente..."
                            className="flex-grow bg-[#090d16] border border-white/5 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition max-h-[120px] resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendReply(e);
                                }
                            }}
                            required
                        ></textarea>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/60 disabled:text-slate-400 text-slate-950 font-bold py-3.5 px-5 rounded-xl transition duration-200 cursor-pointer shadow-md shadow-cyan-500/10 shrink-0 flex items-center justify-center gap-1 text-xs w-full sm:w-auto"
                        >
                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4 fill-slate-950" />
                                    <span>Responder</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

            </main>
        </div>
    );
}
