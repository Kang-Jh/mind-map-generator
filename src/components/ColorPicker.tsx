import styles from '../styles/ColorPicker.module.css';
import { useRef, useState } from 'react';

/**
 * setColor는 color를 인자로 받아서 어떤 식으로 상태를 업데이트 할 것인지를 나타내는 함수입니다
 * @param {string} label 컬러 피커의 대상을 명시하는 문자열
 * @param {string} color hsl() 형태인 문자열
 * @param {(color: string) => void} setColor color를 인자로 받아 내부적으로 상태 업데이트를 실행하는 함수
 */
export default function ColorPicker({
  label,
  color,
  setColor,
}: {
  label: string;
  color: string;
  setColor: (color: string) => void;
}) {
  // 모달의 위치를 정하기 위한 ref
  const colorPickerRef = useRef<HTMLDivElement>(null);
  // 색상을 선택하는 직선 모양의 컬러 피커를 마우스로 눌렀는지 여부
  const [isHueMouseDown, setIsHueMouseDown] = useState(false);
  // 채도와 밝기를 선택하는 직사각형 모양의 컬러 피커를 마우스로 눌렀는지 여부
  const [isSLSelectorMouseDown, setIsSelectorMouseDown] = useState(false);
  // 이전 컬러로 되돌리기 위한 상태
  const [lastColor, setLastColor] = useState(color);
  // 컬러 피커 모달이 열렸는지를 저장하는 상태
  const [isOpened, setIsOpened] = useState(false);
  // 주어진 color에서 색상(Hue)를 나타내는 값
  const h = color.split(',')[0].slice(4).trim();

  return (
    <div className={styles.colorPicker} ref={colorPickerRef}>
      {/* 색상 버튼 */}
      <div>
        <span>{label}</span>
        <button
          className={styles.button}
          style={{
            background: color,
          }}
          onClick={() => {
            setLastColor(color);
            setIsOpened(true);
          }}
        />
      </div>

      {isOpened && (
        <div
          className={styles.colorPickerModal}
          style={{
            top: `calc(25% + ${colorPickerRef.current?.offsetTop ?? 0}px)`,
          }}
        >
          <div className={styles.SLSelectorWrapper}>
            <div
              className={styles.SLSelector}
              style={{
                background: `hsl(${h}, 100%, 50%)`,
              }}
              onMouseDown={(e) => {
                setIsSelectorMouseDown(true);
                if (e.target instanceof HTMLDivElement) {
                  // 타겟 직사각형
                  const rect = e.target.getBoundingClientRect();
                  // HSV에서의 채도값으로
                  // 현재 마우스의 위치의 x좌표에서 직사각형의 x좌표 시작점을 뺀 값을
                  // 타겟의 width 1% 당 픽셀로 나눈 값
                  const saturationOfHSV = Math.round(
                    (e.clientX - rect.left) / (rect.width / 100)
                  );
                  // HSV에서의 명도값으로
                  // 가장 위가 100이므로 100에서 빼줘야 함
                  // 명도값은 현재 마우스의 Y좌표에서 타겟 직사각형의 시작 Y좌표를 빼준 값을
                  // 타겟의 height 1%당 픽셀로 나눈 값
                  const value =
                    100 -
                    Math.round((e.clientY - rect.top) / (rect.height / 100));

                  // HSL에서의 밝기 값으로
                  // HSV에서의 명도에 HSV에서의 채도를 2로 나눈 값을 100에서 뺀 값을 곱해준 후 100으로 나눈 값
                  const lightnessOfHSL = Math.round(
                    (value * (100 - saturationOfHSV / 2)) / 100
                  );
                  // HSL에서의 채도 값으로
                  // HSL에서의 밝기 값이 0%이거나 100%인 경우 채도 값은 0
                  // 이외의 경우에는 HSV에서의 명도 값에서 HSL에서의 밝기 값을 뺀 값을
                  // HSL의 밝기값과 100 - HSL의 밝기 값 중 작은 값으로 나눈 후
                  // 100을 곱해준 값
                  const saturationOfHSL =
                    lightnessOfHSL === 0 || lightnessOfHSL === 100
                      ? 0
                      : Math.round(
                          ((value - lightnessOfHSL) /
                            Math.min(lightnessOfHSL, 100 - lightnessOfHSL)) *
                            100
                        );

                  setColor(
                    `hsl(${h}, ${saturationOfHSL}%, ${lightnessOfHSL}%)`
                  );
                }
              }}
              onMouseMove={(e) => {
                if (
                  isSLSelectorMouseDown &&
                  e.target instanceof HTMLDivElement
                ) {
                  const rect = e.target.getBoundingClientRect();
                  const saturationOfHSV = Math.round(
                    (e.clientX - rect.left) / (rect.width / 100)
                  );
                  const value =
                    100 -
                    Math.round((e.clientY - rect.top) / (rect.height / 100));

                  const lightnessOfHSL = Math.round(
                    (value * (100 - saturationOfHSV / 2)) / 100
                  );
                  const saturationOfHSL =
                    lightnessOfHSL === 0 || lightnessOfHSL === 100
                      ? 0
                      : Math.round(
                          ((value - lightnessOfHSL) /
                            Math.min(lightnessOfHSL, 100 - lightnessOfHSL)) *
                            100
                        );

                  setColor(
                    `hsl(${h}, ${saturationOfHSL}%, ${lightnessOfHSL}%)`
                  );
                }
              }}
              onMouseUp={(e) => {
                setIsSelectorMouseDown(false);
              }}
              onMouseLeave={(e) => {
                setIsSelectorMouseDown(false);
              }}
            >
              <div className={styles.toRightGradient}>
                <div className={styles.toTopGradient} />
              </div>
            </div>
          </div>

          {/* 색조 선택 영역 */}
          <div
            className={styles.hueSelector}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsHueMouseDown(true);
              if (e.target instanceof HTMLDivElement) {
                const rect = e.target.getBoundingClientRect();
                const h = Math.ceil((e.clientX - rect.left) * 1.8);
                setColor(`hsl(${h}, 100%, 50%)`);
              }
            }}
            onMouseMove={(e) => {
              e.stopPropagation();
              if (isHueMouseDown && e.target instanceof HTMLDivElement) {
                const rect = e.target.getBoundingClientRect();
                const h = Math.ceil((e.clientX - rect.left) * 1.8);
                setColor(`hsl(${h}, 100%, 50%)`);
              }
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              setIsHueMouseDown(false);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsHueMouseDown(false);
            }}
          ></div>

          {/* 버튼 영역 */}
          <div>
            <button
              onClick={() => {
                setIsOpened(false);
              }}
            >
              확인
            </button>

            <button
              onClick={() => {
                setColor(lastColor);
                setIsOpened(false);
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
