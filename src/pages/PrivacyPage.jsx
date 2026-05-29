import { Info, ShieldCheck, Lock, Eye, BookOpen } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function PrivacyPage() {
  const { lang = 'es' } = useOutletContext() || {};

  return (
    <div className="p-6 md:p-14 animate-fade-in bg-paradise-950 pb-40">
      <div className="mb-20 max-w-4xl pt-10">
        <h1 className="heading-display text-5xl md:text-6xl text-paradise-50 mb-6 leading-none uppercase">
          {lang === 'es' ? 'Política de' : 'Privacy'}{' '}
          <span className="heading-orange">
            {lang === 'es' ? 'Privacidad' : 'Policy'}
          </span>
        </h1>
        <div className="h-0.5 w-24 bg-gradient-to-r from-orange-500 to-gold-400 mb-8" />
        <p className="text-paradise-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
          {lang === 'es' 
            ? 'En Paradise Premium Rentals, nos tomamos en serio la seguridad y privacidad de sus datos personales. Esta política describe cómo recolectamos, usamos y protegemos su información.' 
            : 'At Paradise Premium Rentals, we take the security and privacy of your personal data seriously. This policy describes how we collect, use, and protect your information.'}
        </p>
      </div>

      <div className="max-w-4xl space-y-16">
        {/* Section 1 */}
        <section className="glass-card p-10 rounded-[40px] border-orange-500/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Eye className="text-orange-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              1. {lang === 'es' ? 'Recolección de Información' : 'Information Collection'}
            </h2>
          </div>
          <div className="space-y-6 text-paradise-300 leading-relaxed font-light">
            <p>
              {lang === 'es' 
                ? 'Recolectamos datos personales como nombre, identificación (cédula/pasaporte), correo electrónico y teléfono. Esta información es obligatoria para la contratación de la Tarjeta de Asistencia Médica (Seguro de Turismo) y su registro ante las autoridades colombianas.' 
                : 'We collect personal data such as name, identification (ID/Passport), email, and phone. This information is mandatory for contracting the Medical Assistance Card (Tourism Insurance) and your registry before Colombian authorities.'}
            </p>
            <p>
              {lang === 'es' 
                ? 'También recolectamos datos técnicos de navegación para optimizar su experiencia premium en nuestra plataforma.' 
                : 'We also collect technical browsing data to optimize your premium experience on our platform.'}
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="glass-card p-10 rounded-[40px] border-orange-500/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <ShieldCheck className="text-orange-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              2. {lang === 'es' ? 'Tratamiento y Finalidad' : 'Data Processing'}
            </h2>
          </div>
          <div className="space-y-6 text-paradise-300 leading-relaxed font-light">
            <p>
              {lang === 'es' 
                ? 'Sus datos se utilizan para: 1. Gestionar su reserva, 2. Cumplir con la obligación legal del Registro Nacional de Turismo, 3. Gestionar seguros de viaje y 4. Enviarle comunicaciones exclusivas de Paradise Premium.' 
                : 'Your data is used to: 1. Manage your booking, 2. Comply with the legal obligation of the National Tourism Registry, 3. Manage travel insurance, and 4. Send you exclusive Paradise Premium communications.'}
            </p>
            <p className="p-6 bg-orange-500/5 rounded-2xl border border-orange-500/20 text-orange-400/80 italic text-sm">
              {lang === 'es' 
                ? 'Bajo ninguna circunstancia vendemos su información. Sus datos son tratados bajo estrictos protocolos de seguridad criptográfica.' 
                : 'Under no circumstances do we sell your information. Your data is treated under strict cryptographic security protocols.'}
            </p>
          </div>
        </section>

        {/* Section 3 - Habeas Data Colombia */}
        <section className="glass-card p-10 rounded-[40px] border-orange-500/10 bg-orange-500/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Lock className="text-orange-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              3. {lang === 'es' ? 'Ley de Habeas Data (Ley 1581)' : 'Habeas Data (Law 1581)'}
            </h2>
          </div>
          <div className="space-y-6 text-paradise-300 leading-relaxed font-light">
            <p>
              {lang === 'es' 
                ? 'Como titular de los datos, usted tiene derecho a conocer, actualizar, rectificar y suprimir su información de nuestras bases de datos en cualquier momento.' 
                : 'As a data owner, you have the right to know, update, rectify, and delete your information from our databases at any time.'}
            </p>
            <p>
              {lang === 'es' 
                ? 'Para ejercer sus derechos, puede contactar a nuestro Oficial de Privacidad en info@paradiserentas.com.' 
                : 'To exercise your rights, you can contact our Privacy Officer at info@paradiserentas.com.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
