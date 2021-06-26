import './App.css';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';
import MindMap from './components/MindMap';
import ToolMenu from './components/ToolMenu';

function App() {
  const [id, setId] = useState(1);
  const [items, setItems] = useState<number[]>([]);

  return (
    <RecoilRoot>
      <div className="App">
        <button
          onClick={() => {
            setItems((state) => [...state, id]);
            setId(id + 1);
          }}
        >
          아이템 생성
        </button>
        <MindMap items={items} />
        <ToolMenu />
      </div>
    </RecoilRoot>
  );
}

export default App;
