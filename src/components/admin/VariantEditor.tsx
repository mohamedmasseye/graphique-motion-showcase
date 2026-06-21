import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';

export interface VariantData {
  id?: string;
  name: string;
  sku: string;
  price: number;
  compare_price: number | null;
  stock: number;
  attributes: Record<string, string>;
  is_default: boolean;
  sort_order: number;
}

interface Props {
  variants: VariantData[];
  onChange: (variants: VariantData[]) => void;
}

const inputClass = "w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-xs placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all";

export default function VariantEditor({ variants, onChange }: Props) {
  const [expanded, setExpanded] = useState<number | null>(variants.length > 0 ? 0 : null);

  const addVariant = () => {
    const newVariant: VariantData = {
      name: '',
      sku: '',
      price: 0,
      compare_price: null,
      stock: 0,
      attributes: {},
      is_default: variants.length === 0,
      sort_order: variants.length,
    };
    onChange([...variants, newVariant]);
    setExpanded(variants.length);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = variants.map((v, i) => i === index ? { ...v, [field]: value } : v);
    onChange(updated);
  };

  const removeVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some(v => v.is_default)) {
      updated[0].is_default = true;
    }
    onChange(updated);
    setExpanded(null);
  };

  const setDefault = (index: number) => {
    const updated = variants.map((v, i) => ({ ...v, is_default: i === index }));
    onChange(updated);
  };

  const updateAttribute = (index: number, key: string, value: string) => {
    const attrs = { ...variants[index].attributes, [key]: value };
    updateVariant(index, 'attributes', attrs);
  };

  const addAttribute = (index: number) => {
    const key = `Attribut ${Object.keys(variants[index].attributes).length + 1}`;
    updateAttribute(index, key, '');
  };

  const removeAttribute = (index: number, key: string) => {
    const attrs = { ...variants[index].attributes };
    delete attrs[key];
    updateVariant(index, 'attributes', attrs);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">
          Variantes ({variants.length})
        </label>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1 text-brand-teal text-xs font-semibold hover:text-brand-teal/80 transition-colors"
        >
          <Plus size={12} /> Ajouter
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-xl p-4 text-center">
          <p className="text-white/25 text-xs">Pas de variantes — prix et stock uniques</p>
          <button
            type="button"
            onClick={addVariant}
            className="text-brand-teal text-xs mt-2 hover:underline"
          >
            + Ajouter une variante (taille, couleur, kit...)
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              {/* Header */}
              <button
                type="button"
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {v.is_default && (
                    <span className="text-[8px] bg-brand-teal/20 text-brand-teal px-1.5 py-0.5 rounded font-bold">PAR DÉFAUT</span>
                  )}
                  <span className="text-white text-sm font-semibold">{v.name || `Variante ${i + 1}`}</span>
                  <span className="text-white/30 text-xs">{formatPrice(v.price)} · stock: {v.stock}</span>
                </div>
                {expanded === i ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
              </button>

              {/* Expanded content */}
              {expanded === i && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06]">
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-white/40 text-[10px] font-semibold uppercase mb-1">Nom *</label>
                      <input
                        value={v.name}
                        onChange={(e) => updateVariant(i, 'name', e.target.value)}
                        className={inputClass}
                        placeholder="Kit Body Only"
                      />
                    </div>
                    <div>
                      <label className="block text-white/40 text-[10px] font-semibold uppercase mb-1">SKU</label>
                      <input
                        value={v.sku}
                        onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                        className={inputClass}
                        placeholder="CAM-001-BK"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/40 text-[10px] font-semibold uppercase mb-1">Prix (FCFA) *</label>
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-white/40 text-[10px] font-semibold uppercase mb-1">Ancien prix</label>
                      <input
                        type="number"
                        value={v.compare_price ?? ''}
                        onChange={(e) => updateVariant(i, 'compare_price', e.target.value ? Number(e.target.value) : null)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-white/40 text-[10px] font-semibold uppercase mb-1">Stock *</label>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Attributes */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-white/40 text-[10px] font-semibold uppercase">Attributs (couleur, taille...)</label>
                      <button type="button" onClick={() => addAttribute(i)} className="text-brand-teal text-[10px] font-semibold hover:underline">
                        + Attribut
                      </button>
                    </div>
                    {Object.entries(v.attributes).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 mb-1.5">
                        <input
                          value={key}
                          onChange={(e) => {
                            const attrs = { ...v.attributes };
                            const oldVal = attrs[key];
                            delete attrs[key];
                            attrs[e.target.value] = oldVal;
                            updateVariant(i, 'attributes', attrs);
                          }}
                          className={`${inputClass} flex-1`}
                          placeholder="Couleur"
                        />
                        <input
                          value={val}
                          onChange={(e) => updateAttribute(i, key, e.target.value)}
                          className={`${inputClass} flex-1`}
                          placeholder="Noir"
                        />
                        <button type="button" onClick={() => removeAttribute(i, key)} className="text-white/20 hover:text-red-400 shrink-0">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    {!v.is_default ? (
                      <button type="button" onClick={() => setDefault(i)} className="text-brand-teal text-[10px] font-semibold hover:underline">
                        Définir par défaut
                      </button>
                    ) : (
                      <span className="text-white/20 text-[10px]">Variante par défaut</span>
                    )}
                    <button type="button" onClick={() => removeVariant(i)} className="text-red-400/60 hover:text-red-400 text-[10px] font-semibold flex items-center gap-1">
                      <Trash2 size={10} /> Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function X({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
