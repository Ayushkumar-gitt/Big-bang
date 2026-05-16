import React, { useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store/useStore';

export const eras = [
  { id: 0, title: 'The Big Bang' },
  { id: 1, title: 'Cosmic Inflation & Galaxies' },
  { id: 2, title: 'Solar System Formation' },
  { id: 3, title: 'Early Earth' },
  { id: 4, title: 'Modern Earth' },
];

export const UIOverlay: React.FC = () => {
  const currentEra = useStore((state) => state.currentEra);
  const isAudioPlaying = useStore((state) => state.isAudioPlaying);
  const setIsAudioPlaying = useStore((state) => state.setIsAudioPlaying);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/audio/space.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
      {/* Top Header / Audio Controls */}
      <div className="p-6 flex justify-between items-start">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Genesis</h1>
          <p className="text-gray-400 text-sm mt-1">Scroll to journey through time</p>
        </div>

        <button
          onClick={toggleAudio}
          className="pointer-events-auto p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors text-white"
        >
          {isAudioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {/* Bottom Timeline */}
      <div className="p-6 pb-10">
        <div className="pointer-events-auto bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-white/10 max-w-4xl mx-auto">
          <div className="flex justify-between items-center relative">
            {/* Timeline Line */}
            <div className="absolute left-0 right-0 h-1 bg-white/20 top-1/2 -translate-y-1/2 rounded-full z-0" />

            {/* Active Progress Line */}
            <div
              className="absolute left-0 h-1 bg-blue-500 top-1/2 -translate-y-1/2 rounded-full z-0 transition-all duration-300"
              style={{ width: `${(currentEra / (eras.length - 1)) * 100}%` }}
            />

            {/* Era Points */}
            {eras.map((era, index) => (
              <div key={era.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    index <= currentEra
                      ? 'bg-blue-500 border-blue-300 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                      : 'bg-gray-800 border-gray-600'
                  }`}
                />
                <span className={`absolute top-6 w-32 text-center text-xs font-medium transition-colors ${
                  index <= currentEra ? 'text-white' : 'text-gray-500'
                }`}>
                  {era.title}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
             <h2 className="text-xl text-white font-light">{eras[currentEra]?.title}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
