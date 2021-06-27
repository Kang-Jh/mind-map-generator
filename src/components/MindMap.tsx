import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  itemStateWithId,
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
  const [resizableId, setResizableId] = useState(0);
  const [isResized, setIsResized] = useState(false);
  const setResizableItem = useSetRecoilState(itemStateWithId(resizableId));

  return (
    <div
      className={styles.MindMapDiv}
      // 바탕을 클릭하면 선택된 모든 아이템들이 풀리도록 onClick 프로퍼티 설정
      onClick={() => {
        // 만약 최근에 어떤 아이템이 리사이즈 되었다면
        // 모든 아이템의 선택을 취소하지 않음
        if (isResized) {
          setIsResized(false);
          return;
        }

        setSelectedItems(
          selectedItems.map((item) => ({ ...item, selected: false }))
        );
        setSelectedIds([]);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      // 컨트롤 키를 누르고 마우스를 움직이면 선택된 모든 아이템들이 움직이도록 onMouseMove 설정
      onMouseMove={(e) => {
        e.preventDefault();
        if (e.ctrlKey) {
          setSelectedItems(
            selectedItems.map((item) => ({
              ...item,
              top: item.top + e.movementY,
              left: item.left + e.movementX,
            }))
          );

          return;
        }

        if (resizableId) {
          setResizableItem((state) => ({
            ...state,
            radius: Math.round(Math.abs(state.radius + e.movementX / 2)),
          }));
        }
      }}
      onMouseUp={() => {
        // 만약 어떤 아이템을 resizing 중이라면 마우스 버튼이 올라올 때
        // 어떤 아이템을 리사이즈하지 않고
        // 최근에 리사이즈 되었다는 것을 저장하여
        // 클릭 이벤트에서 사용될 수 있도록 함
        if (resizableId) {
          setResizableId(0);
          setIsResized(true);
        }
      }}
    >
      {items.map((id) => (
        <Item key={id} id={id} setResizableId={setResizableId} />
      ))}

      {linkedItems.map((pair) => (
        <Line key={pair} pair={pair} />
      ))}
    </div>
  );
}
