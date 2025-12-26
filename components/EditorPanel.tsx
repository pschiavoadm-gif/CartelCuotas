
import React, { useState } from 'react';
import { TagData, LayoutMode } from '../types';

interface EditorPanelProps {
  tags: TagData[];
  onChange: (index: number, newData: TagData) => void;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ 
  tags, 
  onChange, 
  layoutMode, 
  onLayoutChange
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const tagCount = layoutMode === '1x' ? 1 : layoutMode === '2x' ? 2 : 4;
  const currentActiveTab = Math.min(activeTab, tagCount - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(currentActiveTab, {
      ...tags[currentActiveTab],
      [name]: value
    });
  };

  return (
    <div className="bg-white p-6 shadow-2xl rounded-3xl flex flex-col gap-4 no-print max-h-[92vh] overflow-y-auto w-full lg:w-[400px] border border-gray-100 sticky top-4">
      <h2 className="text-xl font-black text-[#1a75bb] uppercase border-b-4 border-[#1a75bb] pb-1">Editor de Etiquetas</h2>
      
      <div className="bg-blue-50/50 p-3 rounded-2xl">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Formato A4</label>
        <div className="flex gap-2">
          {(['1x', '2x', '4x'] as LayoutMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => onLayoutChange(mode)}
              className={`flex-1 py-2 px-1 rounded-xl font-black text-[10px] transition-all border-2 ${
                layoutMode === mode 
                ? 'bg-[#1a75bb] text-white border-[#1a75bb]' 
                : 'bg-white text-gray-400 border-gray-200'
              }`}
            >
              {mode === '1x' ? '1 x Hoja' : mode === '2x' ? '2 x Hoja' : '4 x Hoja'}
            </button>
          ))}
        </div>
      </div>

      {tagCount > 1 && (
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {Array.from({ length: tagCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                currentActiveTab === i 
                ? 'bg-[#1a75bb] text-white' 
                : 'text-gray-500'
              }`}
            >
              ETIQ. {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3 overflow-y-auto pr-1">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción Producto</label>
          <input 
            type="text" name="productDescription" value={tags[currentActiveTab].productDescription} onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 focus:border-[#1a75bb] outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Marca</label>
            <input 
              type="text" name="brand" value={tags[currentActiveTab].brand} onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Código</label>
            <input 
              type="text" name="code" value={tags[currentActiveTab].code} onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 outline-none"
            />
          </div>
        </div>

        <div className="bg-[#1a75bb]/5 p-3 rounded-2xl space-y-3 border border-[#1a75bb]/10">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#1a75bb] uppercase tracking-widest ml-1">Nº Cuotas</label>
              <input 
                type="text" name="installmentsCount" value={tags[currentActiveTab].installmentsCount} onChange={handleChange}
                className="w-full p-2.5 border-2 border-[#1a75bb]/20 rounded-xl font-black text-[#1a75bb] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#1a75bb] uppercase tracking-widest ml-1">Valor Cuota</label>
              <input 
                type="text" name="installmentsPrice" value={tags[currentActiveTab].installmentsPrice} onChange={handleChange}
                className="w-full p-2.5 border-2 border-[#1a75bb]/20 rounded-xl font-black text-[#1a75bb] outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1a75bb] uppercase tracking-widest ml-1">Texto Cuotas</label>
            <textarea 
              name="installmentsText" value={tags[currentActiveTab].installmentsText} onChange={handleChange}
              rows={2}
              className="w-full p-2.5 border-2 border-[#1a75bb]/20 rounded-xl font-bold text-[#1a75bb] outline-none resize-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio Lista</label>
          <input 
            type="text" name="listPrice" value={tags[currentActiveTab].listPrice} onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-black text-gray-700 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vigencia</label>
          <input 
            type="text" name="validityDate" value={tags[currentActiveTab].validityDate} onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
