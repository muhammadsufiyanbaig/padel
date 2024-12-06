"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Timer,
  RotateCcw,
  Plus,
  ArrowDownToLine,
  Share2,
  ShoppingCart,
  Settings,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const SCORE_SEQUENCE = ["00", "15", "30", "40", "AD"];

type ScoreState = {
  team1: { set: number; game: number; score: string };
  team2: { set: number; game: number; score: string };
};

export default function PadelScoreboard() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [scores, setScores] = useState<ScoreState>({
    team1: { set: 0, game: 0, score: "00" },
    team2: { set: 0, game: 0, score: "00" },
  });
  const [history, setHistory] = useState<ScoreState[]>([]);
  const [future, setFuture] = useState<ScoreState[]>([]);
  const [customTime, setCustomTime] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const setCustomTimer = () => {
    const [minutes, seconds] = customTime.split(":").map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      setTime(minutes * 60 + seconds);
      setCustomTime("");
    }
  };

  const updateScore = useCallback((team: "team1" | "team2") => {
    setScores((prevScores) => {
      setHistory((prev) => [...prev, prevScores]);
      setFuture([]);

      const otherTeam = team === "team1" ? "team2" : "team1";
      const currentScore = prevScores[team].score;
      const otherScore = prevScores[otherTeam].score;
      let newScore =
        SCORE_SEQUENCE[SCORE_SEQUENCE.indexOf(currentScore) + 1] || "00";
      let newGame = prevScores[team].game;
      let newSet = prevScores[team].set;

      // Scoring Logic
      if (currentScore === "40" && otherScore === "AD") {
        return {
          ...prevScores,
          [otherTeam]: { ...prevScores[otherTeam], score: "40" },
        };
      } else if (currentScore === "40" && otherScore !== "40") {
        newGame += 1;
        newScore = "00";
        if (newGame === 6) {
          newSet += 1;
          newGame = 0;
        }
      } else if (
        currentScore === "AD" ||
        (currentScore === "40" && otherScore === "40")
      ) {
        newGame += 1;
        newScore = "00";
        if (newGame === 6) {
          newSet += 1;
          newGame = 0;
        }
      }

      const updatedScores = {
        ...prevScores,
        [team]: {
          ...prevScores[team],
          score: newScore,
          game: newGame,
          set: newSet,
        },
        [otherTeam]: { ...prevScores[otherTeam], score: "00" },
      };

      // Check for match result
      if (updatedScores.team1.set === 2 || updatedScores.team2.set === 2) {
        const winner = updatedScores.team1.set === 2 ? "Team 1" : "Team 2";
        setPopupMessage(`Congratulations ${winner}, You Won!`);
        setIsPopupOpen(true);
      } else if (
        updatedScores.team1.set === 1 &&
        updatedScores.team2.set === 1
      ) {
        setPopupMessage("It's a Draw!");
        setIsPopupOpen(true);
      }

      return updatedScores;
    });
  }, []);

  const resetScores = () => {
    setScores({
      team1: { set: 0, game: 0, score: "00" },
      team2: { set: 0, game: 0, score: "00" },
    });
    setHistory([]);
    setFuture([]);
    setIsPopupOpen(false);
  };

  const undo = () => {
    if (history.length > 0) {
      const prevState = history.pop()!;
      setFuture((prev) => [scores, ...prev]);
      setScores(prevState);
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const nextState = future.shift()!;
      setHistory((prev) => [...prev, scores]);
      setScores(nextState);
    }
  };

  return (
    <div className="min-h-screen flex  items-center bg-zinc-800 p-6">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <Image 
          className="w-full" 
          alt="logo"
          src={"/logo.png"} 
          height={200} 
          width={1000} 
          />
        </div>
        {/* Timer */}
        <div className="bg-zinc-900/50 rounded-lg p-4 text-4xl font-mono text-white text-center">
          {formatTime(time)}
        </div>

        {/* Headers */}
        <div className="grid grid-cols-4 gap-4 text-2xl text-gray-300 text-center">
          <div></div>
          <div>SET</div>
          <div>GAME</div>
          <div>SCORE</div>
        </div>

        {/* Team 1 */}
        <div className="grid grid-cols-4 gap-4 items-center">
          <div className="text-[#3498db] text-5xl font-extrabold">Team 1</div>
          <div className="text-center  text-white  text-2xl">
            {scores.team1.set}
          </div>
          <div className="text-center  text-white text-2xl">
            {scores.team1.game}
          </div>
          <Button
            className="bg-[#3498db] text-white text-5xl font-bold  w-full h-full rounded-lg p-4"
            onClick={() => updateScore("team1")}
          >
            {scores.team1.score}
          </Button>
        </div>

        {/* Team 2 */}
        <div className="grid grid-cols-4 gap-4 items-center">
          <div className="text-[#e74c3c] text-5xl font-extrabold">Team 2</div>
          <div className="text-center text-white text-2xl">
            {scores.team2.set}
          </div>
          <div className="text-center text-white text-2xl">
            {scores.team2.game}
          </div>
          <Button
            className="bg-[#e74c3c] text-white text-5xl font-bold  w-full h-full rounded-lg p-4"
            onClick={() => updateScore("team2")}
          >
            {scores.team2.score}
          </Button>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 pt-4 flex-wrap">
          <Button variant="ghost" size="icon" onClick={toggleTimer}>
            {isRunning ? (
              <RotateCcw className="w-6 h-6 text-gray-400" />
            ) : (
              <Plus className="w-6 h-6 text-gray-400" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={resetTimer}>
            <RotateCcw className="w-6 h-6 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={resetScores}>
            <ArrowDownToLine className="w-6 h-6 text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={history.length === 0}
          >
            <Undo className="w-6 h-6 text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={future.length === 0}
          >
            <Redo className="w-6 h-6 text-gray-400" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex items-center justify-center w-10 h-10 rounded-full  hover:bg-gray-200"
              >
                <Timer className="w-6 h-6 text-gray-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 rounded-lg shadow-lg p-6 max-w-md mx-auto">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg font-semibold text-gray-100">
                  Set Custom Timer
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <Input
                  id="custom-time"
                  placeholder="MM:SS"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full px-4 py-2  rounded-md focus:ring text-gray-100"
                />
                <Button
                  onClick={setCustomTimer}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 focus:ring focus:ring-blue-300"
                >
                  Set
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* Popup */}
        <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{popupMessage}</DialogTitle>
            </DialogHeader>
            <Button onClick={() => setIsPopupOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
