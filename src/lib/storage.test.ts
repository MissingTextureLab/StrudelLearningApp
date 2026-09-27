import { beforeEach, describe, expect, it } from 'vitest';
import {
  deletePattern,
  exportPatternsJson,
  getSavedPatterns,
  importPatternsJson,
  renamePattern,
  savePattern,
} from './storage';

beforeEach(() => {
  localStorage.clear();
});

describe('savePattern / getSavedPatterns', () => {
  it('starts empty', () => {
    expect(getSavedPatterns()).toEqual([]);
  });

  it('saves a pattern and returns it newest-first', () => {
    savePattern('bd loop', 's("bd sd")');
    const [second] = savePattern('hh loop', 's("hh*8")');
    expect(second.name).toBe('hh loop');
    expect(getSavedPatterns().map((p) => p.name)).toEqual(['hh loop', 'bd loop']);
  });

  it('recovers from corrupted localStorage instead of throwing', () => {
    localStorage.setItem('strudel-learning-app:patterns', '{not json');
    expect(getSavedPatterns()).toEqual([]);
  });
});

describe('deletePattern / renamePattern', () => {
  it('deletes by id', () => {
    savePattern('a', 's("hh")');
    const [b] = savePattern('b', 's("bd")');
    const remaining = deletePattern(b.id);
    expect(remaining.map((p) => p.id)).not.toContain(b.id);
    expect(remaining).toHaveLength(1);
  });

  it('renames by id, leaving other patterns untouched', () => {
    const [pattern] = savePattern('old name', 's("bd")');
    const renamed = renamePattern(pattern.id, 'new name');
    expect(renamed[0]).toMatchObject({ id: pattern.id, name: 'new name', code: 's("bd")' });
  });
});

describe('exportPatternsJson / importPatternsJson', () => {
  it('round-trips patterns through export and import', () => {
    savePattern('a', 's("bd")');
    savePattern('b', 's("sd")');
    const json = exportPatternsJson();

    localStorage.clear();
    const imported = importPatternsJson(json);

    expect(imported.map((p) => ({ name: p.name, code: p.code }))).toEqual(
      expect.arrayContaining([
        { name: 'a', code: 's("bd")' },
        { name: 'b', code: 's("sd")' },
      ]),
    );
  });

  it('merges imported patterns with existing ones instead of replacing them', () => {
    savePattern('existing', 's("bd")');
    const json = exportPatternsJson();
    localStorage.clear();
    savePattern('kept', 's("cp")');

    const result = importPatternsJson(json);
    expect(result.map((p) => p.name).sort()).toEqual(['existing', 'kept']);
  });

  it('assigns fresh ids on import so re-importing never collides', () => {
    savePattern('a', 's("bd")');
    const json = exportPatternsJson();
    importPatternsJson(json);
    // importing the same export twice must not merge/overwrite by id
    const again = importPatternsJson(json);
    expect(again).toHaveLength(3);
    expect(new Set(again.map((p) => p.id)).size).toBe(3);
  });

  it('rejects invalid JSON', () => {
    expect(() => importPatternsJson('not json')).toThrow();
  });

  it('rejects JSON that is not a list of patterns', () => {
    expect(() => importPatternsJson(JSON.stringify({ foo: 'bar' }))).toThrow();
    expect(() => importPatternsJson(JSON.stringify([{ foo: 'bar' }]))).toThrow();
  });
});
