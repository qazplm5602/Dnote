import { configureStore } from "@reduxjs/toolkit";
import loginStateReducer from "./LoginStateSlice.tsx";
import contextMenuStateReducer from "./ContextMenuStateSlice.tsx";

export const store = configureStore({
    reducer: {
        user: loginStateReducer,
        contextMenu: contextMenuStateReducer
    },
    
    // store 함수 저장하기 위해서 직렬화 끔
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export type RootState = ReturnType<typeof store.getState>;