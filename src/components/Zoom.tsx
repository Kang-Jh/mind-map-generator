import styles from '../styles/Zoom.module.css';
import { useRecoilState } from 'recoil';
import { zoomState } from '../atoms';

export default function Zoom() {
  const [zoom, setZoom] = useRecoilState(zoomState);

  return (
    <div className={styles.zoom}>
      <label htmlFor="mindMapZoom" className={styles.label}>
        줌
      </label>

      <button
        className={styles.button}
        onClick={() => {
          setZoom(zoom - 10);
        }}
      >
        -
      </button>

      <input
        className={styles.input}
        type="number"
        id="mindMapZoom"
        max={100}
        min={0}
        value={zoom ? zoom : ''}
        onChange={(e) => {
          const zoom = parseInt(e.target.value);
          if (isNaN(zoom)) {
            setZoom(0);
          } else {
            setZoom(zoom);
          }
        }}
      />

      <button
        className={styles.button}
        onClick={() => {
          setZoom(zoom + 10);
        }}
      >
        +
      </button>
    </div>
  );
}
