import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const getPosts = async () =>
  (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

export const getProjects = async () =>
  (await getCollection('projects', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

export const readingTime = (markdown: string): string => {
  const words = markdown.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
};

export const formatDate = (d: Date): string =>
  d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: '2-digit', year: 'numeric' });

export const countBy = (posts: CollectionEntry<'blog'> | CollectionEntry<'projects'>, key: 'category' | 'tags') => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    const values = key === 'category' ? [post.data.category] : post.data.tags;
    for (const value of values) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const pageHref = (base: string, n: number): string => (n === 1 ? base : `${base}${n}/`);

export const groupByYear = (posts: (CollectionEntry<'blog'> | CollectionEntry<'projects'>)[]) => {
  const byYear = new Map<number, (typeof posts)[number]>();
  for (const post of posts) {
    const year = post.data.date.getUTCFullYear();
    const list = byYear.get(year) || [];
    list.push(post);
    byYear.set(year, list);
  }
  return Array.from(byYear.entries())
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => b.year - a.year);
};
