/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Heart, 
  Sword, 
  Save, 
  MessageSquare, 
  Music as MusicIcon,
  ExternalLink,
  PlusCircle,
  MapPin,
  X
} from 'lucide-react';

// --- Constants & Data ---

// INSTRUCCIONES PARA MÚSICA:
// 1. Pon tus archivos .mp3 en la carpeta 'public' de tu proyecto.
// 2. Cambia el 'url' de abajo por '/tu-archivo.mp3'.
const PLAYLIST = [
  { title: "Deltarune - My Castle Town", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Undertale - Fallen Down", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Deltarune - Field of Hopes and Dreams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Undertale - Memory", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "Deltarune - Don't Forget", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
];

const PLATFORMS = [
  { name: 'PURP', date: 'El Comienzo', icon: 'P' },
  { name: 'INSTAGRAM', date: 'Primeros Pasos', icon: 'I' },
  { name: 'WHATSAPP', date: 'Vínculo Diario', icon: 'W' },
  { name: 'CANVA', date: 'Creatividad', icon: 'C' },
  { name: 'TIKTOK', date: 'Risas Juntos', icon: 'T' },
  { name: 'DISCORD', date: 'Noches de Chat', icon: 'D' },
  { name: 'ROBLOX', date: 'Aventuras', icon: 'R' },
];

// --- Components ---

const LoadingScreen = ({ onStart }: { onStart: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-[10px] text-ut-cyan mb-4 uppercase">Nexus_Core_OS</h1>
        <div className="text-xl text-white/60 font-sans tracking-widest">Regalo Especial</div>
      </motion.div>

      <div className="w-full max-w-md h-8 border-4 border-white p-1 mb-8">
        <motion.div 
          className="h-full bg-ut-yellow"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-2xl mb-12 h-8">
        {progress < 100 ? (
          <Typewriter text={`Loading assets... ${Math.floor(progress)}%`} speed={30} />
        ) : (
          <span className="text-ut-green">SYSTEM_READY</span>
        )}
      </div>

      <AnimatePresence>
        {isLoaded && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onStart}
            className="px-12 py-4 border-4 border-white hover:border-ut-orange hover:text-ut-orange transition-colors text-3xl font-bold uppercase tracking-[5px]"
          >
            [ Start ]
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const starCount = 400;
    const stars = Array(starCount).fill(null).map(() => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
      size: Math.random() * 2 + 1
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      stars.forEach(s => {
        s.z -= 0.002;
        if (s.z <= 0) s.z = 1;

        const x = cx + (s.x / s.z) * cx;
        const y = cy + (s.y / s.z) * cy;
        const size = (1 - s.z) * s.size;

        if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
          ctx.fillStyle = `rgba(255, 255, 255, ${1 - s.z})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="stars-canvas" ref={canvasRef} />;
};

const Typewriter = ({ text, speed = 50, onComplete }: { text: string; speed?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text.charAt(index));
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <span className="typewriter-cursor">{displayedText}</span>;
};

const AudioHUD = ({ 
  isPlaying, 
  togglePlay, 
  currentTrackIndex, 
  nextTrack, 
  prevTrack 
}: { 
  isPlaying: boolean; 
  togglePlay: () => void;
  currentTrackIndex: number;
  nextTrack: () => void;
  prevTrack: () => void;
}) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-center bg-black/80 border-2 border-ut-cyan p-3 rounded shadow-[0_0_15px_rgba(0,242,255,0.3)] min-w-[200px]">
      <div className="text-[10px] text-ut-cyan mb-1 tracking-[2px] font-sans uppercase">Audio_System</div>
      <div className="text-[10px] text-white/60 mb-2 truncate max-w-[180px] font-sans">{PLAYLIST[currentTrackIndex].title}</div>
      <div className="flex gap-6">
        <button onClick={prevTrack} className="text-white hover:text-ut-yellow transition-colors cursor-pointer"><SkipBack size={18} /></button>
        <button onClick={togglePlay} className="text-white hover:text-ut-yellow transition-colors cursor-pointer">
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={nextTrack} className="text-white hover:text-ut-yellow transition-colors cursor-pointer"><SkipForward size={18} /></button>
      </div>
    </div>
  );
};

// --- Sections ---

const HomeSection = () => {
  const [showBubble, setShowBubble] = useState<'nath' | 'yugo' | null>(null);

  // --- RECURSOS GRÁFICOS ---
  // Para cambiar las imágenes, busca las etiquetas <img> y cambia el atributo 'src'
  // por el enlace de tu imagen o la ruta local si estás en VS Code.
  
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.15) setShowBubble('nath');
      else if (rand < 0.3) setShowBubble('yugo');
      else setShowBubble(null);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-full pt-4 md:pt-12 gap-8 overflow-y-auto custom-scrollbar pb-8">
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center shrink-0">
        {/* Pixel Planet */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/2/22/Earth_Western_Hemisphere_transparent_background.png" 
            alt="Pixel Earth" 
            className="w-full h-full object-contain pixel-img opacity-90 drop-shadow-[0_0_40px_rgba(0,242,255,0.5)]"
            referrerPolicy="no-referrer"
          />
          
          {/* Mexico Marker */}
          <div className="absolute top-[35%] left-[30%] group">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <MapPin className="text-ut-red" size={24} />
            </motion.div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block bg-black border border-white p-1 text-xs whitespace-nowrap z-20">México (Yugo)</div>
          </div>

          {/* Bolivia Marker */}
          <div className="absolute bottom-[35%] left-[45%] group">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <MapPin className="text-ut-green" size={24} />
            </motion.div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block bg-black border border-white p-1 text-xs whitespace-nowrap z-20">Bolivia (Nath)</div>
          </div>
        </motion.div>

        {/* Orbiting Avatars */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[150%] h-[150%] border-2 border-dashed border-ut-cyan/10 rounded-full pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-white bg-black overflow-hidden shadow-[0_0_30px_rgba(255,0,127,0.4)] pointer-events-auto">
            <img src="https://picsum.photos/seed/nath/200" alt="Nath" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <AnimatePresence>
              {showBubble === 'nath' && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 10 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-2xl text-lg font-bold shadow-xl border-2 border-black whitespace-nowrap"
                >
                  Yuuugoo!
                  <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white bg-black overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.4)] pointer-events-auto">
            <img src="https://picsum.photos/seed/yugo/200" alt="Yugo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <AnimatePresence>
              {showBubble === 'yugo' && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: -10 }}
                  className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-2xl text-lg font-bold shadow-xl border-2 border-black whitespace-nowrap"
                >
                  Naaath!
                  <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-t-2 border-black rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-3xl mb-4 md:mb-12">
        <div className="rpg-border p-4 md:p-8 w-full bg-black/90 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <div className="text-lg md:text-2xl leading-relaxed font-pixel">
            <span className="text-ut-yellow mr-4 text-2xl md:text-3xl">*</span>
            <Typewriter text="Ni la distancia (5,742 km) o el tiempo nos separará porque realmente eres muy especial. Iniciando conexión Bolivia <-> México..." speed={40} />
          </div>
        </div>
        <motion.h1 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-ut-red via-ut-pink to-ut-purple drop-shadow-[0_0_10px_rgba(255,0,127,0.3)]"
        >
          STAY DETERMINED
        </motion.h1>
      </div>
    </div>
  );
};

const GallerySection = () => {
  const [isTvOn, setIsTvOn] = useState(true);
  const [currentMemory, setCurrentMemory] = useState(0);

  // INSTRUCCIONES PARA FOTOS DE LA TV:
  // Cambia estos enlaces por los nombres de tus fotos en la carpeta 'public'
  // Ejemplo: "/foto1.jpg", "/foto2.png"
  const memories = [
    "https://picsum.photos/seed/mem1/600/400",
    "https://picsum.photos/seed/mem2/600/400",
    "https://picsum.photos/seed/mem3/600/400",
    "https://picsum.photos/seed/mem4/600/400",
  ];

  useEffect(() => {
    if (!isTvOn) return;
    const interval = setInterval(() => {
      setCurrentMemory(prev => (prev + 1) % memories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isTvOn]);

  return (
    <div className="flex flex-col items-center justify-start h-full gap-8 w-full max-w-6xl pt-4 md:pt-8 overflow-y-auto custom-scrollbar pb-12">
      {/* TV Show Header */}
      <div className="w-full flex flex-col items-center mb-4 shrink-0">
        <motion.h2 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl md:text-6xl font-bold tracking-[8px] md:tracking-[15px] text-ut-cyan uppercase drop-shadow-[0_0_15px_rgba(0,242,255,0.5)] mb-2 md:mb-4 font-pixel text-center"
        >
          IT'S TV TIME!
        </motion.h2>
        <div className="text-sm md:text-xl text-white/40 tracking-[3px] md:tracking-[5px] uppercase text-center px-4">Nuestra Historia en Pantalla</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center justify-center w-full px-4 md:px-8">
        {/* TV Frame */}
        <div className="relative w-full max-w-[500px] lg:max-w-[650px] aspect-[4/3] bg-[#1a1a1a] border-[10px] md:border-[16px] border-[#333] rounded-[30px] md:rounded-[50px] p-3 md:p-6 shadow-2xl shrink-0">
          <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden border-8 border-black shadow-inner">
            <AnimatePresence mode="wait">
              {isTvOn ? (
                <motion.div
                  key={currentMemory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <div className="absolute inset-0 tv-static pointer-events-none z-10 opacity-10" />
                  <img 
                    src={memories[currentMemory]} 
                    alt="Memory" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 text-xs border border-white/20">MEM_REC_0{currentMemory + 1}</div>
                </motion.div>
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {/* TV Controls */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-10">
            <button 
              onClick={() => setIsTvOn(!isTvOn)}
              className={`w-14 h-14 rounded-full border-4 shadow-lg transition-all flex items-center justify-center ${isTvOn ? 'bg-ut-red border-ut-red/50' : 'bg-gray-800 border-gray-700'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full opacity-50" />
            </button>
            <div className="w-14 h-14 rounded-full bg-[#222] border-4 border-[#444] shadow-inner flex flex-col items-center justify-center gap-1">
              <div className="w-8 h-1 bg-black/40 rounded" />
              <div className="w-8 h-1 bg-black/40 rounded" />
            </div>
          </div>
        </div>

        {/* Intro Message */}
        <div className="max-w-md">
          <div className="rpg-border p-8 bg-black/80">
            <div className="text-2xl leading-relaxed italic">
              <span className="text-ut-yellow mr-4">*</span>
              "Y pensar que todo comenzó con una solicitud... de Purp a Roblox, cada paso ha sido especial. Mira lo lejos que hemos llegado."
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline */}
      <div className="w-full mt-12 px-8">
        <h3 className="text-3xl font-bold text-ut-cyan mb-12 uppercase tracking-[8px] text-center">Nuestra Trayectoria</h3>
        <div className="timeline-container">
          <div className="timeline-track" />
          <motion.div 
            className="timeline-progress" 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 2 }}
          />
          {PLATFORMS.map((p, i) => (
            <div key={i} className="timeline-node">
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="timeline-dot"
              />
              <div className="flex flex-col items-center gap-1 mt-4">
                <div className="w-12 h-12 bg-white/10 border-2 border-ut-cyan flex items-center justify-center font-bold text-xl text-ut-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]">
                  {p.icon}
                </div>
                <div className="font-bold text-sm uppercase tracking-widest">{p.name}</div>
                <div className="text-[10px] text-white/40">{p.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MessagesSection = () => {
  const [showCards, setShowCards] = useState(false);
  const [showConvos, setShowConvos] = useState(false);
  
  // --- RECURSOS GRÁFICOS ---
  // Cambia el enlace en la etiqueta <img> de abajo para poner tu propio GIF.
  
  const cards = [
    { title: "Vínculo Eterno", desc: "Esta carta no puede ser destruida por efectos de distancia.", color: "border-ut-yellow" },
    { title: "Programador Maestro", desc: "Aumenta el ATK de todos los proyectos en 1000.", color: "border-ut-cyan" },
    { title: "Corazón de México", desc: "Envía un abrazo cálido que atraviesa fronteras.", color: "border-ut-pink" },
    { title: "Deseo de Bolivia", desc: "Invoca un mensaje de voz que cura 500 LP.", color: "border-ut-green" },
  ];

  const convos = [
    { from: "Yugo", text: "¡Hola! Me encantó tu perfil de Purp, ¿jugamos Roblox?" },
    { from: "Nath", text: "¡Claro! Pásame tu user y te agrego ahora mismo :)" },
    { from: "Yugo", text: "Eres la persona más increíble que he conocido, de verdad." },
    { from: "Nath", text: "Y tú eres mi programador favorito, te quiero muchísimo." },
  ];

  return (
    <div className="flex flex-col items-center justify-start h-full gap-8 w-full max-w-6xl pt-4 overflow-y-auto custom-scrollbar pb-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full px-4">
        {/* Large GIF Side */}
        <div className="w-full lg:w-[50%] h-[300px] md:h-[450px] lg:h-[550px] rpg-border overflow-hidden relative shrink-0">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJ6bXJ6bXJ6bXJ6bXJ6bXJ6bXJ6bXJ6bXJ6bXJ6bXJ6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif" 
            alt="Main GIF" 
            className="w-full h-full object-cover pixel-img opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4">
            <button 
              onClick={() => setShowCards(true)}
              className="w-full py-4 bg-ut-orange hover:bg-ut-red text-black font-bold text-2xl uppercase tracking-[5px] transition-all shadow-[0_6px_0_#800] active:translate-y-1 active:shadow-none"
            >
              [ Ver Cartas ]
            </button>
            <button 
              onClick={() => setShowConvos(true)}
              className="w-full py-4 bg-ut-cyan hover:bg-ut-blue text-black font-bold text-2xl uppercase tracking-[5px] transition-all shadow-[0_6px_0_#008] active:translate-y-1 active:shadow-none"
            >
              [ Conversaciones ]
            </button>
          </div>
        </div>

        {/* Messages Side */}
        <div className="flex-grow flex flex-col gap-6 w-full">
          <h3 className="text-3xl font-bold text-ut-pink mb-2 uppercase tracking-[8px] border-b-4 border-ut-pink/30 pb-4">Mensajes del Nexo</h3>
          <div className="flex flex-col gap-6">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="rpg-border p-6 bg-black/80">
              <div className="flex gap-4">
                <span className="text-ut-cyan font-bold text-2xl">Y:</span>
                <div className="text-xl leading-relaxed">"Gracias por cada partida de Roblox... Bolivia y México nunca estuvieron tan cerca. Eres mi programador favorito."</div>
              </div>
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="rpg-border p-6 bg-black/80 border-ut-pink">
              <div className="flex gap-4 flex-row-reverse">
                <span className="text-ut-pink font-bold text-2xl">:N</span>
                <div className="text-xl leading-relaxed text-right">"No olvides que no estás solo. Siempre estaré aquí para apoyarte en cada línea de código y en cada sueño."</div>
              </div>
            </motion.div>
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="rpg-border p-6 bg-black/80">
              <div className="flex gap-4">
                <span className="text-ut-cyan font-bold text-2xl">Y:</span>
                <div className="text-xl leading-relaxed">"Eres la mejor parte de mi día. No importa la distancia, mi corazón está contigo."</div>
              </div>
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="rpg-border p-6 bg-black/80 border-ut-pink">
              <div className="flex gap-4 flex-row-reverse">
                <span className="text-ut-pink font-bold text-2xl">:N</span>
                <div className="text-xl leading-relaxed text-right">"Nuestra historia apenas comienza. Stay determined, mi amor."</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cards Modal */}
      <AnimatePresence>
        {showCards && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-12"
          >
            <button onClick={() => setShowCards(false)} className="absolute top-8 right-8 text-white hover:text-ut-red transition-colors"><X size={64} /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
              {cards.map((card, i) => (
                <motion.div key={i} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.1, rotate: 2 }} className="ygo-card w-40 h-60 md:w-48 md:h-72">
                  <div className={`h-24 md:h-32 bg-gray-900 mb-2 border-2 ${card.color} flex items-center justify-center`}>
                    <Heart className={card.color.replace('border-', 'text-')} size={24} />
                  </div>
                  <h4 className="text-sm md:text-lg font-bold mb-1 text-black">{card.title}</h4>
                  <p className="text-[8px] md:text-[10px] text-black/80 leading-tight font-sans">{card.desc}</p>
                  <div className="absolute bottom-2 right-2 text-[6px] md:text-[8px] text-black/40 font-sans">ATK/2500 DEF/2100</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convos Modal */}
      <AnimatePresence>
        {showConvos && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-12"
          >
            <button onClick={() => setShowConvos(false)} className="absolute top-8 right-8 text-white hover:text-ut-red transition-colors"><X size={64} /></button>
            <div className="w-full max-w-2xl flex flex-col gap-6">
              <h2 className="text-4xl font-bold text-ut-cyan mb-8 text-center uppercase tracking-[10px]">Conversaciones Destacadas</h2>
              {convos.map((c, i) => (
                <motion.div key={i} initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} className={`rpg-border p-4 ${c.from === 'Nath' ? 'border-ut-pink self-end' : 'border-ut-cyan self-start'} max-w-[80%]`}>
                  <div className="font-bold mb-1 text-sm uppercase opacity-60">{c.from}</div>
                  <div className="text-lg">{c.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MusicSection = () => {
  const videos = [
    { id: "dQw4w9WgXcQ", title: "Video Especial 1" },
    { id: "3JZ_D3ELwOQ", title: "Video Especial 2" },
    { id: "9bZkp7q19f0", title: "Video Especial 3" },
    { id: "L_jWHffIx5E", title: "Video Especial 4" },
    { id: "fJ9rUzIMcZQ", title: "Video Especial 5" },
    { id: "YQHsXMglC9A", title: "Video Especial 6" },
  ];

  return (
    <div className="flex flex-col items-center justify-start h-full gap-8 w-full max-w-6xl pt-4 overflow-y-auto custom-scrollbar pb-12">
      <h2 className="text-4xl text-ut-cyan tracking-[8px] uppercase font-bold mb-4">Soundtrack_Selection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
        {videos.map((v, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rpg-border p-3 flex flex-col gap-3 bg-black/60"
          >
            <div className="aspect-video bg-black overflow-hidden border-2 border-ut-cyan shadow-[0_0_15px_rgba(0,242,255,0.2)]">
              <iframe src={`https://www.youtube.com/embed/${v.id}`} className="w-full h-full" allowFullScreen />
            </div>
            <div className="text-sm truncate font-bold uppercase tracking-widest">{v.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full px-4 mt-8">
        <div className="rpg-border p-8 bg-gradient-to-br from-ut-purple/20 to-black flex flex-col gap-6">
          <h3 className="text-2xl font-bold uppercase tracking-widest text-ut-purple">Enlaces del Nexo</h3>
          <div className="flex flex-col gap-4">
            <a href="https://www.youtube.com/playlist?list=PLcqFkBb7HpigRo3UICsPgikYAFFSF1gQt" target="_blank" className="flex items-center gap-4 text-xl text-ut-cyan hover:text-ut-yellow transition-all hover:translate-x-2">
              <ExternalLink size={24} /> Ver Playlist Completa
            </a>
            <a href="https://www.youtube.com/playlist?list=PLcqFkBb7HpigRo3UICsPgikYAFFSF1gQt&jct=4t66UjsZ3tVkGjR9JJxEhg" target="_blank" className="flex items-center gap-4 text-xl text-ut-purple hover:text-ut-pink transition-all hover:translate-x-2">
              <PlusCircle size={24} /> Colaborar en la Playlist
            </a>
          </div>
        </div>

        <div className="rpg-border p-8 border-ut-yellow flex flex-col gap-6 bg-black/60">
          <div className="flex items-center gap-4">
            <Volume2 className="text-ut-yellow" size={32} />
            <span className="text-ut-yellow font-bold tracking-[5px] uppercase text-2xl">Voz_Nexo.WAV</span>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 p-4 rounded border-2 border-ut-yellow/30">
              <div className="text-sm mb-2 text-ut-yellow font-bold uppercase">Audio_Especial_01.mp3</div>
              {/* CAMBIA EL SRC DE ABAJO POR TU ARCHIVO DE VOZ */}
              <audio controls className="w-full h-10 accent-ut-yellow">
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
              </audio>
            </div>
            <div className="bg-gray-900 p-4 rounded border-2 border-ut-yellow/30">
              <div className="text-sm mb-2 text-ut-yellow font-bold uppercase">Audio_Especial_02.mp3</div>
              {/* CAMBIA EL SRC DE ABAJO POR TU ARCHIVO DE VOZ */}
              <audio controls className="w-full h-10 accent-ut-yellow">
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('fight');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIndex]);

  if (!isStarted) {
    return <LoadingScreen onStart={() => setIsStarted(true)} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col">
      <StarBackground />
      <div className="glitch-overlay" />
      
      {/* Global Audio */}
      <audio 
        ref={audioRef} 
        src={PLAYLIST[currentTrackIndex].url} 
        onEnded={nextTrack}
      />

      <AudioHUD 
        isPlaying={isPlaying} 
        togglePlay={togglePlay} 
        currentTrackIndex={currentTrackIndex}
        nextTrack={nextTrack}
        prevTrack={prevTrack}
      />

      {/* Main Viewport */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-12 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full min-h-0"
          >
            {activeTab === 'fight' && <HomeSection />}
            {activeTab === 'save' && <GallerySection />}
            {activeTab === 'act' && <MessagesSection />}
            {activeTab === 'mercy' && <MusicSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="h-24 md:h-32 flex items-center justify-center gap-4 md:gap-8 bg-black/95 border-t-4 border-white/10 px-4 md:px-12 z-50 shrink-0">
        <button 
          onClick={() => setActiveTab('fight')}
          className={`menu-btn text-lg md:text-2xl px-4 md:px-6 py-2 md:py-3 ${activeTab === 'fight' ? 'active' : ''}`}
        >
          <Sword className="text-ut-orange w-5 h-5 md:w-6 md:h-6" />
          <span>Fight</span>
        </button>
        <button 
          onClick={() => setActiveTab('act')}
          className={`menu-btn text-lg md:text-2xl px-4 md:px-6 py-2 md:py-3 ${activeTab === 'act' ? 'active' : ''}`}
        >
          <MessageSquare className="text-ut-orange w-5 h-5 md:w-6 md:h-6" />
          <span>Act</span>
        </button>
        <button 
          onClick={() => setActiveTab('save')}
          className={`menu-btn text-lg md:text-2xl px-4 md:px-6 py-2 md:py-3 ${activeTab === 'save' ? 'active' : ''}`}
        >
          <Save className="text-ut-orange w-5 h-5 md:w-6 md:h-6" />
          <span>Save</span>
        </button>
        <button 
          onClick={() => setActiveTab('mercy')}
          className={`menu-btn text-lg md:text-2xl px-4 md:px-6 py-2 md:py-3 ${activeTab === 'mercy' ? 'active' : ''}`}
        >
          <MusicIcon className="text-ut-orange w-5 h-5 md:w-6 md:h-6" />
          <span>Mercy</span>
        </button>
      </nav>

      {/* Decorative Hearts/Stars */}
      <div className="fixed top-4 left-4 flex gap-2 opacity-30">
        <div className="pixel-heart animate-pulse" />
        <div className="pixel-star animate-bounce" />
        <div className="pixel-heart animate-pulse delay-75" />
      </div>
      <div className="fixed bottom-36 right-4 flex gap-2 opacity-30">
        <div className="pixel-star animate-bounce" />
        <div className="pixel-heart animate-pulse" />
      </div>

      {/* Footer Brand */}
      <div className="fixed bottom-4 left-6 text-xs text-gray-600 font-sans tracking-widest uppercase">
        Regalo Especial // Nexus-Core
      </div>
    </div>
  );
}
