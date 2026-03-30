import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const categoryLabels: Record<string, string> = {
    inversion: 'Inversión',
    ahorro: 'Ahorro',
    cripto: 'Criptomonedas',
    fiscalidad: 'Fiscalidad',
  };

  const grouped = sortedPosts.reduce(
    (acc, post) => {
      const cat = post.data.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(post);
      return acc;
    },
    {} as Record<string, typeof sortedPosts>
  );

  let content = `# RentaBase

> Blog sobre inversión, ahorro, criptomonedas y fiscalidad en España. Contenido práctico y con experiencia real para gestionar tu dinero de forma inteligente.

## Páginas principales

- [Inicio](https://rentabase.es/)
- [Blog](https://rentabase.es/blog)
- [Sobre nosotros](https://rentabase.es/sobre-nosotros)

## Artículos del blog

`;

  for (const [category, posts] of Object.entries(grouped)) {
    const label = categoryLabels[category] || category;
    content += `### ${label}\n\n`;
    for (const post of posts) {
      content += `- [${post.data.title}](https://rentabase.es/blog/${post.slug}): ${post.data.description}\n`;
    }
    content += '\n';
  }

  content += `## Información adicional

- Idioma: Español (España)
- Temática: Finanzas personales, inversión pasiva, ETFs, fondos indexados, criptomonedas, fiscalidad española
- Audiencia: Residentes en España interesados en gestionar sus finanzas e inversiones
- Feed RSS: https://rentabase.es/rss.xml
- Contenido completo para LLMs: https://rentabase.es/llms-full.txt
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
