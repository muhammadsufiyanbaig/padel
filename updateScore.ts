
let team1Score = 0;
let team2Score = 0;

function updateTeam1Score(newScore: number) {
    team1Score = newScore;
    console.log(`Team 1 score updated to: ${team1Score}`);
}

function updateTeam2Score(newScore: number) {
    team2Score = newScore;
    console.log(`Team 2 score updated to: ${team2Score}`);
}

// Example usage:
updateTeam1Score(30); // Team 1 score updated to: 30
updateTeam2Score(15); // Team 2 score updated to: 15
console.log(`Team 1 score: ${team1Score}`); // Team 1 score: 30
console.log(`Team 2 score: ${team2Score}`); // Team 2 score: 15