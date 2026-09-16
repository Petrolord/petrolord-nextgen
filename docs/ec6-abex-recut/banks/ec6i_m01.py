import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(2, "a7 integration and commissioning depends on a4 hull conversion, which finishes at 720, and on a5 topsides fabrication, which finishes at 540. What early start does the forward pass give a7?",
 "720, the latest early finish among its predecessors, so a7 runs 720 to 870.",
 ["540, the early finish of a5 topsides fabrication, because the pass takes the first predecessor listed on the row and reaches a4 later in the walk.",
  "390, the early finish of a6 subsea installation, because installation is the last work in the water before commissioning can sensibly begin.",
  "210, because a successor takes the start of the chain feeding it."],
 "300 plus 420 puts a4 at 720 and 720 plus 150 is 870, so an early start of 540 would carry the whole network 180 days early.")

q(0, "EGINA's eight durations are 0, 210, 300, 420, 330, 180, 150 and 0. Why is the network duration not their total?",
 "a2 at 210 and a3 at 300 both start on day 0 and a5 and a6 both start at 210, so parallel work is counted once, along the longest chain, which is 870 days.",
 ["The two milestones of duration 0 are dropped before the sum is taken, because a schedule totals only the rows that carry work.",
  "The total is reduced by the float the backward pass finds, 180 days on a2, 180 on a5 and 480 on a6, leaving the duration behind.",
  "The durations are calendar days while the network reports working days, so the total shrinks once the days nobody works are taken out."],
 "The critical path a1, a3, a4, a7, a8 sums 0, 300, 420, 150 and 0 to exactly the 870 days the engine returns.")

q(3, "Subsea installation a6 is 180 days of work and carries 480 days of float. Where does 480 come from?",
 "Late start 690 less early start 210.",
 ["933 less a6's early finish of 390 and its own 180 days of work, because the calendar span is the room an activity is left before the window closes.",
  "a5's 330 days of fabrication added to a7's 150 days of commissioning, which is the work subsea installation is waiting behind.",
  "a2's float of 180 days added to the 300 days of long lead procurement that subsea installation never has to wait for."],
 "Float is late start less early start on every row, so a2 reads 180 less 0 and a6 reads 690 less 210, which is 480 days.")

q(1, "a2 detailed engineering feeds a5, whose late start is 390, and a6, whose late start is 690. What late finish does the backward pass give a2?",
 "390, the earliest late start among its successors, which puts a2's own late start at 180 and its float at 180.",
 ["690, the late start of a6 subsea installation, because an activity may finish as late as the last of the activities it feeds will allow.",
  "870, the network duration, because the backward pass hands every activity the end of the project and then subtracts each duration in turn.",
  "540, a5's early finish read in place of its late start."],
 "Taking 690 would give a2 a float of 480 and let a slip in detailed engineering push topsides fabrication past its own late start of 390.")

q(0, "Detailed engineering a2 carries 180 days of float and topsides fabrication a5, which waits on it, carries 180. If a2 runs 180 days late, what is left for a5?",
 "Nothing at all: a2 lands on its late finish of 390, a5 then starts at its own late start of 390, and the same 180 days were being read from two rows.",
 ["180 days still, because total float is computed for each activity against the network duration of 870 and is not consumed by a predecessor.",
  "480 days, the largest float in the network, because a chain running late falls back on the room subsea installation carries.",
  "150 days, the duration of integration and commissioning, because that is the work standing between topsides fabrication and first oil."],
 "Total float is what an activity can absorb only if nothing ahead of it on the chain has absorbed any first, which is why 180, 180 and 480 do not add up to anything.")

q(2, "A reviewer adds EGINA's three floats, 180 days on detailed engineering, 180 on topsides fabrication and 480 on subsea installation, and reports the total as the slack in the plan. What is wrong with it?",
 "Two of those numbers are the same 180 days seen from two rows, and none of the three is time anything off its own chain can use.",
 ["The five activities on the critical path each carry a float of 0 that belongs in the same total.",
  "Float should be totalled against the calendar span of 933 days rather than against the network duration of 870, so the slack is understated.",
  "Subsea installation's 480 days is a free float and cannot be added to two total floats of 180 until it has been converted to the same measure."],
 "480 days says only that a6 may start as late as day 690 and still land on 870, and it says nothing whatever about the hull.")

q(3, "Topsides fabrication is 330 days of work and sits off the critical path, while integration and commissioning is 150 days and sits on it. What decides that?",
 "Float: a5 has 180 days of it and a7 has none.",
 ["The activity type, since a Commissioning row sits where nothing downstream can absorb a delay while a Fabrication row runs in a yard with slack around it.",
  "The number of predecessors, since a7 waits on a4 and a5 together while a5 waits on a2 alone, and work fed by two chains cannot be moved.",
  "The duration, since the critical path is assembled from the longest activities in the schedule until their durations reach the network total of 870 days."],
 "The chain through a3 and a4 reaches a7 at 720 while a5 is finished at 540, so a5 may slip 180 days and 870 does not move.")

q(1, "A published diamond network returns 10 days with A, B, C and D all critical and two paths, A to B to D and A to C to D. What does that case show?",
 "Both routes are 10 days long, so all four activities carry float 0 and a count of critical names is not a count of paths.",
 ["A tie is resolved by marking every activity critical until one route is lengthened, so the four names stand in for a path the engine could not choose between.",
  "Four critical activities means four paths, and two of them have been merged here because B and C carry the same duration in this network.",
  "The diamond holds no float anywhere, so it behaves as a single chain of four activities running 10 days from end to end."],
 "The twelve activity chain is the other extreme, 78 days with all twelve critical and one path, because a chain has no alternative route.")

q(2, "Four published activities with no dependencies between them return 7 days, four critical activities and four paths. Why does every one of them read critical?",
 "Nothing was linked, so each starts on day 0 with nowhere to move, and the schedule is only as long as its longest single activity.",
 ["The engine marks every activity critical when it cannot compute float, which is the pre-repair behaviour left in place for unlinked schedules.",
  "Each of the four is 7 days long, so the four run side by side and every one of them ends the project on the same day.",
  "A schedule with no dependencies is refused as unreadable, and the four names come back attached to the message rather than as a result."],
 "It is the correct answer to the network handed over, and 7 days across four separate paths is a dependency column nobody filled in.")

q(0, "On the published textbook network the engine once reported all six activities critical at float 0. What does the method return once it is run properly?",
 "14 days with the critical path at A, B, D and F, and four days of float on each of C and E, which is what the golden reference holds.",
 ["14 days with all six still critical, because the repair corrected the float column and left the critical flag as the engine had always computed it.",
  "The same six names at float 0, checked against a golden reference computed from the engine's own pass.",
  "A refusal, because a network putting every activity on the critical path cannot be told apart from one whose dependency column is empty."],
 "A network whose answer is known from outside the code is the only kind that can show the code is wrong, and this one puts the duration at 14 days.")

q(3, "A schedule is refused with the message: activity b depends on zz, which is not in the schedule. What does that message ask of its reader?",
 "Which activity zz was supposed to be.",
 ["Drop the dependency on zz, because an activity that is not in the schedule can constrain nothing and the network then computes cleanly.",
  "Add an activity called zz with a duration of 0, which takes its place in the logic as a milestone does and leaves every other duration untouched.",
  "Rename b, because the message names b first and a duplicate activity id is the usual cause of a dependency that cannot be resolved."],
 "Delete the link and a duration comes back happily, computed on a plan that is missing a link somebody meant to type.")

q(1, "A schedule has a waiting on c, c waiting on b and b waiting on a. Why is there no critical path at all?",
 "An early start is the latest finish among an activity's predecessors, and inside the loop no finish is ever known, so there is no ordering to run a pass over.",
 ["The forward pass returns to its own start and walks the loop twice, so the durations of a, b and c are counted twice and the duration doubles.",
  "Three activities in a cycle all finish at the same time, so all three read float 0 and the engine cannot choose which of them the path runs through.",
  "The backward pass has no last activity to take a network duration from, although the forward pass completes and reports the length of the loop."],
 "The engine names the three ids in the loop because the only useful fix is deciding which of those links was typed by mistake.")

q(0, "The engine refuses a duration typed as two weeks and accepts a duration of 0. What separates them?",
 "A zero is a number somebody typed and takes its place in the logic, as EGINA's two milestones of duration 0 do, while two weeks is a value the engine will not convert on the author's behalf.",
 ["A duration of 0 is dropped from the network before either pass runs and so can never be wrong, while a duration written in prose would have to be converted first and then placed somewhere in the logic, which is a decision the engine would be making for the author.",
  "Two weeks carries no unit the engine recognises, and a 0 is accepted only on a row typed as a Milestone, which is where the type column earns its place.",
  "The refusal list covers the dependency column alone, so a duration is checked only on a row that some other activity names."],
 "A negative duration is refused the same way, by row and by value: activity a: duration may not be negative: -4.")

q(2, "a8 first oil has a duration of 0 and depends on a6, which finishes at 390, and a7, which finishes at 870. Where does the forward pass put it?",
 "At 870, the later of the two finishes, running from that day to the same day.",
 ["At 390, because a milestone consuming no time is placed at the first finish available to it and held there while the rest of the network catches up.",
  "At 933, the calendar span of the schedule, because first oil is the last dated row and a milestone takes its position from the date column.",
  "Nowhere inside the passes, because an activity of duration 0 consumes no time and is reported beside the network rather than within it."],
 "EGINA's milestones are Project sanction and First oil, the two rows of duration 0, and a8 sits at the network duration of 870 days.")

q(1, "What makes the textbook network, the example schedule from 2026-01-01 and the dated four activity plan useful as checks on the engine?",
 "Each has a duration and a list of critical names computed independently of the engine, at 14 days, 330 days and 179 days, so a wrong answer has somewhere to show.",
 ["Each is small enough to work by hand, so a reviewer recovers the 14 days, the 330 days and the 179 days from the durations without needing a reference at all.",
  "Each was produced by the engine and then stored, so a later run disagreeing with the stored 14, 330 or 179 days shows that something in the code has changed since the case was recorded, which is what a check on an engine is for.",
  "Each carries dates as well as durations, so a calendar span and a network duration can be compared against one another inside a single case."],
 "The dated four activity plan, at 179 days on the path a, b, d, is the smallest of the three that still has an activity sitting off the path.")

emit(Q, '/root/ec-wip-fdp/banks/ec6i_m01.json')
finish()
