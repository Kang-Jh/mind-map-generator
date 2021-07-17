import {
  calculateSaturationOfHSV,
  calculateValueOfHSV,
  calculateLightnessOfHSL,
  calculateSaturationOfHSL,
} from './color';

test('calculate saturation of HSV', () => {
  expect(calculateSaturationOfHSV(5, 1, 100)).toBe(4);
});

test('calculate value of HSV', () => {
  expect(calculateValueOfHSV(5, 1, 100)).toBe(96);
});

test('calculate lightness of HSL', () => {
  expect(
    calculateLightnessOfHSL(
      calculateValueOfHSV(5, 1, 100),
      calculateSaturationOfHSV(5, 1, 100)
    )
  ).toBeCloseTo(94);
});

test('calculate saturation of HSL', () => {
  expect(calculateSaturationOfHSL(4, 0)).toBe(0);
  expect(calculateSaturationOfHSL(4, 100)).toBe(0);
  expect(calculateSaturationOfHSL(96, 94)).toBe(33);
});
