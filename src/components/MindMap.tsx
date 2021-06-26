import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  linkedItemsState,
  selectedIdsState,
  selectedItemsState,
} from '../atoms';
import styles from '../styles/MindMap.module.css';
import Item from './Item';
import Line from './Line';

export default function MindMap({ items }: { items: number[] }) {
  const setSelectedIds = useSetRecoilState(selectedIdsState);
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemsState);
  const linkedItems = useRecoilValue(linkedItemsState);

  return (
    <div
      className={styles.MindMapDiv}
      // 바탕을 클릭하면 선택된 모든 아이템들이 풀리도록 onClick 프로퍼티 설정
      onClick={(e) => {
        setSelectedItems(
          selectedItems.map((item) => ({ ...item, selected: false }))
        );
        setSelectedIds([]);
      }}
      // 컨트롤 키를 누르고 마우스를 움직이면 선택된 모든 아이템들이 움직이도록 onMouseMove 설정
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

      {linkedItems.map((pair) => (
        <Line key={pair} pair={pair} />
      ))}
    </div>
  );
}
