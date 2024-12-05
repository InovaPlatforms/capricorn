export interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  duration: number;
  s3Key?: string;
  bucket: string;
}

export interface Playlist {
  title: string;
  items: Track[];
}

export interface MusicBucket {
  id: string;
  name: string;
  image: string;
  artistId: string;
} 