import React, { useState, useEffect, useRef, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Tv, BookOpen, Sliders, Check, ChevronLeft, ChevronRight,
  Upload, Copy, Maximize2, FileText, Search, Wifi, Cast,
  Layers, SkipBack, SkipForward, X, Menu, Smartphone
} from 'lucide-react';
import {
  PRESET_BACKGROUNDS, MOCK_BIBLE, MOCK_SLIDES, PRODUCTION_CODE,
  Background, Slide
} from './data';

/* ─────────── helpers ─────────── */
function getDynamicVerseSizes(content: any, requestedSize: number, isPreview = false) {
  let base = (requestedSize || 44) * (isPreview ? 0.85 : 1);
  const total = (content?.textHi?.length || 0) + (content?.textEn?.length || 0) || content?.text?.length || 0;
  const scale = total > 350 ? 0.52 : total > 250 ? 0.65 : total > 160 ? 0.78 : total > 90 ? 0.92 : 1.0;
  return {
    hiSize: Math.max(16, Math.round(base * 1.2 * scale)),
    enSize: Math.max(14, Math.round(base * 0.95 * scale)),
    fallbackSize: Math.max(16, Math.round(base * 1.2 * scale)),
  };
}

interface ExtractedPage { title: string; text: string; image?: string; }
interface DocumentDeck { id: string; name: string; type: 'pdf' | 'pptx'; pages: ExtractedPage[]; }

/* ═══════════════════════════════════════════════════════
   TV CASTING SCREEN  (?mode=tv)
═══════════════════════════════════════════════════════ */
function TVScreen({ systemState, connected }: { systemState: any; connected: boolean }) {
  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative flex flex-col justify-center items-center text-center p-6 sm:p-16 select-none">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-50"
        style={{ backgroundImage: `url(${systemState.background?.url})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black-95" />
      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-700 rounded-full blur-[180px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-600 rounded-full blur-[180px] opacity-20 animate-pulse" />
      </div>

      {/* DEBUG: Connection Status Indicator (Top Right) */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2 font-mono text-[10px] text-white/50 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 animate-pulse'}`} />
        {connected ? 'Online' : 'Offline'}
      </div>

      {/* Corner badge */}
      <div className="absolute top-6 left-6 z-30 flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Casting
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl w-full text-white">
        {systemState.type === 'idle' && (
          <div className="flex flex-col items-center gap-5 animate-pulse">
            <Tv className="w-20 h-20 text-slate-600" />
            <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">Standby — Waiting for cast</p>
            <p className="text-slate-600 text-[10px] font-mono mt-2">
              {connected ? 'Connected to server' : 'Not connected to server'}
            </p>
          </div>
        )}

        {systemState.type === 'verse' && (() => {
          const { hiSize, enSize, fallbackSize } = getDynamicVerseSizes(systemState.content, systemState.fontSize);
          return (
            <div className="flex flex-col items-center">
              {(systemState.content.textHi || systemState.content.text) && (
                <h2 style={{ fontSize: hiSize }} className="font-serif font-bold text-white leading-relaxed mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,1)]">
                  {systemState.content.textHi || systemState.content.text}
                </h2>
              )}
              {systemState.content.textHi && systemState.content.textEn && (
                <div className="h-px w-32 bg-sky-400/40 mb-4 rounded-full" />
              )}
              {systemState.content.textHi && systemState.content.textEn && (
                <h3 style={{ fontSize: enSize }} className="font-serif italic text-slate-300 leading-relaxed mb-8 drop-shadow-[0_3px_16px_rgba(0,0,0,1)]">
                  "{systemState.content.textEn}"
                </h3>
              )}
              {!systemState.content.textHi && (
                <h2 style={{ fontSize: fallbackSize }} className="font-serif italic text-white leading-relaxed mb-8 drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
                  "{systemState.content.text}"
                </h2>
              )}
              <div className="h-px w-48 bg-white/20 mb-6 rounded-full" />
              <p className="text-xl font-mono tracking-[0.4em] uppercase text-sky-400 font-extrabold">
                {systemState.content.book} {systemState.content.chapter}:{systemState.content.verse}
              </p>
            </div>
          );
        })()}

        {systemState.type === 'slide' && (
          <div className="flex flex-col items-center">
            {systemState.content?.image ? (
              <div className="grid md:grid-cols-2 gap-10 items-center w-full">
                <img src={systemState.content.image} alt="" className="max-h-[65vh] object-contain rounded-xl border border-white/10 shadow-2xl mx-auto" />
                <div className="text-left">
                  <p className="text-sky-400 text-sm font-mono uppercase tracking-widest mb-2">{systemState.content.title}</p>
                  <div className="h-px w-16 bg-sky-500 mb-4" />
                  <p style={{ fontSize: (systemState.fontSize || 32) * 0.75 }} className="text-slate-100 leading-relaxed">{systemState.content.text}</p>
                </div>
              </div>
            ) : (
              <>
                {systemState.content?.subtitle && (
                  <span className="text-xs text-sky-400 font-bold uppercase tracking-[0.3em] bg-sky-950/50 ring-1 ring-sky-500/30 px-5 py-2 rounded-full mb-6">
                    {systemState.content.subtitle}
                  </span>
                )}
                <h4 style={{ fontSize: (systemState.fontSize || 40) * 1.2 }} className="font-sans font-extrabold uppercase leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)] mb-8">
                  {systemState.content.title}
                </h4>
                <div className="h-px w-48 bg-white/20 mb-8 rounded-full" />
                <p style={{ fontSize: (systemState.fontSize || 40) * 0.8 }} className="text-slate-100 max-w-3xl leading-relaxed">
                  {systemState.content.text}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WIFI INFO SCREEN  (shown on controller bottom)
═══════════════════════════════════════════════════════ */
function WiFiCard({ lanIP, port = 3000 }: { lanIP: string; port?: number }) {
  const [copied, setCopied] = useState(false);
  const tvUrl = `http://${lanIP}:${port}/index.html`;

  const copy = () => {
    navigator.clipboard.writeText(tvUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-4 mb-4 bg-[#0a1628] border border-sky-900/60 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wifi className="w-4 h-4 text-sky-400" />
        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">TV Casting URL</span>
        {lanIP !== '...' && <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
      </div>
      <div className="bg-[#060d1a] rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 border border-slate-800">
        <span className="text-sky-300 font-mono text-[11px] truncate">{tvUrl}</span>
        <button onClick={copy}
          className="shrink-0 text-[9px] font-bold px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1 transition active:scale-95">
          {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <p className="text-[9px] text-slate-500 mt-2 text-center">
        Open this URL on your TV browser to receive casts
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MOBILE CONTROLLER  (default view)
═══════════════════════════════════════════════════════ */
export default function App() {
  /* ── Safe storage helper (Capacitor WebView safe) ── */
  const safeGet = (key: string): string => {
    try { return localStorage.getItem(key) || ''; } catch { return ''; }
  };
  const safeSet = (key: string, val: string) => {
    try { localStorage.setItem(key, val); } catch {}
  };

  /* ── URL-based mode detection ── */
  const getInitialMode = (): 'controller' | 'tv' => {
    try {
      const p = new URLSearchParams(window.location.search);
      const m = p.get('mode');
      if (m === 'tv') return 'tv';
    } catch {}
    return 'controller';
  };

  const [mode] = useState<'controller' | 'tv'>(getInitialMode);

  /* ── Server URL state (persisted in localStorage) ── */
  const [serverUrl, setServerUrl] = useState<string>(() => safeGet('biblecast_server_url'));
  const [urlInput, setUrlInput] = useState('');
  const [showUrlScreen, setShowUrlScreen] = useState<boolean>(() => !safeGet('biblecast_server_url'));

  /* ── Shared socket & cast state ── */
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [systemState, setSystemState] = useState<any>({
    type: 'idle', content: null,
    background: PRESET_BACKGROUNDS[0], fontSize: 40
  });

  /* ── Controller UI state ── */
  const [activeTab, setActiveTab] = useState<'present' | 'bible' | 'docs' | 'settings'>('present');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [customSlides, setCustomSlides] = useState<Slide[]>(MOCK_SLIDES);
  const [fontSize, setFontSize] = useState(44);
  const [lanIP, setLanIP] = useState('...');

  /* ── Bible state ── */
  const [bibleData, setBibleData] = useState<any>(() => {
    const init: any = {};
    Object.entries(MOCK_BIBLE).forEach(([book, chapters]) => {
      init[book] = {};
      Object.entries(chapters).forEach(([ch, verses]) => {
        init[book][ch] = {};
        Object.entries(verses).forEach(([vs, text]) => { init[book][ch][vs] = { en: text, hi: '' }; });
      });
    });
    return init;
  });
  const [selectedBook, setSelectedBook] = useState('Psalms');
  const [selectedChapter, setSelectedChapter] = useState(23);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [bibleQuery, setBibleQuery] = useState('');
  const [showSug, setShowSug] = useState(false);

  /* ── Doc state ── */
  const [uploadedDocs, setUploadedDocs] = useState<DocumentDeck[]>([{
    id: 'sample', name: 'Sunday Sermon.pdf', type: 'pdf',
    pages: [
      { title: 'Welcome to Worship', text: 'Welcome to Covenant Fellowship. Ready to worship in spirit and truth.' },
      { title: 'Opening Prayer', text: '"Praise God from whom all blessings flow; Praise Him all creatures here below."' },
    ]
  }]);
  const [activeDocIdx, setActiveDocIdx] = useState(0);
  const [activeDocPage, setActiveDocPage] = useState(0);
  const [pdfParsing, setPdfParsing] = useState(false);
  const [customBgs, setCustomBgs] = useState<Background[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  /* ── Fetch LAN IP ── */
  useEffect(() => {
    if (!serverUrl) return;
    fetch(`${serverUrl}/api/info`).then(r => r.json()).then(d => {
      if (d.lanIP) setLanIP(d.lanIP);
    }).catch(() => {});
  }, [serverUrl]);

  /* ── Load Bible ── */
  useEffect(() => {
    if (!serverUrl) return;
    fetch(`${serverUrl}/api/bible`).then(r => r.ok ? r.json() : null).then(d => { if (d) setBibleData(d); }).catch(() => {});
  }, [serverUrl]);

  /* ── Load PDF.js ── */
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    s.async = true;
    s.onload = () => { if ((window as any).pdfjsLib) (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'; };
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  /* ── Socket Connection Logic ── */
  useEffect(() => {
    if (!serverUrl) return;
    if (socketRef.current) socketRef.current.disconnect();
    
    console.log('Connecting to:', serverUrl);
    const socket = io(serverUrl, { transports: ['polling', 'websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => { 
      console.log('Socket Connected'); 
      setConnected(true); 
      socket.emit('get-state'); 
    });
    
    socket.on('reconnect', () => {
      console.log('Socket Reconnected');
      setConnected(true);
      socket.emit('get-state');
    });

    socket.on('state-sync', (d) => { 
      console.log('State Sync:', d);
      if (d) setSystemState(d); 
    });

    // DEBUG LOG ADDED HERE
    socket.on('display-update', (d) => { 
      console.log('🔴 TV Update Received:', d); 
      if (d) setSystemState(d); 
    });
    
    socket.on('disconnect', () => {
      console.log('Socket Disconnected');
      setConnected(false);
    });

    return () => { socket.disconnect(); };
  }, [serverUrl]);

  /* ── Bible search index ── */
  const allVerses = useMemo(() => {
    const list: { book: string; chapter: number; verse: number; text: string; textHi: string }[] = [];
    Object.entries(bibleData).forEach(([book, chapters]: any) => {
      Object.entries(chapters).forEach(([ch, verses]: any) => {
        Object.entries(verses).forEach(([vs, val]: any) => {
          list.push({ book, chapter: parseInt(ch), verse: parseInt(vs), text: val?.en || '', textHi: val?.hi || '' });
        });
      });
    });
    return list;
  }, [bibleData]);

  const suggestions = useMemo(() => {
    if (!bibleQuery.trim()) return [];
    const q = bibleQuery.toLowerCase().trim();
    const parts = q.split(/[\s,.:/\-]+/).filter(Boolean);
    return allVerses.filter(v => {
      const bl = v.book.toLowerCase();
      const st = `${v.book} ${v.chapter}:${v.verse}`.toLowerCase();
      if (st.includes(q) || v.text.toLowerCase().includes(q) || v.textHi.toLowerCase().includes(q)) return true;
      const matchBook = bl.startsWith(parts[0]);
      if (matchBook) {
        if (parts.length === 1) return true;
        if (parts.length === 2 && !isNaN(parseInt(parts[1]))) return v.chapter === parseInt(parts[1]);
        if (parts.length >= 3) return v.chapter === parseInt(parts[1]) && v.verse === parseInt(parts[2]);
      }
      return false;
    }).slice(0, 40);
  }, [allVerses, bibleQuery]);

  /* ── Cast helpers ── */
  const emit = (event: string, data: any) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
      alert("❌ SERVER DISCONNECTED!\n\nPlease check:\n1. Is Termux server running?\n2. Are Phone and TV on same WiFi?\n3. Is the IP Address correct?");
    }
  };

  const castVerse = (v?: typeof allVerses[0]) => {
    const book = v?.book ?? selectedBook;
    const chapter = v?.chapter ?? selectedChapter;
    const verse = v?.verse ?? selectedVerse;
    const val = bibleData[book]?.[chapter]?.[verse];
    emit('cast-verse', {
      book, chapter, verse,
      text: val?.hi || val?.en || '',
      textEn: val?.en || '', textHi: val?.hi || '',
      fontSize, background: systemState.background
    });
  };

  const castSlide = (idx = activeSlideIndex) => {
    const slide = customSlides[idx];
    if (!slide) return;
    emit('cast-slide', { title: slide.title, subtitle: slide.subtitle || '', text: slide.text, slideIndex: idx, totalSlides: customSlides.length, fontSize, background: systemState.background });
  };

  const castDocPage = (dIdx = activeDocIdx, pIdx = activeDocPage) => {
    const doc = uploadedDocs[dIdx];
    if (!doc) return;
    const page = doc.pages[pIdx];
    if (!page) return;
    emit('cast-slide', { title: page.title, subtitle: doc.name, text: page.text, image: page.image, slideIndex: pIdx, totalSlides: doc.pages.length, fontSize, background: systemState.background });
  };

  const clearScreen = () => emit('clear-screen', {});
  const updateBg = (bg: Background) => emit('update-background', bg);

  const goVerse = (dir: 1 | -1) => {
    const idx = allVerses.findIndex(v => v.book === selectedBook && v.chapter === selectedChapter && v.verse === selectedVerse);
    const next = allVerses[idx + dir];
    if (!next) return;
    setSelectedBook(next.book); setSelectedChapter(next.chapter); setSelectedVerse(next.verse);
    setBibleQuery(`${next.book} ${next.chapter}:${next.verse}`);
    emit('cast-verse', { book: next.book, chapter: next.chapter, verse: next.verse, text: next.textHi || next.text, textEn: next.text, textHi: next.textHi, fontSize, background: systemState.background });
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.toLowerCase().endsWith('.pdf')) {
      setPdfParsing(true);
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          const lib = (window as any).pdfjsLib;
          if (!lib) throw new Error('PDF.js loading, retry in 2s');
          const pdf = await lib.getDocument(new Uint8Array(this.result as ArrayBuffer)).promise;
          const pages: ExtractedPage[] = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const tc = await page.getTextContent();
            const text = tc.items.map((it: any) => it.str).join(' ').replace(/\s+/g, ' ').trim() || `Page ${i}`;
            const vp = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.height = vp.height; canvas.width = vp.width;
            const ctx = canvas.getContext('2d');
            if (ctx) { await page.render({ canvasContext: ctx, viewport: vp }).promise; }
            pages.push({ title: `${file.name.slice(0, 15)} — Page ${i}`, text, image: canvas.toDataURL('image/jpeg', 0.8) });
          }
          const newDoc: DocumentDeck = { id: `doc-${Date.now()}`, name: file.name, type: 'pdf', pages };
          setUploadedDocs(prev => [...prev, newDoc]);
          setActiveDocIdx(uploadedDocs.length); setActiveDocPage(0);
        } catch (err: any) { alert(err.message); } finally { setPdfParsing(false); }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Upload a .pdf file for slide casting.');
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadLoading(true);
    const fd = new FormData(); fd.append('media', file);
    try {
      const res = await fetch(`${serverUrl}/api/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        const bg: Background = { id: `custom-${Date.now()}`, name: file.name.slice(0, 15), url: data.relativeUrl, textColor: 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]', fontStyle: 'font-sans' };
        setCustomBgs(prev => [...prev, bg]); updateBg(bg);
      }
    } catch { } finally { setUploadLoading(false); }
  };

  const activeBibleChapters = bibleData[selectedBook] || {};
  const activeChapterVerses = activeBibleChapters[selectedChapter] || {};

  /* ── TV mode ── */
  if (mode === 'tv') return <TVScreen systemState={systemState} connected={connected} />;

  /* ── Server URL input screen ── */
  if (showUrlScreen) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-[#060c18] text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="p-3 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl mb-6 shadow-[0_0_30px_rgba(14,165,233,0.4)]">
          <Cast className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">BibleCast Remote</h1>
        <p className="text-slate-400 text-sm mb-8 text-center">Termux server ka IP address daalo</p>

        <div className="w-full bg-[#0d1a2e] border border-slate-700/60 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Server URL</label>
            <input
              type="text"
              placeholder="192.168.x.x:3000"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && urlInput.trim()) {
                  let url = urlInput.trim().replace(/\/$/, '');
                  if (!url.startsWith('http')) url = 'http://' + url;
                  safeSet('biblecast_server_url', url);
                  setServerUrl(url);
                  setShowUrlScreen(false);
                }
              }}
              className="w-full bg-[#060c18] text-sky-300 font-mono border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none"
            />
            <p className="text-[9px] text-slate-500 mt-2">
              Termux mein <span className="text-slate-300 font-mono">ip addr show</span> chalao IP dekhne ke liye
            </p>
          </div>

          <button
            onClick={() => {
              if (!urlInput.trim()) return;
              let url = urlInput.trim().replace(/\/$/, '');
              if (!url.startsWith('http')) url = 'http://' + url;
              safeSet('biblecast_server_url', url);
              setServerUrl(url);
              setShowUrlScreen(false);
            }}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition active:scale-95">
            <Cast className="w-4 h-4" /> Connect to Server
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="w-full mt-4 flex flex-col gap-2">
          <p className="text-[9px] text-slate-600 uppercase tracking-widest text-center font-bold">Quick options</p>
          {['http://localhost:3000', 'http://192.168.1.1:3000', 'http://10.0.0.1:3000'].map(url => (
            <button key={url} onClick={() => setUrlInput(url)}
              className="w-full py-2 bg-[#0d1a2e] border border-slate-800 hover:border-slate-600 rounded-xl text-[11px] font-mono text-slate-400 hover:text-white transition active:scale-95">
              {url}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#060c18] text-slate-100 flex flex-col font-sans">

      {/* ── Header ── */}
      <div className="bg-[#0b1526] border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg">
            <Cast className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">BibleCast Remote</h1>
            <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {connected ? 'Server connected' : 'Disconnected'}
            </p>
            <button onClick={() => { setUrlInput(serverUrl); setShowUrlScreen(true); }}
              className="text-[8px] text-slate-600 hover:text-sky-400 transition font-mono mt-0.5 text-left truncate max-w-[160px]">
              {serverUrl}
            </button>
          </div>
        </div>
        <button onClick={clearScreen}
          className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-300 hover:bg-rose-900 transition active:scale-95">
          ⬛ Blackout
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-slate-800 shrink-0 bg-[#080f1e] sticky top-[53px] z-40">
        {([
          { id: 'present', icon: <Sliders className="w-3.5 h-3.5" />, label: 'Slides' },
          { id: 'bible', icon: <BookOpen className="w-3.5 h-3.5" />, label: 'Bible' },
          { id: 'docs', icon: <FileText className="w-3.5 h-3.5" />, label: 'Docs' },
          { id: 'settings', icon: <Layers className="w-3.5 h-3.5" />, label: 'Settings' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider transition relative ${activeTab === tab.id ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}>
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* ── Panel content ── */}
      <div className="flex-1 overflow-y-auto pb-4">

        {/* SLIDES TAB */}
        {activeTab === 'present' && (
          <div className="p-4 flex flex-col gap-4">
            {/* Active slide preview */}
            <div className="bg-[#0d1a2e] border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Slide</span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded-md border border-sky-900/50">
                  {activeSlideIndex + 1} / {customSlides.length}
                </span>
              </div>
              <div className="bg-[#060c18] rounded-xl p-3.5 border border-slate-800 min-h-[80px]">
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mb-1">{customSlides[activeSlideIndex]?.subtitle || 'Slide'}</p>
                <h4 className="text-white font-bold text-sm">{customSlides[activeSlideIndex]?.title}</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 italic leading-relaxed">"{customSlides[activeSlideIndex]?.text}"</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button onClick={() => { const p = activeSlideIndex - 1; if (p >= 0) { setActiveSlideIndex(p); castSlide(p); } }}
                  disabled={activeSlideIndex === 0}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-xs font-bold disabled:opacity-30 transition active:scale-95">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button onClick={() => { const n = activeSlideIndex + 1; if (n < customSlides.length) { setActiveSlideIndex(n); castSlide(n); } }}
                  disabled={activeSlideIndex === customSlides.length - 1}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-xs font-bold disabled:opacity-30 transition active:scale-95">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => castSlide()}
                className="w-full mt-3 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition active:scale-95">
                <Cast className="w-4 h-4" /> Cast to TV
              </button>
            </div>

            {/* Slide queue */}
            <div className="bg-[#0d1a2e] border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Queue</span>
                <button onClick={() => {
                  const title = prompt('Slide title:'); const text = prompt('Slide text:');
                  if (title && text) setCustomSlides(p => [...p, { id: `s-${Date.now()}`, title: title.toUpperCase(), text }]);
                }} className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition">+ Add Slide</button>
              </div>
              <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                {customSlides.map((s, i) => (
                  <div key={s.id} onClick={() => { setActiveSlideIndex(i); castSlide(i); }}
                    className={`p-3 rounded-xl cursor-pointer border text-xs font-semibold flex items-center gap-2 transition ${activeSlideIndex === i ? 'bg-slate-900 border-sky-600/70 text-sky-200' : 'bg-[#060c18]/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                    <span className="text-[9px] font-mono text-slate-500 w-5 shrink-0">{i + 1}</span>
                    <span className="truncate">{s.title}</span>
                    {activeSlideIndex === i && <Cast className="w-3 h-3 text-sky-400 ml-auto shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BIBLE TAB */}
        {activeTab === 'bible' && (
          <div className="p-4 flex flex-col gap-4">
            <div className="bg-[#0d1a2e] border border-slate-700/60 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Scripture Search</span>

              {/* Search */}
              <div className="relative mb-4">
                <input type="text" placeholder="Search: 'John 3:16' or 'love'..."
                  value={bibleQuery}
                  onChange={e => { setBibleQuery(e.target.value); setShowSug(true); }}
                  onFocus={() => setShowSug(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && suggestions.length > 0) {
                      const v = suggestions[0];
                      setSelectedBook(v.book); setSelectedChapter(v.chapter); setSelectedVerse(v.verse);
                      setBibleQuery(`${v.book} ${v.chapter}:${v.verse}`); setShowSug(false);
                      castVerse(v);
                    }
                  }}
                  className="w-full bg-[#060c18] text-slate-200 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:border-sky-600 outline-none transition" />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                {bibleQuery && <button onClick={() => { setBibleQuery(''); setShowSug(false); }} className="absolute right-3 top-3 text-slate-600 hover:text-slate-400"><X className="w-3 h-3" /></button>}

                {showSug && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#0b1529] border border-slate-800 rounded-xl shadow-2xl z-50 max-h-[200px] overflow-y-auto">
                    {suggestions.map((v, i) => (
                      <div key={i} onMouseDown={e => e.preventDefault()}
                        onClick={() => { setSelectedBook(v.book); setSelectedChapter(v.chapter); setSelectedVerse(v.verse); setBibleQuery(`${v.book} ${v.chapter}:${v.verse}`); setShowSug(false); }}
                        className="p-2.5 border-b border-slate-800/50 last:border-0 hover:bg-slate-900 cursor-pointer flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-bold text-sky-400 font-mono">{v.book} {v.chapter}:{v.verse}</p>
                          <p className="text-[9px] text-slate-400 italic truncate max-w-[220px]">"{v.text}"</p>
                        </div>
                        <button onMouseDown={e => { e.stopPropagation(); setSelectedBook(v.book); setSelectedChapter(v.chapter); setSelectedVerse(v.verse); setBibleQuery(`${v.book} ${v.chapter}:${v.verse}`); setShowSug(false); castVerse(v); }}
                          className="text-[8px] bg-sky-600 hover:bg-sky-500 text-white font-bold px-2 py-1 rounded-lg transition shrink-0">
                          ⚡ Cast
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Book', value: selectedBook, onChange: (v: string) => { setSelectedBook(v); const chs = bibleData[v] || {}; const fc = parseInt(Object.keys(chs)[0] || '1'); setSelectedChapter(fc); const vs = chs[fc] || {}; setSelectedVerse(parseInt(Object.keys(vs)[0] || '1')); }, options: Object.keys(bibleData).map(b => ({ value: b, label: b })) },
                  { label: 'Chapter', value: selectedChapter, onChange: (v: string) => { const ch = parseInt(v); setSelectedChapter(ch); const vs = activeBibleChapters[ch] || {}; setSelectedVerse(parseInt(Object.keys(vs)[0] || '1')); }, options: Object.keys(activeBibleChapters).map(c => ({ value: c, label: `Ch ${c}` })) },
                  { label: 'Verse', value: selectedVerse, onChange: (v: string) => setSelectedVerse(parseInt(v)), options: Object.keys(activeChapterVerses).map(v => ({ value: v, label: `v${v}` })) },
                ].map(sel => (
                  <div key={sel.label}>
                    <label className="text-[8px] text-slate-500 uppercase font-bold tracking-widest block mb-1">{sel.label}</label>
                    <select value={sel.value} onChange={e => (sel.onChange as any)(e.target.value)}
                      className="w-full bg-[#060c18] text-slate-200 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-medium focus:border-sky-600 outline-none cursor-pointer">
                      {sel.options.map(o => <option key={o.value} value={o.value} className="bg-[#0b1529]">{o.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Prev / Next */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => goVerse(-1)} className="flex items-center justify-center gap-1.5 py-2 bg-[#060c18] hover:bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold transition active:scale-95">
                  <SkipBack className="w-3 h-3" /> Prev Verse
                </button>
                <button onClick={() => goVerse(1)} className="flex items-center justify-center gap-1.5 py-2 bg-[#060c18] hover:bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold transition active:scale-95">
                  Next Verse <SkipForward className="w-3 h-3" />
                </button>
              </div>

              {/* Preview */}
              <div className="bg-[#060c18] rounded-xl p-3.5 border border-slate-800 mb-4">
                <p className="text-[10px] font-mono font-bold text-sky-400 mb-2">{selectedBook} {selectedChapter}:{selectedVerse}</p>
                {activeChapterVerses[selectedVerse]?.hi && <p className="text-amber-200 font-bold font-serif text-sm leading-relaxed mb-2">{activeChapterVerses[selectedVerse].hi}</p>}
                {activeChapterVerses[selectedVerse]?.hi && activeChapterVerses[selectedVerse]?.en && <div className="h-px w-12 bg-slate-800 my-2" />}
                {activeChapterVerses[selectedVerse]?.en && <p className="text-slate-300 italic font-serif text-xs leading-relaxed">"{activeChapterVerses[selectedVerse].en}"</p>}
                {!activeChapterVerses[selectedVerse] && <p className="text-slate-600 italic text-xs">Scripture unavailable.</p>}
              </div>

              <button onClick={() => castVerse()}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition active:scale-95">
                <Cast className="w-4 h-4" /> Cast Scripture to TV
              </button>
            </div>
          </div>
        )}

        {/* DOCS TAB */}
        {activeTab === 'docs' && (
          <div className="p-4 flex flex-col gap-4">
            <div className="bg-[#0d1a2e] border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documents</span>
                {uploadedDocs[activeDocIdx] && (
                  <span className="text-[10px] font-mono text-sky-400">Page {activeDocPage + 1}/{uploadedDocs[activeDocIdx].pages.length}</span>
                )}
              </div>

              <label className="block border-2 border-dashed border-sky-800/50 hover:border-sky-600/60 rounded-xl p-4 text-center cursor-pointer bg-sky-950/10 hover:bg-sky-950/20 transition mb-3">
                <input type="file" accept=".pdf" onChange={handleDocUpload} className="hidden" disabled={pdfParsing} />
                <FileText className="w-6 h-6 text-sky-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-300">{pdfParsing ? 'Parsing PDF...' : 'Upload PDF'}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Tap to select file</p>
              </label>

              {uploadedDocs.length > 1 && (
                <select value={activeDocIdx} onChange={e => { setActiveDocIdx(parseInt(e.target.value)); setActiveDocPage(0); }}
                  className="w-full bg-[#060c18] text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs mb-3 focus:border-sky-600 outline-none">
                  {uploadedDocs.map((d, i) => <option key={d.id} value={i}>{d.name}</option>)}
                </select>
              )}

              {uploadedDocs[activeDocIdx] && (
                <>
                  <div className="bg-[#060c18] rounded-xl p-3.5 border border-slate-800 mb-3 min-h-[80px]">
                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mb-1">{uploadedDocs[activeDocIdx].pages[activeDocPage]?.title}</p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{uploadedDocs[activeDocIdx].pages[activeDocPage]?.text}</p>
                    {uploadedDocs[activeDocIdx].pages[activeDocPage]?.image && (
                      <div className="mt-2 rounded-lg overflow-hidden max-h-16 bg-black flex justify-center border border-white/5">
                        <img src={uploadedDocs[activeDocIdx].pages[activeDocPage].image} alt="" className="object-contain max-h-full" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button onClick={() => { const p = activeDocPage - 1; if (p >= 0) { setActiveDocPage(p); castDocPage(activeDocIdx, p); } }} disabled={activeDocPage === 0}
                      className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-xs font-bold disabled:opacity-30 transition active:scale-95">
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button onClick={() => { const n = activeDocPage + 1; if (n < uploadedDocs[activeDocIdx].pages.length) { setActiveDocPage(n); castDocPage(activeDocIdx, n); } }} disabled={activeDocPage === uploadedDocs[activeDocIdx].pages.length - 1}
                      className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-xs font-bold disabled:opacity-30 transition active:scale-95">
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => castDocPage()}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition active:scale-95">
                    <Cast className="w-4 h-4" /> Cast Page to TV
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="p-4 flex flex-col gap-4">

            {/* Background picker */}
            <div className="bg-[#0d1a2e] border border-slate-700/60 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">TV Background</span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_BACKGROUNDS.concat(customBgs).map(bg => (
                  <button key={bg.id} onClick={() => updateBg(bg)}
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.65)),url(${bg.url})` }}
                    className={`h-16 rounded-xl bg-cover bg-center flex items-end p-2 border-2 transition ${systemState.background?.id === bg.id ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-slate-800 hover:border-slate-600'}`}>
                    <span className="text-[9px] font-bold text-white drop-shadow-md truncate">{bg.name}</span>
                    {systemState.background?.id === bg.id && <Check className="w-3 h-3 text-sky-400 ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
              <label className="mt-3 flex items-center justify-center gap-2 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-3 cursor-pointer bg-slate-950/20 hover:bg-slate-900/20 transition">
                <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" disabled={uploadLoading} />
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[10px] text-slate-400 font-medium">{uploadLoading ? 'Uploading...' : 'Upload custom background'}</span>
              </label>
            </div>

            {/* Font size */}
            <div className="bg-[#0d1a2e] border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Font Size</span>
                <span className="text-sky-400 font-mono text-sm font-bold">{fontSize}px</span>
              </div>
              <input type="range" min="24" max="80" value={fontSize}
                onChange={e => setFontSize(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer" />
              <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                <span>Small</span><span>Large</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── WiFi URL Card (always visible at bottom) ── */}
      <div className="shrink-0 border-t border-slate-800 pt-3 bg-[#060c18]">
        <WiFiCard lanIP={lanIP} />
      </div>
    </div>
  );
}