import styles from '../styles/ToolMenu.module.css';
import { useRecoilState } from 'recoil';
import {
  selectedItemsState,
  itemStateWithId,
  mindMapBackgroundColorState,
} from '../atoms';
import ColorPicker from './ColorPicker';

export default function ToolMenu() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemsState);
  const [selectedItem, setSelectedItem] = useRecoilState(
    itemStateWithId(selectedItems[0]?.id ?? 0)
  );
  const [mindMapBackgroundColor, setMindMapBackgroundColor] = useRecoilState(
    mindMapBackgroundColorState
  );

  return (
    <div className={styles.toolMenu}>
      <div>마인드 맵</div>

      <ColorPicker
        label="배경 색상"
        color={mindMapBackgroundColor}
        setColor={(color) => setMindMapBackgroundColor(color)}
      />

      {/* 부등호를 써준 이유는 selectedItems.length 로 할 경우 길이가 0일 때 화면에 0이 표시되기 때문임 */}
      {selectedItems.length > 0 && (
        <div>
          <div>아이템</div>

          <ColorPicker
            label="배경 색상"
            color={selectedItem.bgColor}
            setColor={(color) =>
              setSelectedItems((state) =>
                state.map((item) => ({ ...item, bgColor: color }))
              )
            }
          />

          <div>
            <label htmlFor="itemRadius">반지름</label>
            <input
              id="itemRadius"
              type="number"
              value={selectedItem.radius ? selectedItem.radius : ''}
              onChange={(e) =>
                setSelectedItems(
                  selectedItems.map((state) => ({
                    ...state,
                    radius: e.target.value ? parseInt(e.target.value) : 0,
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
              value={selectedItem.fontSize ? selectedItem.fontSize : ''}
              onChange={(e) =>
                setSelectedItems(
                  selectedItems.map((state) => ({
                    ...state,
                    fontSize: e.target.value ? parseInt(e.target.value) : 0,
                  }))
                )
              }
            />
          </div>

          <ColorPicker
            label="폰트 색상"
            color={selectedItem.fontColor}
            setColor={(color) =>
              setSelectedItems((state) =>
                state.map((item) => ({ ...item, fontColor: color }))
              )
            }
          />

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
                  value={selectedItem.left ? selectedItem.left : ''}
                  onChange={(e) =>
                    setSelectedItem((state) => ({
                      ...state,
                      left: e.target.value ? parseInt(e.target.value) : 0,
                    }))
                  }
                />
              </div>

              <div>
                <label htmlFor="positionY">Y 좌표</label>
                <input
                  id="positionY"
                  type="number"
                  value={selectedItem.top ? selectedItem.top : ''}
                  onChange={(e) =>
                    setSelectedItem((state) => ({
                      ...state,
                      top: e.target.value ? parseInt(e.target.value) : 0,
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
