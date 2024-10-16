import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { LoginState as ILoginState, setLoad, setLogin, LoginStateDTO } from "../Redux/LoginStateSlice.tsx";
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

        const dto: LoginStateDTO = {
            logined: false,
            avatar: "",
            name: ""
        }
        
        if (data !== undefined && error === undefined) {
            dto.logined = true;
            dto.avatar = data.avatar;
            dto.name = data.name;
        }
        
        dispatch(setLogin(dto));
    }, [isLoading]);

    return null;
}   