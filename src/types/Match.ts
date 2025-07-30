export interface Club {
  name: string;
  logo: string;
}

export interface Clubs {
  home: Club;
  away: Club;
}

export interface Streams {
  src1?: string;
  src2?: string;
  hls1?: string;
  hls2?: string;
  mhls1?: string;
  mhls2?: string;
}

export interface Score {
  home: number;
  away: number;
  status: 'SCHEDULED' | 'LIVE' | 'HT' | 'FT' | 'POSTPONED' | 'CANCELLED';
  type?: 'HOT' | 'FEATURED';
}

export interface Competition {
  id: string;
  name: string;
  matchday: number;
}

export interface Kickoff {
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  timezone: string;
}

export interface Venue {
  name: string;
  city: string;
  country: string;
}

export interface Match {
  id: string;
  clubs: Clubs;
  streams: Streams;
  score: Score;
  competition: Competition;
  kickoff: Kickoff;
  venue: Venue;
  createdAt?: string;
  updatedAt?: string;
}

export interface StreamSource {
  type: 'hls' | 'iframe';
  url: string;
  label: string;
  key: keyof Streams;
}