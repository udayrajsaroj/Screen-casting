export interface Slide {
  id: string;
  title: string;
  text: string;
  subtitle?: string;
}

export interface Background {
  id: string;
  name: string;
  url: string;
  textColor: string;
  fontStyle: string;
}

export const PRESET_BACKGROUNDS: Background[] = [
  {
    id: 'glowing-cross',
    name: 'Glowing Cross',
    url: 'https://images.unsplash.com/photo-1515787366009-7cbdd2dc587b?auto=format&fit=crop&q=80&w=1200',
    textColor: 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]',
    fontStyle: 'font-serif'
  },
  {
    id: 'sabbath-dawn',
    name: 'Sabbath Dawn',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=1200',
    textColor: 'text-stone-900 drop-shadow-[0_1px_3px_rgba(255,255,255,0.7)]',
    fontStyle: 'font-sans'
  },
  {
    id: 'velvet-nocturne',
    name: 'Midnight Teal',
    url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&q=80&w=1200',
    textColor: 'text-emerald-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]',
    fontStyle: 'font-serif'
  },
  {
    id: 'golden-warmth',
    name: 'Golden Light',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    textColor: 'text-stone-900 drop-shadow-[0_1px_3px_rgba(255,255,255,0.6)]',
    fontStyle: 'font-sans'
  },
  {
    id: 'stellar-sky',
    name: 'Starry Heavens',
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200',
    textColor: 'text-sky-50 drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]',
    fontStyle: 'font-serif'
  }
];

export const MOCK_BIBLE: Record<string, Record<number, Record<number, string>>> = {
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
      105: "Thy Word is a lamp unto my feet, and a light unto my path."
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

export const MOCK_SLIDES: Slide[] = [
  {
    id: 's1',
    title: 'WELCOME TO WORSHIP',
    subtitle: 'God Is Good All The Time',
    text: 'We are so blessed and thrilled to lock eyes and lift praise as one family today. Open your hearts and feel His divine presence.'
  },
  {
    id: 's2',
    title: 'THE COVENANT GRACE',
    subtitle: 'Sermon Series',
    text: '“My grace is sufficient for you, for my strength is made perfect in weakness.” Let us dive deep into the limitless depths of unmerited favor.'
  },
  {
    id: 's3',
    title: 'ANNOUNCEMENTS',
    subtitle: 'Community Opportunities',
    text: 'Mid-week prayer and fellowship continues this Wednesday at 7:00 PM. Food bank donations and volunteer sign-ups are available in the lobby.'
  },
  {
    id: 's4',
    title: 'BENEDICTION',
    subtitle: 'Go in Peace',
    text: 'May the grace of our Lord Jesus Christ, the love of God, and the fellowship of the Holy Spirit rest and abide with you all. Amen.'
  }
];

// Production Code Templates
export const PRODUCTION_CODE = {
  termuxBackend: {
    packageJson: `{
  "name": "termux-casting-backend",
  "version": "1.0.0",
  "description": "Termux LAN Bible & Slide Media Casting Server",
  "main": "server.js",
  "type": "commonjs",
  "dependencies": {
    "express": "^4.21.2",
    "socket.io": "^4.7.5",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1"
  },
  "scripts": {
    "start": "node server.js"
  }
}`,
    serverJs: `/**
 * production-ready Node.js/Express + Socket.io Server for Termux
 * Designed for offline LAN environment with absolute static paths
 */
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const { Server } = require('socket.io');
const os = require('os');

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Enable wide open CORS for ease of local TV connect
app.use(cors({ origin: '*' }));
app.use(express.json());

// Dynamic LAN Wi-Fi IP Fetcher
function getWiFiIP() {
  const interfaces = os.networkInterfaces();
  for (const decName of Object.keys(interfaces)) {
    const list = interfaces[decName];
    for (const entry of list) {
      if (entry.family === 'IPv4' && !entry.internal) {
        // High confidence that this is your local Wi-Fi router address
        if (decName.includes('wlan') || decName.includes('wifi') || entry.address.startsWith('192.168.') || entry.address.startsWith('10.')) {
          return entry.address;
        }
      }
    }
  }
  // Generic fallback if standard interface name omitted
  for (const decName of Object.keys(interfaces)) {
    const list = interfaces[decName];
    for (const entry of list) {
      if (entry.family === 'IPv4' && !entry.internal) {
        return entry.address;
      }
    }
  }
  return '127.0.0.1';
}

const LAN_IP = getWiFiIP();
console.log(\`[Termux Engine] Detected Wi-Fi Network Address: \${LAN_IP}\`);

// Setup local folder for user uploaded media/background images
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Seed preloaded presentation backgrounds
const CORE_BACKGROUNDS = [
  { id: 'glowing-cross', name: 'Glowing Cross', url: 'https://images.unsplash.com/photo-1515787366009-7cbdd2dc587b?auto=format&fit=crop&q=80&w=1200' },
  { id: 'sabbath-dawn', name: 'Sabbath Dawn', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=1200' },
  { id: 'velvet-nocturne', name: 'Midnight Prayer', url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&q=80&w=1200' }
];

// Socket.io initialization supporting multiple displays
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Cache active display state to broadcast immediately on reconnection
let currentCastedContent = {
  type: 'idle',
  content: null,
  background: CORE_BACKGROUNDS[0],
  fontSize: 32
};

// API: Discover Status Endpoint (For Expo automated range search)
app.get('/api/info', (req, res) => {
  res.json({
    status: 'online',
    lanIP: LAN_IP,
    displayUrl: \`http://\${LAN_IP}:3000\`,
    clientCount: io.engine.clientsCount
  });
});

app.get('/api/backgrounds', (req, res) => {
  res.json(CORE_BACKGROUNDS);
});

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

// API: Handle image uploads
app.post('/api/upload', upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No media uploaded' });
  const relativeUrl = \`/uploads/\${req.file.filename}\`;
  
  // ALWAYS prepend absolute LAN IP to avoid localhost path resolution issues on remote TVs
  const absoluteUrl = \`http://\${LAN_IP}:3000\${relativeUrl}\`;
  res.json({
    success: true,
    fileName: req.file.originalname,
    relativeUrl: relativeUrl,
    absoluteUrl: absoluteUrl
  });
});

// Real-time Event Broadcaster Hub
io.on('connection', (socket) => {
  console.log(\`Display or Controller joined: \${socket.id}\`);
  
  // Immediately stream exact current state to connected display
  socket.emit('state-sync', currentCastedContent);

  socket.on('cast-verse', (data) => {
    currentCastedContent = {
      type: 'verse',
      content: data,
      background: data.background || currentCastedContent.background,
      fontSize: data.fontSize || currentCastedContent.fontSize
    };
    io.emit('display-update', currentCastedContent);
  });

  socket.on('cast-slide', (data) => {
    currentCastedContent = {
      type: 'slide',
      content: data,
      background: data.background || currentCastedContent.background,
      fontSize: data.fontSize || currentCastedContent.fontSize
    };
    io.emit('display-update', currentCastedContent);
  });

  socket.on('clear-screen', () => {
    currentCastedContent.type = 'idle';
    currentCastedContent.content = null;
    io.emit('display-update', currentCastedContent);
  });

  socket.on('disconnect', () => {
    console.log(\`Client disconnected: \${socket.id}\`);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(\`─────────────────────────────────────────────────\`);
  console.log(\`⛪ LAN BIBLE CASTING RUNNING AT TERMUX ON PORT 3000\`);
  console.log(\`📱 Display Stream URL: http://\${LAN_IP}:3000\`);
  console.log(\`─────────────────────────────────────────────────\`);
});`
  },
  expoFrontend: {
    appJson: `{
  "expo": {
    "name": "BibleCast",
    "slug": "bible-cast",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0f172a"
      },
      "usesCleartextTraffic": true,
      "package": "com.biblecast.controller"
    },
    "plugins": [
      [
        "expo-document-picker",
        {
          "iCloudContainerEnvironment": "Production"
        }
      ]
    ]
  }
}`,
    AppJs: `import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Share 
} from 'react-native';
import * as Network from 'expo-network';
import * as DocumentPicker from 'expo-document-picker';
import { io } from 'socket.io-client';

// Simple Preloaded Bible Dataset locally
const BIBLE_DATA = {
  "Psalms": {
    "23": {
      "1": "The Lord is my shepherd; I shall not want.",
      "2": "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      "3": "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      "4": "Yea, though I walk through the valley of the shadow of death, I will fear no evil..."
    }
  },
  "John": {
    "3": {
      "16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth..."
    }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('present'); // 'present' | 'bible'
  const [serverIP, setServerIP] = useState(null);
  const [status, setStatus] = useState('Disconnected'); // 'Scanning' | 'Connected' | 'Disconnected'
  const [activeBackground, setActiveBackground] = useState({ id: 'glowing-cross', name: 'Glowing Cross' });
  const [fontSize, setFontSize] = useState(36);
  
  // Bible Selector Coordinates
  const [selectedBook, setSelectedBook] = useState('Psalms');
  const [selectedChapter, setSelectedChapter] = useState('23');
  const [selectedVerse, setSelectedVerse] = useState('1');

  // Custom Presentations
  const [slides, setSlides] = useState([
    { title: "WELCOME TO CHURCH", text: "We are blessed to gather together as one family. Open your hearts." },
    { title: "THE LIFE IN CHRIST", text: "For in him we live, and move, and have our being. Acts 17:28" }
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const socketRef = useRef(null);

  // Zero-Configuration Automatic Subnet Scanner (pings all subnet ips)
  const runSubnetScanner = async () => {
    setStatus('Scanning');
    setServerIP(null);
    try {
      const info = await Network.getIpAddressAsync();
      if (!info || info === '0.0.0.0' || info === '127.0.0.1') {
        throw new Error('No valid Wi-Fi IP found. Please join a local router.');
      }
      const subnet = info.split('.').slice(0, 3).join('.');
      
      const pingPromises = [];
      for (let i = 1; i <= 254; i++) {
        const testIp = \`\${subnet}.\${i}\`;
        pingPromises.push(
          Promise.race([
            fetch(\`http://\${testIp}:3000/api/info\`)
              .then(r => r.json())
              .then(data => {
                if (data.status === 'online') return testIp;
                return null;
              })
              .catch(() => null),
            new Promise(resolve => setTimeout(() => resolve(null), 850))
          ])
        );
      }

      const results = await Promise.all(pingPromises);
      const hostFound = results.find(ip => ip !== null);

      if (hostFound) {
        setServerIP(hostFound);
        initializeSocket(hostFound);
      } else {
        setStatus('Disconnected');
        Alert.alert(
          'Backend Not Found',
          'Ensure your Termux node server is running, listening on port 3000, and connected to the same Wi-Fi router.'
        );
      }
    } catch (e) {
      setStatus('Disconnected');
      Alert.alert('Network Issue', e.message);
    }
  };

  const initializeSocket = (ip) => {
    if (socketRef.current) socketRef.current.disconnect();
    
    socketRef.current = io(\`http://\${ip}:3000\`, {
      transports: ['polling', 'websocket'],
      forceNew: true,
      timeout: 5000
    });

    socketRef.current.on('connect', () => {
      setStatus('Connected');
    });

    socketRef.current.on('disconnect', () => {
      setStatus('Disconnected');
    });
  };

  useEffect(() => {
    runSubnetScanner();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Media Pick Handler
  const handleUploadBackground = async () => {
    if (status !== 'Connected') {
      Alert.alert('Casting Locked', 'Please connect to Termux first.');
      return;
    }
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      if (res.canceled) return;
      const file = res.assets[0];

      const formData = new FormData();
      formData.append('media', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'image/jpeg'
      });

      const response = await fetch(\`http://\${serverIP}:3000/api/upload\`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        const uploadedBg = { id: Date.now().toString(), name: file.name, url: data.absoluteUrl };
        setActiveBackground(uploadedBg);
        socketRef.current.emit('update-background', uploadedBg);
        Alert.alert('Media Planted', 'Successfully uploaded and synced to TV Display.');
      }
    } catch (err) {
      Alert.alert('Upload Failed', err.message);
    }
  };

  const castBibleVerse = () => {
    if (status !== 'Connected') return;
    const book = BIBLE_DATA[selectedBook];
    const textStr = book?.[selectedChapter]?.[selectedVerse] || "Scripture placeholder text.";
    
    socketRef.current.emit('cast-verse', {
      book: selectedBook,
      chapter: selectedChapter,
      verse: selectedVerse,
      text: textStr,
      fontSize: fontSize,
      background: activeBackground
    });
  };

  const castActiveSlide = (index = activeSlideIndex) => {
    if (status !== 'Connected') return;
    const slide = slides[index];
    socketRef.current.emit('cast-slide', {
      title: slide.title,
      text: slide.text,
      slideIndex: index,
      totalSlides: slides.length,
      fontSize: fontSize,
      background: activeBackground
    });
  };

  const handleNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      const nextIndex = activeSlideIndex + 1;
      setActiveSlideIndex(nextIndex);
      castActiveSlide(nextIndex);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      const prevIndex = activeSlideIndex - 1;
      setActiveSlideIndex(prevIndex);
      castActiveSlide(prevIndex);
    }
  };

  const clearTVDisplay = () => {
    if (status !== 'Connected') return;
    socketRef.current.emit('clear-screen');
  };

  return (
    <View style={styles.container}>
      {/* Network Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>BibleCast Controller</Text>
          <View style={[styles.statusBadge, { backgroundColor: status === 'Connected' ? '#10b981' : '#ef4444' }]} />
        </View>
        <Text style={styles.subtitle}>
          {status === 'Connected' ? \`📱 Connected to \${serverIP}\` : \`📡 Status: \${status}\`}
        </Text>
        <TouchableOpacity style={styles.scanBtn} onPress={runSubnetScanner} disabled={status === 'Scanning'}>
          {status === 'Scanning' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.scanBtnText}>Auto-Scan Subnet</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs Menu */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'present' && styles.activeTab]}
          onPress={() => setActiveTab('present')}
        >
          <Text style={[styles.tabText, activeTab === 'present' && styles.activeTabText]}>Present</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bible' && styles.activeTab]}
          onPress={() => setActiveTab('bible')}
        >
          <Text style={[styles.tabText, activeTab === 'bible' && styles.activeTabText]}>Bible</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {activeTab === 'present' ? (
          <View style={styles.contentBlock}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Slide Deck Control</Text>
              <Text style={styles.slideCounter}>Slide {activeSlideIndex + 1} of {slides.length}</Text>
              
              <View style={styles.previewBox}>
                <Text style={styles.previewTitle}>{slides[activeSlideIndex]?.title}</Text>
                <Text style={styles.previewText}>{slides[activeSlideIndex]?.text}</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.controlBtn} onPress={handlePrevSlide} disabled={activeSlideIndex === 0}>
                  <Text style={styles.btnText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.controlBtn, styles.primaryBtn]} onPress={() => castActiveSlide()}>
                  <Text style={styles.btnText}>Cast Slide</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlBtn} onPress={handleNextSlide} disabled={activeSlideIndex === slides.length - 1}>
                  <Text style={styles.btnText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Cast Settings & Custom Wallpapers</Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadBackground}>
                <Text style={styles.uploadText}>+ Upload Slide BG (Multer)</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.contentBlock}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Verse Selector</Text>
              
              <View style={styles.bibleSelectorBox}>
                <Text style={styles.bibleCoordText}>Selected: {selectedBook} {selectedChapter}:{selectedVerse}</Text>
                <View style={styles.coordPickerRow}>
                  {['Psalms', 'John'].map(book => (
                    <TouchableOpacity 
                      key={book} 
                      style={[styles.pickerChip, selectedBook === book && styles.activeChip]}
                      onPress={() => {
                        setSelectedBook(book);
                        setSelectedChapter('23');
                        setSelectedVerse('1');
                      }}
                    >
                      <Text style={styles.chipText}>{book}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={[styles.controlBtn, styles.primaryBtn, { width: '100%', marginTop: 15 }]} onPress={castBibleVerse}>
                <Text style={styles.btnText}>⚡ CAST SCRIPTURE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Persistent Quick Controls */}
      <View style={styles.footerPanel}>
        <TouchableOpacity style={styles.clearBtn} onPress={clearTVDisplay}>
          <Text style={styles.clearBtnText}>🛑 BLACKOUT HIGH SCREEN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 45 },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc' },
  statusBadge: { width: 12, height: 12, borderRadius: 6 },
  subtitle: { color: '#94a3b8', marginTop: 4, fontSize: 13 },
  scanBtn: { backgroundColor: '#1e293b', padding: 8, borderRadius: 6, marginTop: 12, alignSelf: 'flex-start' },
  scanBtnText: { color: '#38bdf8', fontWeight: '500', fontSize: 12 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#38bdf8' },
  tabText: { color: '#64748b', fontWeight: 'bold' },
  activeTabText: { color: '#38bdf8' },
  scroll: { flex: 1 },
  contentBlock: { padding: 15 },
  card: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 15 },
  cardTitle: { color: '#f8fafc', fontWeight: 'bold', fontSize: 14, marginBottom: 12 },
  slideCounter: { color: '#94a3b8', fontSize: 12, marginBottom: 8 },
  previewBox: { backgroundColor: '#0f172a', padding: 12, borderRadius: 8, minHeight: 100, justifyContent: 'center' },
  previewTitle: { color: '#38bdf8', fontWeight: 'bold', fontSize: 13, marginBottom: 4 },
  previewText: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  controlBtn: { flex: 1, backgroundColor: '#334155', padding: 10, marginHorizontal: 4, borderRadius: 6, alignItems: 'center' },
  primaryBtn: { backgroundColor: '#38bdf8' },
  btnText: { color: '#f8fafc', fontWeight: 'bold', fontSize: 13 },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#475569', padding: 15, borderRadius: 8, alignItems: 'center' },
  uploadText: { color: '#94a3b8', fontSize: 12 },
  bibleSelectorBox: { borderLeftWidth: 3, borderLeftColor: '#38bdf8', paddingLeft: 10 },
  bibleCoordText: { color: '#f8fafc', fontSize: 14, fontWeight: '500' },
  coordPickerRow: { flexDirection: 'row', marginTop: 10 },
  pickerChip: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  activeChip: { backgroundColor: '#38bdf8' },
  chipText: { color: '#f8fafc', fontSize: 12 },
  footerPanel: { borderTopWidth: 1, borderTopColor: '#1e293b', padding: 15 },
  clearBtn: { backgroundColor: '#ef4444', padding: 14, borderRadius: 8, alignItems: 'center' },
  clearBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});`
  },
  tvBrowser: {
    indexHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📺 Bible & Media Live Stream Receiver</title>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      background-color: #000;
      color: #fff;
      overflow: hidden;
      font-family: 'Cinzel', 'Georgia', serif;
    }
    .background-dimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 100%);
      z-index: 1;
    }
    .bg-image-stage {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: background-image 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 0;
    }
    .content-container {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100%;
      padding: 3rem;
      text-align: center;
    }
  </style>
</head>
<body class="relative min-h-screen select-none">

  <!-- Background Wallpaper Container -->
  <div id="backdrop" class="bg-image-stage" style="background-image: url('https://images.unsplash.com/photo-1544764200-d834fd210a23?auto=format&fit=crop&q=80&w=1200')"></div>
  <div class="background-dimmer"></div>

  <!-- Fullscreen Toggle Button -->
  <button id="fullscreenBtn" class="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur border border-white/20 hover:bg-black/80 px-4 py-2 rounded-full text-xs text-white uppercase tracking-widest font-sans transition pointer-events-auto">
    📺 Toggle Fullscreen
  </button>

  <!-- Realtime Content Main Area -->
  <main class="content-container">
    <div id="stage-idle" class="flex flex-col items-center justify-center transition-all duration-700 animate-pulse">
      <h2 class="text-3xl text-sky-400 font-bold uppercase tracking-[0.25em] font-sans">STREAMS STANDBY</h2>
      <p class="text-sm text-neutral-400 mt-2 font-sans">Ready to receive live inputs from wlan remote controllers...</p>
    </div>

    <!-- Active Bible & Slides Presentation Container -->
    <div id="stage-active" class="hidden max-w-5xl flex flex-col items-center transition-all duration-1000 transform opacity-0 scale-95">
      <div id="verse-card" class="hidden flex flex-col items-center justify-center">
        <p id="verse-text" class="text-4xl md:text-5xl lg:text-6xl text-center leading-relaxed font-serif tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"></p>
        <span id="verse-coord" class="text-xl md:text-2xl mt-10 text-amber-400 font-sans uppercase tracking-[0.2em] bg-black/40 px-6 py-2 rounded-md"></span>
      </div>

      <div id="slide-card" class="hidden flex flex-col items-center justify-center">
        <span id="slide-sub" class="text-lg md:text-xl text-emerald-400 uppercase tracking-[0.25em] font-sans bg-black/20 px-4 py-1.5 rounded-full mb-6"></span>
        <h1 id="slide-main" class="text-5xl md:text-6xl lg:text-7xl font-sans font-black uppercase text-center leading-tight tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"></h1>
        <p id="slide-desc" class="text-xl md:text-2xl text-neutral-200 text-center max-w-4xl mt-8 leading-relaxed font-sans"></p>
      </div>
    </div>
  </main>

  <!-- Integration Client Script -->
  <script>
    // 1. WebSocket Auto Connection pointing to hosting address
    const socket = io(window.location.origin || 'http://localhost:3000');

    const backdrop = document.getElementById('backdrop');
    const stageIdle = document.getElementById('stage-idle');
    const stageActive = document.getElementById('stage-active');
    const verseCard = document.getElementById('verse-card');
    const slideCard = document.getElementById('slide-card');

    const verseText = document.getElementById('verse-text');
    const verseCoord = document.getElementById('verse-coord');
    
    const slideSub = document.getElementById('slide-sub');
    const slideMain = document.getElementById('slide-main');
    const slideDesc = document.getElementById('slide-desc');

    // UI State renderer function
    function updateDisplay(state) {
      if (!state || state.type === 'idle') {
        stageActive.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
          stageActive.classList.add('hidden');
          stageIdle.classList.remove('hidden');
        }, 500);
        return;
      }

      // Sync active background picture
      if (state.background && state.background.url) {
        backdrop.style.backgroundImage = \`url('\${state.background.url}')\`;
      }

      // Transitions
      stageIdle.classList.add('hidden');
      stageActive.classList.remove('hidden');
      
      // Clear secondary structures
      verseCard.classList.add('hidden');
      slideCard.classList.add('hidden');

      setTimeout(() => {
        stageActive.classList.add('opacity-100', 'scale-100');
        stageActive.classList.remove('opacity-0', 'scale-95');
      }, 50);

      if (state.type === 'verse') {
        verseCard.classList.remove('hidden');
        verseText.innerHTML = \`“\${state.content.text}”\`;
        verseCoord.innerText = \`\${state.content.book} \${state.content.chapter}:\${state.content.verse}\`;
        
        // Adjust variable size representation
        verseText.className = \`text-4xl md:text-5xl lg:text-6xl text-center leading-relaxed font-serif tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]\`;
      } else if (state.type === 'slide') {
        slideCard.classList.remove('hidden');
        slideMain.innerText = state.content.title;
        slideSub.innerText = state.content.subtitle || "PRESENTATION";
        slideDesc.innerText = state.content.text;
      }
    }

    socket.on('state-sync', (data) => {
      updateDisplay(data);
    });

    socket.on('display-update', (data) => {
      updateDisplay(data);
    });

    // Fullscreens Toggle API
    document.getElementById('fullscreenBtn').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .catch(err => alert(\`Fullscreen active locks: \${err.message}\`));
      } else {
        document.exitFullscreen();
      }
    });
  </script>
</body>
</html>`
  }
};
