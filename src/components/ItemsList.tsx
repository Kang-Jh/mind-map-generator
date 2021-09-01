import styles from '../styles/ItemsList.module.css';
import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  idsState,
  linkedItemsState,
  rootedIdsState,
  selectedItemsState,
  totalItemsState,
} from '../atoms';
import ListItem from './ListItem';
import HowToUse from './HowToUse';

export default function ItemsList() {
  const [nextId, setNextId] = useState(1);
  const setIds = useSetRecoilState(idsState);
  const setLinkedIds = useSetRecoilState(linkedItemsState);
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemsState);
  const rootedIds = useRecoilValue(rootedIdsState);
  const setTotalItems = useSetRecoilState(totalItemsState);
  const [isHowToUseOpened, setIsHowToUseOpened] = useState(false);

  return (
    <>
      <div className={styles.itemsListContainer}>
        <div className={styles.buttons}>
          <button
            className={styles.howToUseBtn}
            onClick={() => setIsHowToUseOpened(true)}
          >
            사용법
          </button>

          <button
            className={styles.addBtn}
            onClick={() => {
              setIds((state) => [...state, nextId]);
              setNextId(nextId + 1);
            }}
          >
            아이템 생성
          </button>

          <button
            className={styles.deleteBtn}
            onClick={() => {
              for (let i = 0; i < selectedItems.length; i++) {
                const id = selectedItems[i].id;

                setLinkedIds((state) =>
                  state.filter((pair) => !JSON.parse(pair).includes(id))
                );

                setIds((state) => state.filter((el) => el !== id));

                setTotalItems((state) =>
                  state.map((item) => ({
                    ...item,
                    // 부모가 삭제되는 경우면 null로 그렇지 않은 경우엔 현재 부모를 그대로 사용
                    parent: item.parent === id ? null : item.parent,
                    // 자식 목록에 삭제되는 id가 있으면 필터링
                    // 자식 목록에 삭제되는 id가 없으면 현재 자식 목록 그대로 사용
                    children: item.children.includes(id)
                      ? item.children.filter((el) => el !== id)
                      : item.children,
                  }))
                );
              }
            }}
          >
            아이템 삭제
          </button>

          {/* 연결 버튼 */}
          {selectedItems.length === 2 && (
            <button
              className={styles.linkBtn}
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

      <HowToUse isOpened={isHowToUseOpened} setIsOpened={setIsHowToUseOpened} />
    </>
  );
}
