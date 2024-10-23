import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { ACCESS_KEY, REFRESH_KEY } from "./LoginSuccess";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const { mutate } = useSWRConfig();
    const navigate = useNavigate();
    
    const onLoad = function() {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);

        mutate("/api/user/@me");
        navigate("/");
    }
    
    useEffect(onLoad, []);
    return null;
}