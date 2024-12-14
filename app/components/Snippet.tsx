import { Dispatch, SetStateAction } from "react";
import { ScoreState } from "../Types";

export const useScoreHistory = (
  team1: ScoreState["team1"],
  team2: ScoreState["team2"],
  setTeam1: Dispatch<SetStateAction<ScoreState["team1"]>>,
  setTeam2: Dispatch<SetStateAction<ScoreState["team2"]>>,
  setHistory: Dispatch<SetStateAction<{ team1: ScoreState["team1"]; team2: ScoreState["team2"] }[]>>,
  setFuture: Dispatch<SetStateAction<{ team1: ScoreState["team1"]; team2: ScoreState["team2"] }[]>>,
  setSetTimeDurations: Dispatch<SetStateAction<number[]>>
) => {
  const undo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const prevState = prevHistory.pop()!;
        setFuture((prev) => [{ team1, team2 }, ...prev]);
        setTeam1(prevState.team1);
        setTeam2(prevState.team2);
      }
      return prevHistory;
    });
  };

  const redo = () => {
    setFuture((prevFuture) => {
      if (prevFuture.length > 0) {
        const nextState = prevFuture.shift()!;
        setHistory((prev) => [...prev, { team1, team2 }]);
        setTeam1(nextState.team1);
        setTeam2(nextState.team2);
      }
      return prevFuture;
    });
  };

  const resetScores = () => {
    setTeam1({ set1: 0, set2: 0, set3: 0, game: 0, score: "00" });
    setTeam2({ set1: 0, set2: 0, set3: 0, game: 0, score: "00" });
    setHistory([]);
    setFuture([]);
    setSetTimeDurations([0, 0, 0, 0, 0]); // Reset set durations
  };

  return { undo, redo, resetScores };
};
