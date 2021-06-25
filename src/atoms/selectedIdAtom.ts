import { atom } from 'recoil';

export const singleSelectedIdAtom = atom({
  key: 'selectedIdState',
  default: 0,
});
