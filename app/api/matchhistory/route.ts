import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DB_URI || "");

export async function GET(req: NextRequest) {
  try {
    const result = await sql`SELECT * FROM MatchDetails`;
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching match history:", error);
    return NextResponse.json(
      { error: "Failed to fetch match history" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      team1Name,
      team1Set1,
      team1Set2,
      team1Set3,
      team1Set4,
      team1Set5,
      team1Game,
      team1Score,
      team2Name,
      team2Set1,
      team2Set2,
      team2Set3,
      team2Set4,
      team2Set5,
      team2Game,
      team2Score,
      matchTime,
      set1Time,
      set2Time,
      set3Time,
      set4Time,
      set5Time,
    } = body;
    const result = await sql`
      INSERT INTO MatchDetails (
        Team1Name, Team1Set1, Team1Set2, Team1Set3, Team1Set4, Team1Set5, Team1Game, Team1Score,
        Team2Name, Team2Set1, Team2Set2, Team2Set3, Team2Set4, Team2Set5, Team2Game, Team2Score,
        MatchTime, Set1Time, Set2Time, Set3Time, Set4Time, Set5Time
      ) VALUES (
        ${team1Name}, ${team1Set1}, ${team1Set2}, ${team1Set3}, ${team1Set4}, ${team1Set5}, ${team1Game}, ${team1Score},
        ${team2Name}, ${team2Set1}, ${team2Set2}, ${team2Set3}, ${team2Set4}, ${team2Set5}, ${team2Game}, ${team2Score},
        ${matchTime}, ${set1Time}, ${set2Time}, ${set3Time}, ${set4Time}, ${set5Time}
      );`;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error saving match history:", error);
    return NextResponse.json(
      { error: "Failed to save match history" },
      { status: 500 }
    );
  }
}
