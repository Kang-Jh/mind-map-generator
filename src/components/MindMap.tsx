import { useRecoilState } from 'recoil';
import { selectedItemsState } from '../atoms';
import styles from '../styles/MindMap.module.css';
import Item from './Item';

export default function MindMap({ items }: { items: number[] }) {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemsState);

  return (
    <div
      className={styles.MindMapDiv}
      onMouseMove={(e) => {
        if (e.ctrlKey) {
          setSelectedItems(
            selectedItems.map((item) => ({
              ...item,
              top: item.top + e.movementY,
              left: item.left + e.movementX,
            }))
          );
        }
      }}
    >
      {items.map((id) => (
        <Item key={id} id={id} />
      ))}
    </div>
  );
}
