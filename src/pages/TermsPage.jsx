import { BookOpen, Handshake, AlertTriangle, Calendar, Info } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function TermsPage() {
  const { lang = 'es' } = useOutletContext() || {};

  return (
    <div className="p-6 md:p-14 animate-fade-in bg-paradise-950 pb-40">
      <div className="mb-20 max-w-4xl pt-10">
        <h1 className="heading-display text-5xl md:text-6xl text-paradise-50 mb-6 leading-none uppercase">
          {lang === 'es' ? 'Términos y' : 'Terms &'}{' '}
          <span className="heading-orange">
            {lang === 'es' ? 'Condiciones' : 'Conditions'}
          </span>
        </h1>
        <div className="h-0.5 w-24 bg-gradient-to-r from-orange-500 to-gold-400 mb-8" />
        <p className="text-paradise-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
          {lang === 'es' 
            ? 'Bienvenido a Paradise Premium Rentals. Al usar nuestro sitio web y servicios, usted acepta los siguientes términos y condiciones de uso.' 
            : 'Welcome to Paradise Premium Rentals. By using our website and services, you agree to the following terms and conditions of use.'}
        </p>
      </div>

      <div className="max-w-4xl space-y-12">
        {/* 1. Responsabilidad y Reservas */}
        <section className="glass-card p-10 rounded-[40px] border-orange-500/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Calendar className="text-orange-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              1. {lang === 'es' ? 'Huésped Responsable y Reservas' : 'Responsible Guest & Bookings'}
            </h2>
          </div>
          <div className="space-y-6 text-paradise-300 leading-relaxed font-light">
            <p>
              {lang === 'es' 
                ? 'Se define como Huésped Responsable a la persona que realiza la reserva. Esta persona actúa en representación de todos los ocupantes y es el único responsable legal por la integridad del inmueble y el cumplimiento de estas políticas.' 
                : 'The Responsible Guest is defined as the person who makes the booking. This person acts on behalf of all occupants and is solely responsible for property integrity and policy compliance.'}
            </p>
            <p>
              {lang === 'es' 
                ? 'Las reservas se confirman tras la verificación del pago. La capacidad máxima de cada propiedad debe respetarse estrictamente; el ingreso de personas adicionales no registradas incurrirá en cargos extra.' 
                : 'Bookings are confirmed upon payment verification. Maximum property capacity must be strictly respected; unregistered additional guests will incur extra charges.'}
            </p>
            <p className="p-6 bg-orange-500/5 rounded-2xl border border-orange-500/20 text-orange-400/80 italic text-sm">
              {lang === 'es' 
                ? 'Protección al Menor: En cumplimiento de la Ley 1336 de 2009, rechazamos y denunciaremos cualquier indicio de explotación sexual comercial de niños, niñas y adolescentes.' 
                : 'Child Protection: In compliance with Law 1336 of 2009, we reject and will report any indication of commercial sexual exploitation of children and adolescents.'}
            </p>
          </div>
        </section>

        {/* 2. Cancelaciones Escalonadas */}
        <section className="glass-card p-10 rounded-[40px] border-orange-500/10 border-l-orange-500/40">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <AlertTriangle className="text-orange-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              2. {lang === 'es' ? 'Política de Cancelación' : 'Cancellation Policy'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="font-bold text-orange-400 mb-1">{lang === 'es' ? '+30 Días' : '30+ Days'}</p>
              <p className="text-paradise-400">{lang === 'es' ? 'Reembolso del 80% o crédito del 100%.' : '80% refund or 100% credit.'}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="font-bold text-orange-400 mb-1">{lang === 'es' ? '15-29 Días' : '15-29 Days'}</p>
              <p className="text-paradise-400">{lang === 'es' ? 'Reembolso del 50% del valor total.' : '50% refund of total value.'}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl opacity-60">
              <p className="font-bold text-orange-400 mb-1">{lang === 'es' ? '< 15 Días' : '< 15 Days'}</p>
              <p className="text-paradise-400">{lang === 'es' ? 'No reembolsable.' : 'Non-refundable.'}</p>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <p className="font-bold text-white mb-1">{lang === 'es' ? 'Fuerza Mayor' : 'Force Majeure'}</p>
              <p className="text-paradise-300">{lang === 'es' ? 'Garantizamos reubicación o 100% de devolución.' : 'We guarantee relocation or 100% refund.'}</p>
            </div>
          </div>
        </section>

        {/* 3. Convivencia y Silencio */}
        <section className="glass-card p-10 rounded-[40px] border-orange-500/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Handshake className="text-orange-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              3. {lang === 'es' ? 'Protocolo de Convivencia' : 'Coexistence Protocol'}
            </h2>
          </div>
          <div className="space-y-6 text-paradise-300 leading-relaxed font-light">
            <div className="flex gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/10 text-red-400/80">
              <Info size={20} className="shrink-0" />
              <p className="text-sm italic">
                {lang === 'es' 
                  ? 'Horas de Silencio: 10:00 PM - 8:00 AM. Se prohíbe el uso de bafles profesionales o sonido de alta potencia.' 
                  : 'Quiet Hours: 10:00 PM - 8:00 AM. Use of professional speakers or high-power sound systems is prohibited.'}
              </p>
            </div>
            <p>
              {lang === 'es' 
                ? 'El ruido excesivo que trascienda los límites de la propiedad podrá dar lugar a multas administrativas o incluso la terminación inmediata del contrato sin reembolso.' 
                : 'Excessive noise beyond property limits may result in administrative fines or even immediate contract termination without refund.'}
            </p>
          </div>
        </section>

        {/* 4. Depósito y Daños */}
        <section className="glass-card p-10 rounded-[40px] border-orange-500/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <ShieldCheck className="text-orange-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              4. {lang === 'es' ? 'Depósito y Transparencia' : 'Deposit & Transparency'}
            </h2>
          </div>
          <div className="space-y-4 text-paradise-300 text-sm">
            <p>
              {lang === 'es' 
                ? 'Para garantizar una experiencia justa, aplicamos un Menú de Transparencia para daños comunes:' 
                : 'To ensure a fair experience, we apply a Transparency Menu for common damages:'}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 list-disc pl-5 opacity-80">
              <li>{lang === 'es' ? 'Llaves/Controles: $150k COP' : 'Keys/Refmotes: $150k COP'}</li>
              <li>{lang === 'es' ? 'Manchas en lencería: $80k COP' : 'Linen stains: $80k COP'}</li>
              <li>{lang === 'es' ? 'Cristalería: $25k COP' : 'Glassware: $25k COP'}</li>
              <li>{lang === 'es' ? 'Retraso en salida: $100k/hr' : 'Late check-out: $100k/hr'}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
