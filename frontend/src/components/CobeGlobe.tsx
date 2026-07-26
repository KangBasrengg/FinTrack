import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    let phi = 0;
    let width = 0;
    
    const onResize = () => {
        if (canvasRef.current) {
            width = canvasRef.current.offsetWidth;
        }
    };
    window.addEventListener('resize', onResize);
    onResize();
    
    if (!canvasRef.current) return;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.12],
      markerColor: [0.1, 0.8, 0.5],
      glowColor: [0.05, 0.05, 0.05],
      markers: [
        { location: [-6.2088, 106.8456], size: 0.1 }, // Jakarta
        { location: [40.7128, -74.0060], size: 0.05 }, // NY
        { location: [51.5072, 0.1276], size: 0.05 }, // London
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
        state.width = width * 2;
        state.height = width * 2;
      }
    });
    
    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);
  
  return (
    <div style={{ width: '100%', maxWidth: 700, aspectRatio: 1, margin: 'auto', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          contain: 'layout paint size',
          opacity: 1,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  );
}
