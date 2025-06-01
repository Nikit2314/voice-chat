import { AudioLevel } from '../types';

// Audio analysis configuration
const SMOOTHING_FACTOR = 0.8;
const SPEAKING_THRESHOLD = 15;
const ANALYSIS_INTERVAL = 100; // ms

/**
 * Analyzes audio from a stream and calls the callback with audio level data
 */
export function setupAudioAnalyzer(
  stream: MediaStream,
  callback: (level: AudioLevel) => void
): () => void {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  
  // Configure analyzer
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = SMOOTHING_FACTOR;
  microphone.connect(analyser);
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  let previousValue = 0;
  
  // Create interval to analyze audio
  const intervalId = setInterval(() => {
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume level
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    
    // Get average and apply smoothing
    const average = sum / dataArray.length;
    const smoothedValue = previousValue * SMOOTHING_FACTOR + average * (1 - SMOOTHING_FACTOR);
    previousValue = smoothedValue;
    
    // Scale to 0-100
    const scaledValue = Math.min(100, Math.max(0, Math.round(smoothedValue * 100 / 255)));
    
    // Determine if speaking
    const isSpeaking = scaledValue > SPEAKING_THRESHOLD;
    
    callback({
      level: scaledValue,
      isSpeaking
    });
  }, ANALYSIS_INTERVAL);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    microphone.disconnect();
    audioContext.close();
  };
}

/**
 * Generates random audio wave heights for UI when no audio data is available
 */
export function generateRandomWaveform(count: number, maxHeight: number): number[] {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * maxHeight) + 1
  );
}

/**
 * Maps audio level to wave heights for visualization
 */
export function audioLevelToWaveHeights(level: number, barCount: number, maxHeight: number): number[] {
  // If no audio, return minimal heights
  if (level <= 5) {
    return Array(barCount).fill(1);
  }
  
  // Scale level to create realistic waveform
  const scaleFactor = maxHeight / 100;
  const baseHeight = Math.max(1, Math.floor(level * scaleFactor));
  
  return Array.from({ length: barCount }, () => {
    const randomVariation = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
    return Math.max(1, Math.floor(baseHeight * randomVariation));
  });
}