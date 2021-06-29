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
  // a^2 + a^2 = r^2
  // 제 3사분면 45도 위치에 버튼을 놓으려면
  // 45도 위치에서 x축으로 수선을 내리고 빗변이 아닌 변의 길이(a)를 구해야 함
  // 탄젠트 45도는 1이고 이등변 직각삼각형이므로 한 변의 길이는
  // 피타고라스 정리에 의해 a^2 + a^2 = r^2을 만족시키게 됨
  // 이 변의 길이는 (a^2 / 2)의 제곱근이됨
  const resizeBtnEdge = Math.round(Math.sqrt(Math.pow(item.radius, 2) / 2));
  // 제 3사분면에 위치시켜야 하므로 반지름에서 변의 길이를 뺀 값을 지름에서 빼줘야 함
  const resizeBtnPositionX = diameter - (item.radius - resizeBtnEdge);
  // 제 3사분면에 위치시켜야 하므로 반지름에 변의 길이를 더해줌
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

        // 텍스트를 수정중이면 항상 선택된 상태를 유지하고
        // 그렇지 않은 경우 선택 또는 선택해제시킴
        setItem((state) => ({
          ...state,
          selected: isEdittingText ? true : !state.selected,
        }));
        setSelectedIds((state) => {
          // 현재 텍스트를 수정중이면 그대로 현재 상태 반환
          if (isEdittingText) {
            return state;
          }

          // 텍스트를 수정중이지 않은데
          // 아이템이 선택된 경우에는
          // 현재 아이디를 선택된 아이디 리스트에서 삭제
          if (item.selected) {
            return state.filter((el) => el !== id);
          }

          // 선택된 아이디에 현재 아이디 추가
          return [...state, id];
        });

        setIsEdittingText(false);
      }}
      // 텍스트 드래그 방지
      onMouseMove={(e) => {
        e.preventDefault();
      }}
      // 텍스트 드래그 방지
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {item.selected && (
        // 리사이즈 버튼
        <div
          className={styles.resizeBtn}
          style={{ top: resizeBtnPositionY - 5, left: resizeBtnPositionX - 5 }}
          onClick={(e) => {
            // 버블링시 상위 엘리먼트에서 클릭 이벤트 발생을 막음
            e.stopPropagation();
          }}
          // 마우스를 눌렀을 때 이 아이템이 리사이징 중이라는 것을 저장
          onMouseDown={() => {
            setResizableId(id);
            setIsResizing(true);
          }}
        />
      )}

      {/* 텍스트가 두 번 클릭되면 입력 필드를 렌더링 */}
      {isEdittingText ? (
        <input
          className={styles.input}
          type="text"
          value={item.text}
          onChange={(e) =>
            setItem((state) => ({ ...state, text: e.target.value }))
          }
          onKeyDown={(e) => {
            // 입력 필드에서 엔터키가 눌리면 더 이상 수정을 하지 않음
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
          // 텍스트 두번 클릭하면 입력 필드 렌더링
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (e.ctrlKey || e.altKey) {
              return;
            }

            setIsEdittingText(true);
            // 아이템을 선택된 상태로 변경
            setItem((state) => ({
              ...state,
              selected: true,
            }));
            // 선택된 아이디 리스트에 현재 아이디를 포함시킴
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
