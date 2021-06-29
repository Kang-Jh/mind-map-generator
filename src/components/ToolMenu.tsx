import styles from '../styles/ToolMenu.module.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  selectedItemsState,
  linkedItemsState,
  itemStateWithId,
  mindMapBackgroundColorState,
} from '../atoms';

export default function ToolMenu() {
  const selectedItems = useRecoilValue(selectedItemsState);
  const setLinkedItems = useSetRecoilState(linkedItemsState);
  const [firstSelectedItem, setFirstSelectedItem] = useRecoilState(
    itemStateWithId(selectedItems[0]?.id ?? 0)
  );
  const [lastSelectedItem, setLastSelectedItem] = useRecoilState(
    itemStateWithId(selectedItems[selectedItems.length - 1]?.id ?? 0)
  );

  const [mindMapBackgroundColor, setMindMapBackgroundColor] = useRecoilState(
    mindMapBackgroundColorState
  );

  return (
    <div
      className={styles.toolMenu}
      // 아이템 리사이즈시 툴메뉴에 있는 텍스트들이 드래그로 인해 선택되는 것을 방지
      onMouseMoveCapture={(e) => {
        e.preventDefault();
      }}
    >
      <div>
        <label htmlFor="mindMapBgColor">마인드맵 배경 색상</label>
        <input
          type="color"
          id="mindMapBgColor"
          value={mindMapBackgroundColor}
          onChange={(e) => setMindMapBackgroundColor(e.target.value)}
        />
      </div>

      {/* 부등호를 써준 이유는 selectedItems.length 로 할 경우 길이가 0일 때 화면에 0이 표시되기 때문임 */}
      {lastSelectedItem.id > 0 && (
        <div>
          <div>
            <label htmlFor="itemText">내용</label>
            <input
              id="itemText"
              type="text"
              value={lastSelectedItem.text}
              onChange={(e) =>
                setLastSelectedItem((state) => ({
                  ...state,
                  text: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="itemBgColor">아이템 배경 색상</label>
            <input
              type="color"
              id="itemBgColor"
              value={lastSelectedItem.bgColor}
              onChange={(e) =>
                setLastSelectedItem((state) => ({
                  ...state,
                  bgColor: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="itemRadius">반지름</label>
            <input
              id="itemRadius"
              type="number"
              value={lastSelectedItem.radius}
              onChange={(e) =>
                setLastSelectedItem((state) => ({
                  ...state,
                  radius: parseInt(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="positionX">X 좌표</label>
            <input
              id="positionX"
              type="number"
              value={lastSelectedItem.left}
              onChange={(e) =>
                setLastSelectedItem((state) => ({
                  ...state,
                  left: parseInt(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="positionY">Y 좌표</label>
            <input
              id="positionY"
              type="number"
              value={lastSelectedItem.top}
              onChange={(e) =>
                setLastSelectedItem((state) => ({
                  ...state,
                  top: parseInt(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="fontSize">폰트 크기</label>
            <input
              type="number"
              id="fontSize"
              value={lastSelectedItem.fontSize}
              onChange={(e) =>
                setLastSelectedItem((state) => ({
                  ...state,
                  fontSize: parseInt(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="fontColor">폰트 색상</label>
            <input
              type="color"
              id="fontColor"
              value={lastSelectedItem.fontColor}
              onChange={(e) =>
                setLastSelectedItem((state) => ({
                  ...state,
                  fontColor: e.target.value,
                }))
              }
            />
          </div>
        </div>
      )}

      {selectedItems.length >= 2 && (
        <div>
          <div>상위 개념 {firstSelectedItem.text}</div>
          <div>하위 개념 {lastSelectedItem.text}</div>
          <button
            onClick={() => {
              if (
                lastSelectedItem.parent === null &&
                !lastSelectedItem.children.includes(firstSelectedItem.id)
              ) {
                setFirstSelectedItem((state) => ({
                  ...state,
                  children: [...state.children, lastSelectedItem.id],
                }));

                setLastSelectedItem((state) => ({
                  ...state,
                  parent: firstSelectedItem.id,
                }));

                setLinkedItems((state) => [
                  ...state,
                  JSON.stringify([firstSelectedItem.id, lastSelectedItem.id]),
                ]);

                console.log('연결됨');
              } else if (
                firstSelectedItem.children.includes(lastSelectedItem.id)
              ) {
                setFirstSelectedItem((state) => ({
                  ...state,
                  children: state.children.filter(
                    (id) => id !== lastSelectedItem.id
                  ),
                }));
                setLastSelectedItem((state) => ({
                  ...state,
                  parent: null,
                }));

                setLinkedItems((state) =>
                  state.filter(
                    (pair) =>
                      pair !==
                      JSON.stringify([
                        firstSelectedItem.id,
                        lastSelectedItem.id,
                      ])
                  )
                );
              }
            }}
          >
            {firstSelectedItem.children.includes(lastSelectedItem.id)
              ? '연결 해제'
              : '연결하기'}
          </button>
        </div>
      )}
    </div>
  );
}
