export interface VideoError {
  url: string;
  error: string;
  details?: {
    error: string;
    networkState: number;
    readyState: number;
    currentSrc: string;
    videoWidth: number;
    videoHeight: number;
    buffered: { start: number; end: number } | null;
    paused: boolean;
    seeking: boolean;
    duration: number;
    muted: boolean;
  };
} 