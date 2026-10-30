// Single source of truth for the homepage and the README index.
// Order here is the order patterns are numbered in.
import creational from './creational.js';
import structural from './structural.js';
import behavioral from './behavioral.js';
import modern from './modern.js';

export const categories = [
  { id: 'creational', name: 'Creational', blurb: 'Ways to create objects without hard-wiring which class gets built or how.' },
  { id: 'structural', name: 'Structural', blurb: 'Ways to put objects together into bigger structures while keeping them flexible.' },
  { id: 'behavioral', name: 'Behavioral', blurb: 'Ways for objects to share work and talk to each other without tight coupling.' },
  { id: 'modern', name: 'Modern JavaScript', blurb: 'Patterns that grew out of JavaScript itself: modules, async work, reactivity and cleanup.' },
];

const byCategory = { creational, structural, behavioral, modern };

export const patterns = categories.flatMap(({ id: category }) =>
  byCategory[category].map((p) => ({ ...p, category, file: `${category}/${p.id}.js`, testFile: `${category}/${p.id}.test.js` })),
).map((p, i) => ({ ...p, number: i + 1 }));
