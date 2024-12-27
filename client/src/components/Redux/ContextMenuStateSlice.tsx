import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface MenuItem {
    text: string,
    callback: () => void
}

export interface ContextMenuState {
    show: boolean,
    pos: { left: number, top: number },
    menus: MenuItem[]
}

export interface MenuShowArgs {
    pos: ContextMenuState['pos'],
    menus: MenuItem[]
}

const initValue: ContextMenuState = {
    show: false,
    pos: {
        left: 0,
        top: 0
    },
    menus: []
}

export const contextStateSlice = createSlice({
    name: "contextState",
    initialState: initValue,
    reducers: {
        showMenu: function(_, action: PayloadAction<MenuShowArgs>) {
            return {
                show: true,
                menus: action.payload.menus,
                pos: action.payload.pos  
            };
        },
        hide: function(state) {
            return { ...state, show: false };
        }
    }
});

export const setMenuShow = contextStateSlice.actions.showMenu;
export const setMenuHide = contextStateSlice.actions.hide;
export default contextStateSlice.reducer;