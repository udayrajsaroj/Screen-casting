import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import os from 'os';

// Ensure the standard upload directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  
  // Socket.io initialization with open CORS for casting receivers
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    }
  });

  app.use(cors());
  app.use(express.json());

  // Static serving for public uploaded files and backgrounds
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // Local static mock backgrounds
  const DEFAULT_BACKGROUNDS = [
    {
      id: 'glowing-cross',
      name: 'Glowing Cross',
      url: 'https://images.unsplash.com/photo-1515787366009-7cbdd2dc587b?auto=format&fit=crop&q=80&w=1200',
      textColor: 'text-white text-shadow-md',
      fontStyle: 'font-serif'
    },
    {
      id: 'sabbath-dawn',
      name: 'Sabbath Dawn',
      url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=1200',
      textColor: 'text-stone-900',
      fontStyle: 'font-sans'
    },
    {
      id: 'velvet-nocturne',
      name: 'Midnight Prayer',
      url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&q=80&w=1200',
      textColor: 'text-emerald-50',
      fontStyle: 'font-serif'
    },
    {
      id: 'golden-warmth',
      name: 'Golden Sanctuary',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
      textColor: 'text-amber-950',
      fontStyle: 'font-sans'
    },
    {
      id: 'stellar-sky',
      name: 'Starry Heavens',
      url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200',
      textColor: 'text-sky-50',
      fontStyle: 'font-serif'
    }
  ];

  // Utility function to dynamically detect Wi-Fi LAN IP on Termux/Local
  function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const netList = interfaces[name];
      if (!netList) continue;
      for (const net of netList) {
        // Look for IPv4 addresses that aren't loopback
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return '127.0.0.1';
  }

  // API Route: App Service Information
  app.get('/api/info', (req, res) => {
    const lanIP = getLocalIP();
    res.json({
      status: 'online',
      lanIP: lanIP,
      displayUrl: `http://${lanIP}:3000`,
      clientCount: io.engine.clientsCount
    });
  });

  // API Route: Preloaded Backgrounds List
  app.get('/api/backgrounds', (req, res) => {
    res.json(DEFAULT_BACKGROUNDS);
  });

  // Load real Bible JSON files if they exist and merge on-the-fly
  const BIBLE_DATABASE = {
    "Genesis": {
      1: {
        1: "In the beginning God created the heaven and the earth.",
        2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        3: "And God said, Let there be light: and there was light.",
        27: "So God created man in his own image, in the image of God created he him; male and female created he them."
      }
    },
    "Psalms": {
      23: {
        1: "The Lord is my shepherd; I shall not want.",
        2: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
        3: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
        4: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
        5: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
        6: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever."
      },
      119: {
        105: "Thy word is a lamp unto my feet, and a light unto my path."
      }
    },
    "John": {
      1: {
        1: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        14: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth."
      },
      3: {
        16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
      },
      14: {
        6: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."
      }
    },
    "Romans": {
      8: {
        28: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
        38: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,",
        39: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord."
      }
    },
    "Hebrews": {
      11: {
        1: "Now faith is the substance of things hoped for, the evidence of things not seen."
      }
    }
  };

  let mergedBible: any = null;

  function getAndMergeBible() {
    if (mergedBible) return mergedBible;

    let bibleEn: any = {};
    let bibleHi: any = {};

    try {
      const enPath = path.join(process.cwd(), 'bible_en.json');
      if (fs.existsSync(enPath)) {
        bibleEn = JSON.parse(fs.readFileSync(enPath, 'utf8'));
        console.log('Successfully loaded English Bible (bible_en.json)');
      }
    } catch (e) {
      console.error('Error loading bible_en.json:', e);
    }

    try {
      const hiPath = path.join(process.cwd(), 'bible_hi.json');
      if (fs.existsSync(hiPath)) {
        bibleHi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
        console.log('Successfully loaded Hindi Bible (bible_hi.json)');
      }
    } catch (e) {
      console.error('Error loading bible_hi.json:', e);
    }

    const allBooks = new Set([...Object.keys(bibleEn), ...Object.keys(bibleHi)]);
    const merged: any = {};

    for (const book of allBooks) {
      merged[book] = {};
      const chaptersEn = bibleEn[book] || {};
      const chaptersHi = bibleHi[book] || {};
      const allChapters = new Set([...Object.keys(chaptersEn), ...Object.keys(chaptersHi)]);

      for (const ch of allChapters) {
        merged[book][ch] = {};
        const versesEn = chaptersEn[ch] || {};
        const versesHi = chaptersHi[ch] || {};
        const allVerses = new Set([...Object.keys(versesEn), ...Object.keys(versesHi)]);

        for (const vs of allVerses) {
          merged[book][ch][vs] = {
            en: versesEn[vs] || "",
            hi: versesHi[vs] || ""
          };
        }
      }
    }

    // Fallback if files were missing
    if (Object.keys(merged).length === 0) {
      console.log('Setting fallback merged Bible using mock contents.');
      Object.entries(BIBLE_DATABASE).forEach(([book, chapters]) => {
        merged[book] = {};
        Object.entries(chapters).forEach(([ch, verses]) => {
          merged[book][ch] = {};
          Object.entries(verses).forEach(([vs, text]) => {
            merged[book][ch][vs] = {
              en: text,
              hi: ""
            };
          });
        });
      });
    }

    mergedBible = merged;
    return merged;
  }

  // Unified merged Bible route for dual language (English + Hindi)
  app.get('/api/bible', (req, res) => {
    try {
      const bible = getAndMergeBible();
      res.json(bible);
    } catch (err) {
      console.error("Failed to serve merged bible API:", err);
      res.status(500).json({ error: "Failed to load bible database." });
    }
  });

  // Multer Storage Configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file limit
  });

  // API Route: Custom Uploaded Backgrounds
  app.post('/api/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const relativeUrl = `/uploads/${req.file.filename}`;
    const lanIP = getLocalIP();
    
    // In actual local setup, prefix LAN IP so TV browser gets correct route
    const absoluteUrl = `http://${lanIP}:3000${relativeUrl}`;

    res.json({
      success: true,
      fileName: req.file.originalname,
      relativeUrl: relativeUrl,
      absoluteUrl: absoluteUrl
    });
  });

  // Active Presentation State maintained by the server
  let activeCast: any = {
    type: 'idle', // 'idle', 'verse', 'slide'
    content: null,
    background: DEFAULT_BACKGROUNDS[0], // default background
    fontSize: 32, // standard casting pt font size representation
  };

  // Socket.io Real-time Handlers
  io.on('connection', (socket) => {
    console.log(`Socket Client connected: ${socket.id}`);
    
    // Send active state immediately to new client (e.g., active TV browser)
    socket.emit('state-sync', activeCast);

    // Event: Cast Bible Verse
    socket.on('cast-verse', (data) => {
      activeCast = {
        type: 'verse',
        content: data, // { book, chapter, verse, text, translation }
        background: data.background || activeCast.background,
        fontSize: data.fontSize || activeCast.fontSize
      };
      io.emit('display-update', activeCast);
    });

    // Event: Cast Custom Slide
    socket.on('cast-slide', (data) => {
      activeCast = {
        type: 'slide',
        content: data, // { title, text, image, slideIndex, totalSlides }
        background: data.background || activeCast.background,
        fontSize: data.fontSize || activeCast.fontSize
      };
      io.emit('display-update', activeCast);
    });

    // Event: Update active background selectively
    socket.on('update-background', (bg) => {
      activeCast.background = bg;
      io.emit('display-update', activeCast);
    });

    // Event: Clear display screen
    socket.on('clear-screen', () => {
      activeCast = {
        type: 'idle',
        content: null,
        background: activeCast.background,
        fontSize: activeCast.fontSize
      };
      io.emit('display-update', activeCast);
    });

    // Request active state explicitly
    socket.on('get-state', () => {
      socket.emit('display-update', activeCast);
    });

    socket.on('disconnect', () => {
      console.log(`Socket Client disconnected: ${socket.id}`);
    });
  });

  // Mount Vite middleware in development environment to serve frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production client distribution bundle
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Bible Casting Backend Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
