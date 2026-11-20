import { FaqCategory, FaqItem } from '../data/faqs';

export type FaqFilterCategory = 'all' | FaqCategory;

export function filterFaqs(
  items: FaqItem[],
  category: FaqFilterCategory,
  query: string
): FaqItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      item.question,
      item.answer,
      item.specNote ?? '',
      item.seriesScope,
      item.category,
      ...item.keywords,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function countFaqsByCategory(items: FaqItem[]): Record<FaqFilterCategory, number> {
  const counts: Record<FaqFilterCategory, number> = {
    all: items.length,
    maintenance: 0,
    warranty: 0,
    'technical-support': 0,
  };

  for (const item of items) {
    counts[item.category] += 1;
  }

  return counts;
}

export function formatFaqCategoryLabel(category: FaqCategory): string {
  switch (category) {
    case 'maintenance':
      return 'Maintenance';
    case 'warranty':
      return 'Warranty';
    case 'technical-support':
      return 'Technical Support';
  }
}
