import styles from '../styles/ColorPicker.module.css';
import { useRef, useState } from 'react';
import {
  calculateLightnessOfHSL,
  calculateSaturationOfHSL,
  calculateSaturationOfHSV,
  calculateValueOfHSV,
} from '../utils/color';

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
      <div className={styles.mdoalOpenBtnDiv}>
        <span className={styles.label}>{label}</span>
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
            top: `calc(15% + ${colorPickerRef.current?.offsetTop ?? 0}px)`,
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
                  // HSV에서의 채도
                  const saturationOfHSV = calculateSaturationOfHSV(
                    e.clientX,
                    rect.left,
                    rect.width
                  );
                  // HSV에서의 명도
                  const value = calculateValueOfHSV(
                    e.clientY,
                    rect.top,
                    rect.height
                  );
                  // HSL에서의 밝기
                  const lightnessOfHSL = calculateLightnessOfHSL(
                    value,
                    saturationOfHSV
                  );
                  // HSL에서의 채도
                  const saturationOfHSL = calculateSaturationOfHSL(
                    value,
                    lightnessOfHSL
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
                  // 타겟 직사각형
                  const rect = e.target.getBoundingClientRect();
                  // HSV에서의 채도
                  const saturationOfHSV = calculateSaturationOfHSV(
                    e.clientX,
                    rect.left,
                    rect.width
                  );
                  // HSV에서의 명도
                  const value = calculateValueOfHSV(
                    e.clientY,
                    rect.top,
                    rect.height
                  );
                  // HSL에서의 밝기
                  const lightnessOfHSL = calculateLightnessOfHSL(
                    value,
                    saturationOfHSV
                  );
                  // HSL에서의 채도
                  const saturationOfHSL = calculateSaturationOfHSL(
                    value,
                    lightnessOfHSL
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
                const h = Math.ceil(
                  // 색상 값은
                  // 현재 마우스가 타겟의 시작 x좌표에서 얼마나 떨어져있는지를 나타내는 값에
                  // 1픽셀 당 몇 도인지를 곱해준 값
                  (e.clientX - rect.left) * (360 / rect.width)
                );
                setColor(`hsl(${h}, 100%, 50%)`);
              }
            }}
            onMouseMove={(e) => {
              e.stopPropagation();
              if (isHueMouseDown && e.target instanceof HTMLDivElement) {
                const rect = e.target.getBoundingClientRect();
                const h = Math.ceil(
                  (e.clientX - rect.left) * (360 / rect.width)
                );
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
          <div className={styles.colorPickerBtnDiv}>
            <button
              className={styles.confirmBtn}
              onClick={() => {
                setIsOpened(false);
              }}
            >
              확인
            </button>

            <button
              className={styles.cancelBtn}
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
