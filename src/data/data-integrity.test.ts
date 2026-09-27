import { describe, expect, it } from 'vitest';
import { lessons } from './lessons';
import { referenceCategories } from './reference';

// These check the invariants the UI actually relies on (React `key`s,
// initial-selection lookups by id) — not just "does the data look nice".
// A broken invariant here means duplicate/misrendered entries or a lesson
// that can never be selected, not just a typo.

describe('lessons', () => {
  it('has unique ids (LessonPanel selects/keys lessons by id)', () => {
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a contiguous order sequence starting at 0', () => {
    const orders = lessons.map((l) => l.order).sort((a, b) => a - b);
    expect(orders).toEqual(lessons.map((_, i) => i));
  });

  it('has no empty title, block or concept text', () => {
    for (const lesson of lessons) {
      expect(lesson.title.trim()).not.toBe('');
      expect(lesson.block.trim()).not.toBe('');
      expect(lesson.concept.length).toBeGreaterThan(0);
      for (const paragraph of lesson.concept) {
        expect(paragraph.trim()).not.toBe('');
      }
    }
  });

  it('has unique, non-empty example labels within each lesson (used as React keys)', () => {
    for (const lesson of lessons) {
      const labels = lesson.examples.map((e) => e.label);
      expect(new Set(labels).size).toBe(labels.length);
      for (const example of lesson.examples) {
        expect(example.label.trim()).not.toBe('');
        expect(example.code.trim()).not.toBe('');
      }
    }
  });

  it('has non-empty prompts and hints for every exercise', () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        expect(exercise.prompt.trim()).not.toBe('');
        if (exercise.hint !== undefined) expect(exercise.hint.trim()).not.toBe('');
        if (exercise.starterCode !== undefined) expect(exercise.starterCode.trim()).not.toBe('');
      }
    }
  });
});

describe('referenceCategories', () => {
  it('has unique category ids (ReferencePanel keys/opens categories by id)', () => {
    const ids = referenceCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no empty category title or summary', () => {
    for (const category of referenceCategories) {
      expect(category.title.trim()).not.toBe('');
      expect(category.summary.trim()).not.toBe('');
    }
  });

  it('has unique, non-empty entry names within each category (used as React keys)', () => {
    for (const category of referenceCategories) {
      const names = category.entries.map((e) => e.name);
      expect(new Set(names).size).toBe(names.length);
      for (const entry of category.entries) {
        expect(entry.name.trim()).not.toBe('');
        expect(entry.description.trim()).not.toBe('');
      }
    }
  });

  it('has unique, non-empty example labels within each entry (used as React keys)', () => {
    for (const category of referenceCategories) {
      for (const entry of category.entries) {
        const labels = entry.examples.map((e) => e.label);
        expect(new Set(labels).size).toBe(labels.length);
        for (const example of entry.examples) {
          expect(example.label.trim()).not.toBe('');
          expect(example.code.trim()).not.toBe('');
        }
      }
    }
  });
});
