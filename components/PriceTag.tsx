
import React, { useRef, useEffect, useState } from 'react';
import { TagData } from '../types';

interface PriceTagProps {
  data: TagData;
  customBg?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({ data, customBg }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  const backgroundImage = customBg || "https://www.vdar.com.ar/carteles/base-carteles.jpg";

  const MASTER_WIDTH = 1122;
  const MASTER_HEIGHT = 794;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && containerRef.current.parentElement) {
        const parent = containerRef.current.parentElement;
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;
        
        const scaleW = parentWidth / MASTER_WIDTH;
        const scaleH = parentHeight / MASTER_HEIGHT;
        setScale(Math.min(scaleW, scaleH));
      }
    };

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-white overflow-hidden flex items-center justify-center"
    >
      <div 
        className="absolute origin-center font-['Exo'] select-none flex-shrink-0"
        style={{ 
          width: `${MASTER_WIDTH}px`, 
          height: `${MASTER_HEIGHT}px`,
          transform: `scale(${scale})`
        }}
      >
        <img 
          src={backgroundImage} 
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ display: 'block', zIndex: -1 }}
        />

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <div className="absolute top-[21.5%] left-0 w-full flex flex-col items-center text-center px-[8%]">
            <h2 className="text-[#1a75bb] text-[36px] font-bold leading-tight uppercase max-w-full truncate">
              {data.productDescription}
            </h2>
            <h3 className="text-[#1a75bb] text-[36px] font-bold leading-tight uppercase -mt-1">
              {data.brand}
            </h3>
            <p className="text-[#1a75bb] text-[12px] font-black mt-1 uppercase tracking-tighter">
              {data.code}
            </p>
          </div>

          <div className="absolute top-[39%] left-0 w-full h-[38%]">
            <div className="absolute left-0 top-0 w-[42%] h-full flex flex-col items-center justify-start pt-[3%] pr-[5%]">
              <span className="text-white text-[179px] font-black italic leading-[0.7] tracking-tighter">
                {data.installmentsCount}
              </span>
              <div className="text-white text-[23.3px] font-normal italic uppercase text-center leading-[1.1] whitespace-pre-line max-w-[95%] mt-4 relative -top-[3%]">
                {data.installmentsText}
              </div>
            </div>

            <div className="absolute left-[42%] right-0 top-0 h-full flex items-center justify-center pr-[2%]">
              <div className="flex items-center text-[#1a75bb] italic font-black pb-[2%] relative -top-[10%] -left-[10%]">
                <span className="text-[108px] font-light mr-1 italic leading-none">$</span>
                <span className="text-[175px] leading-[0.8] tracking-tighter">
                  {data.installmentsPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[10%] left-0 w-full flex flex-col items-center">
            <div className="flex items-center text-[#1a75bb] italic font-black">
              <span className="text-[68px] font-light mr-1 italic leading-none">$</span>
              <span className="text-[100px] leading-none tracking-tight">
                {data.listPrice}
              </span>
            </div>
          </div>

          <div className="absolute bottom-[3%] left-[6%]">
            <span className="text-white text-[15.5px] font-light italic uppercase tracking-wider">
              {data.validityDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PriceTag);
