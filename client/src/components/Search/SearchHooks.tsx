import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useSearchOption() {
    const [ searchParams, _ ] = useSearchParams();
    const page = useMemo(() => searchParams.get("page"), [searchParams]);
    const query = useMemo(() => searchParams.get("query"), [searchParams]);
    const sort = useMemo(() => searchParams.get("sort"), [searchParams]);
    
    return { page: page || "1", query: query || "", sort: sort || "0" };
}

interface SearchOptionType {
    page?: string,
    query?: string,
    sort?: string
}

export function useChangeSearchOption() {
    const [ _, setSearchParams ] = useSearchParams();
    const options = useSearchOption();
    
    return function(data: SearchOptionType) {
        const result: { [key: string]: string } = {};
        if (options.page || data.page)
            result.page = data.page || options.page;
        if (options.query || data.query)
            result.query = data.query || options.query;
        if (options.sort || data.sort)
            result.sort = data.sort || options.sort;

        setSearchParams(result);
    }
}