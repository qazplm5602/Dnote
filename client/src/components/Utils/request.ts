import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken"

let refreshTakeProcess: Promise<boolean> | null = null;

export default async function  request<T>(path: string, option: AxiosRequestConfig = {}): Promise<AxiosResponse<T, any>> {
    // 아직 리프레시 토큰 가져오고 있는지 ...
    if (refreshTakeProcess !== null)
        await refreshTakeProcess; // 있으믄 대기 ㄱㄱ

    // 토큰 넣기
    const defaultHeader: AxiosRequestConfig['headers'] = {};
    const accessToken = localStorage.getItem(ACCESS_KEY);
    if (accessToken !== null) {
        defaultHeader.Authorization = `Barer ${accessToken}`;
    }
    
    const response = await axios(`/api/${path}`, {
        ...option,
        headers: Object.assign(option.headers || {}, defaultHeader)
    }).catch(v => v as AxiosError<ErrorResponse>);


    // 연결하는데 오류가 뜸
    if (response instanceof AxiosError) {
        // 리프레시 토큰
        const refreshToken = localStorage.getItem(REFRESH_KEY);

        if (response.response?.data?.code === "TOKEN3" && refreshToken !== null) { // 토큰 만료
            refreshTakeProcess = tryRequestAccessToken(refreshToken);
            await refreshTakeProcess; // 될때까지 대기...

            // 다시 불러와
            return await request(path, option);
        }

        throw response;
    }

    return response;
}

// 리프레시 토큰으로 ㄱㄱ
async function tryRequestAccessToken(token: string): Promise<boolean> {
    const result = await axios.post<string>(`/api/user/login/refresh`, token).catch(v => v as AxiosError<ErrorResponse>);
    if (result instanceof AxiosError) {
        const code = result.response?.data?.code;
        if (code !== undefined && code.startsWith("TOKEN")) { // 토큰 관련 오류만 받음
            localStorage.removeItem(REFRESH_KEY);
            return false; // 재발급 실패
        }

        throw result; // 무슨 이유인지는 모르겠지만 재발급 실패함
    }

    localStorage.setItem(ACCESS_KEY, result.data);
    return true; // 토큰 재발급 완료!!! ㅁㄴㅇㄹㄹ
}

export interface ErrorResponse {
    code: string,
    message: string
}