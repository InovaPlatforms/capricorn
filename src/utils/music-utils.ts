export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
}

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getNextTrackIndex = (
  currentIndex: number,
  totalTracks: number,
  isShuffled: boolean,
  shuffledIndices?: number[]
): number => {
  if (isShuffled && shuffledIndices) {
    const currentShuffledIndex = shuffledIndices.indexOf(currentIndex);
    return shuffledIndices[(currentShuffledIndex + 1) % totalTracks];
  }
  return (currentIndex + 1) % totalTracks;
};

export const getPreviousTrackIndex = (
  currentIndex: number,
  totalTracks: number,
  isShuffled: boolean,
  shuffledIndices?: number[]
): number => {
  if (isShuffled && shuffledIndices) {
    const currentShuffledIndex = shuffledIndices.indexOf(currentIndex);
    return shuffledIndices[
      (currentShuffledIndex - 1 + totalTracks) % totalTracks
    ];
  }
  return (currentIndex - 1 + totalTracks) % totalTracks;
}; 