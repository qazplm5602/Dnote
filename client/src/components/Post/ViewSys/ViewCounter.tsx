import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { aliveType } from "../../Utils/misc";
import request from "../../Utils/request";

const VIEW_WAIT_TIME = 10;

export default function PostViewCounter() {
    const { id, user } = useParams();
    const timeHandler = useRef<NodeJS.Timeout | null>(null);
    const tokenRef = useRef<string | null>(null);

    const requestAddView = function() {
        request("post/view", { method: "POST", headers: { "Content-Type": "text/plain" }, data: tokenRef.current });
    }
    const removeViewToken = function() {
        request("post/view", { method: "DELETE", headers: { "Content-Type": "text/plain" }, data: tokenRef.current });
    }

    const genToken = async function(aliveRef: aliveType) {
        const result = await request<string>(`post/view?user=${user}&post=${id}`, { method: "PUT" });
        tokenRef.current = result.data;
        
        if (!aliveRef.alive) {
            removeViewToken();
            tokenRef.current = null;
            return;
        }

        timeHandler.current = setTimeout(() => {
            requestAddView();
            timeHandler.current = null;
            tokenRef.current = null;
        }, VIEW_WAIT_TIME * 1000);
    }

    useEffect(() => {
        if (id === undefined || user === undefined) return;
        
        const aliveRef = { alive: true };
        genToken(aliveRef);
        
        return () => {
            aliveRef.alive = false;
            if (timeHandler.current !== null) {
                clearTimeout(timeHandler.current);
                timeHandler.current = null;
            }

            if (tokenRef.current !== null) {
                removeViewToken();
                tokenRef.current = null;
            }
        };
    }, [ id, user ]);
    
    return null;
}