import type { BRING_PILL_TO_FRONT, FINISH_DRAWING, MOVE_PILL, SET_SPLIT_LINES, SPLIT_PILLS, START_DRAWING, UPDATE_DRAWING } from "../constants/pillSplitter";

export interface TPill {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  borderRadius: number;
  zIndex?: number;
}

export interface TPillsState {
  pills: TPill[];
  drawingPill?: TPill;
  splitLines: { x: number; y: number } | null;
}

export type TPillSplitterAction =
  | { type: typeof START_DRAWING; payload: { x: number; y: number } }
  | { type: typeof UPDATE_DRAWING; payload: { x: number; y: number } }
  | { type: typeof FINISH_DRAWING }
  | { type: typeof SET_SPLIT_LINES; payload: { x: number; y: number } | null }
  | { type: typeof SPLIT_PILLS; payload: { x: number; y: number } }
  | { type: typeof MOVE_PILL; payload: { id: string; x: number; y: number } }
  | { type: typeof BRING_PILL_TO_FRONT; payload: { id: string } };