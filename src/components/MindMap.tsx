import { useRecoilState } from 'recoil';
import { itemAtom, singleSelectedIdAtom } from '../atoms';
import styles from '../styles/MindMap.module.css';
import Item from './Item';

export default function MindMap({ items }: { items: number[] }) {
  const [singleSelectedId, setSingleSelectedId] =
    useRecoilState(singleSelectedIdAtom);
  const [singleSelectedItem, setSingleSelectedItem] = useRecoilState(
    itemAtom(singleSelectedId)
  );

  return (
    <div
      className={styles.MindMapDiv}
      onClick={() => {
        setSingleSelectedItem((state) => ({
          ...state,
          selected: false,
        }));
        setSingleSelectedId(0);
      }}
      onMouseMove={(e) => {
        e.preventDefault();
        if (e.ctrlKey && singleSelectedItem.selected) {
          setSingleSelectedItem((state) => ({
            ...state,
            top: state.top + e.movementY,
            left: state.left + e.movementX,
          }));
        }
      }}
    >
      {items.map((id) => (
        <Item key={id} id={id} />
      ))}
    </div>
  );
}
