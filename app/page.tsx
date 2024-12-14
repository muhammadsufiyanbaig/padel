"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Undo, Redo, RefreshCcw, Play, Pause, TimerReset, UserPen, Trophy, ChartBarBig, Plus, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DialogComponent from "./components/Dialog";
import WinnerDialog from "./components/WinnerDialog";
import MatchHistory from "./components/MatchHistory";
import TeamsNameDialog from "./components/TeamsName";
import CustomTimer from "./components/CustomTimer";
import { ScoreState, TeamScore } from "./Types";
import { useScoreHistory } from "./components/Snippet";

const SCORE_SEQUENCE = ["00", "15", "30", "40", "AD"];

export default function PadelScoreboard() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [team1, setTeam1] = useState<TeamScore>({
    set1: 0,
    set2: 0,
    set3: 0,
    game: 0,
    score: "00",
  });
  const [team2, setTeam2] = useState<TeamScore>({
    set1: 0,
    set2: 0,
    set3: 0,
    game: 0,
    score: "00",
  });
  const [history, setHistory] = useState<
    { team1: ScoreState["team1"]; team2: ScoreState["team2"] }[]
  >([]);
  const [future, setFuture] = useState<
    { team1: ScoreState["team1"]; team2: ScoreState["team2"] }[]
  >([]);
  const [customMinutes, setCustomMinutes] = useState("");
  const [customSeconds, setCustomSeconds] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMatchWon, setIsMatchWon] = useState(false);
  const [winningTeamStats, setWinningTeamStats] = useState<
    ScoreState["team1"] | null
  >(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [allPreviousStats, setAllPreviousStats] = useState<any[]>([]);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [setTimeDurations, setSetTimeDurations] = useState([0, 0, 0]);
  const [currentSet, setCurrentSet] = useState(1);
  const [fullMatchTime, setFullMatchTime] = useState(0);
  const [isSetWon, setIsSetWon] = useState(false);
  const [setWonTeam, setSetWonTeam] = useState<"team1" | "team2" | null>(null);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const [winner, setWinner] = useState("");
  const [gridCol, setGridCol] = useState(7);

  const [sets, setSets] = useState([
    { team1: 0, team2: 0 },
    { team1: 0, team2: 0 },
    { team1: 0, team2: 0 },
  ]);

  const { undo, redo, resetScores } = useScoreHistory(
    team1,
    team2,
    setTeam1,
    setTeam2,
    setHistory,
    setFuture,
    setSetTimeDurations
  );

  const addSet = () => {
    if (sets.length < 5) {
      setSets((prevSets) => [...prevSets, { team1: 0, team2: 0 }]);
      setGridCol((prev) => prev + 1);
      setSetTimeDurations((prev) => [...prev, 0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // ...existing code...
  useEffect(() => {
    if (isRunning && !isMatchWon) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
          setFullMatchTime((prevTime) => prevTime + 1);
          setSetTimeDurations((prev) => {
            const newDurations = [...prev];
            newDurations[currentSet - 1] += 1; // Increment the duration of the current set
            return newDurations;
          });
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, isMatchWon, currentSet]);
  // ...existing code...

  useEffect(() => {
    console.log(`Timer: ${formatTime(fullMatchTime)}`);
  }, [fullMatchTime]);

  const setCustomTimer = () => {
    const minutes = parseInt(customMinutes, 10);
    const seconds = parseInt(customSeconds, 10);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      setTime(minutes * 60 + seconds);
      setCustomMinutes("");
      setCustomSeconds("");
    }
  };

  const setCustomTimerAndStart = () => {
    const minutes = parseInt(customMinutes, 10);
    const seconds = parseInt(customSeconds, 10);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      const totalSeconds = minutes * 60 + seconds;
      setTime(totalSeconds);
      setFullMatchTime(totalSeconds); // Set full match time as well
      setCustomMinutes("");
      setCustomSeconds("");
      setIsRunning(true); // Start the timer
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetFullMatchTimer = () => {
    setIsRunning(false);
    setTime(0);
    setFullMatchTime(0); // Reset full match time as well
  };

  const saveMatchStats = (
    team1Stats: ScoreState["team1"],
    team2Stats: ScoreState["team2"]
  ) => {
    const matchStats = {
      team1: { ...team1Stats, name: team1Name },
      team2: { ...team2Stats, name: team2Name },
      matchTime: formatTime(fullMatchTime),
      setTimes: setTimeDurations.map(formatTime),
    };
    const existingStats = JSON.parse(
      localStorage.getItem("allPreviousStats") || "[]"
    );
    existingStats.push(matchStats);
    localStorage.setItem("allPreviousStats", JSON.stringify(existingStats));
    setAllPreviousStats((prevStats) => [...prevStats, matchStats]);
  };

  // const logMatchStats = (
  //   team1Stats: ScoreState["team1"],
  //   team2Stats: ScoreState["team2"]
  // ) => {
  //   console.log("Match Stats:");
  //   console.log("Team 1:", team1Stats);
  //   console.log("Team 2:", team2Stats);
  // };

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
      let newSet1 = currentTeam.set1;
      let newSet2 = currentTeam.set2;
      let newSet3 = currentTeam.set3;
      let newSet4 = currentTeam.set4;
      let newSet5 = currentTeam.set5;

      // Scoring Logic
      if (currentScore === "AD" && otherScore === "40") {
        newGame += 1;
        newScore = "00";
        setOtherTeam({ ...otherTeam, score: "00" });
      } else if (currentScore === "40" && otherScore === "AD") {
        newScore = "40";
        setOtherTeam({ ...otherTeam, score: "40" });
      } else if (currentScore === "40" && otherScore === "40") {
        newScore = "AD";
      } else if (currentScore === "AD") {
        newGame += 1;
        newScore = "00";
        setOtherTeam({ ...otherTeam, score: "00" });
      } else if (currentScore === "40" && otherScore !== "40") {
        newGame += 1;
        newScore = "00";
        setOtherTeam({ ...otherTeam, score: "00" });
      }

      setCurrentTeam({
        ...currentTeam,
        score: newScore,
        game: newGame,
        set1: newSet1,
        set2: newSet2,
        set3: newSet3,
        set4: newSet4,
        set5: newSet5,
      });
    },
    [team1, team2, currentSet, fullMatchTime, isMatchWon]
  );

  const downloadCSV = () => {
    const rows = [
      [
        "Team 1",
        "Set 1",
        "Set 2",
        "Set 3",
        "Games",
        "Score",
        "Team 2",
        "Set 1",
        "Set 2",
        "Set 3",
        "Games",
        "Score",
        "Match Time",
      ],
      ...allPreviousStats.map((stat) => [
        stat.team1.name,
        stat.team1.set1,
        stat.team1.set2,
        stat.team1.set3,
        stat.team1.game,
        stat.team1.score,
        stat.team2.name,
        stat.team2.set1,
        stat.team2.set2,
        stat.team2.set3,
        stat.team2.game,
        stat.team2.score,
        stat.matchTime,
      ]),
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link1 = document.createElement("a");
    link1.setAttribute("href", encodedUri);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "match_history.csv");
    document.body.appendChild(link);
    link.click();
  };

  const clearMatchHistory = () => {
    localStorage.removeItem("allPreviousStats");
    setAllPreviousStats([]);
  };

  useEffect(() => {
    const storedStats = JSON.parse(
      localStorage.getItem("allPreviousStats") || "[]"
    );
    setAllPreviousStats(storedStats);
  }, []);

  useEffect(() => {
    localStorage.setItem("allPreviousStats", JSON.stringify(allPreviousStats));
  }, [allPreviousStats]);

  const closeSet = () => {
    setIsSetWon(false);
    setSetWonTeam(null);
    setCurrentSet((prevSet) => prevSet + 1);
    setTeam1((prev) => ({ ...prev, game: 0, score: "00" }));
    setTeam2((prev) => ({ ...prev, game: 0, score: "00" }));
    setTime(0);
  };

  const continueSet = () => {
    setIsSetWon(false);
    setSetWonTeam(null);
  };

  const handleAssignWinner = () => {
    setIsWinnerDialogOpen(true);
  };

  useEffect(() => {
    if (winner) {
      if (winner === "team1") {
        setPopupMessage(`${team1Name} wins!`);
        setWinningTeamStats(team1);
      } else if (winner === "team2") {
        setPopupMessage(`${team2Name} wins!`);
        setWinningTeamStats(team2);
      } else {
        setPopupMessage("It's a draw!");
        setWinningTeamStats(null);
      }
      setIsPopupOpen(true);
    }
  }, [winner]);

  const handleWinnerSelected = (selectedWinner: string) => {
    setWinner(selectedWinner);
    setIsWinnerDialogOpen(false);
    setIsPopupOpen(true);
    setIsMatchWon(true);
    saveMatchStats(team1, team2); // Save match stats when the winner is selected
  };

  const completeSet = () => {
    if (currentSet <= sets.length) {
      setTeam1((prev) => ({
        ...prev,
        [`set${currentSet}`]: prev.game,
        game: 0,
        score: "00", // Reset score to 0
      }));
      setTeam2((prev) => ({
        ...prev,
        [`set${currentSet}`]: prev.game,
        game: 0,
        score: "00", // Reset score to 0
      }));
      setCurrentSet((prev) => prev + 1);
      setTime(0);

      if (currentSet === 5) {
        setIsRunning(false); // Stop the full match timer
      }
    }
  };

  return (
    <div className="min-h-screen flex  items-center bg-zinc-800 p-6">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="space-y-4">
          <Image
            className="w-full"
            alt="logo"
            src={"/logo.png"}
            height={200}
            width={1000}
          />
        </div>
        {/* Full Match Timer */}
        <div className="bg-zinc-900/50 rounded-lg p-4 text-4xl font-mono text-white text-center sm:text-2xl">
          {formatTime(fullMatchTime)}
        </div>
        <div className="flex justify-center gap-x-4 pb-4">
          <Button variant="ghost" size="icon" onClick={startTimer}>
            <Play className="w-6 h-6 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={stopTimer}>
            <Pause className="w-6 h-6 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={resetFullMatchTimer}>
            <TimerReset className="w-6 h-6 text-gray-400" />
          </Button>
          <CustomTimer
            customMinutes={customMinutes}
            setCustomMinutes={setCustomMinutes}
            customSeconds={customSeconds}
            setCustomSeconds={setCustomSeconds}
            setCustomTimerAndStart={setCustomTimerAndStart}
          />
        </div>
        {/* Headers */}
        <div
          className={`grid gap-4 text-sm text-gray-300 text-center sm:text-xl`}
          style={{
            gridTemplateColumns: `repeat(${gridCol}, 1fr)`,
          }}
        >
          <div></div>
          {sets.map((_, index) => (
            <div key={index}>SET {index + 1}</div>
          ))}
          <div>GAME</div>
          <div>SCORE</div>
          <div></div>
        </div>

        {/* Team 1 */}
        <div
          className={`grid gap-4 items-center`}
          style={{
            gridTemplateColumns: `repeat(${gridCol}, 1fr)`,
          }}
        >
          <div className="text-[#3498db] text-lg font-extrabold sm:text-3xl ">
            {team1Name}
          </div>
          {sets.map((set, index) => (
            <div
              key={index}
              className="text-center text-white text-xl sm:text-3xl"
            >
              {team1[`set${index + 1}`] ? team1[`set${index + 1}`] : "00"}
            </div>
          ))}
          <div className="text-center text-white text-xl sm:text-3xl">
            {team1.game}
          </div>
          <Button
            className={`bg-[#3498db] text-white text-2xl font-bold w-full h-full rounded-lg p-4 sm:text-3xl`}
            onClick={() => updateScore("team1")}
          >
            {team1.score}
          </Button>
          <Button
            className={`!bg-[#ffffff] !text-blue-500 text-lg font-bold w-full rounded-lg px-3 py-6  hover:scale-105`}
            onClick={addSet}
            disabled={sets.length >= 5}
          >
            <PlusIcon className="w-16 h-16 font-black mr-1 text-blue-500"/>
            Set
          </Button>
        </div>

        {/* Team 2 */}
        <div
          className={`grid gap-4 items-center`}
          style={{
            gridTemplateColumns: `repeat(${gridCol}, 1fr)`,
          }}
        >
          <div className="text-[#9a9e95] text-lg font-extrabold sm:text-3xl  ">
            {team2Name}
          </div>
          {sets.map((set, index) => (
            <div
              key={index}
              className="text-center text-white text-xl sm:text-3xl"
            >
              {team2[`set${index + 1}`] ? team2[`set${index + 1}`] : "00"} 
            </div>
          ))}
          <div className="text-center text-white text-xl sm:text-3xl">
            {team2.game}
          </div>
          <Button
            className={`bg-[#454942] text-white text-2xl font-bold w-full h-full rounded-lg p-4 sm:text-3xl`}
            onClick={() => updateScore("team2")}
          >
            {team2.score}
          </Button>
          <Button
            className={`!bg-zinc-900 !text-white text-sm font-bold w-full rounded-lg px-4 py-6 sm:text-base hover:scale-105`}
            onClick={handleAssignWinner}
          >
             <Trophy className="w-8 h-8 mr-1 text-yellow-500 animate-pulse" />
            Winner
          </Button>
        </div>
        {/* Duration */}
        <div
          className={`grid gap-4 items-center`}
          style={{
            gridTemplateColumns: `repeat(${gridCol}, 1fr)`,
          }}
        >
          <div className="text-[#91989c] text-sm font-extrabold sm:text-3xl  ">
            Duration
          </div>
          {setTimeDurations.map((duration, index) => (
            <div
              key={index}
              className="text-center text-white text-lg sm:text-3xl"
            >
              {formatTime(duration)}
            </div>
          ))}
          <div></div>
          <Button
            className={`!bg-[#ffffff] !text-blue-500 text-sm font-bold  w-full rounded-lg px-4 py-6 sm:text-base hover:scale-105`}
            onClick={completeSet}
            disabled={isMatchWon || isSetWon || currentSet > 5 || (team1.game === 0 && team2.game === 0)}
          >
            Complete Set
          </Button>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 flex-wrap">
          {isMatchWon ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPopupOpen(true)}
            >
              <Trophy className="w-6 h-6 text-gray-400" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                resetScores();
                resetFullMatchTimer();
              }}
            >
              <RefreshCcw className="w-6 h-6 text-gray-400" />
            </Button>
          )}

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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNameDialogOpen(true)}
          >
            <UserPen className="w-6 h-6 text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsStatsDialogOpen(true)}
          >
            <ChartBarBig className="w-6 h-6 text-gray-400" />
          </Button>

          <MatchHistory
            isStatsDialogOpen={isStatsDialogOpen}
            setIsStatsDialogOpen={setIsStatsDialogOpen}
            allPreviousStats={allPreviousStats}
            downloadCSV={downloadCSV}
            clearMatchHistory={clearMatchHistory}
          />
        </div>

        {/* Popup */}
        <WinnerDialog
          isOpen={isPopupOpen}
          onOpenChange={setIsPopupOpen}
          popupMessage={popupMessage}
          winningTeamStats={winningTeamStats}
          resetScores={resetScores}
          resetTimer={resetFullMatchTimer}
        />
        <DialogComponent
          isOpen={isWinnerDialogOpen}
          onOpenChange={setIsWinnerDialogOpen}
          onWinnerSelected={handleWinnerSelected}
        />
        <TeamsNameDialog
          isOpen={isNameDialogOpen}
          onOpenChange={setIsNameDialogOpen}
          team1Name={team1Name}
          setTeam1Name={setTeam1Name}
          team2Name={team2Name}
          setTeam2Name={setTeam2Name}
        />
      </div>
    </div>
  );
}
