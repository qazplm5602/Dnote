import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface LoginStateDTO {
    logined: boolean,
    name: string,
    avatar: string | null    
}

export interface LoginState extends LoginStateDTO {
    loading: boolean,
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
        setLoad(state, action: PayloadAction<boolean>) {
            return { ...state, loading: action.payload };
        },
        setLogin(state, action: PayloadAction<LoginStateDTO>) {
            const newState = { ...state };
            newState.logined = action.payload.logined;
            
            if (newState.logined) {
                newState.avatar = action.payload.avatar;
                newState.name = action.payload.name;
            }

            return newState;
        }
    }
});


export const setLoad = loginStateSlice.actions.setLoad;
export const setLogin = loginStateSlice.actions.setLogin;
export default loginStateSlice.reducer;