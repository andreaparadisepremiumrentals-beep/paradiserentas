// --------------------------------------------------------
// ReorderableListings — drag & drop ordering for listings
// Uses @dnd-kit; persists via updateDisplayOrder (Supabase).
// --------------------------------------------------------
import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, Loader2, AlertTriangle } from 'lucide-react';
import { updateDisplayOrder } from '../lib/store';

function SortableRow({ property, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  const formatPrice = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center gap-4 px-4 py-3 rounded-2xl border bg-paradise-950/60 transition-colors ${
        isDragging
          ? 'border-emerald-500/50 bg-paradise-900/80 shadow-xl'
          : 'border-white/5 hover:border-white/10'
      }`}
    >
      <button
        type="button"
        className="p-2 rounded-lg text-paradise-500 hover:text-emerald-400 hover:bg-white/5 cursor-grab active:cursor-grabbing touch-none"
        aria-label="Reordenar"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>

      <span className="w-6 text-center text-[10px] font-black text-paradise-500 tabular-nums shrink-0">
        {index + 1}
      </span>

      {property.images?.[0] || property.image ? (
        <img
          src={property.images?.[0] || property.image}
          alt=""
          className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate">{property.title}</p>
        <p className="text-[11px] text-paradise-500 truncate">
          {property.category === 'finca' ? 'Finca' : property.category === 'apartment' ? 'Apartamento' : property.category}
          {property.location ? ` · ${property.location}` : ''}
        </p>
      </div>

      <span className="text-xs font-bold text-paradise-300 shrink-0 tabular-nums">
        {formatPrice(property.price)}
      </span>

      {property.isMock && (
        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-wider border border-amber-500/20 shrink-0">
          Mock
        </span>
      )}
    </li>
  );
}

export default function ReorderableListings({ items }) {
  const [ordered, setOrdered] = useState(items);
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error

  // Sync when parent list changes (initial load / refetch).
  useEffect(() => {
    setOrdered(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = useMemo(() => ordered.map((p) => p.id), [ordered]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setStatus('idle');
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((p) => p.id === active.id);
    const newIndex = ordered.findIndex((p) => p.id === over.id);
    const next = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(next);

    setStatus('saving');
    try {
      await updateDisplayOrder(next);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1800);
    } catch (err) {
      console.error('Reorder failed:', err);
      setStatus('error');
      // Revert on failure so the UI matches the persisted order.
      setOrdered(ordered);
    }
  };

  if (ordered.length === 0) {
    return (
      <p className="text-center text-paradise-500 text-sm italic py-8">
        No hay propiedades para ordenar.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-paradise-500 font-medium">
          Arrastra para reordenar. El cambio se guarda automáticamente.
        </p>
        <span className="flex items-center gap-2 text-[11px] font-semibold">
          {status === 'saving' && (
            <>
              <Loader2 size={14} className="animate-spin text-emerald-400" />
              <span className="text-paradise-400">Guardando…</span>
            </>
          )}
          {status === 'saved' && (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400">Guardado</span>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-red-400">Error al guardar</span>
            </>
          )}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {ordered.map((property, index) => (
              <SortableRow key={property.id} property={property} index={index} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
