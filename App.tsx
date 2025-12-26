
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TagData, LayoutMode } from './types';
import PriceTag from './components/PriceTag';
import EditorPanel from './components/EditorPanel';

const createInitialTag = (id: number): TagData => ({
  id,
  productDescription: "DESCRIPCIÓN DE PRODUCTO",
  brand: "MARCA",
  code: `CÓD. 32513`,
  installmentsCount: "24",
  installmentsText: "CUOTITAS TEXTO\nEDITABLE PARA TC Ó CP",
  installmentsPrice: "29.999",
  listPriceLabel: "PRECIO LISTA",
  listPrice: "119.999",
  validityDate: "DISPONIBLE HASTA EL 31-12-2026"
});

const App: React.FC = () => {
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [base64Bg, setBase64Bg] = useState<string>('');
  const [tags, setTags] = useState<TagData[]>([
    createInitialTag(0),
    createInitialTag(1),
    createInitialTag(2),
    createInitialTag(3)
  ]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('1x');
  const [scale, setScale] = useState(0.5);

  const isLandscape = layoutMode === '1x' || layoutMode === '4x';

  // Pre-cargar la imagen de fondo para asegurar visibilidad al imprimir mediante el navegador
  useEffect(() => {
    const imageUrl = "https://www.vdar.com.ar/carteles/base-carteles.jpg";
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Bg(reader.result as string);
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error("Error cargando fondo:", err);
        setBase64Bg(imageUrl);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = isLandscape ? 1122 : 794; 
      const availableWidth = window.innerWidth > 1024 ? window.innerWidth - 460 : window.innerWidth - 30;
      const newScale = Math.min(availableWidth / targetWidth, 1);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLandscape]);

  useEffect(() => {
    const styleId = 'print-config';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.innerHTML = `
      @media print {
        @page {
          size: A4 ${isLandscape ? 'landscape' : 'portrait'};
          margin: 0mm;
        }
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        html, body { 
          margin: 0 !important; 
          padding: 0 !important; 
          background: white !important; 
        }
        .no-print { display: none !important; }
        .print-container { 
          display: block !important;
          width: ${isLandscape ? '297mm' : '210mm'} !important; 
          height: ${isLandscape ? '210mm' : '297mm'} !important; 
          margin: 0 !important; 
          padding: 0 !important;
          transform: none !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 99999;
        }
      }
    `;
  }, [isLandscape]);

  const handleUpdateTag = useCallback((index: number, newData: TagData) => {
    setTags(prev => {
      const next = [...prev];
      next[index] = newData;
      return next;
    });
  }, []);

  const visibleTags = useMemo(() => {
    if (layoutMode === '1x') return [tags[0]];
    if (layoutMode === '2x') return [tags[0], tags[1]];
    return tags;
  }, [layoutMode, tags]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-4 lg:p-8 gap-8 bg-[#f8fafc] overflow-x-hidden">
      <div className="no-print shrink-0 w-full lg:w-auto">
        <EditorPanel 
          tags={tags} 
          onChange={handleUpdateTag} 
          layoutMode={layoutMode}
          onLayoutChange={setLayoutMode}
        />
      </div>

      <div className="flex-1 flex justify-center items-start overflow-visible pt-4 print:p-0">
        <div 
          ref={printContainerRef}
          className="print-container bg-white shadow-2xl transition-transform duration-200 origin-top flex flex-col print:m-0"
          style={{ 
            width: isLandscape ? '297mm' : '210mm', 
            height: isLandscape ? '210mm' : '297mm',
            transform: `scale(${scale})`,
          }}
        >
          <div className={`grid h-full w-full ${
            layoutMode === '1x' ? 'grid-cols-1 grid-rows-1' 
            : layoutMode === '2x' ? 'grid-cols-1 grid-rows-2' 
            : 'grid-cols-2 grid-rows-2'
          }`}>
            {visibleTags.map((tag, idx) => (
              <div key={`${tag.id}-${idx}`} className="tag-cell relative overflow-hidden h-full w-full outline outline-1 outline-gray-100 print:outline-none">
                <PriceTag data={tag} customBg={base64Bg} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
