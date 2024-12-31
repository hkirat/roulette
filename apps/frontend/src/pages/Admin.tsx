import { useSocket } from "@/hooks/use-socket";
import { GameState, Number, OutgoingMessages } from "@repo/common/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Admin() {
    const {socket, loading} = useSocket("123123");

    const numbers: Number[] = Array.from({ length: 37 }, (_, i) => i);
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const [state, setState] = useState<GameState>(GameState.GameOver);

    useEffect(() => {
        if (!loading && socket) {
            socket.onmessage = (e) => {
                const data = e.data;
                const parsedData: OutgoingMessages = JSON.parse(data);
                if (parsedData.type === "current-state") {
                    setState(parsedData.state);
                }
                if (parsedData.type === "won" || parsedData.type === "lost") {
                    setState(GameState.GameOver)
                }
        
                if (parsedData.type === "stop-bets") {
                    setState(GameState.CantBet)
                }
                
                if (parsedData.type === "start-game") {
                    setState(GameState.CanBet)
                }
          
            }
        }
    }, [socket, loading]);

    const getNumberColor = (num: number) => {
        if (num === 0) return "bg-table-green text-white";
        return redNumbers.includes(num) ? "bg-number-red text-white" : "bg-number-black text-white";
    };

    function handleSelect({number}) {
        socket.send(JSON.stringify({
            type: "end-game",
            output: number
        }))
    }
    
    return <div className="min-h-screen bg-table-green p-8 flex flex-col items-center    justify-center gap-8">
      {state === GameState.CanBet && "Bets open"}
      {state === GameState.CantBet && "Bets closed"}
      {state === GameState.GameOver && "Game over!"}

      <div className="bg-table-green border-4 border-table-border rounded-lg p-8 shadow-2xl">
        <div className="grid grid-cols-13 gap-1">
          {numbers.map((num) => (
            <div
              key={num}
              onClick={() => handleSelect({ number: num })}
              className={cn(
                "w-12 h-12 flex items-center justify-center cursor-pointer",
                "transition-transform hover:scale-105 font-bold text-lg",
                getNumberColor(num)
              )}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => {
        socket.send(JSON.stringify({
            type: "start-game"
        }))
      }}>Start new game {state === GameState.GameOver && "✅"}</Button>
      <Button variant="secondary" onClick={() => {
        socket.send(JSON.stringify({
            type: "stop-bets"
        }))
      }}>Stop bets {state === GameState.CanBet && "✅"}</Button>

    </div>
}