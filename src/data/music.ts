import { artists } from './artists';
import { MusicBucket } from '@/types/music';

export const musicBuckets: MusicBucket[] = [
  { 
    id: '1-syb-new', 
    name: 'SYB',
    image: artists.find(a => a.name === 'SYB')?.image || '',
    artistId: artists.find(a => a.name === 'SYB')?.id || ''
  },
  { 
    id: '10-house-new', 
    name: 'House',
    image: artists.find(a => a.name === 'House')?.image || '',
    artistId: artists.find(a => a.name === 'House')?.id || ''
  },
  { 
    id: '11-pophouse-new', 
    name: 'Pop House',
    image: artists.find(a => a.name === 'Pop House')?.image || '',
    artistId: artists.find(a => a.name === 'Pop House')?.id || ''
  },
  { 
    id: '12-disco', 
    name: 'Disco',
    image: artists.find(a => a.name === 'Disco')?.image || '',
    artistId: artists.find(a => a.name === 'Disco')?.id || ''
  },
  { 
    id: '14-california', 
    name: 'California',
    image: artists.find(a => a.name === 'California')?.image || '',
    artistId: artists.find(a => a.name === 'California')?.id || ''
  },
  { 
    id: '15-aqua', 
    name: 'Aqua',
    image: artists.find(a => a.name === 'Aqua')?.image || '',
    artistId: artists.find(a => a.name === 'Aqua')?.id || ''
  },
  { 
    id: '16-samurai', 
    name: 'Samurai',
    image: artists.find(a => a.name === 'Samurai')?.image || '',
    artistId: artists.find(a => a.name === 'Samurai')?.id || ''
  },
  { 
    id: '17-kazukinozomi', 
    name: 'Kazuki Nozomi',
    image: artists.find(a => a.name === 'Kazuki Nozomi')?.image || '',
    artistId: artists.find(a => a.name === 'Kazuki Nozomi')?.id || ''
  },
  { 
    id: '18-apollo', 
    name: 'Apollo',
    image: artists.find(a => a.name === 'Apollo')?.image || '',
    artistId: artists.find(a => a.name === 'Apollo')?.id || ''
  },
  { 
    id: '2-musicmixes-new', 
    name: 'Music Mixes',
    image: artists.find(a => a.name === 'Music Mixes')?.image || '',
    artistId: artists.find(a => a.name === 'Music Mixes')?.id || ''
  },
  { 
    id: '20-hathor', 
    name: 'Hathor',
    image: artists.find(a => a.name === 'Hathor')?.image || '',
    artistId: artists.find(a => a.name === 'Hathor')?.id || ''
  },
  { 
    id: '21-cybersound-syndicate', 
    name: 'Cybersound Syndicate',
    image: artists.find(a => a.name === 'Cybersound Syndicate')?.image || '',
    artistId: artists.find(a => a.name === 'Cybersound Syndicate')?.id || ''
  },
  { 
    id: '22-cyberpunk-pirate', 
    name: 'Cyberpunk Pirate',
    image: artists.find(a => a.name === 'Cyberpunk Pirate')?.image || '',
    artistId: artists.find(a => a.name === 'Cyberpunk Pirate')?.id || ''
  },
  { 
    id: '23-bioluminescent', 
    name: 'Bioluminescent',
    image: artists.find(a => a.name === 'Bioluminescent')?.image || '',
    artistId: artists.find(a => a.name === 'Bioluminescent')?.id || ''
  },
  { 
    id: '24-cyberpunk', 
    name: 'Cyberpunk',
    image: artists.find(a => a.name === 'Cyberpunk')?.image || '',
    artistId: artists.find(a => a.name === 'Cyberpunk')?.id || ''
  },
  { 
    id: '25-art-deco-high-fashion', 
    name: 'Art Deco High Fashion',
    image: artists.find(a => a.name === 'Art Deco High Fashion')?.image || '',
    artistId: artists.find(a => a.name === 'Art Deco High Fashion')?.id || ''
  },
  { 
    id: '26-mystical', 
    name: 'Mystical',
    image: artists.find(a => a.name === 'Mystical')?.image || '',
    artistId: artists.find(a => a.name === 'Mystical')?.id || ''
  },
  { 
    id: '27-1920-spacerace', 
    name: '1920 Spacerace',
    image: artists.find(a => a.name === '1920 Spacerace')?.image || '',
    artistId: artists.find(a => a.name === '1920 Spacerace')?.id || ''
  },
  { 
    id: '28-victorian-mars-colony', 
    name: 'Victorian Mars Colony',
    image: artists.find(a => a.name === 'Victorian Mars Colony')?.image || '',
    artistId: artists.find(a => a.name === 'Victorian Mars Colony')?.id || ''
  },
  { 
    id: '29-hologram-noir', 
    name: 'Hologram Noir',
    image: artists.find(a => a.name === 'Hologram Noir')?.image || '',
    artistId: artists.find(a => a.name === 'Hologram Noir')?.id || ''
  },
  { 
    id: '3-nilewave', 
    name: 'Nilewave',
    image: artists.find(a => a.name === 'Nilewave')?.image || '',
    artistId: artists.find(a => a.name === 'Nilewave')?.id || ''
  },
  { 
    id: '30-digital-shaman', 
    name: 'Digital Shaman',
    image: artists.find(a => a.name === 'Digital Shaman')?.image || '',
    artistId: artists.find(a => a.name === 'Digital Shaman')?.id || ''
  },
  { 
    id: '31-aztec-cyberpunk', 
    name: 'Aztec Cyberpunk',
    image: artists.find(a => a.name === 'Aztec Cyberpunk')?.image || '',
    artistId: artists.find(a => a.name === 'Aztec Cyberpunk')?.id || ''
  },
  { 
    id: '32-greek-gods-djs', 
    name: 'Greek Gods DJs',
    image: artists.find(a => a.name === 'Greek Gods DJs')?.image || '',
    artistId: artists.find(a => a.name === 'Greek Gods DJs')?.id || ''
  },
  { 
    id: '33-christmas', 
    name: 'Christmas',
    image: artists.find(a => a.name === 'Christmas')?.image || '',
    artistId: artists.find(a => a.name === 'Christmas')?.id || ''
  },
  { 
    id: '4-lofi-new', 
    name: 'Lo-Fi',
    image: artists.find(a => a.name === 'Lofi')?.image || '',
    artistId: artists.find(a => a.name === 'Lofi')?.id || ''
  },
  { 
    id: '5-steampunk', 
    name: 'Steampunk',
    image: artists.find(a => a.name === 'Steampunk')?.image || '',
    artistId: artists.find(a => a.name === 'Steampunk')?.id || ''
  },
  { 
    id: '6-pantheranoir', 
    name: 'Panthera Noir',
    image: artists.find(a => a.name === 'Panthera Noir')?.image || '',
    artistId: artists.find(a => a.name === 'Panthera Noir')?.id || ''
  },
  { 
    id: '7-pebbles-new', 
    name: 'Pebbles',
    image: artists.find(a => a.name === 'Pebbles')?.image || '',
    artistId: artists.find(a => a.name === 'Pebbles')?.id || ''
  },
  { 
    id: '8-spellbound', 
    name: 'Spellbound',
    image: artists.find(a => a.name === 'Spellbound')?.image || '',
    artistId: artists.find(a => a.name === 'Spellbound')?.id || ''
  },
  { 
    id: '9-synthwave', 
    name: 'Synthwave',
    image: artists.find(a => a.name === 'Synthwave')?.image || '',
    artistId: artists.find(a => a.name === 'Synthwave')?.id || ''
  }
]; 