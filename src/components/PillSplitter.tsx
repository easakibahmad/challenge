import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  startDrawing,
  updateDrawing,
  finishDrawing,
  setSplitLines,
  splitPills,
  movePill,
  bringPillToFront
} from '../utils/pillSplitterActionCreators';

import type { RootState } from '../redux/store';

import "../styles/pillSplitter.css"

const PillSplitter: React.FC = () => {
  const dispatch = useDispatch();
  const pillsState = useSelector((state: RootState) => state);
  const { pills, drawingPill, splitLines } = pillsState;
  const [cursorPos, setCursorPos] = React.useState<{ x: number; y: number } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Track drag offset so pill follows mouse grab point
  const [dragOffset, setDragOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('pill')) return;
    dispatch(startDrawing(e.clientX, e.clientY));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });

    if (drawingPill) {
      dispatch(updateDrawing(e.clientX, e.clientY));
      dispatch(setSplitLines({ x: e.clientX, y: e.clientY }));
    } else {
      dispatch(setSplitLines({ x: e.clientX, y: e.clientY }));
    }
  };

  const handleMouseUp = () => {
    if (drawingPill) {
      dispatch(finishDrawing());
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (drawingPill) return;
    dispatch(splitPills(e.clientX, e.clientY));
  };

const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
  dispatch(bringPillToFront(id));

  if (!containerRef.current) return;

  const pillElem = e.currentTarget;
  const pillRect = pillElem.getBoundingClientRect();
  const offsetX = e.clientX - pillRect.left;
  const offsetY = e.clientY - pillRect.top;

  setDragOffset({ x: offsetX, y: offsetY });

  e.dataTransfer.setData('text/plain', id);

  // Create a clone node for drag image
  const dragImage = pillElem.cloneNode(true) as HTMLElement;
  dragImage.style.position = 'absolute';
  dragImage.style.top = '-1000px'; // move off screen
  dragImage.style.left = '-1000px';
  dragImage.style.margin = '0';

  document.body.appendChild(dragImage);

  e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);

  // Remove the clone after a small delay so dragImage can be used
  setTimeout(() => {
    document.body.removeChild(dragImage);
  }, 0);
};



  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const id = e.dataTransfer.getData('text/plain');
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate position relative to container minus drag offset
    let x = e.clientX - containerRect.left - dragOffset.x;
    let y = e.clientY - containerRect.top - dragOffset.y;

    // Optional: clamp so pill stays inside container boundaries
    x = Math.max(0, Math.min(x, containerRect.width));
    y = Math.max(0, Math.min(y, containerRect.height));

    dispatch(movePill(id, x, y));
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gray-100 cursor-plus"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={allowDrop}
    >
      {pills.map((pill) => (
        <div
          key={pill.id}
          className="pill absolute border-4 border-black cursor-move"
          draggable
          onDragStart={(e) => handleDragStart(e, pill.id)}
style={{
  top: pill.y,
  left: pill.x,
  width: pill.width,
  height: pill.height,
  backgroundColor: pill.color,
  borderRadius: pill.borderRadius,
  userSelect: 'none',
  zIndex: pill.zIndex ?? 0,
}}

        />
      ))}

      {drawingPill && (
        <div
          className="absolute border-4 border-black opacity-50"
          style={{
            top: drawingPill.y,
            left: drawingPill.x,
            width: drawingPill.width,
            height: drawingPill.height,
            backgroundColor: drawingPill.color,
            borderRadius: drawingPill.borderRadius,
            userSelect: 'none',
          }}
        />
      )}

      {cursorPos && (
        <>
          <div
            className="absolute bg-green-600"
            style={{
              top: 0,
              left: cursorPos.x,
              width: 4,
              height: '100%',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />
          <div
            className="absolute bg-green-600"
            style={{
              top: cursorPos.y,
              left: 0,
              height: 4,
              width: '100%',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />
        </>
      )}
    </div>
  );
};

export default PillSplitter;
