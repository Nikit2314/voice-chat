import React, { useEffect, useState } from 'react';
import { audioLevelToWaveHeights, generateRandomWaveform } from '../../utils/audioUtils';
import { AudioLevel } from '../../types';

interface AudioWaveformProps {
  audioLevel: AudioLevel;
  barCount?: number;
  maxHeight?: number;
  className?: string;
  barClassName?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioLevel,
  barCount = 5,
  maxHeight = 16,
  className = '',
  barClassName = ''
}) => {
  const [heights, setHeights] = useState<number[]>([]);
  
  // Update heights based on audio level
  useEffect(() => {
    if (audioLevel.isSpeaking) {
      // Use actual audio level for heights when speaking
      setHeights(audioLevelToWaveHeights(audioLevel.level, barCount, maxHeight));
    } else {
      // Use small random values when not speaking
      setHeights(Array(barCount).fill(1).map(() => Math.floor(Math.random() * 3) + 1));
    }
  }, [audioLevel, barCount, maxHeight]);
  
  return (
    <div className={`audio-wave-container ${className}`}>
      {heights.map((height, index) => (
        <div
          key={index}
          className={`audio-wave-bar ${barClassName}`}
          style={{ 
            height: `${height / maxHeight * 100}%`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};