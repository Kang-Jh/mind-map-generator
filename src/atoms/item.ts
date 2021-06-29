import { atom, selector } from 'recoil';
import { memoizeItemAtomBasedOnId } from '../utils/memoize';

export interface ItemInterface {
  id: number;
  text: string;
  radius: number; // 반지름
  top: number;
  left: number;
  bgColor: string;
  fontSize: number;
  fontColor: string;
  selected: boolean;
  parent: number | null;
  children: number[];
}

export const idsState = atom<number[]>({
  key: 'itemsState',
  default: [],
});

// 아이디를 인자로 받아 원자를 반환
export const itemStateWithId = memoizeItemAtomBasedOnId((id) =>
  atom<ItemInterface>({
    key: `item${id}State`,
    default: {
      id: id,
      text: `item ${id}`,
      radius: 50,
      top: 0,
      left: 0,
      bgColor: `#CCC`,
      fontSize: 16,
      fontColor: '#000',
      selected: false,
      parent: null,
      children: [],
    },
  })
);

// 선택된 아이디들을 담는 원자
export const selectedIdsState = atom<number[]>({
  key: 'selectedIdsState',
  default: [],
});

// 선택된 아이디들을 통해 얻어지는 아이디들을 반환하는 선택자
export const selectedItemsState = selector<ItemInterface[]>({
  key: 'selectedItemsState',
  get: ({ get }) => {
    const selectedIds = get(selectedIdsState);

    const items = selectedIds.map((id) => get(itemStateWithId(id)));

    return items;
  },
  set: ({ get, set }, newValue) => {
    const selectedIds = get(selectedIdsState);

    const itemsAtoms = selectedIds.map((id) => itemStateWithId(id));

    itemsAtoms.forEach((itemAtom, index) => {
      set(itemAtom, (newValue as ItemInterface[])[index]);
    });
  },
});

/**
 * string[]에서 string은 JSON.stringify를 통해 number[]를 문자열화 시킨 것임
 */
export const linkedItemsState = atom<string[]>({
  key: 'linkedItemsState',
  default: [],
});
