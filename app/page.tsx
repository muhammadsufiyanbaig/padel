"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Timer,
  ArrowDownToLine,
  Undo,
  Redo,
  RefreshCcw,
  ChartAreaIcon,
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
  const [team1, setTeam1] = useState({ set: 0, game: 0, score: "00" });
  const [team2, setTeam2] = useState({ set: 0, game: 0, score: "00" });
  const [history, setHistory] = useState<
    { team1: ScoreState["team1"]; team2: ScoreState["team2"] }[]
  >([]);
  const [future, setFuture] = useState<
    { team1: ScoreState["team1"]; team2: ScoreState["team2"] }[]
  >([]);
  const [customTime, setCustomTime] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMatchWon, setIsMatchWon] = useState(false);
  const [winningTeamStats, setWinningTeamStats] = useState<
    ScoreState["team1"] | null
  >(null);
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
      // Start a new interval if the timer is running
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTime((prevTime) => prevTime + 1); // Update time every second
        }, 1000);
      }
    } else {
      // Clear the interval when the timer is paused
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Cleanup when component unmounts or timer state changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]); // Depend on isRunning to start/stop the timer

  const setCustomTimer = () => {
    const [minutes, seconds] = customTime.split(":").map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      setTime(minutes * 60 + seconds); // Set the custom time
      setCustomTime("");
    }
  };

  const updateScore = useCallback(
    (team: "team1" | "team2") => {
      setHistory((prev) => [...prev, { team1, team2 }]);
      setFuture([]);

      const currentTeam = team === "team1" ? team1 : team2;
      const otherTeam = team === "team1" ? team2 : team1;
      const setCurrentTeam = team === "team1" ? setTeam1 : setTeam2;
      const setOtherTeam = team === "team1" ? setTeam2 : setTeam1;

      const currentScore = currentTeam.score;
      const otherScore = otherTeam.score;
      let newScore =
        SCORE_SEQUENCE[SCORE_SEQUENCE.indexOf(currentScore) + 1] || "00";
      let newGame = currentTeam.game;
      let newSet = currentTeam.set;

      // Scoring Logic
      if (currentScore === "40" && otherScore === "AD") {
        setOtherTeam({ ...otherTeam, score: "40" });
      } else if (currentScore === "40" && otherScore !== "40") {
        newGame += 1;
        newScore = "00";
        if (newGame === 6) {
          newSet += 1;
          newGame = 0;
        }
        setOtherTeam({ ...otherTeam, score: "00" });
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
        setOtherTeam({ ...otherTeam, score: "00" });
      }

      if (newSet === 2) {
        // Assuming 2 sets to win
        setPopupMessage(`${team === "team1" ? "Team 1" : "Team 2"} wins!`);
        setWinningTeamStats(currentTeam);
        setIsPopupOpen(true);
        setIsMatchWon(true);
      }

      setCurrentTeam({
        ...currentTeam,
        score: newScore,
        game: newGame,
        set: newSet,
      });
    },
    [team1, team2]
  );

  const resetScores = () => {
    setTeam1({ set: 0, game: 0, score: "00" });
    setTeam2({ set: 0, game: 0, score: "00" });
    setHistory([]);
    setFuture([]);
    setIsPopupOpen(false);
    setIsMatchWon(false);
  };

  const undo = () => {
    if (history.length > 0) {
      const prevState = history.pop()!;
      setFuture((prev) => [{ team1, team2 }, ...prev]);
      setTeam1(prevState.team1);
      setTeam2(prevState.team2);
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const nextState = future.shift()!;
      setHistory((prev) => [...prev, { team1, team2 }]);
      setTeam1(nextState.team1);
      setTeam2(nextState.team2);
    }
  };

  // Download as CSV functionality
  const downloadCSV = () => {
    const rows = [
      ["Team", "Sets", "Games", "Score"],
      ["Team 1", team1.set, team1.game, team1.score],
      ["Team 2", team2.set, team2.game, team2.score],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "match_scores.csv");
    document.body.appendChild(link);
    link.click();
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
          <div className="text-center  text-white  text-2xl">{team1.set}</div>
          <div className="text-center  text-white text-2xl">{team1.game}</div>
          <Button
            className={`bg-[#3498db] text-white text-5xl font-bold  w-full h-full rounded-lg p-4`}
            onClick={() => updateScore("team1")}
            disabled={isMatchWon}
          >
            {team1.score}
          </Button>
        </div>

        {/* Team 2 */}
        <div className="grid grid-cols-4 gap-4 items-center">
          <div className="text-[#e74c3c] text-5xl font-extrabold">Team 2</div>
          <div className="text-center text-white text-2xl">{team2.set}</div>
          <div className="text-center text-white text-2xl">{team2.game}</div>
          <Button
            className={`bg-[#e74c3c] text-white text-5xl font-bold  w-full h-full rounded-lg p-4`}
            onClick={() => updateScore("team2")}
            disabled={isMatchWon}
          >
            {team2.score}
          </Button>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 pt-4 flex-wrap">
          {isMatchWon ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPopupOpen(true)}
            >
              <ChartAreaIcon className="w-6 h-6 text-gray-400" />
            </Button>
          ) : (
            ""
          )}
          <Button variant="ghost" size="icon" onClick={()=>{ resetScores();}}>
            <RefreshCcw className="w-6 h-6 text-gray-400" />
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
          <Button variant="ghost" size="icon" onClick={downloadCSV}>
            <ArrowDownToLine className="w-6 h-6 text-gray-400" />
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
            {winningTeamStats && (
              <div className="text-center text-gray-100">
                <table className="min-w-full bg-zinc-900">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Sets</th>
                      <th className="px-4 py-2">Games</th>
                      <th className="px-4 py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">
                        {winningTeamStats.set}
                      </td>
                      <td className="border px-4 py-2">
                        {winningTeamStats.game}
                      </td>
                      <td className="border px-4 py-2">
                        {winningTeamStats.score}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <Button
              onClick={() => {
                setIsPopupOpen(false);
                resetScores();
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
