import React from 'react';
import { DedicatedPlayer } from '../components/expanded-player/DedicatedPlayer';

interface PlayerPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const PlayerPage: React.FC<PlayerPageProps> = ({ onNavigate }) => {
  return (
    <DedicatedPlayer
      onClose={() => onNavigate('home')}
      onNavigate={onNavigate}
    />
  );
};

export default PlayerPage;
