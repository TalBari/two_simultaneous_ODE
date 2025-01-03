import React, { useRef, useEffect } from 'react';
import { evaluate } from 'mathjs';

interface InitialPointSelectorProps {
  t0: number;
  onSelectPoint: (x: number, y: number) => void;
  equations: {
    dx: string;
    dy: string;
  };
}

export const InitialPointSelector = ({ t0, onSelectPoint, equations }: InitialPointSelectorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw grid and handle mouse interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas size and scale
    const size = 400; 
    canvas.width = size;
    canvas.height = size;
    const scale = size / 10; 

    // Clear canvas with a darker background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, size, size);

    // Draw grid
    ctx.strokeStyle = '#2f2f2f'; 
    ctx.lineWidth = 1;

    // Draw grid lines
    for (let i = 0; i <= 10; i++) {
      const pos = i * scale;
      
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Draw axes
    const center = size / 2;

    // X-axis
    ctx.strokeStyle = '#ff0000'; 
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, center);
    ctx.lineTo(size, center);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(center, 0);
    ctx.lineTo(center, size);
    ctx.stroke();

    // Draw vector field
    const spacing = scale / 4; 
    const arrowSize = scale / 8; 

    for (let x = spacing; x < size; x += spacing) {
      for (let y = spacing; y < size; y += spacing) {
        // Convert to coordinate system
        const xCoord = (x / scale) - 5;
        const yCoord = -((y / scale) - 5);

        try {
          // Calculate vector components
          const dx = evaluate(equations.dx, { x: xCoord, y: yCoord, t: t0 });
          const dy = evaluate(equations.dy, { x: xCoord, y: yCoord, t: t0 });

          // Normalize vector
          const mag = Math.sqrt(dx * dx + dy * dy);
          if (mag > 0) {
            const normalizedDx = (dx / mag) * arrowSize;
            const normalizedDy = -(dy / mag) * arrowSize; 

            // Draw arrow
            ctx.beginPath();
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1.5;
            ctx.moveTo(x, y);
            ctx.lineTo(x + normalizedDx, y + normalizedDy);

            // Draw arrowhead
            const angle = Math.atan2(normalizedDy, normalizedDx);
            const headLength = arrowSize * 0.4;
            const headAngle = Math.PI / 6;

            ctx.lineTo(
              x + normalizedDx - headLength * Math.cos(angle - headAngle),
              y + normalizedDy - headLength * Math.sin(angle - headAngle)
            );
            ctx.moveTo(x + normalizedDx, y + normalizedDy);
            ctx.lineTo(
              x + normalizedDx - headLength * Math.cos(angle + headAngle),
              y + normalizedDy - headLength * Math.sin(angle + headAngle)
            );
            ctx.stroke();
          }
        } catch (e) {
          // Skip invalid points
        }
      }
    }

    // Add labels
    ctx.fillStyle = '#8f8f8f'; 
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // X-axis labels
    for (let i = -5; i <= 5; i++) {
      if (i !== 0) {
        const x = (i + 5) * scale;
        ctx.fillText(i.toString(), x, center + 20);
      }
    }

    // Y-axis labels
    for (let i = -5; i <= 5; i++) {
      if (i !== 0) {
        const y = (i + 5) * scale;
        ctx.fillText((-i).toString(), center + 20, y);
      }
    }

    // Add t₀ label
    ctx.fillStyle = '#00ffff'; 
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`t = ${t0.toFixed(2)}`, size - 60, 30);
  }, [t0, equations]);

  // Handle click events
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to our coordinate system (-5 to 5)
    const scale = canvas.width / 10;
    const coordX = (x / scale) - 5;
    const coordY = -((y / scale) - 5); 

    onSelectPoint(coordX, coordY);

    // Draw point
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw point with glow effect
    ctx.fillStyle = '#ffa500'; 
    ctx.shadowColor = '#ffa500'; 
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#2a2a2a',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ 
          cursor: 'crosshair',
          border: '2px solid #3f3f3f',
          borderRadius: '8px'
        }}
      />
      <div style={{ 
        marginTop: '10px', 
        color: '#8f8f8f', 
        fontSize: '14px' 
      }}>
        Click to add a trajectory at t = {t0.toFixed(2)}
      </div>
    </div>
  );
};
