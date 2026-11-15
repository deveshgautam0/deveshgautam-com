import rss from '@astrojs/rss';
import { getPosts } from '../../lib/content.ts';
import site from '../../data/site.json';
export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: site.name,
    description: site.tagline,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
    })),
  });
}
