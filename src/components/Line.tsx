import styles from '../styles/Line.module.css';
import { useLayoutEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { itemStateWithId } from '../atoms';

/**
 *
 * @param {string} pair stringified number array which contains parent and child in order
 */
export default function Line({ pair }: { pair: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [parentId, childId] = JSON.parse(pair);
  const parentItem = useRecoilValue(itemStateWithId(parentId));
  const childItem = useRecoilValue(itemStateWithId(childId));
  // 부모 아이템의 중심의 X, Y 좌표
  const parentCenterX = parentItem.left + parentItem.radius;
  const parentCenterY = parentItem.top + parentItem.radius;
  // 자식 아이템의 중심의 X, Y 좌표
  const childCenterX = childItem.left + childItem.radius;
  const childCenterY = childItem.top + childItem.radius;
  const canvasWidth = Math.abs(parentCenterX - childCenterX);
  const canvasHeight = Math.abs(parentCenterY - childCenterY);
  const canvasLeft = Math.min(parentCenterX, childCenterX);
  const canvasTop = Math.min(parentCenterY, childCenterY);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      // 부모 아이템의 중심으로 이동
      ctx.moveTo(
        Math.abs(canvasLeft - parentCenterX),
        Math.abs(canvasTop - parentCenterY)
      );
      // 자식 아이템의 중심까지 선을 그음
      ctx.lineTo(
        Math.abs(canvasLeft - childCenterX),
        Math.abs(canvasTop - childCenterY)
      );
      // 선에 outline을 그림
      ctx.stroke();
      ctx.closePath();
    }

    return () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      }
    };
  }, [
    canvasHeight,
    canvasLeft,
    canvasTop,
    canvasWidth,
    childCenterX,
    childCenterY,
    parentCenterX,
    parentCenterY,
  ]);

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      width={canvasWidth ? canvasWidth : 1}
      height={canvasHeight ? canvasHeight : 1}
      style={{
        top: canvasTop,
        left: canvasLeft,
      }}
    >
      {parentItem.text}과 {childItem.text}를 잇는 연결선
    </canvas>
  );
}
