import Item from './Item';

export default function MindMap({ items }: { items: number[] }) {
  return (
    <div>
      {items.map((id) => (
        <Item key={id} id={id} />
      ))}
    </div>
  );
}
