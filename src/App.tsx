import { useState, useCallback } from 'react';
import { evaluate } from 'mathjs';
import { Scene3D } from './components/Scene3D';
import { Controls } from './components/Controls';
import './App.css';

interface Trajectory {
  forward: Array<[number, number, number]>;
  backward: Array<[number, number, number]>;
  speed: number;
}

function App() {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  
  const [equations, setEquations] = useState({
    dx: 'y',
    dy: '-x'
  });

  const [speed, setSpeed] = useState(1);

  const [directorField, setDirectorField] = useState({
    density: 1,
    scale: 1,
    width: 0.05,
    visible: false,
    color: '#ff0000',
    grid: {
      xMin: -5,
      xMax: 5,
      yMin: -5,
      yMax: 5,
      tMin: -5,
      tMax: 5,
      xSpacing: 1,
      ySpacing: 1,
      tSpacing: 1
    }
  });

  const [grid, setGrid] = useState({
    size: 20,
    divisions: 20,
    opacity: 1,
    primaryColor: '#6f6f6f',
    secondaryColor: '#4f4f4f'
  });

  const [vectorField2D, setVectorField2D] = useState({
    visible: false,
    scale: 1,
    width: 1.0,
    density: 1,
    color: '#00ffff'
  });

  const [t0, setT0] = useState(0);

  const solveODE = useCallback((x0: number, y0: number, t0: number, dt: number, steps: number, forward: boolean) => {
    const points: Array<[number, number, number]> = [];
    let x = x0;
    let y = y0;
    let t = t0;
    
    // If going backward in time, negate dt for all calculations
    const stepSize = forward ? dt : -dt;
    
    for (let i = 0; i < steps; i++) {
      points.push([x, y, t]);
      
      try {
        const dx = evaluate(equations.dx, { x, y, t });
        const dy = evaluate(equations.dy, { x, y, t });
        
        // RK4 method with correct stepSize
        const k1x = dx;
        const k1y = dy;
        
        const k2x = evaluate(equations.dx, { x: x + stepSize*k1x/2, y: y + stepSize*k1y/2, t: t + stepSize/2 });
        const k2y = evaluate(equations.dy, { x: x + stepSize*k1x/2, y: y + stepSize*k1y/2, t: t + stepSize/2 });
        
        const k3x = evaluate(equations.dx, { x: x + stepSize*k2x/2, y: y + stepSize*k2y/2, t: t + stepSize/2 });
        const k3y = evaluate(equations.dy, { x: x + stepSize*k2x/2, y: y + stepSize*k2y/2, t: t + stepSize/2 });
        
        const k4x = evaluate(equations.dx, { x: x + stepSize*k3x, y: y + stepSize*k3y, t: t + stepSize });
        const k4y = evaluate(equations.dy, { x: x + stepSize*k3x, y: y + stepSize*k3y, t: t + stepSize });
        
        x += stepSize * (k1x + 2*k2x + 2*k3x + k4x) / 6;
        y += stepSize * (k1y + 2*k2y + 2*k3y + k4y) / 6;
        t += stepSize;
      } catch (error) {
        console.error('Error evaluating equations:', error);
        break;
      }
    }
    
    return points;
  }, [equations]);

  const handleAddTrajectory = useCallback((x0: number, y0: number, t0: number) => {
    setT0(t0);
    const dt = 0.05;
    const steps = 200;
    
    const forwardPoints = solveODE(x0, y0, t0, dt, steps, true);
    const backwardPoints = solveODE(x0, y0, t0, dt, steps, false);
    
    setTrajectories(prev => [...prev, {
      forward: forwardPoints,
      backward: backwardPoints,
      speed
    }]);
  }, [solveODE, speed]);

  const handleUpdateEquations = useCallback((dx: string, dy: string) => {
    setEquations({ dx, dy });
  }, []);

  const handleResetTrajectories = useCallback(() => {
    setTrajectories([]);
  }, []);

  const handleUpdateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleUpdateDirectorField = useCallback((settings: {
    density: number;
    scale: number;
    showPlanes: 'xy' | 'xt' | 'yt' | 'all';
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
    }
  }) => {
    setDirectorField(settings);
  }, []);

  const handleGridUpdate = useCallback((newSettings: typeof grid) => {
    setGrid(newSettings);
  }, []);

  const handleVectorField2DUpdate = useCallback((settings: typeof vectorField2D) => {
    setVectorField2D(settings);
  }, []);

  const handleT0Update = useCallback((newT0: number) => {
    setT0(newT0);
  }, []);

  return (
    <div style={{ 
      width: '100vw',
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      backgroundColor: '#2a2a2a'
    }}>
      <div style={{ 
        width: '300px', 
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid #ccc',
        backgroundColor: '#1a1a1a',
        padding: '10px'
      }}>
        <Controls
          onAddTrajectory={handleAddTrajectory}
          onUpdateEquations={handleUpdateEquations}
          onResetTrajectories={handleResetTrajectories}
          onUpdateSpeed={handleUpdateSpeed}
          onUpdateDirectorField={handleUpdateDirectorField}
          onUpdateGrid={handleGridUpdate}
          onUpdateVectorField2D={handleVectorField2DUpdate}
          onUpdateT0={handleT0Update}
          directorField={directorField}
          grid={grid}
          vectorField2D={vectorField2D}
          t0={t0}
        />
      </div>
      <div style={{ 
        flex: 1,
        height: '100%',
        position: 'relative'
      }}>
        <Scene3D 
          trajectories={trajectories}
          equations={equations}
          directorField={directorField}
          grid={grid}
          vectorField2D={vectorField2D}
          t0={t0}
        />
      </div>
    </div>
  );
}

export default App;
