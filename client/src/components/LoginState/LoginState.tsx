import { useDispatch } from "react-redux";
import { setLoad, setLogin, LoginStateDTO } from "../Redux/LoginStateSlice.tsx";
import { useEffect } from "react";
import useSWR from "swr";
import request, { ErrorResponse } from "../Utils/request.ts";
import { AxiosError } from "axios";

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

export const USER_CACHE_KEY = "user/@me";

export default function LoginState() {
    const dispatch = useDispatch();
    const { data, error, isLoading } = useSWR<UserDTO | undefined>(USER_CACHE_KEY, fetcher);

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
        } else if (error !== undefined) {
            const errorData = error as AxiosError<ErrorResponse>;
            if (errorData?.response?.data?.code === "USER4") { // 계정 차단 당함
                localStorage.removeItem("accessToken");                
                localStorage.removeItem("refreshToken");                
            }
        }
        
        dispatch(setLogin(dto));
    }, [isLoading, error, data]);

    return null;
}   