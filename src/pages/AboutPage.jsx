// --------------------------------------------------------
// AboutPage — Nuestra historia y visión
// --------------------------------------------------------
import { Sparkles, Heart, Target, ShieldCheck } from 'lucide-react';

const VALUES = [
  { icon: Target, title: 'Propósito', text: 'Nacimos para simplificar la búsqueda de hogares premium en Medellín.' },
  { icon: Heart, title: 'Pasión', text: 'Nos apasiona combinar el lujo inmobiliario con la calidez humana.' },
  { icon: ShieldCheck, title: 'Confianza', text: 'Seguridad y transparencia total en cada contrato de arrendamiento.' },
  { icon: Sparkles, title: 'Innovación', text: 'Usamos IA para que encuentres tu lugar ideal en tiempo récord.' },
];

export default function AboutPage() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-paradise-50 mb-6">
          Nuestra <span className="text-gradient">Historia</span>
        </h1>
        <p className="text-paradise-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Paradise Premium Rentals nació de una necesidad real: la falta de una plataforma que integrara 
          servicios de alta gama con tecnología de vanguardia en el vibrante corazón de Medellín.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-2xl font-semibold text-paradise-50 mb-4">El Comienzo del Viaje</h2>
          <p className="text-paradise-400 leading-relaxed mb-6">
            Todo empezó con una visión simple: Medellín es un paraíso, pero encontrar el lugar perfecto 
            para vivir no debería ser un laberinto. Decidimos combinar nuestra experiencia en el sector 
            inmobiliario con el poder de la Inteligencia Artificial para crear una solución integral.
          </p>
          <p className="text-paradise-400 leading-relaxed">
            Hoy, no solo ofrecemos techos; ofrecemos experiencias. Desde apartamentos ultra-modernos 
            en El Poblado hasta fincas majestuosas y yates exclusivos. Todo en un solo lugar, 
            diseñado para aquellos que no se conforman con lo ordinario.
          </p>
        </div>
        <div className="glass-card rounded-2xl overflow-hidden aspect-video relative group">
          <img 
            src="/assets/luxury_penthouse.png" 
            alt="Luxury Penthouse View" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paradise-950/80 to-transparent flex items-end p-8">
            <p className="text-accent-400 font-medium italic">"El lujo no es una opción, es nuestro estándar."</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VALUES.map((v, i) => (
          <div key={i} className="glass-card p-6 rounded-xl text-center">
            <v.icon size={32} className="mx-auto text-accent-500 mb-4" />
            <h3 className="text-paradise-50 font-semibold mb-2">{v.title}</h3>
            <p className="text-paradise-400 text-sm leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
