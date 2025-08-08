import { BORDER_RADIUS, 
  BRING_PILL_TO_FRONT, 
  FINISH_DRAWING, 
  MIN_PART_SIZE, 
  MIN_PILL_SIZE, 
  MOVE_PILL, 
  SET_SPLIT_LINES, 
  SPLIT_PILLS, 
  START_DRAWING, 
  UPDATE_DRAWING} from "../../constants/pillSplitter";
import type { TPill, TPillSplitterAction, TPillsState } from "../../types/pillSplitter";
import { generateId, getRandomColor } from "../../utils/commonUtils";

const initialState: TPillsState = {
  pills: [],
  drawingPill: undefined,
  splitLines: null,
};

export const pillSplitterReducer = ( state = initialState,action: TPillSplitterAction ): TPillsState => {
  switch (action.type) {
    case START_DRAWING: {
      const { x, y } = action.payload;
      return {
        ...state,
        drawingPill: {
          id: generateId(),
          x,
          y,
          width: 0,
          height: 0,
          color: getRandomColor(),
          borderRadius: BORDER_RADIUS,
        },
      };
    }
    case UPDATE_DRAWING: {
      if (!state.drawingPill) return state;
      const { x, y } = action.payload;
      return {
        ...state,
        drawingPill: {
          ...state.drawingPill,
          width: Math.max(MIN_PILL_SIZE, x - state.drawingPill.x),
          height: Math.max(MIN_PILL_SIZE, y - state.drawingPill.y),
        },
      };
    }
    case FINISH_DRAWING: {
      if (!state.drawingPill) return state;
      return {
        ...state,
        pills: [...state.pills, state.drawingPill],
        drawingPill: undefined,
      };
    }
    case SET_SPLIT_LINES: {
      return {
        ...state,
        splitLines: action.payload,
      };
    }
case BRING_PILL_TO_FRONT: {
  const { id } = action.payload;
  const maxZIndex = state.pills.reduce(
    (max, pill) => Math.max(max, pill.zIndex ?? 0),
    0
  );

  return {
    ...state,
    pills: state.pills.map(pill =>
      pill.id === id ? { ...pill, zIndex: maxZIndex + 1 } : pill
    ),
  };
}

case SPLIT_PILLS: {
  const splitX = action.payload.x;
  const splitY = action.payload.y;
  const newPills: TPill[] = [];

  state.pills.forEach((pill) => {
    let didSplit = false;

    const intersectsVertically =
      pill.x < splitX && pill.x + pill.width > splitX && pill.width >= MIN_PILL_SIZE;
    const intersectsHorizontally =
      pill.y < splitY && pill.y + pill.height > splitY && pill.height >= MIN_PILL_SIZE;

    if (intersectsVertically && intersectsHorizontally) {
      // Calculate sizes for 4 parts
      const leftWidth = splitX - pill.x;
      const rightWidth = pill.x + pill.width - splitX;
      const topHeight = splitY - pill.y;
      const bottomHeight = pill.y + pill.height - splitY;

      if (
        leftWidth >= MIN_PART_SIZE &&
        rightWidth >= MIN_PART_SIZE &&
        topHeight >= MIN_PART_SIZE &&
        bottomHeight >= MIN_PART_SIZE
      ) {
        // top-left
        newPills.push({
          ...pill,
          id: generateId(),
          x: pill.x,
          y: pill.y,
          width: leftWidth,
          height: topHeight,
          borderRadius: BORDER_RADIUS,
        });
        // top-right
        newPills.push({
          ...pill,
          id: generateId(),
          x: splitX,
          y: pill.y,
          width: rightWidth,
          height: topHeight,
          borderRadius: BORDER_RADIUS,
        });
        // bottom-left
        newPills.push({
          ...pill,
          id: generateId(),
          x: pill.x,
          y: splitY,
          width: leftWidth,
          height: bottomHeight,
          borderRadius: BORDER_RADIUS,
        });
        // bottom-right
        newPills.push({
          ...pill,
          id: generateId(),
          x: splitX,
          y: splitY,
          width: rightWidth,
          height: bottomHeight,
          borderRadius: BORDER_RADIUS,
        });
        didSplit = true;
      } else {
        // If 4-way split not possible, fallback to vertical or horizontal split below
      }
    }

    // If no 4-way split done, try vertical split only
    if (!didSplit && intersectsVertically) {
      const leftWidth = splitX - pill.x;
      const rightWidth = pill.x + pill.width - splitX;

      if (leftWidth >= MIN_PART_SIZE && rightWidth >= MIN_PART_SIZE) {
        newPills.push({
          ...pill,
          id: generateId(),
          width: leftWidth,
          borderRadius: BORDER_RADIUS,
        });
        newPills.push({
          ...pill,
          id: generateId(),
          x: splitX,
          width: rightWidth,
          borderRadius: BORDER_RADIUS,
        });
        didSplit = true;
      }
    }

    // If no vertical split done, try horizontal split only
    if (!didSplit && intersectsHorizontally) {
      const topHeight = splitY - pill.y;
      const bottomHeight = pill.y + pill.height - splitY;

      if (topHeight >= MIN_PART_SIZE && bottomHeight >= MIN_PART_SIZE) {
        newPills.push({
          ...pill,
          id: generateId(),
          height: topHeight,
          borderRadius: BORDER_RADIUS,
        });
        newPills.push({
          ...pill,
          id: generateId(),
          y: splitY,
          height: bottomHeight,
          borderRadius: BORDER_RADIUS,
        });
        didSplit = true;
      }
    }

    // If no split at all, move aside if intersecting or keep pill
    if (!didSplit) {
      if (pill.x < splitX && pill.x + pill.width > splitX) {
        newPills.push({ ...pill, x: pill.x - 10 });
      } else if (pill.y < splitY && pill.y + pill.height > splitY) {
        newPills.push({ ...pill, y: pill.y - 10 });
      } else {
        newPills.push(pill);
      }
    }
  });

  return {
    ...state,
    pills: newPills,
  };
}

    case MOVE_PILL: {
      const { id, x, y } = action.payload;
      return {
        ...state,
        pills: state.pills.map((pill) =>
          pill.id === id ? { ...pill, x, y } : pill
        ),
      };
    }
    default:
      return state;
  }
};
