import test from 'node:test';
import assert from 'node:assert/strict';
import { KAYNOXX_FAQS } from '../data/faqs';
import { countFaqsByCategory, filterFaqs, formatFaqCategoryLabel } from './faqEngine';

test('countFaqsByCategory covers maintenance, warranty, and technical support accurately', () => {
  const counts = countFaqsByCategory(KAYNOXX_FAQS);
  assert.equal(counts.all, KAYNOXX_FAQS.length);
  assert.equal(counts.maintenance, 3);
  assert.equal(counts.warranty, 3);
  assert.equal(counts['technical-support'], 3);
  assert.equal(counts.maintenance + counts.warranty + counts['technical-support'], counts.all);
});

test('filterFaqs filters cleanly by category', () => {
  const warrantyOnly = filterFaqs(KAYNOXX_FAQS, 'warranty', '');
  assert.equal(warrantyOnly.length, 3);
  assert.ok(warrantyOnly.every((item) => item.category === 'warranty'));

  const supportOnly = filterFaqs(KAYNOXX_FAQS, 'technical-support', '');
  assert.equal(supportOnly.length, 3);
  assert.ok(supportOnly.every((item) => item.category === 'technical-support'));
});

test('filterFaqs matches technical keywords, answers, and spec notes case-insensitively', () => {
  const oilMatches = filterFaqs(KAYNOXX_FAQS, 'all', 'VG 320');
  assert.equal(oilMatches.length, 1);
  assert.equal(oilMatches[0].id, 'geared-oil-schedule');

  const vvvfMatches = filterFaqs(KAYNOXX_FAQS, 'technical-support', 'VVVF');
  assert.ok(vvvfMatches.some((item) => item.id === 'vvvf-encoder-commissioning'));

  const emptyMatches = filterFaqs(KAYNOXX_FAQS, 'all', 'nonexistent-query-xyz');
  assert.equal(emptyMatches.length, 0);
});

test('formatFaqCategoryLabel returns human-readable labels', () => {
  assert.equal(formatFaqCategoryLabel('maintenance'), 'Maintenance');
  assert.equal(formatFaqCategoryLabel('warranty'), 'Warranty');
  assert.equal(formatFaqCategoryLabel('technical-support'), 'Technical Support');
});
