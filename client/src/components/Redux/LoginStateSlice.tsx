import { createSlice } from "@reduxjs/toolkit"

export interface LoginState {
    loading: boolean,
    logined: boolean,
    name: string,
    avatar: string
}

const initValue: LoginState = {
    loading: true,
    logined: false,
    name: "",
    avatar: ""
}

export const loginStateSlice = createSlice({
    name: 'loginState',
    initialState: initValue,
    reducers: {
        
    }
});


export default loginStateSlice.reducer;