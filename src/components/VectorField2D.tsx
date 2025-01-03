import { evaluate } from 'mathjs';
import { Line } from '@react-three/drei';
import { useMemo } from 'react';

interface VectorField2DProps {
  dx: string;
  dy: string;
  t0: number;
  scale: number;
  width: number;
  color: string;
  grid: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    spacing: number;
  };
}

export const VectorField2D = ({
  dx,
  dy,
  t0,
  scale,
  width,
  color,
  grid,
}: VectorField2DProps) => {
  const vectors = useMemo(() => {
    const points: Array<[number, number, number]> = [];
    const lines: Array<[number, number, number]> = [];

    for (let x = grid.xMin; x <= grid.xMax; x += grid.spacing) {
      for (let y = grid.yMin; y <= grid.yMax; y += grid.spacing) {
        try {
          const scope = { x, y, t: t0 };
          const dxValue = evaluate(dx, scope);
          const dyValue = evaluate(dy, scope);
          
          // Skip if both values are 0
          if (Math.abs(dxValue) < 1e-10 && Math.abs(dyValue) < 1e-10) continue;
          
          const mag = Math.sqrt(dxValue * dxValue + dyValue * dyValue);
          const normDx = (dxValue / mag) * scale;
          const normDy = (dyValue / mag) * scale;

          // Add arrow shaft
          points.push([x, y, t0]);
          lines.push([x + normDx, y + normDy, t0]);

          // Add arrowhead
          const headLength = scale * 0.2;
          const headAngle = Math.PI / 6;

          // Calculate perpendicular vector for arrowhead
          const perpX = -normDy / scale;
          const perpY = normDx / scale;

          // Right head
          points.push([x + normDx, y + normDy, t0]);
          lines.push([
            x + normDx - (normDx/scale * Math.cos(headAngle) + perpX * Math.sin(headAngle)) * headLength,
            y + normDy - (normDy/scale * Math.cos(headAngle) + perpY * Math.sin(headAngle)) * headLength,
            t0
          ]);

          // Left head
          points.push([x + normDx, y + normDy, t0]);
          lines.push([
            x + normDx - (normDx/scale * Math.cos(headAngle) - perpX * Math.sin(headAngle)) * headLength,
            y + normDy - (normDy/scale * Math.cos(headAngle) - perpY * Math.sin(headAngle)) * headLength,
            t0
          ]);
        } catch (e) {
          // Skip invalid points
          console.error('Error calculating vector:', e);
        }
      }
    }

    return { points, lines };
  }, [dx, dy, t0, scale, grid]);

  return (
    <group position={[0, 0, t0]}>
      {vectors.points.map((start, i) => (
        <Line
          key={`vector-${i}`}
          points={[
            [start[0], start[1], 0],
            [vectors.lines[i][0], vectors.lines[i][1], 0]
          ]}
          color={color}
          lineWidth={width}
        />
      ))}
    </group>
  );
};
