import styles from '../styles/ListItem.module.css';
import { memo } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { itemStateWithId, subTreeState } from '../atoms';

/**
 * 리스트 아이템은 왼쪽 사이드바에서 렌더링되는 개별 아이템들로
 * 재귀적으로 자식들을 렌더링함
 * @returns
 */
function ListItem({ id }: { id: number }) {
  const [item, setItem] = useRecoilState(itemStateWithId(id));
  const setSubTree = useSetRecoilState(subTreeState(id));

  return (
    <div>
      <button
        className={
          item.selected
            ? `${styles.selected} ${styles.listItem}`
            : `${styles.listItem}`
        }
        onClick={(e) => {
          e.stopPropagation();
          setItem((state) => ({ ...state, selected: !state.selected }));
          setSubTree((state) =>
            state.map((node) => ({ ...node, selected: !item.selected }))
          );
        }}
      >
        {item.text}
      </button>

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

export default memo(ListItem);
