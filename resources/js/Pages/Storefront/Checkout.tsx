import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Cpu, CreditCard, ShieldCheck, HeartHandshake, ArrowLeft, Loader2, Sparkles, Check } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    type: string;
    description: string;
    monthly_cost: string;
    one_time_cost: string;
}

interface CheckoutProps {
    service: Service;
    auth: {
        user: any;
    };
}

export default function Checkout({ service, auth }: CheckoutProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Default selection: one_time purchase
    const { data, setData, post, processing, errors } = useForm({
        card_name: '',
        card_number: '',
        card_expiry: '',
        card_cvv: '',
        payment_type: 'one_time',
    });

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length > 0) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setData('card_number', formatted.slice(0, 19));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        setData('card_expiry', value.slice(0, 5));
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('card_cvv', value.slice(0, 4));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('checkout.process', service.id));
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] py-12 px-4 md:px-8 relative overflow-hidden font-sans">
            <Head title={`Adquirir ${service.name}`} />

            {/* Glowing Blur Backgrounds */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition duration-200 mb-8 font-medium text-sm group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Volver al Catálogo</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Solution Detail & Price Selector */}
                    <div className="lg:col-span-5 glass-panel rounded-3xl p-8 border border-white/5 flex flex-col gap-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider w-fit">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>{service.type}</span>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{service.name}</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                        </div>

                        {/* Model Price Choice Selector */}
                        <div className="bg-[#0b101e] p-2 rounded-2xl border border-white/5">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setData('payment_type', 'one_time')}
                                    className={`py-3 px-4 rounded-xl font-bold text-xs transition duration-200 flex flex-col items-center gap-1 cursor-pointer ${
                                        data.payment_type === 'one_time'
                                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <span>PAGO ÚNICO</span>
                                    <span className="text-xs font-extrabold">${service.one_time_cost} USD</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('payment_type', 'monthly')}
                                    className={`py-3 px-4 rounded-xl font-bold text-xs transition duration-200 flex flex-col items-center gap-1 cursor-pointer ${
                                        data.payment_type === 'monthly'
                                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <span>SUSCRIPCIÓN</span>
                                    <span className="text-xs font-extrabold">${service.monthly_cost} /mes</span>
                                </button>
                            </div>
                        </div>

                        {/* Billing Breakdown */}
                        <div className="space-y-3 text-sm text-slate-400 pt-4 border-t border-white/5">
                            <div className="flex justify-between">
                                <span>Concepto</span>
                                <span className="text-white font-medium">Solución {service.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Garantía de Satisfacción</span>
                                <span className="text-green-400 flex items-center gap-1 font-medium">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>14 días activa</span>
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-white/5 pt-3 text-base text-white font-bold">
                                <span>Total a Pagar</span>
                                <span className="text-cyan-400">
                                    {data.payment_type === 'one_time' ? `$${service.one_time_cost} USD` : `$${service.monthly_cost} USD`}
                                </span>
                            </div>
                        </div>

                        {/* Guarantees Box */}
                        <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 flex gap-3 text-xs items-start">
                            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-white mb-0.5">Garantía AIAIntelligence</h4>
                                <p className="text-slate-500 leading-relaxed">
                                    El cobro se procesará como simulación garantizada. Al confirmar el checkout se activará tu sandbox y terminal de forma inmediata.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Card Form */}
                    <div className="lg:col-span-7 glass-panel rounded-3xl p-8 border border-white/5 flex flex-col gap-8">
                        
                        {/* Interactive Credit Card Mockup */}
                        <div className="flex justify-center select-none perspective-[1000px]">
                            <div
                                className={`w-full max-w-[340px] h-[200px] rounded-2xl relative transition-transform duration-700 preserve-3d cursor-pointer ${
                                    isFlipped ? 'rotate-y-180' : ''
                                }`}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                {/* FRONT of Card */}
                                <div className="absolute inset-0 rounded-2xl p-6 bg-gradient-to-tr from-slate-900 via-[#10192e] to-indigo-950 border border-white/10 flex flex-col justify-between backface-hidden shadow-2xl neon-glow-cyan">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] uppercase tracking-widest text-cyan-400 font-extrabold">
                                                AIAIntelligence Card
                                            </span>
                                            <div className="w-9 h-7 bg-amber-500/20 border border-amber-500/30 rounded-md flex items-center justify-center">
                                                <div className="w-5 h-4 bg-amber-500/40 rounded-sm"></div>
                                            </div>
                                        </div>
                                        <CreditCard className="w-8 h-8 text-cyan-400/80" />
                                    </div>

                                    <div className="text-lg font-mono tracking-widest text-slate-100 py-2">
                                        {data.card_number || '•••• •••• •••• ••••'}
                                    </div>

                                    <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider">
                                        <div>
                                            <span className="text-slate-500 block text-[8px]">Card Holder</span>
                                            <span className="text-slate-300 font-bold block max-w-[150px] truncate">
                                                {data.card_name || 'RAFA DEVELOPER'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-500 block text-[8px]">Expires</span>
                                            <span className="text-slate-300 font-bold block">
                                                {data.card_expiry || 'MM/YY'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* BACK of Card */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-slate-950 via-[#0d1222] to-slate-900 border border-white/10 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl p-6">
                                    <div className="w-full h-10 bg-slate-950 absolute left-0 top-6"></div>
                                    <div className="mt-12 flex justify-end items-center gap-3">
                                        <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">
                                            SECURE CODE
                                        </div>
                                        <div className="w-16 h-8 bg-slate-900 border border-white/5 rounded flex items-center justify-center text-sm font-bold font-mono tracking-widest text-white">
                                            {data.card_cvv || '•••'}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[8px] text-slate-600 font-mono tracking-wider">
                                        <span>SIMULATOR CHECKOUT v1.0</span>
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-cyan-500/40"></div>
                                            <div className="w-3 h-3 rounded-full bg-indigo-500/40"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Nombre en la Tarjeta
                                </label>
                                <input
                                    type="text"
                                    value={data.card_name}
                                    onChange={(e) => setData('card_name', e.target.value)}
                                    placeholder="RAFAEL GOMEZ"
                                    className="bg-[#0b101e] border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition"
                                    onFocus={() => setIsFlipped(false)}
                                    required
                                />
                                {errors.card_name && <span className="text-xs text-red-500">{errors.card_name}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Número de Tarjeta
                                </label>
                                <input
                                    type="text"
                                    value={data.card_number}
                                    onChange={handleNumberChange}
                                    placeholder="4000 1234 5678 9010"
                                    className="bg-[#0b101e] border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition font-mono"
                                    onFocus={() => setIsFlipped(false)}
                                    required
                                />
                                {errors.card_number && <span className="text-xs text-red-500">{errors.card_number}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Vencimiento
                                    </label>
                                    <input
                                        type="text"
                                        value={data.card_expiry}
                                        onChange={handleExpiryChange}
                                        placeholder="MM/YY"
                                        className="bg-[#0b101e] border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition font-mono text-center"
                                        onFocus={() => setIsFlipped(false)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        CVV (Firma)
                                    </label>
                                    <input
                                        type="password"
                                        value={data.card_cvv}
                                        onChange={handleCvvChange}
                                        placeholder="•••"
                                        className="bg-[#0b101e] border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition font-mono text-center text-lg"
                                        onFocus={() => setIsFlipped(true)}
                                        onBlur={() => setIsFlipped(false)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/60 disabled:text-slate-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Procesando Simulación...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Confirmar y Activar Sandbox</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
