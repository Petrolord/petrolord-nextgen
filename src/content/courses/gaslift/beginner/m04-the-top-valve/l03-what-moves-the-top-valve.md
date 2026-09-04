# What moves the top valve

Four inputs reach the first mandrel and they do not reach it equally. One of them, the input designers reach for first, does not reach it at all.

{{panel:pd-column-explorer}}

## One input at a time, everything else held

westTexasOil, with the published value in the middle of each row and everything outside that row held where the case put it.

| Input walked, low to high | Top valve, ft |
| --- | --- |
| kickoff 864.7, 1014.7, 1164.7 psia | 1749.007210707, 2119.249955500, 2497.388313360 |
| unloading wellhead 64.7, 114.7, 214.7 psia | 2236.962885353, 2119.249955500, 1883.817105956 |
| kill fluid 0.35, 0.45, 0.6 psi/ft | 2771.766518393, 2119.249955500, 1566.149985252 |
| injection gas gravity 0.55, 0.65, 0.8 | 2095.769374223, 2119.249955500, 2162.184191942 |

The kill fluid gradient and the kickoff pressure move the top valve hundreds of feet. The wellhead pressure moves it tens of feet a step, 2178.106709661 ft at 89.7 psia and 2060.392620473 ft at 139.7 psia. The gas gravity moves it tens of feet across its whole range, and it does so purely through the weight of the injection column, with nothing else in the design touched.

## The two directions

Kickoff pressure and kill fluid pull opposite ways. More kickoff pressure is more head to spend, so the valve goes deeper: 1749.007210707, 1871.569210771, 1994.978008731, 2119.249955500, 2244.400016098, 2370.441984061 and 2497.388313360 ft across the sweep. A heavier kill fluid is more head to spend it on, so the valve comes up.

Wellhead pressure behaves like kill fluid: it is a pressure the injection line must clear before it can start buying depth, so raising it from 64.7 to 214.7 psia lifts the mandrel from 2236.962885353 ft to 1883.817105956 ft.

## The input that does nothing here

The surface decrement per valve. It sets every spacing below valve 1 and never enters the top valve condition, so the first mandrel is the one depth in the string a decrement change cannot move. westTexasOil at 25.00 psi per valve and midDecrementKnifeEdge at 26.75 psi per valve both place it from kickoff, wellhead and kill fluid alone.

## The mistake

Reaching for the decrement to deepen the top valve. It reshuffles every mandrel under valve 1, it changes the valve count and it leaves valve 1 exactly where it was, which is the worst kind of adjustment: visible everywhere except where it was aimed. If the top mandrel is too shallow, the levers are the kickoff pressure, the kill fluid and the wellhead pressure, in that order.

## What the sweep refuses to say

That any of these values is achievable. The kickoff pressure is a compressor limit, the kill fluid a well condition, the wellhead pressure a flowline. The sweep says what the design would do, never what the field allows.

## Exercise

Move the kickoff pressure from 964.7 to 1064.7 psia and record the two top valve depths, then do the same for the kill fluid gradient from 0.4 to 0.5 psi/ft.

Say which pair moved further, and name the field constraint that decides which lever you could pull.
