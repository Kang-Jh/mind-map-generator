import { atom, selector } from 'recoil';
import { memoizeItemAtomBasedOnId } from '../utils/memoize';

export interface ItemInterface {
  id: number;
  text: string;
  width: number;
  height: number;
  top: number;
  left: number;
  bgColor: string;
  selected: boolean;
}

export const itemStateWithId = memoizeItemAtomBasedOnId((id) =>
  atom<ItemInterface>({
    key: `item${id}State`,
    default: {
      id: id,
      text: `item ${id}`,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bgColor: `#CCC`,
      selected: false,
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
