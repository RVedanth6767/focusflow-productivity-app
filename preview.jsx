export function FocusFlowLandingPreview() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 text-[10px] uppercase tracking-[0.42em] text-cyan-50/65 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,212,255,.8)]" />
              <span>REC // SYSTEM ACTIVE // CLASSIFIED</span>
            </div>
            <div>STATUS: ACTIVE <span className="px-2 text-cyan-400">|</span> DATE: 2026</div>
          </div>

          <div className="flex flex-col gap-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/10 shadow-[0_0_30px_rgba(0,212,255,.35)]">
                <span className="font-['Orbitron'] text-lg tracking-[0.2em] text-cyan-400">FF</span>
              </div>
              <div>
                <p className="font-['Orbitron'] text-2xl font-black uppercase tracking-[0.34em] text-white">FocusFlow AI</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.42em] text-white/45">Neural Command Interface</p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.3em] text-slate-200/70">
              <a href="#hero" className="relative py-3 text-white after:absolute after:bottom-1 after:left-0 after:h-px after:w-full after:bg-gradient-to-r after:from-transparent after:via-cyan-400 after:to-transparent">I. Dashboard</a>
              <a href="#modules">II. AI Assistant</a>
              <a href="#history">III. History</a>
              <a href="#analytics">IV. Analytics</a>
              <a href="#settings">V. Settings</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] lg:px-8">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.52em] text-cyan-100/70 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Chapter Six
          </div>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.5em] text-white/50">AI-POWERED PRODUCTIVITY SYSTEM</p>
            <h1 className="font-['Orbitron'] text-5xl font-black uppercase leading-none text-white sm:text-6xl md:text-7xl xl:text-[7.2rem]">
              FocusFlow <span className="text-cyan-400">AI</span>
            </h1>
            <p className="max-w-4xl text-[11px] uppercase tracking-[0.46em] text-cyan-100/80 sm:text-sm">
              AI-POWERED PRODUCTIVITY SYSTEM // REAL-TIME OPTIMIZATION
            </p>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              A next-gen intelligent workflow system designed to enhance focus, automate tasks, and push productivity beyond limits.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-4">
            {['AI Assistant', 'Task Engine', 'Focus Timer', 'Analytics'].map((item, index) => (
              <article
                key={item}
                className="rounded-[1.8rem] border border-cyan-400/20 bg-slate-900/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,.04),0_18px_50px_rgba(2,6,23,.42)] backdrop-blur-2xl"
              >
                <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-100/55">0{index + 1}</p>
                <h3 className="mt-8 font-['Orbitron'] text-2xl uppercase tracking-[0.14em] text-white">{item}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">High-clarity module card with glassmorphism, neon borders, and classified-system spacing.</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,.04),0_18px_50px_rgba(2,6,23,.42)] backdrop-blur-2xl">
          <p className="text-[10px] uppercase tracking-[0.42em] text-white/45">Classified Node</p>
          <h2 className="mt-4 font-['Orbitron'] text-2xl uppercase tracking-[0.22em] text-white">Control Matrix</h2>

          <div className="mt-8 space-y-4">
            {[
              ['Neural Sync', '99.2%'],
              ['Task Routing', 'Auto'],
              ['Focus Stream', 'Stable'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-white/10 pb-4 text-[11px] uppercase tracking-[0.24em] text-white/70">
                <span>{label}</span>
                <span className="text-cyan-100">{value}</span>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
