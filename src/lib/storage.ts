export interface SavedPattern {
  id: string;
  name: string;
  code: string;
  updatedAt: number;
}

const STORAGE_KEY = 'strudel-learning-app:patterns';

export function getSavedPatterns(): SavedPattern[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(patterns: SavedPattern[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
}

export function savePattern(name: string, code: string): SavedPattern[] {
  const patterns = getSavedPatterns();
  const pattern: SavedPattern = { id: crypto.randomUUID(), name, code, updatedAt: Date.now() };
  const next = [pattern, ...patterns];
  persist(next);
  return next;
}

export function deletePattern(id: string): SavedPattern[] {
  const next = getSavedPatterns().filter((p) => p.id !== id);
  persist(next);
  return next;
}

export function renamePattern(id: string, name: string): SavedPattern[] {
  const next = getSavedPatterns().map((p) => (p.id === id ? { ...p, name } : p));
  persist(next);
  return next;
}
