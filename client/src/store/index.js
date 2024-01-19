/*import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import feedbackSlice from "./feedback-slice";

const rootReducer = combineReducers({
    feedback: feedbackSlice.reducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['feedback'] // specify which reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;*/