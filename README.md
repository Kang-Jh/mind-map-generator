# 마인드 맵 생성기

## 기술 스택

- ReactJS
- RecoilJS

# 반응형 웹앱이 아닙니다

마인드 맵은 현실에서도 A4 용지가 아닌 매우 큰 용지를 필요로 하는 기법이므로 모든 개념을 한 눈에 보기 힘든 모바일을 지원하는 것은 의미가 없다고 판단했습니다.

# 어떻게 아이템(개념) 간 연결 선을 그릴 것인가?

연결 선을 렌더링하는 방법에는 SVG나 Canvas API를 이용하는 방법이 있을 것입니다. 저는 **Canvas API를 이용**해서 두 아이템 간의 연결 선을 표현했습니다. 아주 기초적인 이용이라 MDN에 있는 Canvas API 튜토리얼 문서를 다 읽은 것은 아니고 필요한 부분만 간단하게 읽어서 연결선을 구현했습니다.

Line 이라는 컴포넌트는 prop으로 pair라는 문자열을 받는데 이 문자열은 배열로 표현된 [부모, 자식] 쌍을 문자열화 한 것입니다.

이 문자열로부터 리코일을 이용하여 부모와 자식 아이템의 정보를 불러온 후 위치 정보(left, top)와 반지름(radius)를 이용하여 각 아이템의 중점을 구합니다.

중점의 x좌표는 left + radius가 되고, y좌표는 top + radius가 됩니다.

이후에 캔버스 엘리먼트의 width와 height, top, left를 중점의 좌표들을 이용하여 계산합니다.

캔버스에서 연결선을 그을 때는 일단 부모의 중점으로 이동하여 자식의 중점으로 선을 긋습니다.

아이템이 연결선보다 z축에서 높은 위치에 위치하게 함으로써 선이 마치 원의 테두리에서 테두리로 연결된 듯한 느낌을 갖게 해줍니다.

# 어떻게 아이템(개념) 간 연결을 구현할 것인가?

아이템은 부모와 자식들을 가집니다. 연결(또는 연결해제) 시 부모 아이템은 자식 아이템의 아이디를 children에 추가(또는 제거)하고 자식 아이템은 부모 아이템의 아이디를 parent에 설정(또는 제거)합니다.

또한 각 연결 때마다 연결선을 긋기 위해 linkedIds라는 원자에 아이디가 부모, 자식 순서로 문자열화 되어서 저장됩니다.

처음에는 아이템들이 선택된 순서에 따라 부모, 자식이 결정되며 이를 바탕으로 연결을 진행했습니다. 하지만 이러한 방식의 구현은 단순하게 구현할 경우 후손 아이템을 부모, 조상 아이템을 자식으로 하는 연결 버그가 일어날 수 있고, 복잡하게 구현할 경우 각 개념 간 연결이 가능한지를 확인하기 위해 시간복잡도가 O(V + E)인 상대적으로 높은 알고리즘(사실 그래프, DFS, BFS를 아직 공부하지 않아서 시간복잡도는 그냥 검색을 통한 결과로만 알고 있습니다..)을 필요로 했습니다.

물론 이러한 시간복잡도는 현대의 컴퓨터 + 아이템의 개수가 아무리 많아도 1,000개를 넘지 않을 것으로 예상되는 마인드맵에서는 그렇게 큰 의미를 가지지 않을 수도 있습니다. 하지만 그래프 알고리즘에 자신이 없는 저로서는 다른 쉬운 알고리즘을 찾기 시작했습니다.

마인드맵의 특성을 분석하다가 마인드맵은 결국 **최상위 개념으로 시작해서 점점 하위 개념으로 퍼져나가는 방식**이었던 만큼 먼저 생성된 노드가 나중에 생성된 노드의 하위 개념이 되는 경우는 거의 없다고 판단했습니다.

ids 에는 항상 아이디가 정렬된 순서대로 저장되므로 아이템 선택 시에 아이디 순서를 보장하는 방식으로 선택된 아이템들을 획득할 수 있다면 위의 마인드맵 특성을 쉽게 적용할 수 있을 것이라고 판단했습니다. 그래서 selectedItemsState 원자의 코드를 수정하고 이를 바탕으로 구현해낼 수 있었습니다.

# 어떻게 아이템의 이동을 구현할 것인가?

아이템의 이동은 아이템들이 선택된 후 왼쪽 컨트롤 키를 누르고 마우스를 움직일 경우 움직이게 구현했습니다.

원리는 상위 컴포넌트인 마인드맵 컴포넌트의 root tag인 div에 onMouseMove라는 속성을 설정함으로써 마우스가 움직일 때마다 항상 마우스가 움직인 위치를 측정할 수 있습니다.

측정 원리는 매우 간단합니다. 컨트롤 키가 눌렸을 때 선택된 아이템들의 top, left에 각각 event.movementX, event.movementY를 더해주는 것입니다. movementX, Y는 이전 마우스 위치에서 얼마나 움직였는지를 측정해줍니다.

# 리사이즈 버튼의 위치 정하기

리사이즈 버튼을 시계로 예를 들면 4시와 5시 사이의 중간에 위치시키기 위해 탄젠트 45도가 1인 점, 즉, 중점에서 탄젠트 값이 1인 점을 빗변으로 하는 직각 이등변삼각형의 빗변의 길이가 반지름인 점을 이용했습니다.

피타고라스 정리에 의해 $x^2 + x^2 = r^2$ 이 되고 한 변의 길이는 $x = \frac{r}{\sqrt{2}} = \frac{r\sqrt{2}}{2}$ 가 됩니다. 첫번째 등식을 자바스크립트 코드로 표현한다면 다음과 같게 됩니다.

```tsx
const x = Math.sqrt(Math.pow(r, 2) / 2);
```

이러한 변의 길이 x를 이용해서 리사이즈 버튼의 x, y좌표를 구해보면 x좌표와 y좌표는 모두 반지름 + x가 됩니다. 매우 간단한 방식으로 리사이즈 버튼의 위치를 정할 수 있었습니다.

# 커스텀 컬러 피커 구현하기

HTML에는 내장된 컬러 피커가 존재합니다. 하지만 내장된 컬러 피커는 브라우저마다 UI가 다르게 나오기 때문에 크로스 브라우징을 필요로 합니다. 하지만 저는 내장된 컬러 피커를 스타일링하는 방법을 찾지 못했습니다.

그래서 커스텀 컬러 피커를 구현하기로 결정했습니다. 물론 가장 쉬운 방법은 react-color 같은 서드파티 모듈을 사용하는 것입니다만 react-color를 사용한다면 역량 강화에 도움이 되지 않고 react-color의 패키지 용량을 생각한다면 배보다 배꼽이 더 큰 것 같아서 사용하지 않기로 했습니다.

가장 처음에 생각했던 방법은 모든 색상을 한 번에 렌더링하는 것이었습니다만 큰 문제가 있었습니다. 바로 경우의 수가 $256^3\fallingdotseq1677만$이라는 것이었습니다. 아래와 같은 코드로 시도해봤습니다.

```tsx
const colors: string[] = []
for (let i = 0; i < 256; i++) {
    for (let j = 0; j < 256; j++) {
        for (let k = 0; k < 256; k++) {
            const color = `#${i.toString(16)}${j.toString(16)}${k.toString(16)}`;
            colors.push(color);
        }
    }
}

function ColorPicker() {
    return (
        ...다른 코드들

        <div>
            {colors.map(color => <span>{color}</span>}
        </div>
    )
}
```

결과는 당연하게도 실패했습니다. 일단 화면에 렌더링하는 시간이 매우 오래 걸리고 각 색상의 크기를 1px씩 잡아도 1600만 픽셀이 필요하다는 결과가 나옵니다.

위와 같은 방식으로는 커스텀 컬러 피커를 구현할 수 없다는 것을 깨닫고 생각한 것은 제가 생각해낸 위의 방식과 리코일 소개 동영상에서 사용된 컬러 피커와 react-color로 구현된 컬러 피커를 비교해보는 것이었습니다.

리코일 소개 동영상에서 사용된 컬러 피커와 react-color로 구현된 컬러 피커는 동일한 원리를 사용하고 있었습니다.

## 색상 표현 방식

색상 표현을 위해 사용되는 방법에는 크게 다섯가지가 있다.

1. 키워드 - white, red, green, blue, black 등 색상 명칭을 그대로 사용
2. RGB - R은 Red, G는 Green, B는 Blue이고, 각 색상은 [0, 255] 구간의 값을 가지게 되고 세 수의 조합으로 색이 결정된다.
3. Hex - RGB의 각 색상을 16진수로 변환한 후 앞에 해쉬태그를 붙여서 만든 문자열로 RGB와 원리는 동일하다고 볼 수 있다.
4. HSL - HSL은 Hue(색조), Saturation(채도), Lightness(밝기)로 표현되는 값으로 색조는 [0, 360] 구간의 값을 가지고 채도와 밝기는 백분율로 표현된다. 채도의 경우 0%에 가까울 수록 회색이 되고 100%에 가까울 수록 원래의 색상이 된다. 휘도의 경우 100%에 가까울 수록 흰 색에 가까워지고 0%에 가까울 수록 검은 색이 된다. Lightness에 따라 흰색 또는 검은색을 현재 색상에 섞는다는 느낌인듯 하다.
5. HSV 또는 HSB - CSS4에 사용될 색상 표현 방식으로 HSL과의 차이점은 V 또는 B(Value 또는 Brightness)가 명도를 나타낸다는 점이다. 여기서 명도란 조명 아래에 있을 때의 색상을 결정하는데 HSL에서는 L이 100%일 때 순수한 흰 색이지만 HSV에서는 그렇지 않은 듯 하다.

HSL과 HSV는 정확하지 않고 디자인 업계 사람이 아니라면 알아두면 좋겠지만 실제로 써먹을 일은 없을 것 같다.

## react-color 홈페이지에서 관찰한 것

첫 번째로 react-color 홈페이지와 리코일 소개 동영상에서 관찰한 것은 먼저 직선으로 되어있는 색상 선택 영역이 있고, 사각형으로 되어 있는 색상 선택 영역이 있었다는 것이다.

두 번째는 직선으로 되어 있는 색상 선택 영역에서 버튼을 움직일 때마다 색상값 H가 [0, 360] 구간에 있었다는 것이다.

세 번째는 사각형으로 되어 있는 색상 선택 역영은 x축이 HSV에서 S를 의미하고, y축은 HSV에서 V를 의미한다는 것이었다.

네 번째는 직선으로 되어 있는 선택 영역과 직사각형으로 되어 있는 채도, 명도 선택 영역이 CSS를 이용해 표현된다는 것을 알았습니다.

## 관찰한 것을 바탕으로 컬러 피커 구현하기

핵심은 측정된 HSV를 HSL로 변환할 수 있어야 합니다.

변환에 관한 공식은 위키피디아 링크 [https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_HSL](https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_HSL) 를 참고해서 만들었습니다.

아래 코드는 컬러 피커의 기능적 구현을 위한 최소한의 CSS가 적용된 코드입니다.

```tsx
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
				 {/* 나머지 코드 생략 */}
}
```

생략된 부분은 크게 중요한 부분은 없습니다.

mouseMove에서는 조건문에 MouseDown의 조건문에 마우스가 눌린 상태인지를 확인하는 조건이 추가됩니다. 이후에는 mouseDown과 일치합니다.

mouseUp, mouseLeave에서는 마우스 눌린 상태를 false로 업데이트합니다.

리코일을 사용하지 않고 mouseLeave를 사용한 이유는 최대한 전역 상태를 줄이기 위해서였습니다.
