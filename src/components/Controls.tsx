import { InitialPointSelector } from './InitialPointSelector';

interface ControlsProps {
  onAddTrajectory: (x0: number, y0: number, t0: number) => void;
  onUpdateEquations: (dx: string, dy: string) => void;
  onResetTrajectories: () => void;
  onUpdateSpeed: (speed: number) => void;
  onUpdateDirectorField: (settings: {
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
  }) => void;
  onUpdateGrid: (settings: {
    size: number;
    divisions: number;
    opacity: number;
    primaryColor: string;
    secondaryColor: string;
  }) => void;
  onUpdateVectorField2D: (settings: {
    visible: boolean;
    scale: number;
    width: number;
    density: number;
    color: string;
  }) => void;
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
  onUpdateT0: (t0: number) => void;
  t0: number;
}

export const Controls = ({
  onAddTrajectory,
  onUpdateEquations,
  onResetTrajectories,
  onUpdateSpeed,
  onUpdateDirectorField,
  onUpdateGrid,
  onUpdateVectorField2D,
  directorField,
  grid,
  vectorField2D,
  onUpdateT0,
  t0
}: ControlsProps) => {
  const [equations, setEquations] = useState({
    dx: 'y',
    dy: '-x'
  });
  
  const [speed, setSpeed] = useState(1);
  
  const [gridSize, setGridSize] = useState(grid.size);
  const [gridDivisions, setGridDivisions] = useState(grid.divisions);
  const [gridOpacity, setGridOpacity] = useState(grid.opacity);
  const [gridPrimaryColor, setGridPrimaryColor] = useState(grid.primaryColor);
  const [gridSecondaryColor, setGridSecondaryColor] = useState(grid.secondaryColor);

  const handleEquationChange = (type: 'dx' | 'dy', value: string) => {
    const newEquations = { ...equations, [type]: value };
    setEquations(newEquations);
    onUpdateEquations(newEquations.dx, newEquations.dy);
    onResetTrajectories();
  };

  const handleSpeedChange = (value: number) => {
    setSpeed(value);
    onUpdateSpeed(value);
  };

  const handleDirectorFieldChange = (
    field: 'density' | 'scale' | 'width' | 'visible' | 'color' | 'grid',
    value: number | boolean | string | { [key: string]: number }
  ) => {
    let newSettings;
    if (field === 'grid') {
      newSettings = { ...directorField, grid: value as { [key: string]: number } };
    } else {
      newSettings = { ...directorField, [field]: value };
    }
    onUpdateDirectorField(newSettings);
  };

  const handleGridChange = (
    field: 'size' | 'divisions' | 'opacity' | 'primaryColor' | 'secondaryColor',
    value: number | string
  ) => {
    let newSettings;
    newSettings = { ...grid, [field]: value };
    onUpdateGrid(newSettings);
  };

  const handleVectorField2DChange = (
    field: 'visible' | 'scale' | 'width' | 'density' | 'color',
    value: boolean | number | string
  ) => {
    const newSettings = {
      ...vectorField2D,
      [field]: value
    };
    onUpdateVectorField2D(newSettings);
  };

  const handlePointSelect = (x: number, y: number) => {
    onAddTrajectory(x, y, t0);
  };
  
  return (
    <div style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      width: '340px',
      maxHeight: '100vh',
      overflowY: 'auto'
    }}>
      <div>
        <h3>System Equations</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>dx/dt = </label>
          <input
            value={equations.dx}
            onChange={e => handleEquationChange('dx', e.target.value)}
            style={{ width: '200px', padding: '5px' }}
          />
        </div>
        <div>
          <label>dy/dt = </label>
          <input
            value={equations.dy}
            onChange={e => handleEquationChange('dy', e.target.value)}
            style={{ width: '200px', padding: '5px' }}
          />
        </div>
      </div>
      
      <div>
        <h3>Time</h3>
        <div>
          <label>t0: </label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={t0}
            onChange={(e) => onUpdateT0(parseFloat(e.target.value))}
          />
          <span>{t0.toFixed(1)}</span>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Initial Point Selection</h3>
        <InitialPointSelector
          t0={t0}
          onSelectPoint={handlePointSelect}
          equations={equations}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Animation Speed</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={speed}
            onChange={e => {
              const newSpeed = parseFloat(e.target.value);
              setSpeed(newSpeed);
              onUpdateSpeed(newSpeed);
            }}
            style={{ flex: 1 }}
          />
          <span>{speed.toFixed(1)}x</span>
        </div>
      </div>

      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px' 
        }}>
          <h3>Director Field</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={directorField.visible}
              onChange={e => handleDirectorFieldChange('visible', e.target.checked)}
            />
            Show
          </label>
        </div>

        {directorField.visible && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <h4>Arrow Properties</h4>
              <div style={{ marginBottom: '10px' }}>
                <label>Length: {directorField.scale.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={directorField.scale}
                  onChange={e => handleDirectorFieldChange('scale', parseFloat(e.target.value))}
                  style={{ width: '100%', margin: '5px 0' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Width: {directorField.width.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={directorField.width}
                  onChange={e => handleDirectorFieldChange('width', parseFloat(e.target.value))}
                  style={{ width: '100%', margin: '5px 0' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Color: </label>
                <input
                  type="color"
                  value={directorField.color}
                  onChange={e => handleDirectorFieldChange('color', e.target.value)}
                  style={{ width: '100%', margin: '5px 0', height: '30px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4>Grid Properties</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label>X Range:</label>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                    <input
                      type="number"
                      value={directorField.grid.xMin}
                      onChange={e => handleDirectorFieldChange('grid', { 
                        ...directorField.grid, 
                        xMin: parseFloat(e.target.value) 
                      })}
                      style={{ width: '60px' }}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={directorField.grid.xMax}
                      onChange={e => handleDirectorFieldChange('grid', { 
                        ...directorField.grid, 
                        xMax: parseFloat(e.target.value) 
                      })}
                      style={{ width: '60px' }}
                    />
                  </div>
                  <label>X Spacing: </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={directorField.grid.xSpacing}
                    onChange={e => handleDirectorFieldChange('grid', { 
                      ...directorField.grid, 
                      xSpacing: parseFloat(e.target.value) 
                    })}
                    style={{ width: '60px' }}
                  />
                </div>

                <div>
                  <label>Y Range:</label>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                    <input
                      type="number"
                      value={directorField.grid.yMin}
                      onChange={e => handleDirectorFieldChange('grid', { 
                        ...directorField.grid, 
                        yMin: parseFloat(e.target.value) 
                      })}
                      style={{ width: '60px' }}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={directorField.grid.yMax}
                      onChange={e => handleDirectorFieldChange('grid', { 
                        ...directorField.grid, 
                        yMax: parseFloat(e.target.value) 
                      })}
                      style={{ width: '60px' }}
                    />
                  </div>
                  <label>Y Spacing: </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={directorField.grid.ySpacing}
                    onChange={e => handleDirectorFieldChange('grid', { 
                      ...directorField.grid, 
                      ySpacing: parseFloat(e.target.value) 
                    })}
                    style={{ width: '60px' }}
                  />
                </div>

                <div>
                  <label>T Range:</label>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                    <input
                      type="number"
                      value={directorField.grid.tMin}
                      onChange={e => handleDirectorFieldChange('grid', { 
                        ...directorField.grid, 
                        tMin: parseFloat(e.target.value) 
                      })}
                      style={{ width: '60px' }}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={directorField.grid.tMax}
                      onChange={e => handleDirectorFieldChange('grid', { 
                        ...directorField.grid, 
                        tMax: parseFloat(e.target.value) 
                      })}
                      style={{ width: '60px' }}
                    />
                  </div>
                  <label>T Spacing: </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={directorField.grid.tSpacing}
                    onChange={e => handleDirectorFieldChange('grid', { 
                      ...directorField.grid, 
                      tSpacing: parseFloat(e.target.value) 
                    })}
                    style={{ width: '60px' }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>2D Vector Field (t={t0})</h3>
        <div>
          <label>
            <input
              type="checkbox"
              checked={vectorField2D.visible}
              onChange={(e) => handleVectorField2DChange('visible', e.target.checked)}
            />
            Visible
          </label>
        </div>
        <div>
          <label>Scale: </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={vectorField2D.scale}
            onChange={(e) => handleVectorField2DChange('scale', parseFloat(e.target.value))}
          />
          <span>{vectorField2D.scale.toFixed(1)}</span>
        </div>
        <div>
          <label>Width: </label>
          <input
            type="range"
            min="0.01"
            max="1.0"
            step="0.01"
            value={vectorField2D.width}
            onChange={(e) => handleVectorField2DChange('width', parseFloat(e.target.value))}
          />
          <span>{vectorField2D.width.toFixed(2)}</span>
        </div>
        <div>
          <label>Density: </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={vectorField2D.density}
            onChange={(e) => handleVectorField2DChange('density', parseFloat(e.target.value))}
          />
          <span>{vectorField2D.density.toFixed(1)}</span>
        </div>
        <div>
          <label>Color: </label>
          <input
            type="color"
            value={vectorField2D.color}
            onChange={(e) => handleVectorField2DChange('color', e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Grid</h3>
        <div>
          <label>Size: </label>
          <input
            type="range"
            min="10"
            max="50"
            step="1"
            value={gridSize}
            onChange={e => {
              const newSize = parseFloat(e.target.value);
              setGridSize(newSize);
              handleGridChange('size', newSize);
            }}
            style={{ width: '100%', margin: '5px 0' }}
          />
          <span>{gridSize}</span>
        </div>

        <div>
          <label>Divisions: </label>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={gridDivisions}
            onChange={e => {
              const newDivisions = parseFloat(e.target.value);
              setGridDivisions(newDivisions);
              handleGridChange('divisions', newDivisions);
            }}
            style={{ width: '100%', margin: '5px 0' }}
          />
          <span>{gridDivisions}</span>
        </div>

        <div>
          <label>Opacity: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={gridOpacity}
            onChange={e => {
              const newOpacity = parseFloat(e.target.value);
              setGridOpacity(newOpacity);
              handleGridChange('opacity', newOpacity);
            }}
            style={{ width: '100%', margin: '5px 0' }}
          />
          <span>{gridOpacity.toFixed(1)}</span>
        </div>

        <div>
          <label>Primary Color: </label>
          <input
            type="color"
            value={gridPrimaryColor}
            onChange={e => {
              const newColor = e.target.value;
              setGridPrimaryColor(newColor);
              handleGridChange('primaryColor', newColor);
            }}
            style={{ width: '100%', margin: '5px 0', height: '30px' }}
          />
        </div>

        <div>
          <label>Secondary Color: </label>
          <input
            type="color"
            value={gridSecondaryColor}
            onChange={e => {
              const newColor = e.target.value;
              setGridSecondaryColor(newColor);
              handleGridChange('secondaryColor', newColor);
            }}
            style={{ width: '100%', margin: '5px 0', height: '30px' }}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onResetTrajectories}
          style={{
            padding: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Reset All
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Controls</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Left click + drag to rotate</li>
          <li>Right click + drag to pan</li>
          <li>Scroll to zoom</li>
          <li>Click in grid to add trajectory</li>
        </ul>
      </div>
    </div>
  );
};
