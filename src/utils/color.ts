/**
 * HSV에서의 채도값을 계산하는 함수로
 * 현재 마우스의 위치의 x좌표에서 직사각형의 x좌표 시작점을 뺀 값을
 * 타겟의 width 1% 당 픽셀로 나눈 값
 *
 * @param {number} eventClientX 마우스 포인터의 X좌표
 * @param {number} leftOfRect 직사각형의 CSS left 값
 * @param {number} widthOfRect 직사각형의 가로 길이
 * @returns {number} 채도
 */
function calculateSaturationOfHSV(
  eventClientX: number,
  leftOfRect: number,
  widthOfRect: number
): number {
  return Math.round((eventClientX - leftOfRect) / (widthOfRect / 100));
}

/**
 * HSV에서의 명도값을 계산하는 함수로
 * 직사각형의 가장 위가 100이므로 100에서 빼줘야 함
 * 명도값은 현재 마우스의 Y좌표에서 타겟 직사각형의 시작 Y좌표를 빼준 값을
 * 타겟의 height 1%당 픽셀로 나눈 값
 * @param {number} eventClientY 마우스 포인터의 Y좌표
 * @param {number} topOfRect 직사각형의 CSS top 값
 * @param {number} heightOfRect 직사각형의 높이
 * @returns 명도
 */
function calculateValueOfHSV(
  eventClientY: number,
  topOfRect: number,
  heightOfRect: number
): number {
  return 100 - Math.round((eventClientY - topOfRect) / (heightOfRect / 100));
}

/**
 * HSL에서의 밝기 값을 계산하는 함수로
 * HSV에서의 명도에 HSV에서의 채도를 2로 나눈 값을 100에서 뺀 값을 곱해준 후 100으로 나눈 값
 * @param {number} valueOfHSV HSV에서의 명도값
 * @param {number} saturationOfHSV HSV에서의 채도값
 * @returns {number} HSL에서의 밝기
 */
function calculateLightnessOfHSL(
  valueOfHSV: number,
  saturationOfHSV: number
): number {
  return Math.round((valueOfHSV * (100 - saturationOfHSV / 2)) / 100);
}

/**
 * HSL에서의 채도 값으로
 * HSL에서의 밝기 값이 0%이거나 100%인 경우 채도 값은 0
 * 이외의 경우에는 HSV에서의 명도 값에서 HSL에서의 밝기 값을 뺀 값을
 * HSL의 밝기값과 100 - HSL의 밝기 값 중 작은 값으로 나눈 후
 * 100을 곱해준 값
 * @param {number} valueOfHSV HSV에서의 명도값
 * @param {number} lightnessOfHSL HSL에서의 밝기값
 * @returns {number} HSL에서의 채도값
 */
function calculateSaturationOfHSL(
  valueOfHSV: number,
  lightnessOfHSL: number
): number {
  return lightnessOfHSL === 0 || lightnessOfHSL === 100
    ? 0
    : Math.round(
        ((valueOfHSV - lightnessOfHSL) /
          Math.min(lightnessOfHSL, 100 - lightnessOfHSL)) *
          100
      );
}

export {
  calculateSaturationOfHSV,
  calculateValueOfHSV,
  calculateLightnessOfHSL,
  calculateSaturationOfHSL,
};
