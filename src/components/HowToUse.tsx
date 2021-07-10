import styles from '../styles/HowToUse.module.css';
import { Dispatch, SetStateAction } from 'react';

export default function HowToUse({
  isOpened,
  setIsOpened,
}: {
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}) {
  if (!isOpened) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.howToUse}>
        <h2>마인드 맵 생성기 사용 방법</h2>
        <ul className={styles.descriptionList}>
          <li>
            <p>
              아이템을 선택하려면 왼쪽 아이템 목록에 있는 아이템을 클릭하시거나
              마인드맵에 있는 아이템을 클릭하시면 됩니다.
            </p>
          </li>

          <li>
            <p>
              아이템들을 선택한 후 왼쪽 Ctrl 키를 누른 채로 마우스를 움직이면
              선택된 모든 아이템들이 움직입니다.
            </p>
          </li>

          <li>
            <p>
              마인드맵 배경을 클릭하시면 선택된 모든 아이템들이 선택 해제됩니다.
            </p>
          </li>

          <li>
            <p>아이템 삭제는 선택된 모든 아이템들을 삭제합니다.</p>
          </li>

          <li>
            <p>
              2개의 아이템이 선택되었을 때 연결하기 버튼이 나타납니다. 단,
              연결하기 버튼을 클릭하더라도 아이템들이 연결될 수 없는 경우
              연결되지 않습니다.
            </p>
          </li>

          <li>
            <p>
              서로 직접적으로 연결된 2개의 아이템이 선택되었을 때 연결 해제
              버튼이 나타납니다.
            </p>
          </li>

          <li>
            연결의 경우 선택된 순서에 상관 없이 항상 먼저 생성된 아이템이 상위
            개념이 됩니다.
          </li>
        </ul>

        <button className={styles.btn} onClick={() => setIsOpened(false)}>
          닫기
        </button>
      </div>
    </div>
  );
}
