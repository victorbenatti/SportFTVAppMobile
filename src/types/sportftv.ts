// Tipos para o sistema Sport FTV
export interface Arena {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  quadras: Quadra[];
}

export interface Quadra {
  id: string;
  name: string; // "Quadra 1", "Quadra 2", etc.
  arenaId: string;
}

export interface VideoMoment {
  id: string;
  title: string;
  description?: string;
  arenaId: string;
  quadraId: string;
  timestamp: string; // ISO date
  hour: number; // 18, 19, 20, etc.
  duration: string; // "2:30" format
  videoUrl: string;
  thumbnailUrl?: string;
  date: string; // YYYY-MM-DD or DD/MM/YYYY
  tournament?: string;
  views?: string | number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}
