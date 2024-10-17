import { useDispatch } from "react-redux";
import { setLoad, setLogin, LoginStateDTO } from "../Redux/LoginStateSlice.tsx";
import { useEffect } from "react";
import useSWR from "swr";

export interface UserDTO {
    id: number,
    name: string,
    avatar: string | null
}

const fetcher = async (url: string) => {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    
    if (access === null) return;

    return await fetch(url, {
        headers: {
            Authorization: `Barer ${access}`
        }        
    }).then(v => v.json());
}

export default function LoginState() {
    const dispatch = useDispatch();
    const { data, error, isLoading } = useSWR<UserDTO>("/api/user/@me", fetcher);

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