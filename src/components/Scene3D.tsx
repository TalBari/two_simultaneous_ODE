import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Text, Grid, PlaneGeometry, MeshBasicMaterial } from '@react-three/drei';
import { Trajectory } from './Trajectory';
import { DirectorField } from './DirectorField';
import { VectorField2D } from './VectorField2D';

interface Scene3DProps {
  trajectories: Array<{
    forward: Array<[number, number, number]>;
    backward: Array<[number, number, number]>;
    speed: number;
  }>;
  equations: {
    dx: string;
    dy: string;
  };
  directorField: {
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
  };
  grid: {
    size: number;
    divisions: number;
    opacity: number;
    primaryColor: string;
    secondaryColor: string;
  };
  vectorField2D: {
    visible: boolean;
    scale: number;
    width: number;
    density: number;
    color: string;
  };
  t0: number;
}

export const Scene3D = ({ 
  trajectories, 
  equations, 
  directorField, 
  grid, 
  vectorField2D,
  t0 
}: Scene3DProps) => {
  // Create points for axes
  const xAxisPoints = [[-10, 0, 0], [10, 0, 0]];
  const yAxisPoints = [[0, -10, 0], [0, 10, 0]];
  const tAxisPoints = [[0, 0, -10], [0, 0, 10]];

  return (
    <Canvas
      camera={{ position: [15, 15, 15], fov: 50 }}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute',
        top: 0,
        left: 0,
        background: '#1a1a1a' 
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Grid in x-y plane */}
      <group>
        <gridHelper 
          args={[grid.size, grid.divisions, grid.primaryColor, grid.secondaryColor]} 
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial attach="material" transparent opacity={grid.opacity} />
        </gridHelper>
      </group>
      
      {/* Axes */}
      <group>
        {/* X-axis (red) */}
        <Line
          points={xAxisPoints}
          color="red"
          lineWidth={2}
        />
        <Text 
          position={[11, 0, 0]}
          color="red"
          fontSize={0.5}
          anchorX="left"
        >
          X
        </Text>
        
        {/* Y-axis (red) */}
        <Line
          points={yAxisPoints}
          color="red"
          lineWidth={2}
        />
        <Text 
          position={[0, 11, 0]}
          color="red"
          fontSize={0.5}
          anchorX="left"
        >
          Y
        </Text>
        
        {/* T-axis (blue) */}
        <Line
          points={tAxisPoints}
          color="blue"
          lineWidth={2}
        />
        <Text 
          position={[0, 0, 11]}
          color="blue"
          fontSize={0.5}
          anchorX="left"
        >
          T
        </Text>
      </group>

      {/* Director Field */}
      {directorField.visible && (
        <DirectorField
          dx={equations.dx}
          dy={equations.dy}
          scale={directorField.scale}
          width={directorField.width}
          visible={true}
          color={directorField.color}
          grid={directorField.grid}
          density={directorField.density}
        />
      )}

      {/* 2D Vector Field at t=t0 */}
      {vectorField2D.visible && (
        <group>
          <group position={[0, 0, t0]}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
              <planeGeometry args={[10, 10]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={2} />
            </mesh>
          </group>
          <VectorField2D
            dx={equations.dx}
            dy={equations.dy}
            t0={t0}
            scale={vectorField2D.scale}
            width={vectorField2D.width}
            color={vectorField2D.color}
            grid={{
              xMin: -5,
              xMax: 5,
              yMin: -5,
              yMax: 5,
              spacing: 0.5 / vectorField2D.density
            }}
          />
        </group>
      )}
      
      {/* Trajectories */}
      {trajectories.map((traj, index) => (
        <Trajectory
          key={index}
          forwardPoints={traj.forward}
          backwardPoints={traj.backward}
          speed={traj.speed}
        />
      ))}
      
      <OrbitControls 
        enableDamping={false}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
};
