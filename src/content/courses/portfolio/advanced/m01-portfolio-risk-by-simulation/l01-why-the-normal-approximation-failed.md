# Where a normal curve misleads

There are two ways to read a loss probability and a low case from a portfolio's mean and spread. One fits a normal curve to them and reads the figures off the curve. The other simulates each project's success and failure and counts the outcomes. The engine does the second, and this lesson sets the two methods side by side against the exact answer.

{{panel:ec-governance-explorer}}

## The normal approximation as a method

Take the closed-form emv and stdDev the engine reports and assume the portfolio NPV is spread around them like a bell. P(loss) is then normalCDF(-emv / stdDev), and P90 is emv minus 1.2816 x stdDev.

A risked project is not a bell. It is a mixture: with chance pos it returns a success-case NPV, and otherwise it returns minus its fail cost, a single point. A sum of a few such points is lumpy, with gaps between the outcomes, and a normal curve smooths those gaps away.

## One wildcat

Take one exploration well with pos 0.3, a success-case NPV of 300 and a fail cost of 50, the same terms as the published risked case whose EMV is 55.0000. It fails with chance 0.700000, and when it fails it loses exactly 50.0000 million USD.

| case | exact P(loss) | normal approximation P(loss) | engine P(loss) | exact P90 outcome | normal P90 | engine P90 |
| --- | --- | --- | --- | --- | --- | --- |
| singleWildcat | 0.700000 | 0.365832 | 0.696100 | -50.0000 | -150.5560 | -50.0000 |
| identical2 | 0.490000 | 0.313855 | 0.487100 | -100.0000 | -180.7001 | -100.0000 |
| identical3 | 0.343000 | 0.276275 | 0.343100 | -150.0000 | -191.0335 | -150.0000 |
| identical6 | 0.117649 | 0.200464 | 0.118100 | -300.0000 | -173.5074 | -300.0000 |
| identical8 | 0.255298 | 0.166046 | 0.251400 | -50.0000 | -141.4002 | -50.0000 |

The normal curve says 0.365832 for a loss that happens 0.700000 of the time, and it puts P90 at -150.5560, a loss far larger than the 50.0000 the well can ever lose. A low case beneath the worst reachable outcome is not conservative. It is a number about a different project. The simulation, at seed 20260829 and 10000 iterations, counts 0.696100 and reads P90 -50.0000, the failure itself.

## An error that changes sign

Add identical wildcats. The normal P(loss) is too low with one, two and three wells, too high with six (0.200464 against 0.117649) and too low again with eight (0.166046 against 0.255298). P90 flips too. With one, two and three wells the normal P90 of -150.5560, -180.7001 and -191.0335 sits below the worst reachable outcomes of -50.0000, -100.0000 and -150.0000. With six it sits above the true low case of -300.0000, the outcome where every well fails.

OKONO shows the same flip on real sets. At the 300.0000 limit the normal curve gives 0.003231 against a simulated 0.007900; at 450.0000 it gives 0.142035 against 0.123600. An error that changes sign cannot be fixed with a safety margin, because nothing tells you which way to lean.

## Where the two methods agree

On the published pos1-normal cases, projects that always succeed with a normal spread, the normal curve is exact: normalPairIndependent reads 0.001571 both ways and normalThreeCorrelated 0.231959. It misleads where risking matters most, on a few projects with a real chance of failing.

## The mistake

The mistake is to read a P90 without asking whether the portfolio can produce it. Write the worst outcome by hand, every risked project failing at its fail cost, and check the low case does not fall beneath it.

## Exercise

For singleWildcat and identical6, state the exact P(loss), the normal approximation's P(loss), the exact P90 outcome and the normal P90. Say for each whether the normal P90 lies above or below the reachable low case, and explain why a sign change rules out correcting the normal curve with a fixed margin.
