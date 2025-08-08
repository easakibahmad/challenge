import { BRING_PILL_TO_FRONT, FINISH_DRAWING, 
  MOVE_PILL, 
  SET_SPLIT_LINES, 
  SPLIT_PILLS, 
  START_DRAWING, 
  UPDATE_DRAWING } from "../constants/pillSplitter";

export const startDrawing = (x: number, y: number) => ({
  type: START_DRAWING,
  payload: { x, y },
});

export const updateDrawing = (x: number, y: number) => ({
  type: UPDATE_DRAWING,
  payload: { x, y },
});

export const finishDrawing = () => ({
  type: FINISH_DRAWING,
});

export const setSplitLines = (pos: { x: number; y: number } | null) => ({
  type: SET_SPLIT_LINES,
  payload: pos,
});

export const splitPills = (x: number, y: number) => ({
  type: SPLIT_PILLS,
  payload: { x, y },
});

export const movePill = (id: string, x: number, y: number) => ({
  type: MOVE_PILL,
  payload: { id, x, y },
});

export const bringPillToFront = (id: string) => ({
  type: BRING_PILL_TO_FRONT,
  payload: { id },
});
