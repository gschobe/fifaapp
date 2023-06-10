/* eslint-disable prettier/prettier */
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import storeReducer from "./StoreReducer";
import matchDayReducer from "./FifaGamesReducer";
import authReducer from "./AuthRecucer";
import StatisticsReducer from "./StatisticsReducer";

const store = configureStore({
  reducer: {
    fifadata: persistReducer({ key: "fifadata", storage }, storeReducer),
    fifagames: persistReducer({ key: "fifagames", storage }, matchDayReducer),
    auth: authReducer,
    statistics: StatisticsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// eslint-disable-next-line no-undef
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
