// -----------------------------------------------------------------------------
// BlogPostPage — Artículo individual (JSON-LD Article + breadcrumb)
// -----------------------------------------------------------------------------
import { useParams, Link, Navigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { getPostBySlug, BLOG_POSTS } from '../data/blogPosts';
import { useSeo } from '../lib/seo';
import { SITE, absoluteUrl } from '../lib/site';

function formatDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="heading-display text-2xl md:text-3xl text-paradise-50 mt-12 mb-5 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-emerald-500" />
          {block.text}
        </h2>
      );
    case 'p':
      return <p className="text-paradise-300 leading-relaxed text-lg font-light mb-5">{block.text}</p>;
    case 'ul':
      return (
        <ul className="space-y-3 mb-6">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-paradise-300 leading-relaxed font-light">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case 'tip':
      return (
        <div className="my-8 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-4">
          <Lightbulb size={20} className="text-emerald-400 shrink-0 mt-1" />
          <p className="text-emerald-100/90 leading-relaxed text-sm">{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { lang = 'es' } = useOutletContext() || {};
  const post = getPostBySlug(slug);

  useSeo(
    post
      ? {
          title: post.title,
          description: post.metaDescription,
          path: `/blog/${post.slug}`,
          image: post.image,
          type: 'article',
          breadcrumb: [
            { name: 'Inicio', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ],
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.metaDescription,
              image: absoluteUrl(post.image),
              datePublished: post.date,
              dateModified: post.date,
              inLanguage: 'es-CO',
              author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
              publisher: {
                '@type': 'Organization',
                name: SITE.name,
                logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo) },
              },
              mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
            },
          ],
        }
      : { title: 'Artículo', description: 'Artículo de Paradise Premium', path: '/blog' }
  );

  if (!post) return <Navigate to="/blog" replace />;

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category)
    .concat(BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category))
    .slice(0, 3);

  return (
    <div className="pt-2 md:pt-10 px-6 md:px-14 animate-fade-in bg-paradise-950 pb-40">
      {/* Breadcrumb visual */}
      <nav className="max-w-3xl mx-auto mb-10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-paradise-500">
        <Link to="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-paradise-300 truncate">{post.title}</span>
      </nav>

      {/* Header del artículo */}
      <header className="max-w-3xl mx-auto text-center mb-12">
        <span className="inline-block bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20 mb-5">
          {post.category}
        </span>
        <h1 className="heading-display text-4xl md:text-5xl text-paradise-50 mb-6 leading-tight">{post.title}</h1>
        <div className="flex items-center justify-center gap-6 text-[11px] text-paradise-400 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-2"><Calendar size={14} className="text-emerald-400" /> {formatDate(post.date)}</span>
          <span className="flex items-center gap-2"><Clock size={14} className="text-emerald-400" /> {post.readMinutes} min</span>
        </div>
      </header>

      {/* Imagen de portada */}
      <div className="max-w-4xl mx-auto mb-14">
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
          <img src={post.image} alt={post.title} className="w-full h-[320px] md:h-[420px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-paradise-950/60 to-transparent" />
        </div>
      </div>

      {/* Cuerpo */}
      <article className="max-w-3xl mx-auto">
        {post.blocks.map((b, i) => <Block key={i} block={b} />)}
      </article>

      {/* Etiquetas */}
      <div className="max-w-3xl mx-auto mt-12 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span key={t} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-paradise-400">
            #{t}
          </span>
        ))}
      </div>

      {/* Relacionados */}
      <section className="max-w-6xl mx-auto mt-24 border-t border-white/5 pt-16">
        <h2 className="text-2xl md:text-3xl font-black text-paradise-50 uppercase tracking-tighter mb-10">
          {lang === 'es' ? 'Artículos relacionados' : 'Related articles'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group glass-card rounded-[28px] overflow-hidden border border-white/5 hover:border-emerald-500/20 transition-all duration-500">
              <div className="relative h-44 overflow-hidden">
                <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 brightness-[0.85]" />
                <div className="absolute inset-0 bg-gradient-to-t from-paradise-950/80 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight leading-snug mb-2">{p.title}</h3>
                <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  {lang === 'es' ? 'Leer' : 'Read'} <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-400 text-[11px] font-bold uppercase tracking-widest hover:gap-3 transition-all">
            <ArrowLeft size={16} /> {lang === 'es' ? 'Volver al blog' : 'Back to blog'}
          </Link>
        </div>
      </section>
    </div>
  );
}
