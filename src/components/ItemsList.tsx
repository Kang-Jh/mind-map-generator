import styles from '../styles/itemsList.module.css';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { idsState } from '../atoms';

export default function ItemsList() {
  const [nextId, setNextId] = useState(1);
  const [ids, setIds] = useRecoilState(idsState);

  return (
    <div className={styles.itemsList}>
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
    </div>
  );
}
