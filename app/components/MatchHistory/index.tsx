import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownToLine, Trash } from "lucide-react";
import { MatchHistoryProps } from "@/app/Types";

const MatchHistory = ({ isStatsDialogOpen, setIsStatsDialogOpen, allPreviousStats, downloadCSV, clearMatchHistory }: MatchHistoryProps) => {
  return (
    <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
      <DialogContent className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-7xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-blue-400 text-center">
            Match History
          </DialogTitle>
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={downloadCSV}>
              <ArrowDownToLine className="w-6 h-6 text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon" onClick={clearMatchHistory}>
              <Trash className="w-6 h-6 text-gray-400 hover:text-red-700" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="rounded-md w-full h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-800">
                <TableHead className="text-zinc-300 text-right">Team 1</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 1</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 2</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 3</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 4</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 5</TableHead>
                <TableHead className="text-zinc-300 text-right">Games</TableHead>
                <TableHead className="text-zinc-300 text-right">Score</TableHead>
                <TableHead className="text-zinc-300 text-right">Team 2</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 1</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 2</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 3</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 4</TableHead>
                <TableHead className="text-zinc-300 text-right">Set 5</TableHead>
                <TableHead className="text-zinc-300 text-right">Games</TableHead>
                <TableHead className="text-zinc-300 text-right">Score</TableHead>
                <TableHead className="text-zinc-300 text-right">Match Time</TableHead>
                <TableHead className="text-zinc-300 text-right">Set Times</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPreviousStats.map((stat, index) => (
                <TableRow key={index} className="border-b border-zinc-700 text-right">
                  <TableCell className="font-medium text-right text-zinc-300">{stat.team1name || 'N/A'}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team1set1 || 0}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team1set2 || 0}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team1set3 || 0}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team1set4 || '-'}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team1set5 || '-'}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team2game || 0}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team1score || '00'}</TableCell>
                  <TableCell className="font-medium text-zinc-300">{stat.team2name || 'N/A'}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team2set1 || 0}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team2set2 || 0}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team2set3 || 0}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team2set4 || '-'}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team2set5 || '-'}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team2game || 0}</TableCell>
                  <TableCell className="text-right text-zinc-300">{stat.team1score || '00'}</TableCell>
                  <TableCell className="text-zinc-300">{stat.matchtime || 'N/A'}</TableCell>
                  <TableCell className="text-zinc-300">
                    {stat.set1time || '-'}, {stat.set2time || '-'}, {stat.set3time || '-'}, {stat.set4time || '-'}, {stat.set5time || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <Button onClick={() => setIsStatsDialogOpen(false)} className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MatchHistory;
