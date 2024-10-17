import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserDTO } from "../LoginState/LoginState";

export interface LoginStateDTO extends UserDTO {
    logined: boolean,
}

export interface LoginState extends LoginStateDTO {
    loading: boolean,
}

const initValue: LoginState = {
    loading: true,
    logined: false,
    name: "",
    avatar: "",
    id: -1
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
                newState.id = action.payload.id;
            }

            return newState;
        }
    }
});


export const setLoad = loginStateSlice.actions.setLoad;
export const setLogin = loginStateSlice.actions.setLogin;
export default loginStateSlice.reducer;