import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamsNameDialogProps } from "@/app/Types";


const TeamsNameDialog: React.FC<TeamsNameDialogProps> = ({
  isOpen,
  onOpenChange,
  team1Name,
  setTeam1Name,
  team2Name,
  setTeam2Name,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border border-zinc-700 rounded-lg shadow-lg p-6 max-w-md mx-auto sm:max-w-xs">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-100">
            Set Team Names
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Input
            id="team1-name"
            placeholder="Team 1 Name"
            value={team1Name}
            onChange={(e) => setTeam1Name(e.target.value)}
            className="w-full px-4 py-2  rounded-md focus:ring border border-zinc-700  text-gray-100"
          />
          <Input
            id="team2-name"
            placeholder="Team 2 Name"
            value={team2Name}
            onChange={(e) => setTeam2Name(e.target.value)}
            className="w-full px-4 py-2  rounded-md focus:ring border border-zinc-700  text-gray-100"
          />
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400 focus:ring"
          >
            Set
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamsNameDialog;
