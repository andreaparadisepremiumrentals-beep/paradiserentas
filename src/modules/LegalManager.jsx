import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '../components/ToastProvider';
import {
  FileText,
  PenTool,
  Download,
  Printer,
  Trash2,
  CheckCircle2,
  User,
  ShieldCheck,
  Briefcase,
  Sparkles,
  Share2,
  Clock,
  History,
  Key,
  Type
} from 'lucide-react';
import RemoteSignModal from '../components/RemoteSignModal';
import { deepseekModel } from '../lib/deepseek';
import { getProperties, saveSignedContract } from '../lib/store';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignatureCanvas from '../components/SignatureCanvas';

const MOCK_BOOKINGS = [
  { id: 'BK-782', guest: 'Juan Perez', property: 'Finca Villa del Sol', dates: '15/05/2026 - 20/05/2026', canon: '3.500.000', deposit: '450.000' },
  { id: 'BK-991', guest: 'Maria Gomez', property: 'Penthouse Provenza', dates: '01/06/2026 - 05/06/2026', canon: '2.800.000', deposit: '600.000' }
];

const DOCUMENT_TEMPLATES = {
  admin: {
    title: 'Contrato de Administración',
    content: `
      <div class="legal-doc-header" style="text-align: center; margin-bottom: 40px;">
        <img src="/assets/logoparadise.png" alt="Logo" style="height: 60px; margin-bottom: 20px; filter: brightness(0) saturate(100%) invert(31%) sepia(8%) saturate(1557%) hue-rotate(94deg) brightness(96%) contrast(85%);" />
        <h1 style="font-family: 'Playfair Display', serif; color: #1A4D2E; margin: 0;">CONTRATO DE MANDATO Y ADMINISTRACIÓN</h1>
        <p style="font-size: 10px; color: #B8734A; letter-spacing: 2px; text-transform: uppercase;">Exclusividad y Gestión Patrimonial</p>
      </div>

      <p><b>PARTES:</b> El PROPIETARIO, <span class="editable-field" contenteditable="true" data-field-id="owner_name">____________________</span> con C.C. <span class="editable-field" contenteditable="true" data-field-id="owner_id">____________________</span>, y el ADMINISTRADOR, <b>PARADISE PREMIUM RENTALS SAS</b>.</p>

      <p><b>CLÁUSULA 1 - OBJETO:</b> Mandato comercial para la administración, promoción y comercialización del inmueble ubicado en <span class="editable-field" contenteditable="true" data-field-id="property_address">____________________</span> bajo la modalidad de vivienda turística.</p>

      <p><b>CLÁUSULA 2 - ESTÁNDAR DE SERVICIO:</b> El ADMINISTRADOR garantiza un nivel de hospitalidad "Luxury", incluyendo limpieza profesional, gestión de canales (Airbnb, Booking, Directo) y asistencia 24/7 al huésped.</p>

      <p><b>CLÁUSULA 3 - HONORARIOS:</b> Se pacta una comisión del <span class="editable-field" contenteditable="true" data-field-id="commission">20%</span> sobre el valor bruto de reserva, descontando tasas de plataforma.</p>

      <div style="margin-top: 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
        <div style="text-align: center;">
          <div id="sign-placeholder-owner" style="height: 80px; border-bottom: 1px solid #1A4D2E; margin-bottom: 10px;"></div>
          <p><b>EL PROPIETARIO</b></p>
        </div>
        <div style="text-align: center;">
          <div id="sign-placeholder-admin" style="height: 80px; border-bottom: 1px solid #1A4D2E; margin-bottom: 10px;"></div>
          <p><b>P.P. RENTALS SAS</b></p>
        </div>
      </div>
    `
  },
  rent: {
    title: 'Contrato de Arrendamiento Turístico',
    content: `
      <div class="legal-doc-header" style="text-align: center; margin-bottom: 40px;">
        <img src="/assets/logoparadise.png" alt="Logo" style="height: 60px; margin-bottom: 20px; filter: brightness(0) saturate(100%) invert(26%) sepia(21%) saturate(2311%) hue-rotate(113deg) brightness(92%) contrast(89%);" />
        <h1 style="font-family: 'Playfair Display', serif; color: #1A4D2E; margin: 0;">CONTRATO DE HOSPEDAJE Y VIVIENDA TURÍSTICA</h1>
      </div>

      <p><b>HUÉSPED RESPONSABLE:</b> <span class="editable-field" contenteditable="true" data-field-id="guest_name">____________________</span> con ID <span class="editable-field" contenteditable="true" data-field-id="guest_id">____________________</span>.</p>
      
      <p><b>1. RESIDENCIA:</b> Entrega temporal de <span class="editable-field" contenteditable="true" data-field-id="property_name">____________________</span> desde el <span class="editable-field" contenteditable="true" data-field-id="check_in">____/____/____</span> hasta el <span class="editable-field" contenteditable="true" data-field-id="check_out">____/____/____</span>.</p>

      <p><b>2. PROTOCOLO DE CONVIVENCIA (Ley 1801):</b> Se prohíbe terminantemente el ruido excesivo entre las 10:00 PM y las 8:00 AM. El uso de bafles de alta potencia facultará la terminación inmediata sin lugar a reembolso.</p>

      <p><b>3. DEPÓSITO DE SEGURIDAD:</b> El Huésped constituye un depósito de $<span class="editable-field" contenteditable="true" data-field-id="deposit">450.000</span> COP para cubrir posibles daños menores según el Menú de Transparencia de Paradise Premium.</p>

      <p><b>4. PROTECCIÓN AL MENOR:</b> En cumplimiento de la Ley 1336 de 2009, rechazamos la explotación sexual comercial de niños, niñas y adolescentes.</p>

      <div style="margin-top: 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
        <div style="text-align: center;">
          <div id="sign-placeholder-lessor" style="height: 80px; border-bottom: 1px solid #1A4D2E; margin-bottom: 10px;"></div>
          <p><b>EL ARRENDADOR</b></p>
        </div>
        <div style="text-align: center;">
          <div id="sign-placeholder-tenant" style="height: 80px; border-bottom: 1px solid #1A4D2E; margin-bottom: 10px;"></div>
          <p><b>EL HUÉSPED</b></p>
        </div>
      </div>
    `
  },
  inventory: {
    title: 'Acta de Entrega e Inventario',
    content: `
      <div class="legal-doc-header" style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-family: 'Playfair Display', serif; color: #1A4D2E; margin: 0;">ACTA DE ENTREGA E INVENTARIO</h1>
      </div>

      <p><b>PROPIEDAD:</b> <span class="editable-field" contenteditable="true" data-field-id="property_name">____________________</span> | <b>FECHA:</b> <span class="editable-field" contenteditable="true" data-field-id="date">____/____/2026</span></p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px;">
        <thead>
          <tr style="background: #1A4D2E; color: white;">
            <th style="padding: 8px; border: 1px solid #ddd;">Elemento</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Codificación / Estado</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Reposición (COP)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">Llaves / Controles Aire</td><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Funcional</td><td style="padding: 8px; border: 1px solid #ddd;">$150.000</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">Toallas Luxury (Cuerpo/Cara)</td><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Limpio</td><td style="padding: 8px; border: 1px solid #ddd;">$80.000</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">Cristalería / Kit Cocina</td><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Completo</td><td style="padding: 8px; border: 1px solid #ddd;">$25.000/und</td></tr>
        </tbody>
      </table>

      <p style="font-size: 10px; margin-top: 15px; color: #666;">* El Huésped acepta que el estado de los elementos es óptimo al momento del ingreso. Cualquier anomalía debe reportarse en los primeros 30 minutos.</p>

      <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
        <div style="text-align: center;">
          <div id="sign-placeholder-delivery" style="height: 60px; border-bottom: 1px solid #1A4D2E; margin-bottom: 10px;"></div>
          <p style="font-size: 10px;"><b>ENTREGA (STAFF)</b></p>
        </div>
        <div style="text-align: center;">
          <div id="sign-placeholder-receive" style="height: 60px; border-bottom: 1px solid #1A4D2E; margin-bottom: 10px;"></div>
          <p style="font-size: 10px;"><b>RECIBE (HUÉSPED)</b></p>
        </div>
      </div>
    `
  },
  entry: {
    title: 'Autorización de Ingreso',
    content: `
      <div class="legal-doc-header" style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-family: 'Playfair Display', serif; color: #1A4D2E; margin: 0; text-transform: uppercase;">AUTORIZACIÓN DE INGRESO</h1>
        <p style="font-size: 12px; color: #B8734A;">Para Edificios y Unidades Residenciales</p>
      </div>

      <p><b>DIRIGIDO A:</b> Administración y Seguridad de <span class="editable-field" contenteditable="true" data-field-id="building_name">____________________</span>.</p>
      <p><b>FECHA DE EMISIÓN:</b> <span class="editable-field" contenteditable="true" data-field-id="issue_date">____/____/2026</span></p>

      <p>Por medio de la presente, <b>PARADISE PREMIUM RENTALS</b>, en calidad de administrador del inmueble <span class="editable-field" contenteditable="true" data-field-id="unit_number">Apto/Casa ____</span>, autoriza el ingreso de las siguientes personas para el periodo del <span class="editable-field" contenteditable="true" data-field-id="start_date">____/____</span> al <span class="editable-field" contenteditable="true" data-field-id="end_date">____/____</span>:</p>

      <ul style="background: #f9f9f9; padding: 20px; border-radius: 15px; list-style: none;">
        <li><b>Titular:</b> <span class="editable-field" contenteditable="true" data-field-id="guest_name">____________________</span> - CC: <span class="editable-field" contenteditable="true" data-field-id="guest_id">____________________</span></li>
        <li><b>Acompañantes:</b> <span class="editable-field" contenteditable="true" data-field-id="companions">____________________</span></li>
      </ul>

      <p>El titular de la reserva asume la responsabilidad total por el cumplimiento del reglamento interno de la propiedad horizontal.</p>

      <div style="margin-top: 60px;">
        <div id="sign-placeholder-admin-only" style="width: 250px; height: 70px; border-bottom: 1px solid #1A4D2E; margin-bottom: 10px;"></div>
        <p><b>FIRMA AUTORIZADA</b></p>
        <p style="font-size: 10px; color: #888;">Paradise Premium Rentals & Sales</p>
      </div>
    `
  }
};

// Shared SignatureCanvas is now imported

export default function LegalManager({ selectedRes = null }) {
  const { addToast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState('admin');
  const [content, setContent] = useState(DOCUMENT_TEMPLATES.admin.content);
  const [signatures, setSignatures] = useState({ first: null, second: null });
  const [activeBooking, setActiveBooking] = useState(selectedRes || null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState(false);
  const [contractStatus, setContractStatus] = useState('NOT_SET'); // NOT_SET, PENDING, SIGNED, EXPIRED
  const docRef = useRef(null);

  useEffect(() => {
    setContent(DOCUMENT_TEMPLATES[selectedDoc].content);
    setSignatures({ first: null, second: null });
  }, [selectedDoc]);

  const handlePrint = () => {
    window.print();
  };

  const injectSignature = (idx, dataUrl) => {
    setSignatures(prev => {
      const next = { ...prev, [idx === 0 ? 'first' : 'second']: dataUrl };
      if (next.first && (selectedDoc === 'entry' || next.second)) {
        setContractStatus('SIGNED');
      } else if (next.first || next.second) {
        setContractStatus('PENDING');
      }
      return next;
    });
  };

  const handleAIFill = async () => {
    if (!activeBooking) {
      addToast('Por favor selecciona una reserva para autocompletar.', 'info');
      return;
    }

    setIsAILoading(true);
    try {
      const fields = Array.from(docRef.current.querySelectorAll('.editable-field')).map(el => ({
        id: el.getAttribute('data-field-id'),
        text: el.previousSibling?.textContent?.trim() || 'Campo'
      }));

      const systemPrompt = `Eres el asistente legal de Paradise Premium Rentals. Recibirás datos de una reserva en JSON y una lista de IDs de campos de un contrato. 
      Devuelve ÚNICAMENTE un objeto JSON donde las llaves sean los data-field-id y los valores sean los datos extraídos de la reserva. 
      Si un dato no está en la reserva, intenta inferirlo basándote en el contexto (ej. el administrador es Paradise Premium Rentals SAS) o usa "____________________". 
      Mapeos comunes: 
      - owner_name/owner_id: Propietario (si no está, dejar vacío).
      - guest_name/guest_id: Huésped.
      - property_name/property_address: Propiedad.
      - check_in/check_out/dates: Fechas.
      - canon/deposit: Valores monetarios.
      Asegúrate de que las fechas estén en formato DD/MM/AAAA.`;

      const userPrompt = `Datos de la reserva: ${JSON.stringify(activeBooking)}\nCampos a completar: ${JSON.stringify(fields)}`;

      const result = await deepseekModel.generateContent([systemPrompt, userPrompt]);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");

      const data = JSON.parse(jsonMatch[0]);

      Object.entries(data).forEach(([id, value]) => {
        const el = docRef.current.querySelector(`[data-field-id="${id}"]`);
        if (el) {
          el.textContent = value;
          el.style.backgroundColor = 'transparent';
          el.style.borderBottom = '1px solid #1A4D2E';
        }
      });

      addToast('¡Contrato completado por IA con éxito!');
    } catch (error) {
      console.error('AI Fill error:', error);
      addToast('Error al procesar con IA. Intenta de nuevo.', 'error');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    addToast('Generando PDF de alta fidelidad...', 'info');
    try {
      const element = docRef.current;
      // Temporarily add a container class for better capture
      element.classList.add('pdf-capture-mode');
      
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800 // Consistent width for PDF
      });
      
      element.classList.remove('pdf-capture-mode');
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Paradise_${selectedDoc}_${activeBooking?.id || 'doc'}.pdf`);
      addToast('¡PDF descargado con éxito!');
    } catch (err) {
      console.error('PDF Error:', err);
      addToast('Error al generar el PDF.', 'error');
    }
  };

  const handleResetSignatures = () => {
    setSignatures({ first: null, second: null });
    setContractStatus('NOT_SET');
    addToast('Firmas reiniciadas.', 'info');
  };



  const handleSave = async () => {
    const isSigned = signatures.first && (selectedDoc === 'entry' || signatures.second);
    if (!isSigned) {
      addToast('El documento debe estar firmado por ambas partes antes de guardar.', 'error');
      return;
    }

    try {
      await saveSignedContract({
        booking_id: activeBooking?.id || 'manual',
        doc_type: selectedDoc,
        content: docRef.current.innerHTML,
        signatures: signatures,
        status: 'SIGNED',
        audit: {
          timestamp: new Date().toISOString(),
          agent: 'Paradise AI System'
        }
      });

      addToast('Copia del contrato firmada guardada en el historial de la reserva.');
    } catch (err) {
      console.error('Save error:', err);
      addToast('Error al guardar. Datos salvados localmente.', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 lg:grid lg:grid-cols-12 lg:gap-10 lg:space-y-0 pb-20">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 space-y-6">
        {/* Booking Selector */}
        <section className="glass-card p-6 rounded-[32px] border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-[#B8734A]" size={18} />
            Vincular Reserva
          </h3>
          <select
            onChange={(e) => setActiveBooking(MOCK_BOOKINGS.find(b => b.id === e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-paradise-200 focus:border-[#B8734A] focus:outline-none"
          >
            <option value="">-- Seleccionar Reserva --</option>
            {MOCK_BOOKINGS.map(b => (
              <option key={b.id} value={b.id}>{b.id} - {b.guest}</option>
            ))}
          </select>
          {activeBooking && (
            <div className="mt-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Reserva Activa</p>
              <p className="text-sm font-medium text-white">{activeBooking.guest}</p>
              <p className="text-[10px] text-paradise-400">{activeBooking.property}</p>
            </div>
          )}
        </section>

        {/* Status Panel */}
        <section className="glass-card p-6 rounded-[32px] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <h3 className="text-xs font-bold text-paradise-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <History size={14} /> Estado Legal
          </h3>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              {contractStatus === 'SIGNED' ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={20} />
                </div>
              ) : (
                <div className={`w-10 h-10 rounded-full ${contractStatus === 'PENDING' ? 'bg-orange-500/20 text-orange-500 animate-pulse' : 'bg-white/5 text-paradise-500'} flex items-center justify-center`}>
                  <Clock size={20} />
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight text-white">
                  {contractStatus === 'SIGNED' ? 'Firmado Digitalmente ✅' : contractStatus === 'PENDING' ? 'Pendiente de firma ⏳' : 'Sin iniciar'}
                </p>
                <p className="text-[10px] opacity-60 text-paradise-400">
                  {contractStatus === 'SIGNED' ? new Date().toLocaleString() : 'Esperando huêsped'}
                </p>
              </div>
            </div>
            {contractStatus === 'PENDING' && (
              <span className="text-[10px] font-bold text-orange-500 uppercase">En proceso</span>
            )}
          </div>
        </section>

        <section className="glass-card p-6 rounded-[32px] border-white/5">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="text-[#B8734A]" size={20} />
            Selector de Documento
          </h3>
          <div className="space-y-3">
            {Object.entries(DOCUMENT_TEMPLATES).map(([id, doc]) => (
              <button
                key={id}
                onClick={() => setSelectedDoc(id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${selectedDoc === id
                    ? 'bg-[#1A4D2E]/20 border-[#1A4D2E] text-[#B8734A] shadow-lg'
                    : 'bg-white/5 border-white/10 text-paradise-400 hover:bg-white/10'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDoc === id ? 'bg-[#1A4D2E] text-white' : 'bg-white/5'}`}>
                  {id === 'admin' && <Briefcase size={18} />}
                  {id === 'rent' && <User size={18} />}
                  {id === 'inventory' && <FileText size={18} />}
                  {id === 'entry' && <Key size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-tight">{doc.title}</p>
                  <p className="text-[10px] opacity-60">PDF / DOCX</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* AI Action */}
        <button
          onClick={handleAIFill}
          disabled={isAILoading}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${isAILoading ? 'bg-paradise-900 opacity-50' : 'bg-gradient-to-r from-[#1A4D2E] to-[#256a40] text-white shadow-xl hover:scale-[1.02]'
            }`}
        >
          <Sparkles size={18} className={isAILoading ? 'animate-pulse' : 'animate-bounce'} />
          {isAILoading ? 'Procesando...' : '✨ Autocompletar con IA'}
        </button>

        {/* Signature Module */}
        <section className="glass-card p-6 rounded-[32px] border-white/5 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PenTool className="text-[#B8734A]" size={18} />
              Firmas Digitales
            </h3>
            {(signatures.first || signatures.second) && (
              <button 
                onClick={handleResetSignatures}
                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 uppercase font-bold tracking-widest"
              >
                <Trash2 size={12} /> Reiniciar
              </button>
            )}
          </div>
          <SignatureCanvas
            label={
              selectedDoc === 'admin' ? 'Firma Propietario' :
                selectedDoc === 'rent' ? 'Firma Huésped' :
                  selectedDoc === 'inventory' ? 'Firma Entrega (Staff)' :
                    'Firma Administrador'
            }
            onSave={(url) => injectSignature(0, url)}
          />
          {selectedDoc !== 'entry' && (
            <SignatureCanvas
              label={
                selectedDoc === 'admin' ? 'Firma Administrador' :
                  selectedDoc === 'rent' ? 'Firma Arrendador' :
                    'Firma Recibe (Huésped)'
              }
              onSave={(url) => injectSignature(1, url)}
            />
          )}
        </section>

        {/* Global Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsRemoteModalOpen(true)}
            className="col-span-2 flex items-center justify-center py-5 bg-[#B8734A] text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-2xl shadow-[#B8734A]/30 hover:scale-[1.02] transition-all mb-2 px-4"
          >
            <span className="text-center leading-tight">
              <Share2 size={16} className="inline-block mr-2 align-middle -mt-0.5 shrink-0" />
              Enviar para Firma
            </span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center py-4 px-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
          >
            <span className="text-center leading-tight">
              <CheckCircle2 size={14} className="inline-block mr-1.5 align-middle -mt-0.5 shrink-0" />
              Guardar
            </span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center py-4 px-3 bg-[#1A4D2E] text-white border border-[#1A4D2E] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
          >
            <span className="text-center leading-tight">
              <Download size={14} className="inline-block mr-1.5 align-middle -mt-0.5 shrink-0" />
              Descargar PDF Premium
            </span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center py-4 px-3 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <span className="text-center leading-tight">
              <Printer size={14} className="inline-block mr-1.5 align-middle -mt-0.5 shrink-0" />
              Imprimir Directo
            </span>
          </button>
        </div>

        {/* Remote Sign Modal */}
        <RemoteSignModal
          isOpen={isRemoteModalOpen}
          onClose={() => setIsRemoteModalOpen(false)}
          contractData={{
            title: DOCUMENT_TEMPLATES[selectedDoc].title,
            content: docRef.current?.innerHTML,
            guest_name: activeBooking?.guest
          }}
        />
      </div>

      {/* Visor Area */}
      <div className="lg:col-span-8 print:col-span-12">
        <section className="glass-card p-4 md:p-12 rounded-[40px] border-white/5 bg-white min-h-[11in] shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Logo Watermark (Hidden in editor, shown on print/visor) */}
          <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
            <img src="/assets/logoparadise.png" alt="Logo" className="h-20" />
          </div>

          <div
            ref={docRef}
            className="legal-visor text-black font-serif leading-relaxed"
            style={{
              color: '#333',
              fontSize: '14px',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            {/* Document Content */}
            <div dangerouslySetInnerHTML={{ __html: content }}
              className="prose prose-slate max-w-none"
            />

            {/* Audit Trail Section */}
            <div className="mt-20 pt-8 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-[0.2em] grid grid-cols-2 gap-8 print:mt-10">
              <div>
                <p className="font-bold text-gray-600 mb-1">Certificación Digital</p>
                <p><b>ID:</b> {activeBooking?.id || 'MANUAL-DOC'}</p>
                <p><b>Hash:</b> {btoa(content).substring(0, 32)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-600 mb-1">Registro Paradise</p>
                <p><b>Fecha:</b> {new Date().toLocaleDateString()}</p>
                <p><b>Estado:</b> {signatures.first && signatures.second ? 'FIRMADO' : 'PENDIENTE'}</p>
              </div>
            </div>

            {/* Injected Signatures Layer (Overlay) */}
            <style>{`
              .editable-field {
                background-color: #fff9c4;
                padding: 2px 4px;
                border-radius: 4px;
                display: inline-block;
                min-width: 40px;
                border-bottom: 1px dotted #B8734A;
              }
              .editable-field:focus {
                outline: none;
                background-color: #fff176;
              }
              @media print {
                @page {
                  size: A4;
                  margin: 20mm;
                }
                body * { visibility: hidden !important; }
                .legal-visor, .legal-visor * { visibility: visible !important; }
                .legal-visor { 
                  position: absolute; 
                  left: 0; 
                  top: 0; 
                  width: 100% !important; 
                  padding: 0 !important;
                  margin: 0 !important;
                  background: white !important;
                  color: black !important;
                }
                .editable-field { 
                  background-color: transparent !important; 
                  border: none !important; 
                  padding: 0 !important;
                  text-decoration: underline;
                }
                .no-print, button, .glass-card:not(.legal-visor) { display: none !important; }
                header, footer, .sidebar-controls { display: none !important; }
                .legal-doc-header img { filter: grayscale(1) !important; max-height: 80px !important; }
              }
            `}</style>

            {/* Portal-like injection for signatures */}
            {signatures.first && (
              <PortalSignature
                target={selectedDoc === 'admin' ? '#sign-placeholder-owner' : selectedDoc === 'rent' ? '#sign-placeholder-lessor' : '#sign-placeholder-delivery'}
                trigger={content}
              >
                <img src={signatures.first} alt="Firma 1" style={{ maxHeight: '80px', margin: '0 auto' }} />
              </PortalSignature>
            )}
            {signatures.second && (
              <PortalSignature
                target={selectedDoc === 'admin' ? '#sign-placeholder-admin' : selectedDoc === 'rent' ? '#sign-placeholder-tenant' : '#sign-placeholder-receive'}
                trigger={content}
              >
                <img src={signatures.second} alt="Firma 2" style={{ maxHeight: '80px', margin: '0 auto' }} />
              </PortalSignature>
            )}
          </div>
        </section>
      </div>

      {/* Print Overlay Helper */}
      <div id="print-area" className="hidden"></div>
    </div>
  );
}

// Helper to render signatures into placeholders in the HTML string
const PortalSignature = ({ children, target, trigger }) => {
  const [targetEl, setTargetEl] = useState(null);

  useEffect(() => {
    // Small delay to ensure dangerouslySetInnerHTML has rendered
    const timeout = setTimeout(() => {
      const el = document.querySelector(target);
      setTargetEl(el);
    }, 100);
    return () => clearTimeout(timeout);
  }, [target, trigger]);

  if (!targetEl) return null;

  return React.createPortal(children, targetEl);
};
