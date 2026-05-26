import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Cpu, Terminal, ShieldCheck, HeartHandshake, Play, HelpCircle, User, LogIn, Sparkles, Check, ArrowRight, Zap, RefreshCw, X } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    type: string;
    description: string;
    monthly_cost: string;
    one_time_cost: string;
    is_active: boolean;
}

interface WelcomeProps {
    services: Service[];
    auth: {
        user: any;
    };
}

export default function Welcome({ services, auth }: WelcomeProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [demoTerminalOpen, setDemoTerminalOpen] = useState(false);
    const [terminalLines, setTerminalLines] = useState<Array<{ text: string; type: string }>>([]);
    const [terminalRunning, setTerminalRunning] = useState(false);
    const [terminalProgress, setTerminalProgress] = useState(0);

    // Run the simulated console execution in real-time
    const runDemoConsole = (service: Service) => {
        setSelectedService(service);
        setDemoTerminalOpen(true);
        setTerminalLines([]);
        setTerminalRunning(true);
        setTerminalProgress(0);

        const type = service.type;
        const steps = {
            AIAgent: [
                { text: 'AIAintelligence Core Sandbox initializing... Done.', type: 'info' },
                { text: 'Loading AI Agent Weights & Prompt Config...', type: 'info' },
                { text: 'Connecting to WhatsApp Business API Gateway... [STATUS: 200 OK]', type: 'success' },
                { text: 'Triggering n8n Workflow execution trigger: webhook_receive', type: 'success' },
                { text: 'Querying Gemini 3.5 Flash LLM context endpoint...', type: 'info' },
                { text: 'Gemini NLP Analysis: Intent [Client_Question], Emotion [Neutral]', type: 'info' },
                { text: 'Gemini Response: "¡Hola! He agendado tu cita de Automatización para mañana a las 10:00 AM."', type: 'success' },
                { text: 'Sending WhatsApp payload to API server... Dispatched.', type: 'success' },
                { text: 'Pipeline run complete. 1 event processed. Latency: 420ms.', type: 'info' }
            ],
            ETL: [
                { text: 'Python virtual ETL sandbox booting... Loaded.', type: 'info' },
                { text: 'Importing pandas library as pd & openpyxl reader...', type: 'info' },
                { text: 'Reading input stream: /var/www/temp/data_dirty_contacts.xlsx', type: 'info' },
                { text: 'Columns parsed: Name, Phone, Email, Spiritual_Status, Country', type: 'info' },
                { text: 'Pandas execution: Removing duplicate names & standardizing phone formats...', type: 'success' },
                { text: 'Validating email patterns via regex... 12 invalid rows sanitized.', type: 'success' },
                { text: 'Syncing cleanly processed dataframe with MySQL DB target...', type: 'info' },
                { text: 'MySQL Sync status: 420 rows synchronized. 18 errors ignored.', type: 'success' },
                { text: 'Pipeline executed in 4.5 seconds. CPU usage: 12.4%', type: 'info' }
            ],
            IntegracionN8N: [
                { text: 'Social media automated poster cron trigger initialized.', type: 'info' },
                { text: 'Scraping target news feeds and Google Trends database...', type: 'info' },
                { text: 'Assembling prompts for marketing copy generation...', type: 'info' },
                { text: 'Invoking Gemini 3.5 Flash API... Content successfully generated.', type: 'success' },
                { text: 'Connecting to n8n LinkedIn node credentials...', type: 'info' },
                { text: 'Dispatching post to LinkedIn feed: "El poder de la IA..." -> Status 201', type: 'success' },
                { text: 'Dispatching post to Twitter feed... -> Status 201', type: 'success' },
                { text: 'Cron task finished. Channels published: 3. Errors: 0.', type: 'info' }
            ]
        };

        const currentSteps = steps[type as keyof typeof steps] || steps['AIAgent'];
        let stepIdx = 0;

        const interval = setInterval(() => {
            if (stepIdx < currentSteps.length) {
                setTerminalLines(prev => [...prev, currentSteps[stepIdx]]);
                setTerminalProgress(Math.floor(((stepIdx + 1) / currentSteps.length) * 100));
                stepIdx++;
            } else {
                clearInterval(interval);
                setTerminalRunning(false);
            }
        }, 550);
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-[#e5e7eb] relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
            <Head title="Tienda de Soluciones IA & Automatizaciones" />

            {/* Glowing Blur Backgrounds */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none"></div>

            {/* Navigation Header */}
            <nav className="sticky top-0 z-40 bg-[#090d16]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400">
                        AIAIntelligence
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold py-2 px-5 rounded-xl transition duration-300 shadow-md shadow-cyan-500/10"
                        >
                            <Terminal className="w-4 h-4" />
                            <span>Mi Portal</span>
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-slate-300 hover:text-white transition duration-200"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-medium py-2 px-4 rounded-xl transition duration-200"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="px-6 md:px-12 pt-20 pb-16 text-center max-w-4xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Automatización Inteligente sin Límites</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Vende tus Ideas y Automatiza tus{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                        Soluciones Digitales
                    </span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                    Diseñamos, hospedamos e integramos agentes de IA conversacionales y pipelines de datos de alto rendimiento. Flexibilidad total de pago, sin deudas bancarias y con 14 días de garantía.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                        href="#catalog"
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-8 rounded-xl transition duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                    >
                        <span>Explorar Catálogo</span>
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </header>

            {/* Catalog Section */}
            <section id="catalog" className="px-6 md:px-12 py-20 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Nuestro Catálogo de Automatizaciones</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Pasa el cursor sobre las tarjetas para ver la ficha técnica. Elige entre Pago Único para descargar el código, o Suscripción Cloud para que nosotros lo administremos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="group relative rounded-3xl glass-panel p-8 flex flex-col hover:border-cyan-500/30 transition-all duration-500 shadow-xl"
                        >
                            {/* Executive Front View */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-950/80 to-indigo-950/80 border border-cyan-800/30">
                                    <Cpu className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">
                                        Tecnología IA
                                    </span>
                                    <span className="text-xs bg-cyan-950/40 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-800/30 font-semibold uppercase">
                                        {service.type}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                                {service.name}
                            </h3>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                                {service.description}
                            </p>

                            {/* Tech Specs Hover (revealed on card hover in desktop) */}
                            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-[#0d1326]/95 rounded-3xl p-8 transition-opacity duration-300 flex flex-col justify-between border border-cyan-500/40 pointer-events-none group-hover:pointer-events-auto">
                                <div>
                                    <div className="flex items-center gap-2 text-cyan-400 font-bold mb-4 uppercase tracking-widest text-xs">
                                        <Terminal className="w-4 h-4 animate-pulse" />
                                        <span>Ficha Técnica Avanzada</span>
                                    </div>
                                    <ul className="space-y-3 text-xs text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                                            <span><strong>Núcleo:</strong> n8n Automation Engine / Python ETL Pipeline</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                                            <span><strong>Modelo:</strong> Gemini 3.5 Flash via API</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                                            <span><strong>Latencia:</strong> Ejecución asíncrona en colas (~450ms)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                                            <span><strong>Seguridad:</strong> Autenticación HMAC-SHA256 & Credenciales Cifradas</span>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => runDemoConsole(service)}
                                    className="w-full mt-4 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 hover:border-cyan-500 text-cyan-400 font-semibold py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Play className="w-4 h-4 fill-cyan-400" />
                                    <span>Ejecutar Demo en Vivo</span>
                                </button>
                            </div>

                            {/* Price details */}
                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mb-6">
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                                        Licencia (Pago Único)
                                    </span>
                                    <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">
                                        ${service.one_time_cost} <span className="text-xs font-normal text-slate-500">USD</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                                        Hosting Cloud (Mensual)
                                    </span>
                                    <span className="text-xl font-extrabold text-cyan-400">
                                        ${service.monthly_cost} <span className="text-xs font-normal text-cyan-600">/mes</span>
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => runDemoConsole(service)}
                                    className="md:hidden bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition text-xs flex items-center justify-center gap-1 border border-white/5"
                                >
                                    <Play className="w-3.5 h-3.5" />
                                    <span>Demo</span>
                                </button>
                                <Link
                                    href={route('checkout.show', service.id)}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-200 text-sm text-center flex-grow flex items-center justify-center gap-1 shadow-md shadow-cyan-500/10"
                                >
                                    <span>Adquirir</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quality Seals Section */}
            <section className="bg-slate-950/40 border-y border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex items-center flex-col md:flex-row gap-4">
                        <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/30 text-cyan-400">
                            <HeartHandshake className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-100">Garantía de Satisfacción</h4>
                            <p className="text-slate-400 text-xs mt-1">Reembolso garantizado por 14 días si el flujo no se adapta a tus necesidades.</p>
                        </div>
                    </div>
                    <div className="flex items-center flex-col md:flex-row gap-4">
                        <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/30 text-cyan-400">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-100">100% Código Seguro</h4>
                            <p className="text-slate-400 text-xs mt-1">Nuestros flujos n8n y scripts de Pandas están auditados y libres de vulnerabilidades.</p>
                        </div>
                    </div>
                    <div className="flex items-center flex-col md:flex-row gap-4">
                        <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/30 text-cyan-400">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-100">Soporte Técnico de Agencia</h4>
                            <p className="text-slate-400 text-xs mt-1">Soporte técnico premium a través de nuestro Helpdesk integrado para todas las suscripciones.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Demo Terminal Modal */}
            {demoTerminalOpen && selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm">
                    <div className="w-full max-w-3xl glass-panel rounded-2xl overflow-hidden border border-cyan-500/50 shadow-2xl neon-glow-cyan">
                        {/* Terminal Header */}
                        <div className="bg-[#0b101d] px-5 py-3 border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
                                <span className="text-xs text-slate-400 ml-4 font-mono">
                                    aiaintelligence_sandbox://demo_run
                                </span>
                            </div>
                            <button
                                onClick={() => setDemoTerminalOpen(false)}
                                className="text-slate-400 hover:text-white transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Terminal Content */}
                        <div className="bg-[#040811] p-6 h-[340px] overflow-y-auto terminal-font text-cyan-400 text-sm leading-relaxed scrollbar-thin">
                            {terminalLines.map((line, idx) => (
                                <div
                                    key={idx}
                                    className={`mb-2 font-mono ${
                                        line.type === 'success' ? 'text-green-400' :
                                        line.type === 'error' ? 'text-red-400' : 'text-cyan-400'
                                    }`}
                                >
                                    <span className="text-slate-600 select-none mr-2">$</span>
                                    {line.text}
                                </div>
                            ))}

                            {terminalRunning && (
                                <div className="flex items-center gap-3 text-cyan-600 mt-4 select-none font-mono">
                                    <span className="animate-spin">⌛</span>
                                    <span>Ejecutando proceso... {terminalProgress}%</span>
                                </div>
                            )}

                            {!terminalRunning && (
                                <div className="text-green-400 font-bold mt-6 flex items-center gap-2 select-none font-mono">
                                    <Check className="w-5 h-5 text-green-400" />
                                    <span>[PROCESO TERMINADO] Puedes integrar esta solución ahora.</span>
                                </div>
                            )}
                        </div>

                        {/* Terminal Footer Actions */}
                        <div className="bg-[#0b101d] px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-xs text-slate-400 font-light">
                                Solución: {selectedService.name}
                            </span>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => setDemoTerminalOpen(false)}
                                    className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-4 rounded-xl transition text-xs flex-grow sm:flex-grow-0"
                                >
                                    Cerrar Sandbox
                                </button>
                                <Link
                                    href={route('checkout.show', selectedService.id)}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-5 rounded-xl transition duration-200 text-xs text-center flex-grow sm:flex-grow-0 flex items-center justify-center gap-1 shadow-md shadow-cyan-500/10"
                                >
                                    <span>Contratar Solución</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
