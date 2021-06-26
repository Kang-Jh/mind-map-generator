import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedItemsState, linkedItemsState } from '../atoms';

export default function ToolMenu() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemsState);
  const setLinkedItems = useSetRecoilState(linkedItemsState);

  return (
    <div>
      <div>
        마지막으로 선택된 아이템
        {/* 부등호를 써준 이유는 selectedItems.length 로 할 경우 길이가 0일 때 화면에 0이 표시되기 때문임 */}
        {selectedItems.length > 0 &&
          selectedItems[selectedItems.length - 1].text}
      </div>

      {selectedItems.length === 2 && (
        <div>
          <div>상위개념 {selectedItems[0].text}</div>
          <div>하위개념 {selectedItems[1].text}</div>
          <button
            onClick={() => {
              if (
                selectedItems[1].parent === null &&
                !selectedItems[1].children.includes(selectedItems[0].id)
              ) {
                setSelectedItems(
                  selectedItems.map((item, index) => ({
                    ...item,
                    parent: index === 0 ? item.parent : selectedItems[0].id,
                    children:
                      index === 0
                        ? [...item.children, selectedItems[1].id]
                        : item.children,
                  }))
                );

                setLinkedItems((state) => [
                  ...state,
                  JSON.stringify([selectedItems[0].id, selectedItems[1].id]),
                ]);

                console.log('연결됨');
              } else if (
                selectedItems[0].children.includes(selectedItems[1].id)
              ) {
                setSelectedItems(
                  selectedItems.map((item, index) => ({
                    ...item,
                    parent: index === 0 ? item.parent : null,
                    children:
                      index === 0
                        ? item.children.filter(
                            (id) => id !== selectedItems[1].id
                          )
                        : item.children,
                  }))
                );

                setLinkedItems((state) =>
                  state.filter(
                    (pair) =>
                      pair !==
                      JSON.stringify([selectedItems[0].id, selectedItems[1].id])
                  )
                );
              }
            }}
          >
            {selectedItems[0].children.includes(selectedItems[1].id)
              ? '연결 해제'
              : '연결하기'}
          </button>
        </div>
      )}
    </div>
  );
}
