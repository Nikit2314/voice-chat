import React, { useState } from 'react';
import { Mic, Play } from 'lucide-react';
import { Button } from './ui/Button';
import { useAudioStore } from '../store/useAudioStore';
import { socketService } from '../services/socketService';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setLocalStream } = useAudioStore();
  const { t } = useTranslation();
  
  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Сначала проверяем подключение к сокету
      await socketService.connect(username.trim() || null);
      
      // Затем запрашиваем доступ к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false
      });
      
      setLocalStream(stream);
      onComplete();
    } catch (err: any) {
      console.error('Error during setup:', err);
      
      if (err.name === 'NotAllowedError') {
        setError(t('errors.micPermission'));
      } else if (err.message === 'connect_error') {
        setError(t('errors.connectionFailed'));
      } else {
        setError(err.message || t('errors.generic'));
      }
      
      setLocalStream(null);
      // Отключаемся от сокета в случае ошибки
      socketService.disconnect();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-md p-8">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <Mic className="h-12 w-12 text-primary-600 dark:text-primary-300" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">{t('welcome.title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {t('welcome.description')}
        </p>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder={t('welcome.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            maxLength={20}
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-md bg-error-500/10 text-error-600 dark:text-error-500 text-sm">
            {error}
          </div>
        )}
        
        <Button 
          onClick={handleStart} 
          isLoading={isLoading}
          className="w-full"
          disabled={isLoading}
        >
          <Play className="mr-2 h-4 w-4" />
          {isLoading ? t('welcome.connecting') : t('welcome.start')}
        </Button>
        
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-500">
          {t('welcome.terms')}
        </p>
      </div>
    </div>
  );
};