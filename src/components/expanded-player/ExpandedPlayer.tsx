import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { DedicatedPlayer } from './DedicatedPlayer';

interface ExpandedPlayerProps {
  onNavigate?: (route: string, param?: string) => void;
}

export const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({ onNavigate }) => {
  const { expandedPlayerOpen, setExpandedPlayerOpen } = usePlayer();
  const [shouldRender, setShouldRender] = useState(expandedPlayerOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (expandedPlayerOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender && !isClosing) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 340);
      return () => clearTimeout(timer);
    }
  }, [expandedPlayerOpen, shouldRender, isClosing]);

  const handleStartClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setExpandedPlayerOpen(false);
      setShouldRender(false);
      setIsClosing(false);
    }, 340);
  };

  if (!shouldRender) return null;

  return (
    <DedicatedPlayer
      isClosing={isClosing}
      onClose={handleStartClose}
      onNavigate={onNavigate}
    />
  );
};

export default ExpandedPlayer;
