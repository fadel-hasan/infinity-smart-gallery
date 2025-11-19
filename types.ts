
export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  prompt: string;
  timestamp: number;
  isLoading?: boolean;
  category: string;
}

export enum AppView {
  GALLERY = 'GALLERY',
  EDITOR = 'EDITOR',
}

export type Category = string; // Changed from union type to string to allow dynamic categories

export const DEFAULT_CATEGORIES: string[] = ['All', 'Nature', 'Urban', 'Sci-Fi', 'Animals', 'Abstract', 'Characters'];
