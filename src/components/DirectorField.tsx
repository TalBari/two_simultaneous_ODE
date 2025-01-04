import { useMemo } from 'react';
import { evaluate } from 'mathjs';
import { Line } from '@react-three/drei';

interface DirectorFieldProps {
  dx: string;
  dy: string;
  density: number;
  scale: number;
  width: number;
  visible: boolean;
  color: string;
  grid: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    tMin: number;
    tMax: number;
    xSpacing: number;
    ySpacing: number;
    tSpacing: number;
  };
}

export const DirectorField = ({ 
  dx, 
  dy, 
  scale,
  width,
  visible,
  color,
  grid
}: DirectorFieldProps) => {
  const arrows = useMemo(() => {
    if (!visible) return [];

    const result: Array<Array<[number, number, number]>> = [];
    
    // Helper function to create arrow points
    const createArrow = (x: number, y: number, t: number) => {
      try {
        // Calculate dx/dt and dy/dt at this point
        const dxValue = evaluate(dx, { x, y, t });
        const dyValue = evaluate(dy, { x, y, t });

        // Create vector in (x, y, t) coordinates
        const start: [number, number, number] = [x, y, t];
        const end: [number, number, number] = [
          x + dxValue * scale,
          y + dyValue * scale,
          t + scale
        ];
        
        // Add arrowhead
        const arrowHeadLength = scale * 0.2;
        const arrowHeadAngle = Math.PI / 6;

        // Calculate direction vector
        const dirX = end[0] - start[0];
        const dirY = end[1] - start[1];
        const dirT = end[2] - start[2];
        const dirMagnitude = Math.sqrt(dirX * dirX + dirY * dirY + dirT * dirT);

        // Normalize direction vector
        const normalizedDirX = dirX / dirMagnitude;
        const normalizedDirY = dirY / dirMagnitude;
        const normalizedDirT = dirT / dirMagnitude;

        // Calculate two perpendicular vectors for the arrowhead
        const perp1X = -dy;
        const perp2Y = dy;

        // Create arrowhead points
        const rightHead: [number, number, number] = [
          end[0] - (normalizedDirX * Math.cos(arrowHeadAngle) + perp1X * Math.sin(arrowHeadAngle)) * arrowHeadLength,
          end[1] - normalizedDirY * Math.cos(arrowHeadAngle) * arrowHeadLength,
          end[2] - (normalizedDirT * Math.cos(arrowHeadAngle) + (-dy) * Math.sin(arrowHeadAngle)) * arrowHeadLength
        ];

        const leftHead: [number, number, number] = [
          end[0] - normalizedDirX * Math.cos(arrowHeadAngle) * arrowHeadLength,
          end[1] - (normalizedDirY * Math.cos(arrowHeadAngle) + perp2Y * Math.sin(arrowHeadAngle)) * arrowHeadLength,
          end[2] - (normalizedDirT * Math.cos(arrowHeadAngle) + dy * Math.sin(arrowHeadAngle)) * arrowHeadLength
        ];
        
        return [
          [start, end],
          [end, rightHead],
          [end, leftHead]
        ];
      } catch (error) {
        return null;
      }
    };

    // Generate arrows in a 3D grid based on spacing settings
    for (let x = grid.xMin; x <= grid.xMax; x += grid.xSpacing) {
      for (let y = grid.yMin; y <= grid.yMax; y += grid.ySpacing) {
        for (let t = grid.tMin; t <= grid.tMax; t += grid.tSpacing) {
          const arrow = createArrow(x, y, t);
          if (arrow) {
            result.push(...arrow);
          }
        }
      }
    }
    
    return result;
  }, [dx, dy, scale, grid, visible]);

  if (!visible) return null;

  return (
    <group>
      {arrows.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={color}
          lineWidth={width}
        />
      ))}
    </group>
  );
};
