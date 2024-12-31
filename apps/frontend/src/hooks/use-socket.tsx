import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";
 
export function useSocket(name?: string) {
    const [socket, setSocket] = useState<WebSocket>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?name=${name}`)

        ws.onopen = () => {
            setLoading(false)
        }

        setSocket(ws);
    }, []);

    return {socket, loading};
}