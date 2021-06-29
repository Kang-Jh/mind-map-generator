import './App.css';
import { RecoilRoot } from 'recoil';
import MindMap from './components/MindMap';
import ToolMenu from './components/ToolMenu';
import ItemsList from './components/ItemsList';

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <ItemsList />
        <MindMap />
        <ToolMenu />
      </div>
    </RecoilRoot>
  );
}

export default App;
