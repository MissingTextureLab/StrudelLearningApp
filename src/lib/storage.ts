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

export function exportPatternsJson(): string {
  return JSON.stringify(getSavedPatterns(), null, 2);
}

function isSavedPatternShape(value: unknown): value is Pick<SavedPattern, 'name' | 'code'> {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return typeof p.name === 'string' && typeof p.code === 'string';
}

// Imports patterns from a previously exported JSON file, merging them with
// what's already saved. Imported patterns always get a fresh id (so
// re-importing the same file, or importing on a different browser that
// happens to share an id, never overwrites an existing pattern).
export function importPatternsJson(json: string): SavedPattern[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('El archivo no contiene JSON válido.');
  }
  if (!Array.isArray(parsed) || !parsed.every(isSavedPatternShape)) {
    throw new Error('El archivo no tiene el formato esperado (una lista de patrones exportados desde esta app).');
  }
  const imported: SavedPattern[] = parsed.map((p) => ({
    id: crypto.randomUUID(),
    name: p.name,
    code: p.code,
    updatedAt: typeof (p as SavedPattern).updatedAt === 'number' ? (p as SavedPattern).updatedAt : Date.now(),
  }));
  const next = [...imported, ...getSavedPatterns()];
  persist(next);
  return next;
}
