import styles from '../styles/ToolMenu.module.css';
import { useRecoilState } from 'recoil';
import {
  selectedItemsState,
  itemStateWithId,
  mindMapBackgroundColorState,
} from '../atoms';

export default function ToolMenu() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemsState);
  const [selectedItem, setSelectedItem] = useRecoilState(
    itemStateWithId(selectedItems[0]?.id ?? 0)
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
      {selectedItems.length > 0 && (
        <div>
          <div>
            <label htmlFor="itemBgColor">아이템 배경 색상</label>
            <input
              type="color"
              id="itemBgColor"
              value={selectedItem.bgColor}
              onChange={(e) =>
                setSelectedItems(
                  selectedItems.map((state) => ({
                    ...state,
                    bgColor: e.target.value,
                  }))
                )
              }
            />
          </div>

          <div>
            <label htmlFor="itemRadius">반지름</label>
            <input
              id="itemRadius"
              type="number"
              value={selectedItem.radius}
              onChange={(e) =>
                setSelectedItems(
                  selectedItems.map((state) => ({
                    ...state,
                    radius: parseInt(e.target.value),
                  }))
                )
              }
            />
          </div>

          <div>
            <label htmlFor="fontSize">폰트 크기</label>
            <input
              type="number"
              id="fontSize"
              value={selectedItem.fontSize}
              onChange={(e) =>
                setSelectedItems(
                  selectedItems.map((state) => ({
                    ...state,
                    fontSize: parseInt(e.target.value),
                  }))
                )
              }
            />
          </div>

          <div>
            <label htmlFor="fontColor">폰트 색상</label>
            <input
              type="color"
              id="fontColor"
              value={selectedItem.fontColor}
              onChange={(e) =>
                setSelectedItems(
                  selectedItems.map((state) => ({
                    ...state,
                    fontColor: e.target.value,
                  }))
                )
              }
            />
          </div>

          {selectedItems.length === 1 && (
            <>
              <div>
                <label htmlFor="itemText">내용</label>
                <input
                  id="itemText"
                  type="text"
                  value={selectedItem.text}
                  onChange={(e) =>
                    setSelectedItem((state) => ({
                      ...state,
                      text: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label htmlFor="positionX">X 좌표</label>
                <input
                  id="positionX"
                  type="number"
                  value={selectedItem.left}
                  onChange={(e) =>
                    setSelectedItem((state) => ({
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
                  value={selectedItem.top}
                  onChange={(e) =>
                    setSelectedItem((state) => ({
                      ...state,
                      top: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
