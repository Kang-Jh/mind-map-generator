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

export const selectedIdsState = atom<number[]>({
  key: 'selectedIdsState',
  default: [],
});

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
