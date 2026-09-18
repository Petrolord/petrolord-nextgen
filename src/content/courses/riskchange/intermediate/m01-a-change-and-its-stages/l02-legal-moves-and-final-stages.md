# Legal moves and final stages

A stage list says where a change can be. The stage machine says where it can go next. The engine holds one row of legal next stages for every stage, and a move that is not in the row is refused.

## The table of legal moves

| from | legal next stages |
| --- | --- |
| "Draft" | "Screening", "Cancelled" |
| "Screening" | "Review", "Rejected", "Cancelled", "Draft" |
| "Review" | "Approval", "Rejected", "Cancelled", "Screening" |
| "Approval" | "Implementation", "Rejected", "Cancelled", "Review" |
| "Implementation" | "Closed", "Cancelled" |
| "Closed" | none |
| "Rejected" | none |
| "Cancelled" | none |

Every answer in this lesson is read off those eight rows, and every one of them was replayed through the independent Python oracle for the module, so each is two methods agreeing.

## Forward one step at a time

Each active stage moves forward one step: "Draft" to "Screening", "Screening" to "Review", "Review" to "Approval", "Approval" to "Implementation", and "Implementation" to the Closed stage. No row skips a stage. A change in "Review" cannot go straight to the Closed stage, and a change in "Draft" cannot go straight to "Approval".

The engine's own summary of the table is short: only "Approval" leads to "Implementation". There is no other door onto the facility. That is why the approval rules in module two matter so much: they decide whether the one door opens.

## Back one step, from three stages

A change can step back from "Screening", "Review" and "Approval" to the stage before. Screening can return a change to "Draft" for rework, Review can return it to "Screening", and Approval can return it to "Review". "Implementation" has no step back. Once a change is on the facility it can finish or be cancelled, and the row offers nothing else.

## Where "Rejected" and "Cancelled" can be reached

"Rejected" appears in three rows: "Screening", "Review" and "Approval". A change in "Draft" cannot move to "Rejected"; its row offers only "Screening" and "Cancelled".

"Cancelled" appears in every active row, from "Draft" through "Implementation". Withdrawing a change is always open while the work is live.

## Three stages that lead nowhere

The engine prints it plainly: 3 stages lead nowhere, "Closed", "Rejected" and "Cancelled". Their rows read none. These are the terminal stages from lesson one, and the machine gives each of them no exit.

Try to move one and the engine refuses with a sentence of its own:

- a Closed change moved anywhere: A closed change is final.
- a Rejected change moved anywhere: A rejected change is final.

{{panel:rc-change-explorer}}

## Reading a move as a question

A move is a question of two stages: where the change is and where somebody wants it to go. If the target is not in the row of the current stage, no signature, date or action can make the move legal.

## Exercise

For each of these moves, record whether the engine allows it and which row decided it: "Draft" to "Screening", "Review" to the Closed stage, "Implementation" back to "Approval", "Screening" back to "Draft", and a "Rejected" change to anything. Then name the one stage that leads into "Implementation" and the three stages that lead nowhere.
