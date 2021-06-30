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
                if (
                  selectedItems[1].parent === null &&
                  !selectedItems[0].children.includes(selectedItems[1].id)
                ) {
                  setSelectedItems(
                    selectedItems.map((item) => ({
                      ...item,
                      parent:
                        item.id === selectedItems[1].id
                          ? selectedItems[0].id
                          : null,
                      children:
                        item.id === selectedItems[0].id
                          ? [...item.children, selectedItems[1].id]
                          : item.children,
                    }))
                  );

                  setLinkedIds((state) => [
                    ...state,
                    JSON.stringify([selectedItems[0].id, selectedItems[1].id]),
                  ]);
                } else if (
                  selectedItems[0].children.includes(selectedItems[1].id)
                ) {
                  setSelectedItems(
                    selectedItems.map((item) => ({
                      ...item,
                      parent:
                        item.id === selectedItems[1].id ? null : item.parent,
                      children:
                        item.id === selectedItems[0].id
                          ? item.children.filter(
                              (id) => id !== selectedItems[1].id
                            )
                          : item.children,
                    }))
                  );

                  setLinkedIds((state) =>
                    state.filter(
                      (pair) =>
                        pair !==
                        JSON.stringify([
                          selectedItems[0].id,
                          selectedItems[1].id,
                        ])
                    )
                  );
                }
              }}
            >
              {selectedItems[0].children.includes(selectedItems[1].id)
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
