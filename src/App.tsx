import { UIOverlay } from './components/UIOverlay';
import { Scene } from './components/canvas/Scene';

function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <UIOverlay />
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>
    </div>
  );
}

export default App;
