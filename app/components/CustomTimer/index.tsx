import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomTimerProps } from "@/app/Types";


const CustomTimer: React.FC<CustomTimerProps> = ({
  customMinutes,
  setCustomMinutes,
  customSeconds,
  setCustomSeconds,
  setCustomTimerAndStart,
}) => {

  return (
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
    <DialogContent className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-6 max-w-md mx-auto sm:max-w-xs">
      <DialogHeader className="mb-4 text-white">
        <DialogTitle className="text-lg font-semibold text-gray-100">
          Set Custom Timer
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="flex space-x-4 justify-center items-center">
          <Input
            id="custom-minutes"
            placeholder="MM"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="p-2 rounded-md w-16 h-16 focus:ring text-gray-100 bg-zinc-800  border-zinc-700"
          />
          <p className="text-gray-100 text-2xl">:</p>
          <Input
            id="custom-seconds"
            placeholder="SS"
            value={customSeconds}
            onChange={(e) => setCustomSeconds(e.target.value)}
            className="px-2 rounded-md w-16 h-16 focus:ring text-gray-100 bg-zinc-800 border border-zinc-700"
          />
        </div>
        <Button
          onClick={setCustomTimerAndStart}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400 focus:ring focus:ring-blue-300"
        >
          Set & Start
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  );
};

export default CustomTimer;
