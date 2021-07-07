import styles from '../styles/Item.module.css';
import { useRecoilState } from 'recoil';
import { itemStateWithId } from '../atoms';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function Item({
  id,
  setResizableId,
}: {
  id: number;
  setResizableId: Dispatch<SetStateAction<number>>;
}) {
  const [item, setItem] = useRecoilState(itemStateWithId(id));
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
  // 제 3사분면에 위치시켜야 하므로 반지름에 변의 길이를 더해줌
  const resizeBtnPositionX = item.radius + resizeBtnEdge;
  // 제 3사분면에 위치시켜야 하므로 반지름에 변의 길이를 더해줌
  const resizeBtnPositionY = item.radius + resizeBtnEdge;

  // 아이템 생성 시 위치를 설정하는 이펙트
  useEffect(() => {
    // 현재 화면의 왼쪽 상단에 위치하게 변경
    setItem((state) => ({
      ...state,
      top: window.scrollY + 200,
      left: window.scrollX + 250,
    }));
  }, [setItem]);

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

        // 선택 또는 선택해제시킴
        setItem((state) => ({
          ...state,
          selected: !state.selected,
        }));
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

      {/* 텍스트 필드 */}
      <span>{item.text}</span>
    </div>
  );
}
