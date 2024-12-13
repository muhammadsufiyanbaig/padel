"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WinnerSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onWinnerSelected: (winner: string) => void;
}

const WinnerSelectionDialog: React.FC<WinnerSelectionDialogProps> = ({
  isOpen,
  onOpenChange,
  onWinnerSelected,
}) => {
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const handleWinnerSelection = () => {
    if (selectedWinner !== "Draw") {
      setShowConfetti(true); // Trigger confetti for winners
      setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
    }
    onWinnerSelected(selectedWinner);
    onOpenChange(false);
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-zinc-100 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-400 flex items-center justify-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
              Select Winner
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup
              value={selectedWinner}
              onValueChange={setSelectedWinner}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="team1" id="team1" />
                <Label htmlFor="team1">Team 1</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="team2" id="team2" />
                <Label htmlFor="team2">Team 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Draw" id="draw" />
                <Label htmlFor="draw">Draw</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              onClick={handleWinnerSelection}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white"
              disabled={!selectedWinner}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WinnerSelectionDialog;
