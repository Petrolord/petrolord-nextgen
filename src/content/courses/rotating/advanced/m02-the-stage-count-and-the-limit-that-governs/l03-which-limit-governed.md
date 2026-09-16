# Which limit governed

Two rules each demand a stage count and the engine has to return one. It returns the count and it also returns the name of the rule that produced it, and that name is the field worth reading hardest.

{{panel:fc-compressor-explorer}}

## The sweep the studio draws

Hold the SOKU gas, rate, suction and limits and walk the discharge pressure:

| discharge psia | overall ratio | by ratio | by temperature | stages | governed by | ratio per stage | brake hp |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 300.000000 | 3.260869565 | 1 | 2 | 2 | discharge temperature | 1.805787796 | 2192.7856 |
| 450.000000 | 4.891304348 | 2 | 2 | 2 | both equally | 2.211629342 | 3030.8719 |
| 600.000000 | 6.521739130 | 2 | 2 | 2 | both equally | 2.553769592 | 3654.3900 |
| 800.000000 | 8.695652174 | 2 | 3 | 3 | discharge temperature | 2.056367445 | 4054.2990 |
| 985.000000 | 10.706521739 | 2 | 3 | 3 | discharge temperature | 2.204023061 | 4481.0626 |
| 1200.000000 | 13.043478261 | 2 | 3 | 3 | discharge temperature | 2.353953103 | 4892.4897 |
| 1500.000000 | 16.304347826 | 3 | 3 | 3 | both equally | 2.535719112 | 5365.9149 |
| 1900.000000 | 20.652173913 | 3 | 4 | 4 | discharge temperature | 2.131775386 | 5615.9251 |
| 2400.000000 | 26.086956522 | 3 | 4 | 4 | discharge temperature | 2.259986545 | 6085.1118 |

On every row of that table the returned count is the larger of the two demands, and the governed-by column names which demand it came from. Where the two are equal the engine says "both equally" rather than picking one, which is the honest answer and it happens on 3 of the 9 rows.

## Power is smooth and machines are not

Brake horsepower climbs steadily down that table. The stage count climbs in steps, and every step is a machine, a cooler and a foundation. Those are two different kinds of quantity and they cost money in two different ways.

That is why a discharge pressure chosen loosely is expensive in a way a power curve does not show. Moving from 1500.000000 psia to 1900.000000 psia adds the fourth machine, and the brake horsepower column gives no hint that a step is about to happen.

The ratio-per-stage column records the same steps from the other side. It climbs while the count holds, from 2.056367445 at 800.000000 psia to 2.204023061 at 985.000000 psia to 2.353953103 at 1200.000000 psia, and then it drops back when a machine is added, from 2.535719112 at 1500.000000 psia to 2.131775386 at 1900.000000 psia. Each stage is taking a smaller bite because there is one more of them, which is the whole point of adding it.

## Why the name matters more than the number

A count of 3 tells you what to buy. The name tells you what to argue about. If the temperature limit governed, a colder cooler or a higher stated limit is the lever, and the ratio limit is slack. If the ratio limit governed, a machine that takes more ratio in one bite is the lever, and the cooling is slack. Pulling the slack lever changes nothing and costs a revision.

"Both equally" is the row to notice, because there the count is on the edge of both rules at once and a small move in either input changes the answer.

## The mistake

The mistake is reporting a stage count with no governing rule attached, then spending the next week improving the input that was never binding. The second mistake is reading a "both equally" row as a comfortable answer. It is the least comfortable row on the table.

## Exercise

Explain how the returned stage count relates to the two demanded counts on every row of the sweep, and say what "both equally" means and how often it occurs there. Then say what lever the temperature limit points at and what lever the ratio limit points at, and why the name of the governing rule is worth more than the count alone.
