import styles from '../styles/ListItem.module.css';
import { useRecoilState } from 'recoil';
import { itemStateWithId } from '../atoms';

/**
 * 리스트 아이템은 왼쪽 사이드바에서 렌더링되는 개별 아이템들로
 * 재귀적으로 자식들을 렌더링함
 * @returns
 */
export default function ListItem({ id }: { id: number }) {
  const [item, setItem] = useRecoilState(itemStateWithId(id));

  return (
    <div
      onClickCapture={() => {
        // 예상되는 버그1: 아이템 텍스트 수정 중에 목록에서 클릭할 경우 선택해제 됨
        // 예상되는 버그2: 하위 아이템 선택 후 선택된 하위 아이템의 상위 아이템을 선택할 경우 하위 아이템이 선택해제 됨
        setItem((state) => ({ ...state, selected: !state.selected }));
      }}
    >
      <div>{item.text}</div>

      {item.children.length > 0 && (
        <ul className={styles.ul}>
          {item.children.map((id) => (
            <li key={id}>
              <ListItem id={id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
