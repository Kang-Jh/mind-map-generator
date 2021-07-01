import styles from '../styles/ItemsList.module.css';
import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  idsState,
  linkedItemsState,
  rootedIdsState,
  selectedItemsState,
} from '../atoms';
import ListItem from './ListItem';

export default function ItemsList() {
  const [nextId, setNextId] = useState(1);
  const setIds = useSetRecoilState(idsState);
  const setLinkedIds = useSetRecoilState(linkedItemsState);
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemsState);
  const rootedIds = useRecoilValue(rootedIdsState);

  return (
    <div className={styles.itemsListContainer}>
      <div className={styles.buttons}>
        <div>
          <button
            onClick={() => {
              setIds((state) => [...state, nextId]);
              setNextId(nextId + 1);
            }}
          >
            아이템 생성
          </button>
        </div>

        {/* 연결 버튼 */}
        {selectedItems.length === 2 && (
          <div>
            <div>상위 개념 {selectedItems[0].text}</div>
            <div>하위 개념 {selectedItems[1].text}</div>

            <button
              onClick={() => {
                const parent = selectedItems[0];
                const child = selectedItems[1];

                if (child.parent === parent.id) {
                  // 자식의 부모 아이디와 현재 선택된 부모 아이디가 같은 경우
                  // 연결 해제시키고 linkedIds에서 아이디 쌍을 삭제

                  setSelectedItems((state) =>
                    state.map((item) => ({
                      ...item,
                      parent: item.id === child.id ? null : item.parent,
                      children:
                        item.id === parent.id
                          ? item.children.filter((id) => id !== child.id)
                          : item.children,
                    }))
                  );

                  setLinkedIds((state) =>
                    state.filter(
                      (pair) => pair !== JSON.stringify([parent.id, child.id])
                    )
                  );
                } else if (child.parent === null) {
                  // 자식의 부모가 아직 설정되지 않은 경우
                  // 부모와 자식을 연결 시키고 linkedIds에 아이디 쌍을 추가
                  setSelectedItems((state) =>
                    state.map((item) => ({
                      ...item,
                      parent: item.id === parent.id ? item.parent : parent.id,
                      children:
                        item.id === parent.id
                          ? [...item.children, child.id]
                          : item.children,
                    }))
                  );

                  setLinkedIds((state) => {
                    const pair = JSON.stringify([parent.id, child.id]);
                    if (state.includes(pair)) {
                      return state;
                    }

                    return [...state, pair];
                  });
                }
              }}
            >
              {selectedItems[1].parent === selectedItems[0].id
                ? '연결 해제'
                : '연결하기'}
            </button>
          </div>
        )}
      </div>

      <ul className={styles.itemsList}>
        {rootedIds.map((id) => (
          <li key={id}>
            <ListItem id={id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
