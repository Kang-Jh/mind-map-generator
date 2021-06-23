import styles from '../styles/Item.module.css';
import { useRecoilState } from 'recoil';
import { itemAtom } from '../atoms';

export default function Item({ id }: { id: number }) {
  const [item, setItem] = useRecoilState(itemAtom(id));

  return (
    <div
      className={styles.item}
      style={{
        width: `${item.width}px`,
        height: `${item.height}px`,
        backgroundColor: item.bgColor,
      }}
    >
      <div>{item.contents}</div>
    </div>
  );
}
