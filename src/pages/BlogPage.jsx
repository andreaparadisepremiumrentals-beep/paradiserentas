// -----------------------------------------------------------------------------
// BlogPage — Artículos y guías de Paradise Premium (SEO local)
// -----------------------------------------------------------------------------
import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Newspaper, Clock, ArrowRight, Tag } from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogPosts';
import { Seo } from '../lib/seo';

function formatDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function BlogPage() {
  const { lang = 'es' } = useOutletContext() || {};
  const [category, setCategory] = useState('all');
  const filtered = category === 'all' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === category);

  return (
    <div className="pt-2 md:pt-10 px-6 md:px-14 animate-fade-in bg-paradise-950 pb-40">
      <Seo
        title={`${lang === 'es' ? 'Blog y Guías de Medellín' : 'Medellín Blog & Guides'}`}
        description="Artículos y guías sobre vivir, arrendar y disfrutar Medellín y Antioquia: barrios, precios, fincas, experiencias náuticas y consejos para propietarios."
        path="/blog"
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Blog', path: '/blog' }]}
      />

      <div className="text-center mb-16">
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-paradise-50 mb-6">
          {`${lang === 'es' ? 'Blog &' : 'Blog &'}`}{' '}
          <span className="heading-orange">{`${lang === 'es' ? 'Guías' : 'Guides'}`}</span>
        </h1>
        <p className="text-paradise-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {`${lang === 'es' ? 'Todo lo que necesitas saber para vivir, arrendar y disfrutar Medellín y Antioquia, escrito por nuestro equipo local.' : 'Everything you need to know to live, rent and enjoy Medellín and Antioquia, written by our local team.'}`}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center mb-14">
        {['all', ...BLOG_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${category === c ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-paradise-400 border-white/10 hover:text-emerald-400 hover:border-emerald-500/20'}`}
          >
            {`${c === 'all' ? (lang === 'es' ? 'Todos' : 'All') : c}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group glass-card rounded-[32px] overflow-hidden border border-white/5 hover:border-emerald-500/20 transition-all duration-700 flex flex-col"
          >
            <div className="relative h-56 overflow-hidden">
              <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 brightness-[0.85] group-hover:brightness-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-paradise-950/80 to-transparent" />
              <div className="absolute top-4 left-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 text-emerald-300 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                {post.category}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-[10px] text-paradise-400 font-bold uppercase tracking-widest mb-3">
                <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-400" /> {`${post.readMinutes}`} min</span>
                <span>{`${formatDate(post.date)}`}</span>
              </div>
              <h2 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter leading-tight mb-3">
                {post.title}
              </h2>
              <p className="text-paradise-400 text-sm leading-relaxed flex-1">{post.excerpt}</p>
              <div className="mt-5 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                {`${lang === 'es' ? 'Leer artículo' : 'Read article'}`} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
