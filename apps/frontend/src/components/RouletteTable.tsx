import React, { useEffect, useState } from "react";
import Chip from "./Chip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { COINS, GameState, Number, OutgoingMessages } from "@repo/common/types";
import { useSocket } from "@/hooks/use-socket";

interface BetSpot {
  number: Number;
  type: "number";
}

const RouletteTable = () => {
  const [selectedChip, setSelectedChip] = useState<COINS>(COINS.One);
  const [balance, setBalance] = useState(2500);
  const [bets, setBets] = useState<Map<Number, number>>(new Map());
  const {socket, loading} = useSocket(); 
  const [state, setState] = useState<GameState>(GameState.GameOver);

  const numbers: Number[] = Array.from({ length: 37 }, (_, i) => i);
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  const handleBet = (spot: BetSpot) => {
    if (state !== GameState.CanBet) {
      return;
    }
    if (balance < selectedChip) {
      toast.error("Insufficient balance");
      return;
    }

    setBets((prev) => {
      const newBets = new Map(prev);
      const currentBet = newBets.get(spot.number) || 0;
      newBets.set(spot.number, currentBet + selectedChip);
      return newBets;
    });

    socket.send(JSON.stringify({
      type: "bet",
      clientId: "1",
      amount: selectedChip,
      number: spot.number
    }))

    setBalance((prev) => prev - selectedChip);
    
    toast.success(`Bet placed on ${spot.number} for value ${selectedChip}`);
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return "bg-table-green text-white";
    return redNumbers.includes(num) ? "bg-number-red text-white" : "bg-number-black text-white";
  };

  useEffect(() => {
    if (!loading && socket) {
      socket.onmessage = (e) => {
        const data = e.data;
        const parsedData: OutgoingMessages = JSON.parse(data);
        if (parsedData.type === "current-state") {
          setState(parsedData.state);
        }

        if (parsedData.type === "start-game") {
          setState(GameState.CanBet)
        }
        
        if (parsedData.type === "end-game") {
          setState(GameState.GameOver)
        }

        if (parsedData.type === "stop-bets") {
          setState(GameState.CantBet)
        }

        if (parsedData.type === "won") {
          toast.success(`You won ${parsedData.wonAmount}`);
          setBalance(parsedData.balance);
          setBets(new Map())
          setState(GameState.GameOver)
        }

        if (parsedData.type === "lost") {
          toast.error(`You lost :(`);
          setBalance(parsedData.balance);
          setBets(new Map())
          setState(GameState.GameOver)
        }
        
      }
    }
  }, [socket, loading]);

  if (loading) {
    return <div className="w-screen h-screen bg-black text-white flex flex-col justify-center">   
      <div className="flex justify-center">
        Loading...
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-table-green p-8 flex flex-col items-center justify-center gap-8">
      <div className="text-white text-2xl font-semibold">Balance: ${balance}</div>
      {state === GameState.CanBet && "Bets open"}
      {state === GameState.CantBet && "Bets closed"}
      {state === GameState.GameOver && "Game about to start"}
      
      <div className="bg-table-green border-4 border-table-border rounded-lg p-8 shadow-2xl">
        {/* Numbers Grid */}
        <div className="grid grid-cols-13 gap-1">
          {numbers.map((num) => (
            <div
              key={num}
              onClick={() => handleBet({ number: num, type: "number" })}
              className={cn(
                "w-12 h-12 flex items-center justify-center cursor-pointer",
                "transition-transform hover:scale-105 font-bold text-lg",
                getNumberColor(num)
              )}
            >
              {num}
              {bets.get(num) && (
                <div className="absolute animate-chip-drop">
                  <Chip value={bets.get(num) || 0} className="w-8 h-8 text-sm" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Betting Options */}
        {/* <div className="mt-4 grid grid-cols-3 gap-2">
          <div
            onClick={() => handleBet({ number: -1, type: "section", value: "1-12" })}
            className="bg-table-green text-white p-4 text-center cursor-pointer hover:bg-opacity-80"
          >
            1-12
          </div>
          <div
            onClick={() => handleBet({ number: -1, type: "section", value: "13-24" })}
            className="bg-table-green text-white p-4 text-center cursor-pointer hover:bg-opacity-80"
          >
            13-24
          </div>
          <div
            onClick={() => handleBet({ number: -1, type: "section", value: "25-36" })}
            className="bg-table-green text-white p-4 text-center cursor-pointer hover:bg-opacity-80"
          >
            25-36
          </div>
        </div> */}
      </div>

      {/* Chips Selection */}
      <div className="flex gap-4">
        {Object.values(COINS).filter(x => !isNaN(x as number)).map((value: COINS) => (
          <Chip
            key={value}
            value={value}
            selected={selectedChip === value}
            onClick={() => setSelectedChip(value)}
          />
        ))}
      </div>
    </div>
  );
};

export default RouletteTable;