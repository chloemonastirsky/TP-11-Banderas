import { useContext } from 'react';
import { GameContext } from '../components/GameContext';

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame debe ser utilizado dentro de un GameProvider');
  }

  return context;
};