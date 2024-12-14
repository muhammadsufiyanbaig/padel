import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WinnerDialogProps } from "@/app/Types";

const WinnerDialog: React.FC<WinnerDialogProps> = ({
  isOpen,
  onOpenChange,
  popupMessage,
  winningTeamStats,
  resetScores,
  resetTimer,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-700 border">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center mb-6">
            <Trophy className="w-8 h-8 mr-3 text-yellow-500 animate-pulse" />
            {popupMessage}
          </DialogTitle>
        </DialogHeader>
        {winningTeamStats ? (
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400">Set1</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {winningTeamStats.set1}
                </p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400">Set2</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {winningTeamStats.set2}
                </p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400">Set3</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {winningTeamStats.set3}
                </p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400">Games</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {winningTeamStats.game}
                </p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400">Score</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {winningTeamStats.score}
                </p>
              </div>
              {winningTeamStats.set4 !== undefined && (
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-zinc-400">Set4</h3>
                  <p className="text-2xl font-bold text-blue-400">
                    {winningTeamStats.set4}
                  </p>
                </div>
              )}
              {winningTeamStats.set5 !== undefined && (
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-zinc-400">Set5</h3>
                  <p className="text-2xl font-bold text-blue-400">
                    {winningTeamStats.set5}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center text-lg font-semibold text-green-500">
            It's a Draw
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={() => {
              onOpenChange(false);
              resetScores();
              resetTimer();
            }}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-400 text-white"
          >
            Close and Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerDialog;
