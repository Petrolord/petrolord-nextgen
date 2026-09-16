# Equal ratios chained

A train is the stage calculation run more than once, with the discharge of each stage becoming the suction of the next and a cooler in between. Everything a single stage taught still holds, and what is new is the bookkeeping.

{{panel:fc-compressor-explorer}}

## SOKU as three stages

Cooled back to 110.0000 degF between stages against a suction of 104.0000 degF, the SOKU duty runs like this:

| stage | suction psia | discharge psia | in degF | out degF | ratio | z average | polytropic head ft lbf per lbm | gas hp | brake hp |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 92.0000 | 202.7701 | 104.0000 | 251.2956 | 2.204023061 | 0.987885118 | 40786.5845 | 1461.7913 | 1510.1150 |
| 2 | 202.7701 | 446.9100 | 110.0000 | 258.8635 | 2.204023061 | 0.974896675 | 40678.7794 | 1457.9276 | 1506.1235 |
| 3 | 446.9100 | 985.0000 | 110.0000 | 258.8635 | 2.204023061 | 0.948163998 | 39563.3251 | 1417.9497 | 1464.8241 |

The ratio column is the same figure three times, which is the equal-ratio rule showing up as a fact about the built machine rather than as an intention.

## What is the same and what is not

The ratio is identical on every stage and the work is not. The polytropic head falls along the train, from 40786.5845 to 40678.7794 to 39563.3251 ft lbf per lbm, and the gas horsepower falls with it, from 1461.7913 to 1457.9276 to 1417.9497.

The compressibility column is why. It runs 0.987885118, then 0.974896675, then 0.948163998, falling as the pressure level rises. The same pressure ratio applied to a denser, less ideal gas is less work per pound, and the third stage is the cheapest of the three despite doing the same ratio.

Stages two and three also share their inlet at 110.0000 degF and their discharge at 258.8635 degF, because they start from the same cooled temperature and take the same ratio. Stage one is the odd one out, starting from the 104.0000 degF suction.

## The totals

Gas horsepower totals 4337.6686 and brake horsepower 4481.0626. The cooling totals 8550254.4381 Btu per hr, which is 8.5503 MMBtu per hr. The final discharge is 258.8635 degF.

The stated discharge limit on this duty is 300.0000 degF, and the hottest stage on the train is 258.8635 degF, which leaves 41.1365 degF of room. Every stage on the table carries a null warning.

## The mistake

The mistake is sizing a train from one stage multiplied by the stage count. The ratio is common, so it is tempting, and the head and the power are not common, so the answer is wrong. Chain the stages and read the totals the chain produces.

The second mistake is quoting the final discharge as the train's temperature. It is the temperature of the last stage. The hottest stage is what a limit is judged against, and on this train they happen to be equal.

## Exercise

Give the three stage ratios on the SOKU train and say why they are identical. Then explain why the head and the gas power fall along the train while the ratio does not, give the gas and brake horsepower totals and the total cooling, and say which temperature a discharge limit is judged against.
