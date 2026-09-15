# Activities, and what comes first

An activity is a piece of work with a duration in days and a list of the activities that must finish before it can start. EGINA's schedule carries eight of them, and the engine can compute nothing at all until somebody has typed the second half of that sentence.

{{panel:ec-schedule-explorer}}

## The eight rows

| activity | type | duration | must finish first |
| --- | --- | --- | --- |
| Project sanction | Milestone | 0 | nothing |
| Detailed engineering | Engineering | 210 | a1 |
| Long lead procurement | Procurement | 300 | a1 |
| Hull conversion | Fabrication | 420 | a3 |
| Topsides fabrication | Fabrication | 330 | a2 |
| Subsea installation | Installation | 180 | a2 |
| Integration and commissioning | Commissioning | 150 | a4, a5 |
| First oil | Milestone | 0 | a6, a7 |

The ids run a1 for project sanction through a8 for first oil. Duration is the work in whole days. The longest single piece of work is a4 hull conversion at 420 days, and the shortest are a1 and a8 at 0.

## The dependency column is the only logic

a4 lists a3, so hull conversion cannot begin until long lead procurement has finished. a7 lists two, a4 and a5, so integration waits for the later of them. a8 lists a6 and a7. Every link is finish to start: the predecessor finishes, then the successor may begin.

Nothing else in a row constrains anything. The type column reads Fabrication or Commissioning for the reader and changes no arithmetic, and a duration of 420 does not by itself place a4 anywhere. Position comes from the links.

## Two activities with no duration

a1 and a8 are milestones: a position in the network and no work. EGINA's milestone list reads Project sanction and First oil, exactly the two rows of duration 0. A milestone still obeys the logic, so a8 waits for both a6 and a7 even though it consumes no time.

## A schedule nobody linked

One published case runs four activities with no dependencies at all between them. The engine returns a duration of 7 days, marks all four critical, and reports four separate paths, one per activity.

That is the correct answer to the network it was handed. With nothing typed, every activity starts on day 0 and the schedule is as long as its longest single activity. It looks like a healthy plan and is not one.

## The mistake

Reading the word critical as a judgement about the work. On an unlinked network it means only that nothing gave the activity anywhere to move.

Before EC6-0 the engine reached that conclusion on networks that were fully linked. On the published textbook network of six activities it marked all six critical at float 0, when the method puts the critical path at A, B, D, F and gives C and E four days of float each. A plan where every row reads critical is a plan whose dependency column should be read first.

## Exercise

Name the two EGINA activities of duration 0, and say what a8 waits for and why it still takes 0 days. Then state the duration the engine returns for the four unlinked published activities, say how many paths it reports, and explain why all four read critical.
