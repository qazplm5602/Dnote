import { useDispatch } from "react-redux";
import { setLoad, setLogin, LoginStateDTO } from "../Redux/LoginStateSlice.tsx";
import { useEffect } from "react";
import useSWR from "swr";
import request from "../Utils/request.ts";

export interface UserDTO {
    id: number,
    name: string,
    avatar: string | null
}

const fetcher = async (url: string) => {
    const access = localStorage.getItem("accessToken");
    if (access === null) // 토큰이 없지롱.
        return;

    return (await request<UserDTO>(url)).data;
}

export default function LoginState() {
    const dispatch = useDispatch();
    const { data, error, isLoading } = useSWR<UserDTO | undefined>("user/@me", fetcher);

    useEffect(() => {
        dispatch(setLoad(isLoading));
        if (isLoading) return;

        const dto: LoginStateDTO = {
            logined: false,
            avatar: "",
            name: "",
            id: -1
        }

        const isLogin = data !== undefined && error === undefined && data.id !== undefined  && data.name !== undefined && data.avatar !== undefined;
        
        if (isLogin) {
            dto.logined = true;
            dto.avatar = data.avatar;
            dto.name = data.name;
            dto.id = data.id;
        }
        
        dispatch(setLogin(dto));
    }, [isLoading, data]);

    return null;
}   