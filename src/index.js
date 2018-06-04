import { createReducer, passAlong } from './reducer';
import { bindDispatch } from './dispatch';
import createActionNamespace from './actions';

import DataLoader from './components/data-loader';
import AutoTrigger from './components/auto-trigger';

export {
  AutoTrigger,
  bindDispatch,
  createActionNamespace,
  createReducer,
  DataLoader,
  passAlong
};
