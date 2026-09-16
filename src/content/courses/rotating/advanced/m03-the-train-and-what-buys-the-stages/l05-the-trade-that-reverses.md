# The trade that reverses

Cooling harder between stages buys less compression work and costs more exchanger duty. That trade is real, it is easy to state, and it is only true while the stage count holds still.

{{panel:fc-compressor-explorer}}

## The table the trade is read off

| cooled to degF | stages | total cooling MMBtu per hr | total gas hp |
| --- | --- | --- | --- |
| 90.0000 | 3 | 8.9856 | 4220.8083 |
| 100.0000 | 3 | 8.7679 | 4279.3999 |
| 104.0000 | 3 | 8.6809 | 4302.7446 |
| 110.0000 | 3 | 8.5503 | 4337.6686 |
| 130.0000 | 3 | 8.1149 | 4453.3383 |
| 150.0000 | 4 | 8.6374 | 4447.6481 |
| 180.0000 | 5 | 8.6948 | 4572.5633 |

The stage count is in that table because it moves, and the trade only reads cleanly on the rows where it does not.

## Where the trade holds

Across the 5 rows that share a stage count of 3, the cooling falls and the gas power rises on every step. Over those rows the cooling goes from 8.9856 to 8.1149 MMBtu per hr and the gas power from 4220.8083 to 4453.3383 hp.

That is the familiar statement. A colder gas entering each stage is denser, the same pressure ratio costs less work on it, and the heat that was taken out to make it colder is the exchanger's problem instead of the driver's. Read as a statement about one fixed set of machines, it is exactly right.

## Where it reverses

2 rows add a stage. On the first of them the cooling goes back UP, from 8.1149 to 8.6374 MMBtu per hr, while the gas power goes DOWN, from 4453.3383 to 4447.6481 hp. Both halves of the trade moved the wrong way at once.

The extra machine is why. Adding a fourth stage changes the ratio each stage takes, so the comparison is no longer between two versions of the same train. It is between a three-stage train and a four-stage train, and those are different machines with different work and different heat. The last row, at 180.0000 degF and 5 stages, sits at 8.6948 MMBtu per hr and 4572.5633 hp.

## How to state it so it stays true

Say the count. "At a fixed stage count, cooling harder buys power and costs duty" survives the whole table. The same sentence with the count removed is contradicted by the sixth row of it.

That extra machine is also the reason multi-stage compression is worth its machinery at all. The reversal is not a curiosity in the data. It is the mechanism the whole arrangement exists to exploit, showing up where the count changes.

## The mistake

The mistake is quoting the trade without the count attached, then using it to justify a cooler approach on a duty where the approach is about to buy a machine. A reader who takes the fixed-count statement as a general law will predict the wrong sign on both quantities across exactly the move that matters most.

## Exercise

State the trade as it holds on the five rows that share a stage count of 3, giving the cooling and the gas power at both ends of that run. Then give the two figures that move the wrong way where the fourth machine appears, explain why, and write the trade as a sentence that stays true across the whole table.
