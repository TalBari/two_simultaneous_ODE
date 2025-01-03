import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

interface TrajectoryProps {
  forwardPoints: Array<[number, number, number]>;
  backwardPoints: Array<[number, number, number]>;
  speed: number;
}

export const Trajectory = ({ forwardPoints, backwardPoints, speed }: TrajectoryProps) => {
  const [visibleForwardPoints, setVisibleForwardPoints] = useState<Array<[number, number, number]>>([]);
  const [visibleBackwardPoints, setVisibleBackwardPoints] = useState<Array<[number, number, number]>>([]);
  const progressRef = useRef(0);

  useEffect(() => {
    // Reset progress when points change
    progressRef.current = 0;
    setVisibleForwardPoints([forwardPoints[0]]);
    setVisibleBackwardPoints([backwardPoints[0]]);
  }, [forwardPoints, backwardPoints]);

  useFrame((state, delta) => {
    // Update progress based on speed and delta time
    progressRef.current += delta * speed;

    // Calculate points to show
    const pointsPerSecond = 50; // How many points to add per second at speed=1
    const totalPointsToShow = Math.floor(progressRef.current * pointsPerSecond);

    // Show equal number of points in both directions
    const pointsEachDirection = Math.min(
      totalPointsToShow,
      Math.min(forwardPoints.length, backwardPoints.length)
    );

    setVisibleForwardPoints(forwardPoints.slice(0, pointsEachDirection));
    setVisibleBackwardPoints(backwardPoints.slice(0, pointsEachDirection));
  });

  return (
    <group>
      {/* Forward trajectory (green) */}
      {visibleForwardPoints.length > 1 && (
        <Line
          points={visibleForwardPoints}
          color="#4CAF50"
          lineWidth={2}
        />
      )}

      {/* Backward trajectory (magenta) */}
      {visibleBackwardPoints.length > 1 && (
        <Line
          points={visibleBackwardPoints}
          color="#e91e63"
          lineWidth={2}
        />
      )}

      {/* Initial point (blue sphere) */}
      {visibleForwardPoints.length > 0 && (
        <mesh position={[forwardPoints[0][0], forwardPoints[0][1], forwardPoints[0][2]]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#2196F3" />
        </mesh>
      )}
    </group>
  );
};
