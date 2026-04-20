import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/987214c8-edff-4991-b724-287d26e95ca6/files/97698259-bfa1-419d-9263-30a21c01b7ba.jpg";

const TRACKS = [
  { id: 1, title: "CONCRETE PULSE", duration: "5:42", bpm: 140, year: 2024 },
  { id: 2, title: "VOID SEQUENCE", duration: "6:18", bpm: 138, year: 2024 },
  { id: 3, title: "MACHINE DAWN", duration: "4:55", bpm: 145, year: 2023 },
  { id: 4, title: "BROKEN GRID", duration: "7:02", bpm: 142, year: 2023 },
  { id: 5, title: "FRACTURE LOOP", duration: "5:30", bpm: 136, year: 2022 },
  { id: 6, title: "STATIC RITUAL", duration: "8:11", bpm: 148, year: 2022 },
];

const SECTIONS = ["главная", "музыка", "о проекте", "контакты"] as const;
type Section = typeof SECTIONS[number];

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("главная");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextTrack = useCallback(() => {
    setCurrentTrack(prev => {
      if (prev === null) return null;
      const idx = TRACKS.findIndex(t => t.id === prev);
      const next = idx < TRACKS.length - 1 ? idx + 1 : 0;
      return TRACKS[next].id;
    });
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const playTrack = useCallback((id: number) => {
    if (currentTrack === id && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(id);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = () => {
    if (currentTrack === null) {
      playTrack(1);
    } else {
      setIsPlaying(p => !p);
    }
  };

  const prevTrack = () => {
    if (currentTrack === null) return;
    const idx = TRACKS.findIndex(t => t.id === currentTrack);
    const prev = idx > 0 ? idx - 1 : TRACKS.length - 1;
    setCurrentTrack(TRACKS[prev].id);
    setProgress(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            nextTrack();
            return 0;
          }
          return p + 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentTrack, nextTrack]);

  const activeTrack = TRACKS.find(t => t.id === currentTrack);

  const formatProgress = (p: number) => {
    if (!activeTrack) return "0:00";
    const parts = activeTrack.duration.split(":").map(Number);
    const total = parts[0] * 60 + parts[1];
    const current = (p / 100) * total;
    const m = Math.floor(current / 60);
    const s = Math.floor(current % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--dark)" }}>

      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12"
        style={{
          height: "60px",
          borderBottom: "1px solid var(--grey-mid)",
          background: "rgba(10,10,10,0.96)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="font-oswald text-xl tracking-widest text-white cursor-pointer"
          onClick={() => setActiveSection("главная")}
        >
          BRKBT<span style={{ color: "var(--red)" }}>.</span>
        </div>

        <div className="hidden md:flex gap-8">
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`nav-link font-mono text-xs uppercase tracking-widest ${activeSection === s ? "active text-white" : "text-gray-500"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          className="md:hidden transition-colors"
          style={{ color: menuOpen ? "var(--red)" : "#666" }}
          onClick={() => setMenuOpen(o => !o)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={20} />
        </button>
      </nav>

      {menuOpen && (
        <div
          className="fixed top-[60px] left-0 right-0 z-40 flex flex-col"
          style={{ background: "rgba(8,8,8,0.99)", borderBottom: "1px solid var(--grey-mid)" }}
        >
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => { setActiveSection(s); setMenuOpen(false); }}
              className="font-mono text-xs uppercase tracking-widest py-5 px-6 text-left transition-colors"
              style={{
                color: activeSection === s ? "#fff" : "#555",
                borderLeft: activeSection === s ? "2px solid var(--red)" : "2px solid transparent",
                borderBottom: "1px solid var(--grey-mid)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 pt-[60px] pb-[72px]">

        {/* ═══ ГЛАВНАЯ ═══ */}
        {activeSection === "главная" && (
          <div className="noise-overlay glitch-line min-h-[calc(100vh-60px)] relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={HERO_IMG}
                alt="BRKBT"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.22) contrast(1.4) saturate(0.2)" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, var(--dark) 100%)" }}
              />
            </div>

            {/* Marquee */}
            <div
              className="absolute overflow-hidden"
              style={{ top: 0, left: 0, right: 0, borderBottom: "1px solid var(--grey-mid)" }}
            >
              <div className="flex whitespace-nowrap animate-marquee py-2" style={{ width: "200%" }}>
                {Array(10).fill(null).map((_, i) => (
                  <span key={i} className="font-mono text-xs tracking-widest mr-12" style={{ color: "var(--text-muted)" }}>
                    BREAKBEAT · INDUSTRIAL · ELECTRONIC ·
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col justify-end min-h-[calc(100vh-60px)] px-6 md:px-16 pb-20">
              <div className="font-mono text-xs tracking-widest mb-4 animate-fade-up" style={{ color: "var(--red)" }}>
                // ELECTRONIC MUSIC PROJECT
              </div>
              <h1
                className="font-oswald leading-none text-white animate-fade-up-delay-1"
                style={{
                  fontSize: "clamp(5rem, 16vw, 13rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                BRK<span style={{ color: "var(--red)" }}>BT</span>
              </h1>

              <p
                className="font-mono text-sm mt-5 max-w-xs animate-fade-up-delay-2"
                style={{ color: "var(--text-dim)", lineHeight: 1.9 }}
              >
                Индустриальный брейкбит.<br />
                Ломаный ритм. Конкретный звук.
              </p>

              <div className="flex gap-4 mt-10 animate-fade-up-delay-2">
                <button
                  onClick={() => { setActiveSection("музыка"); playTrack(1); }}
                  className="font-oswald text-sm text-white uppercase transition-colors"
                  style={{ background: "var(--red)", padding: "12px 32px", letterSpacing: "0.15em" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#c42020")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--red)")}
                >
                  Слушать
                </button>
                <button
                  onClick={() => setActiveSection("о проекте")}
                  className="font-oswald text-sm uppercase transition-all"
                  style={{
                    border: "1px solid var(--grey-light)",
                    color: "#777",
                    padding: "12px 32px",
                    letterSpacing: "0.15em",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#777"; e.currentTarget.style.borderColor = "var(--grey-light)"; }}
                >
                  О проекте
                </button>
              </div>

              <div className="flex gap-12 mt-16 animate-fade-up-delay-3">
                {[
                  { val: "6", label: "треков" },
                  { val: "140", label: "avg bpm" },
                  { val: "2022", label: "основан" },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="font-oswald text-2xl text-white" style={{ fontWeight: 600 }}>{stat.val}</div>
                    <div className="font-mono text-xs mt-1" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ МУЗЫКА ═══ */}
        {activeSection === "музыка" && (
          <div className="min-h-[calc(100vh-132px)] px-6 md:px-16 py-16">
            <div className="animate-fade-up">
              <div className="font-mono text-xs tracking-widest mb-3" style={{ color: "var(--red)" }}>// DISCOGRAPHY</div>
              <h2 className="font-oswald text-5xl md:text-7xl text-white" style={{ fontWeight: 700 }}>МУЗЫКА</h2>
              <div className="mt-3 mb-12" style={{ width: 60, height: 2, background: "var(--red)" }} />
            </div>

            <div className="max-w-3xl animate-fade-up-delay-1">
              <div
                className="grid grid-cols-12 font-mono text-xs py-2 px-4 mb-1"
                style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--grey-mid)" }}
              >
                <div className="col-span-1">#</div>
                <div className="col-span-7">НАЗВАНИЕ</div>
                <div className="col-span-2 text-center">BPM</div>
                <div className="col-span-2 text-right">ДЛИТ.</div>
              </div>

              {TRACKS.map((track, idx) => {
                const isActive = currentTrack === track.id;
                return (
                  <div
                    key={track.id}
                    className="grid grid-cols-12 items-center py-4 px-4 cursor-pointer transition-all"
                    style={{
                      background: isActive ? "var(--grey-mid)" : "transparent",
                      borderLeft: `2px solid ${isActive ? "var(--red)" : "transparent"}`,
                      paddingLeft: isActive ? "calc(1rem - 2px)" : "1rem",
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = "var(--grey)";
                        e.currentTarget.style.borderLeftColor = "var(--grey-light)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderLeftColor = "transparent";
                      }
                    }}
                    onClick={() => playTrack(track.id)}
                  >
                    <div className="col-span-1 font-mono text-xs" style={{ color: isActive ? "var(--red)" : "var(--text-muted)" }}>
                      {isActive && isPlaying ? (
                        <span className="flex gap-px items-end" style={{ height: 16 }}>
                          {[1, 2, 3].map(i => (
                            <span
                              key={i}
                              style={{
                                display: "inline-block",
                                width: 2,
                                background: "var(--red)",
                                height: `${6 + i * 4}px`,
                                animation: `blink-bar ${0.4 + i * 0.15}s ease-in-out infinite alternate`,
                              }}
                            />
                          ))}
                        </span>
                      ) : (
                        String(idx + 1).padStart(2, "0")
                      )}
                    </div>
                    <div className="col-span-7">
                      <div
                        className="font-oswald text-base md:text-lg tracking-wide"
                        style={{ color: isActive ? "#fff" : "#999", fontWeight: isActive ? 600 : 400 }}
                      >
                        {track.title}
                      </div>
                      <div className="font-mono text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{track.year}</div>
                    </div>
                    <div className="col-span-2 text-center font-mono text-xs" style={{ color: "var(--text-dim)" }}>{track.bpm}</div>
                    <div className="col-span-2 text-right font-mono text-xs" style={{ color: "var(--text-dim)" }}>{track.duration}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ О ПРОЕКТЕ ═══ */}
        {activeSection === "о проекте" && (
          <div className="min-h-[calc(100vh-132px)] px-6 md:px-16 py-16">
            <div className="animate-fade-up">
              <div className="font-mono text-xs tracking-widest mb-3" style={{ color: "var(--red)" }}>// ABOUT</div>
              <h2 className="font-oswald text-5xl md:text-7xl text-white" style={{ fontWeight: 700 }}>О ПРОЕКТЕ</h2>
              <div className="mt-3 mb-12" style={{ width: 60, height: 2, background: "var(--red)" }} />
            </div>

            <div className="grid md:grid-cols-2 gap-16 max-w-5xl animate-fade-up-delay-1">
              <div className="flex flex-col gap-5">
                {[
                  "BRKBT — проект на пересечении индустриальной электроники и брейкбита. Ломаные паттерны, грязный бас, механические ритмы.",
                  "Звук создаётся из семплов промышленной среды, синтезаторов и аналогового оборудования. Никакого глянца — только сырая текстура.",
                  "Основан в 2022. Выпускает треки и миксы в формате самиздата.",
                ].map((text, i) => (
                  <p key={i} className="text-base leading-loose" style={{ color: "#777" }}>{text}</p>
                ))}
              </div>

              <div className="flex flex-col gap-0">
                {[
                  { label: "ЖАНР", value: "Breakbeat / Industrial" },
                  { label: "BPM ДИАПАЗОН", value: "130 — 150" },
                  { label: "ИНСТРУМЕНТЫ", value: "Аналог, сэмплинг, DAW" },
                  { label: "ФОРМАТ", value: "Треки / Миксы / Лайвы" },
                  { label: "ДИСТРИБУЦИЯ", value: "Bandcamp / SoundCloud" },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-4"
                    style={{ borderBottom: "1px solid var(--grey-mid)" }}
                  >
                    <span className="font-mono text-xs tracking-widest" style={{ color: "var(--text-muted)" }}>{item.label}</span>
                    <span className="font-oswald text-sm text-white" style={{ fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 max-w-2xl animate-fade-up-delay-2">
              <div
                className="font-oswald leading-tight"
                style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)", color: "#2a2a2a", fontWeight: 700 }}
              >
                «Ритм — это не пульс.<br />
                <span style={{ color: "var(--red)" }}>Ритм — это удар.»</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ КОНТАКТЫ ═══ */}
        {activeSection === "контакты" && (
          <div className="min-h-[calc(100vh-132px)] px-6 md:px-16 py-16">
            <div className="animate-fade-up">
              <div className="font-mono text-xs tracking-widest mb-3" style={{ color: "var(--red)" }}>// CONTACTS</div>
              <h2 className="font-oswald text-5xl md:text-7xl text-white" style={{ fontWeight: 700 }}>КОНТАКТЫ</h2>
              <div className="mt-3 mb-12" style={{ width: 60, height: 2, background: "var(--red)" }} />
            </div>

            <div className="grid md:grid-cols-2 gap-16 max-w-4xl">
              <div className="animate-fade-up-delay-1 flex flex-col">
                {[
                  { icon: "Mail", label: "Email", value: "info@brkbt.ru", href: "mailto:info@brkbt.ru" },
                  { icon: "Music", label: "SoundCloud", value: "soundcloud.com/brkbt", href: "#" },
                  { icon: "Radio", label: "Bandcamp", value: "brkbt.bandcamp.com", href: "#" },
                  { icon: "MessageCircle", label: "Telegram", value: "@brkbt", href: "#" },
                  { icon: "Instagram", label: "Instagram", value: "@brkbt_music", href: "#" },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 py-4 group transition-all"
                    style={{ borderBottom: "1px solid var(--grey-mid)", textDecoration: "none" }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--grey)",
                        border: "1px solid var(--grey-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "border-color 0.2s",
                      }}
                    >
                      <Icon name={item.icon as "Mail"} size={14} style={{ color: "#555" }} />
                    </div>
                    <div>
                      <div className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{item.label}</div>
                      <div className="font-oswald text-sm mt-0.5" style={{ color: "#ccc", fontWeight: 500 }}>{item.value}</div>
                    </div>
                    <Icon name="ArrowRight" size={12} style={{ color: "#333", marginLeft: "auto" }} />
                  </a>
                ))}
              </div>

              <div className="animate-fade-up-delay-2">
                <div className="font-mono text-xs tracking-widest mb-6" style={{ color: "var(--text-dim)" }}>
                  // НАПИСАТЬ НАПРЯМУЮ
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { type: "text", placeholder: "ИМЯ" },
                    { type: "email", placeholder: "EMAIL" },
                  ].map(field => (
                    <input
                      key={field.placeholder}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="font-mono text-xs tracking-widest px-4 py-3 w-full outline-none"
                      style={{
                        background: "var(--grey)",
                        border: "1px solid var(--grey-light)",
                        color: "#ccc",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => (e.target.style.borderColor = "var(--red)")}
                      onBlur={e => (e.target.style.borderColor = "var(--grey-light)")}
                    />
                  ))}
                  <textarea
                    placeholder="СООБЩЕНИЕ"
                    rows={5}
                    className="font-mono text-xs tracking-widest px-4 py-3 w-full outline-none resize-none"
                    style={{
                      background: "var(--grey)",
                      border: "1px solid var(--grey-light)",
                      color: "#ccc",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => (e.target.style.borderColor = "var(--red)")}
                    onBlur={e => (e.target.style.borderColor = "var(--grey-light)")}
                  />
                  <button
                    className="font-oswald text-sm text-white uppercase transition-colors"
                    style={{ background: "var(--red)", padding: "13px", letterSpacing: "0.2em" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#c42020")}
                    onMouseLeave={e => (e.currentTarget.style.background = "var(--red)")}
                  >
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═══ PLAYER BAR ═══ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 player-bar"
        style={{
          height: "72px",
          background: "rgba(8,8,8,0.97)",
          borderTop: "1px solid var(--grey-mid)",
        }}
      >
        <div className="h-full px-4 md:px-8 flex items-center gap-4 md:gap-6">
          {/* Info */}
          <div style={{ flex: "1", minWidth: 0 }}>
            {activeTrack ? (
              <>
                <div className="font-oswald text-sm text-white truncate" style={{ fontWeight: 500 }}>
                  {activeTrack.title}
                </div>
                <div className="font-mono text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {activeTrack.bpm} BPM
                </div>
              </>
            ) : (
              <div className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                // SELECT TRACK
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
            <button
              onClick={prevTrack}
              style={{ color: currentTrack ? "#666" : "var(--text-muted)", transition: "color 0.2s" }}
              onMouseEnter={e => { if (currentTrack) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.color = currentTrack ? "#666" : "var(--text-muted)"; }}
            >
              <Icon name="SkipBack" size={15} />
            </button>

            <button
              onClick={togglePlay}
              className="flex items-center justify-center flex-shrink-0 animate-pulse-red"
              style={{
                width: 38,
                height: 38,
                background: "var(--red)",
                color: "#fff",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c42020")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--red)")}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={15} />
            </button>

            <button
              onClick={nextTrack}
              style={{ color: currentTrack ? "#666" : "var(--text-muted)", transition: "color 0.2s" }}
              onMouseEnter={e => { if (currentTrack) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.color = currentTrack ? "#666" : "var(--text-muted)"; }}
            >
              <Icon name="SkipForward" size={15} />
            </button>
          </div>

          {/* Progress */}
          <div className="hidden md:flex flex-col gap-1" style={{ flex: "1", maxWidth: 280 }}>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={e => setProgress(parseFloat(e.target.value))}
              className="progress-bar w-full"
              style={{ accentColor: "var(--red)" }}
            />
            <div className="flex justify-between font-mono text-xs" style={{ color: "var(--text-muted)" }}>
              <span>{formatProgress(progress)}</span>
              <span>{activeTrack?.duration ?? "—"}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Icon name="Volume2" size={13} style={{ color: "var(--text-muted)" }} />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={e => setVolume(parseInt(e.target.value))}
              className="progress-bar"
              style={{ width: 64, accentColor: "var(--red)" }}
            />
          </div>

          <button
            onClick={() => setActiveSection("музыка")}
            className="hidden md:flex items-center flex-shrink-0 transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <Icon name="List" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
