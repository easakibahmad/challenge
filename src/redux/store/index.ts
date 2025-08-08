import { legacy_createStore as createStore } from 'redux';
import { pillSplitterReducer } from '../features/pillSplitterReducer';

export const store = createStore(pillSplitterReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
