import styles from '../styles/Item.module.css';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { itemStateWithId, selectedIdsState } from '../atoms';
import { Dispatch, SetStateAction, useState } from 'react';

export default function Item({
  id,
  setResizableId,
}: {
  id: number;
  setResizableId: Dispatch<SetStateAction<number>>;
}) {
  const [item, setItem] = useRecoilState(itemStateWithId(id));
  const [isEdittingText, setIsEdittingText] = useState(false);
  const setSelectedIds = useSetRecoilState(selectedIdsState);
  const [isResizing, setIsResizing] = useState(false);
  // 지름
  const diameter = item.radius * 2;
  const resizeBtnEdge = Math.round(Math.sqrt(Math.pow(item.radius, 2) / 2));
  const resizeBtnPositionX = diameter - (item.radius - resizeBtnEdge);
  const resizeBtnPositionY = item.radius + resizeBtnEdge;

  return (
    <div
      className={`${styles.item} ${item.selected ? styles.selected : ''}`}
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        backgroundColor: item.bgColor,
        fontSize: `${item.fontSize}px`,
        color: `${item.fontColor}`,
        top: item.top,
        left: item.left,
        zIndex: item.selected ? 2 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isResizing) {
          setIsResizing(false);
          return;
        }

        setItem((state) => ({
          ...state,
          selected: isEdittingText ? true : !state.selected,
        }));
        setSelectedIds((state) => {
          if (isEdittingText) {
            return state;
          }

          if (item.selected) {
            return state.filter((el) => el !== id);
          }

          return [...state, id];
        });

        setIsEdittingText(false);
      }}
      onMouseMove={(e) => {
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {item.selected && (
        <div
          className={styles.resizeBtn}
          style={{ top: resizeBtnPositionY - 5, left: resizeBtnPositionX - 5 }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={() => {
            setResizableId(id);
            setIsResizing(true);
          }}
        />
      )}

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
            setSelectedIds((state) => {
              return state.includes(id) ? state : [...state, id];
            });
          }}
        >
          {item.text}
        </span>
      )}
    </div>
  );
}
