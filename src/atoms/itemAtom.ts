import { atom } from 'recoil';
import { memoizeItemAtomBasedOnId } from '../utils/memoize';

export const itemAtom = memoizeItemAtomBasedOnId((id) =>
  atom({
    key: `item${id}State`,
    default: {
      id: id,
      text: `item ${id}`,
      positionX: 0,
      positionY: 0,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bgColor: `#CCC`,
      selected: false,
    },
  })
);
