import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  idsState,
  itemStateWithId,
  linkedItemsState,
  mindMapBackgroundColorState,
  selectedItemsState,
  zoomState,
} from '../atoms';
import styles from '../styles/MindMap.module.css';
import Item from './Item';
import Line from './Line';

export default function MindMap() {
  const ids = useRecoilValue(idsState);
  const backgroundColor = useRecoilValue(mindMapBackgroundColorState);
  const setSelectedItems = useSetRecoilState(selectedItemsState);
  const linkedItems = useRecoilValue(linkedItemsState);
  const [resizableId, setResizableId] = useState(0);
  const [isResized, setIsResized] = useState(false);
  const setResizableItem = useSetRecoilState(itemStateWithId(resizableId));
  const zoom = useRecoilValue(zoomState);

  // 마인드맵의 대략 중간부터 실행되게 수정
  useEffect(() => {
    window.scrollTo(2000, 2000);
  }, []);

  return (
    <div
      style={{ backgroundColor, transform: `scale(${zoom / 100})` }}
      className={styles.MindMapDiv}
      // 바탕을 클릭하면 선택된 모든 아이템들이 풀리도록 onClick 프로퍼티 설정
      onClick={() => {
        // 만약 최근에 어떤 아이템이 리사이즈 되었다면
        // 모든 아이템의 선택을 취소하지 않음
        if (isResized) {
          setIsResized(false);
          return;
        }

        setSelectedItems((state) =>
          state.map((item) => ({ ...item, selected: false }))
        );
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      // 컨트롤 키를 누르고 마우스를 움직이면 선택된 모든 아이템들이 움직이도록 onMouseMove 설정
      onMouseMove={(e) => {
        e.preventDefault();
        if (e.ctrlKey) {
          setSelectedItems((state) =>
            state.map((item) => ({
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
      {ids.map((id) => (
        <Item key={id} id={id} setResizableId={setResizableId} />
      ))}

      {linkedItems.map((pair) => (
        <Line key={pair} pair={pair} />
      ))}
    </div>
  );
}
