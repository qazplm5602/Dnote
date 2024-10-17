import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default async function request<T>(path: string, option: AxiosRequestConfig = {}): Promise<AxiosResponse<T, any>> {
    // 토큰 넣기
    const defaultHeader: AxiosRequestConfig['headers'] = {};
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken !== null) {
        defaultHeader.Authorization = `Barer ${accessToken}`;
    }

    const response = await axios(`/api/${path}`, {
        ...option,
        headers: option.headers !== undefined ? Object.assign(option.headers, defaultHeader) : {}
    }).catch(e => e);

    return response;
}