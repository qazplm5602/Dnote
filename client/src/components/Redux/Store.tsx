import { configureStore } from "@reduxjs/toolkit";
import loginStateReducer from "./LoginStateSlice.tsx";
import contextMenuStateReducer from "./ContextMenuStateSlice.tsx";

export const store = configureStore({
    reducer: {
        user: loginStateReducer,
        contextMenu: contextMenuStateReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;