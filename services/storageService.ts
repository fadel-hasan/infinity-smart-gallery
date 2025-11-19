
import { GeneratedImage, DEFAULT_CATEGORIES } from '../types';

const STORAGE_KEY = 'nano_banana_db_v1';

interface AppState {
  images: GeneratedImage[];
  categories: string[];
}

export const saveState = (images: GeneratedImage[], categories: string[]) => {
  try {
    // In a real app, this would send data to a backend API.
    // For this demo, we use LocalStorage to persist data across reloads.
    const state: AppState = { images, categories };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save to local DB", error);
  }
};

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { images: [], categories: DEFAULT_CATEGORIES };
    }
    const parsed = JSON.parse(raw);
    // Ensure categories always has defaults if something goes wrong
    if (!parsed.categories || parsed.categories.length === 0) {
      parsed.categories = DEFAULT_CATEGORIES;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to load from local DB", error);
    return { images: [], categories: DEFAULT_CATEGORIES };
  }
};
