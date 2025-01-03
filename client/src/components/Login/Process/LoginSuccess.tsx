import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { USER_CACHE_KEY } from "../../LoginState/LoginState";

export const ACCESS_KEY = "accessToken";
export const REFRESH_KEY = "refreshToken";

export default function LoginSuccess() {
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const [cookies, _, removeCookie] = useCookies([ACCESS_KEY, REFRESH_KEY]);

    const onLoad = function() {
        // 쿠키에 토큰이 있어야함
        if (cookies[ACCESS_KEY] !== undefined && cookies[REFRESH_KEY] !== undefined) {
            localStorage.setItem(ACCESS_KEY, cookies[ACCESS_KEY]);
            localStorage.setItem(REFRESH_KEY, cookies[REFRESH_KEY]);
            removeCookie(ACCESS_KEY);
            removeCookie(REFRESH_KEY);

            mutate(USER_CACHE_KEY); // 새로고침
        } else {
            console.error("access / refresh 토큰을 찾을 수 없습니다.");
        }
        navigate("/"); // 첫 페이지로
    }

    useEffect(onLoad, []);
    
    return null;
}