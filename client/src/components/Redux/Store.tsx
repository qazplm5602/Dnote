import { configureStore } from "@reduxjs/toolkit";
import loginStateReducer from "./LoginStateSlice.tsx";

export const store = configureStore({
    reducer: {
        user: loginStateReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;