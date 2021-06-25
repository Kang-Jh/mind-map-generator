import styles from '../styles/Item.module.css';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { itemAtom, singleSelectedIdAtom } from '../atoms';
import { useState } from 'react';

export default function Item({ id }: { id: number }) {
  const [item, setItem] = useRecoilState(itemAtom(id));
  const [isEdittingText, setIsEdittingText] = useState(false);
  const setSingleSelectedId = useSetRecoilState(singleSelectedIdAtom);

  return (
    <div
      className={`${styles.item} ${item.selected ? styles.selected : ''}`}
      style={{
        width: `${item.width}px`,
        height: `${item.height}px`,
        backgroundColor: item.bgColor,
        top: item.top,
        left: item.left,
        zIndex: item.selected ? 100000 : 0,
      }}
      onClick={(e) => {
        e.stopPropagation();

        setItem((state) => ({
          ...state,
          selected: isEdittingText ? true : !state.selected,
        }));
        setSingleSelectedId(isEdittingText ? id : item.selected ? 0 : id);

        setIsEdittingText(false);
      }}
    >
      {isEdittingText ? (
        <input
          className={styles.input}
          type="text"
          value={item.text}
          onChange={(e) =>
            setItem((state) => ({ ...state, text: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEdittingText(false);
            }
          }}
          // 입력 필드 클릭시 아이템이 선택되는 것을 막기 위한 onClick
          onClick={(e) => {
            e.stopPropagation();
          }}
          // 텍스트 드래그를 통한 선택을 위한 onMouseMove
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          autoFocus
        />
      ) : (
        <span
          onClick={(e) => {
            e.stopPropagation();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (e.ctrlKey || e.altKey) {
              return;
            }

            setIsEdittingText(true);
            setItem((state) => ({
              ...state,
              selected: true,
            }));
            setSingleSelectedId(id);
          }}
        >
          {item.text}
        </span>
      )}
    </div>
  );
}
