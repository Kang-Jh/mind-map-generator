import { atom, GetRecoilValue, selector } from 'recoil';
import { memoize } from '../utils/memoize';

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
export const itemStateWithId = memoize((id) =>
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

export const totalItemsState = selector<ItemInterface[]>({
  key: 'totalItemsSelector',
  get: ({ get }) => {
    const ids = get(idsState);

    return ids.map((id) => get(itemStateWithId(id)));
  },
  set: ({ get, set }, newValue) => {
    const ids = get(idsState);

    ids.forEach((id, index) => {
      set(itemStateWithId(id), (newValue as ItemInterface[])[index]);
    });
  },
});

// 선택된 아이디들을 통해 얻어지는 아이디들을 반환하는 선택자
export const selectedItemsState = selector<ItemInterface[]>({
  key: 'selectedItemsState',
  get: ({ get }) => {
    const ids = get(idsState);

    const items = ids
      .map((id) => get(itemStateWithId(id)))
      .filter((item) => item.selected);

    return items;
  },
  set: ({ get, set }, newValue) => {
    const items = get(selectedItemsState);

    items.forEach((item, index) => {
      set(itemStateWithId(item.id), (newValue as ItemInterface[])[index]);
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

// 부모가 없는 아이템들의 아이디들 선택자
export const rootedIdsState = selector<number[]>({
  key: 'rootedIdsState',
  get: ({ get }) => {
    const ids = get(idsState);

    const rootedIds = ids
      .map((id) => get(itemStateWithId(id)))
      .filter((item) => item.parent === null)
      .map((item) => item.id);

    return rootedIds;
  },
});

/**
 * 특정 아이템의 모든 자손 아이템을 만들기 위한 함수로
 * 주어진 배열에 모든 자손 아이템들을 추가한다
 */
function pushSubTree(
  arr: ItemInterface[],
  node: ItemInterface,
  get: GetRecoilValue
) {
  for (let i = 0; i < node.children.length; i++) {
    const child = get(itemStateWithId(node.children[i]));
    arr.push(child);
    pushSubTree(arr, child, get);
  }
}

/**
 * 주어진 아이디의 모든 하위 아이템을 반환하는 선택자
 */
export const subTreeState = memoize<ItemInterface[]>((id) =>
  selector({
    key: `$subTreeStateOf${id}`,
    get: ({ get }) => {
      const root = get(itemStateWithId(id));
      const subTree: ItemInterface[] = [root];
      pushSubTree(subTree, root, get);
      return subTree;
    },
    set: ({ get, set }, newValue) => {
      const subTree = get(subTreeState(id));

      subTree.forEach((node, index) =>
        set(itemStateWithId(node.id), (newValue as ItemInterface[])[index])
      );
    },
  })
);
