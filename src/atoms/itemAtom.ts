import { atom } from 'recoil';
import memoizeItemAtomBasedOnId from '../utils/memoize';

export const itemAtom = memoizeItemAtomBasedOnId((id) =>
  atom({
    key: `item${id}`,
    default: {
      contents: `Box${id}`,
      positionX: 0,
      positionY: 0,
      width: 100,
      height: 100,
      bgColor: `#fff`,
    },
  })
);
