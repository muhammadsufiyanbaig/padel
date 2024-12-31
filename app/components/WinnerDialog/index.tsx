"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { WinnerDialogProps } from "@/app/Types";
import Image from "next/image";

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
      <DialogContent className="sm:max-w-[90%] max-w-[95vw] bg-black text-zinc-100 border-zinc-700 border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-3xl font-bold text-white flex items-center justify-center mb-4 sm:mb-6">
            <div className="flex flex-col-reverse items-center gap-3 sm:gap-5 mt-2 sm:mt-4">
              <div className="w-[80%] sm:w-[60%]">
                <Image
                  className="w-full h-auto"
                  alt="logo"
                  src="/logo.png"
                  width={1000}
                  height={200}
                  priority
                />
              </div>
              <div className="flex gap-2 items-center">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-yellow-500 animate-pulse" />
                <span className="text-lg sm:text-2xl">{popupMessage}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {winningTeamStats ? (
          <div className="mt-2 sm:mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-center">
              <StatsBox title="Set1" value={winningTeamStats.set1} />
              <StatsBox title="Set2" value={winningTeamStats.set2} />
              <StatsBox title="Set3" value={winningTeamStats.set3} />
              {winningTeamStats.set4 !== undefined && (
                <StatsBox title="Set4" value={winningTeamStats.set4} />
              )}
              {winningTeamStats.set5 !== undefined && (
                <StatsBox title="Set5" value={winningTeamStats.set5} />
              )}
              <StatsBox title="Games" value={winningTeamStats.game} />
              <StatsBox title="Score" value={winningTeamStats.score} />
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center text-base sm:text-lg font-semibold text-green-500">
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
            className="w-full mt-4 bg-blue-500 hover:bg-blue-400 text-white text-sm sm:text-base py-2 sm:py-3 rounded-lg transition-all duration-200"
          >
            Close and Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StatsBox: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
  <div className="bg-zinc-900 p-2 sm:p-4 rounded-lg">
    <h3 className="text-xs sm:text-sm font-medium text-zinc-400">{title}</h3>
    <p className="text-lg sm:text-2xl font-bold text-blue-400">{value}</p>
  </div>
);

export default WinnerDialog;

