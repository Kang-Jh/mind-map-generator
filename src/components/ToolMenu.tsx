import styles from '../styles/ToolMenu.module.css';
import { useRecoilState } from 'recoil';
import {
  selectedItemsState,
  itemStateWithId,
  mindMapBackgroundColorState,
} from '../atoms';
import ColorPicker from './ColorPicker';
import InputField from './InputField';

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
        <div className={styles.itemForm}>
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

          <InputField
            label="반지름"
            type="number"
            id="itemRadius"
            value={selectedItem.radius ? selectedItem.radius : ''}
            onChange={(e) =>
              setSelectedItems((state) =>
                state.map((item) => ({
                  ...item,
                  radius: e.target.value ? parseInt(e.target.value) : 0,
                }))
              )
            }
          />

          <InputField
            label="폰트 크기"
            id="fontSize"
            type="number"
            value={selectedItem.fontSize ? selectedItem.fontSize : ''}
            onChange={(e) =>
              setSelectedItems((state) =>
                state.map((item) => ({
                  ...item,
                  fontSize: e.target.value ? parseInt(e.target.value) : 0,
                }))
              )
            }
          />

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
              <InputField
                label="내용"
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

              <InputField
                label="X 좌표"
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

              <InputField
                label="Y 좌표"
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
