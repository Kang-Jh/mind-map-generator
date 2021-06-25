import { RecoilState } from 'recoil';

/**
 * 복잡한 메모이제이션이 필요하지 않을 것이라고 판단해서
 * 서드파티 라이브러리를 쓰는 것이 아니라 직접 구현한 함수
 *
 * id를 인자로 받아 RecoilState를 반환하는 함수를 인자로 받아서
 * id값으로 이미 RecoilState가 만들어져있다면 그것을 반환하고
 * 만들어지지 않았다면 새로 만들어서 store에 저장 후 반환
 *
 * 가장 기본적인 클로저 사용법 중 하나
 *
 * @param fn RecoilState(atom 함수의 반환값)를 반환하는 함수
 * @returns {function} 메모이제이션된 함수
 */
function memoizeItemAtomBasedOnId<T = any>(
  fn: (id: number) => RecoilState<T>
): (id: number) => RecoilState<T> {
  const store: { [key: number]: any } = {};

  return function (id: number) {
    if (store[id]) {
      return store[id];
    }

    store[id] = fn(id);

    return store[id];
  };
}

export { memoizeItemAtomBasedOnId };
