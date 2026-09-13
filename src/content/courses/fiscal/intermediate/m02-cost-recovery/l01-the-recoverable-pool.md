# The recoverable pool

Cost recovery is three lines of arithmetic. A pool of unrecovered cost, an allowance that caps this year's draw, and a carryforward of whatever the allowance would not let out.

{{panel:ec-instrument-explorer}}

## The three lines

The recoverable pool for a year is the balance brought forward plus this year's capex plus this year's opex. The allowance is the cost recovery limit taken as a percent of revenue after royalty. Cost recovered is the smaller of the two. The pool then carries forward whatever the allowance left behind, and profit oil is revenue after royalty minus cost recovered, floored at zero.

Everything in that sequence is a single year's decision. There is no schedule, no depreciation life and no ordering rule that recovers capex before opex or the other way round. Every dollar of cost that has ever been incurred and not yet recovered sits in one undifferentiated balance.

## The pool on a real ledger

The Designer's default project charges 500.0000 million USD of capex in year 1 and 31.0027 of opex in the same year, and nothing but opex thereafter: 28.8480 in year 2, 26.9153 in year 3, 25.1816 in year 4. Run it under a 50 percent cost recovery limit, with the "Generic Royalty/Tax" instruments around it:

| year | grossRevenue | royalty | costRecovered | unrecoveredCostPool | profitOil |
| --- | --- | --- | --- | --- | --- |
| 1 | 271.9889 | 33.9986 | 118.9951 | 412.0076 | 118.9951 |
| 2 | 244.4628 | 30.5578 | 106.9525 | 333.9031 | 106.9525 |
| 3 | 219.7286 | 27.4661 | 96.1313 | 264.6871 | 96.1313 |
| 4 | 197.5024 | 24.6878 | 86.4073 | 203.4615 | 86.4073 |
| 5 | 191.1513 | 23.8939 | 83.6287 | 143.4591 | 83.6287 |

Year 1 puts 500.0000 of capex and 31.0027 of opex into the pool, releases 118.9951 as cost recovered, and closes at 412.0076. Year 2 adds only 28.8480 of opex, releases 106.9525 and closes at 333.9031. The balance falls not because the model is amortising anything but because each year's draw exceeds each year's new spend.

Notice that cost recovered and profit oil are identical in every row. That is not a coincidence and it is not an identity of cost recovery. At a limit of exactly 50 percent the allowance is half of revenue after royalty, and while the pool is deep enough to fill it the other half is what remains as profit oil.

## The mistake

Reading cost recovered as this year's spend. In year 5 the default project incurs 23.6264 of opex and no capex at all, yet it recovers 83.6287. Cost recovered is a draw on a historic balance, so the year that recovers most may be a year that spent almost nothing, and the year that spent 500.0000 recovers only 118.9951. A reader who treats the cost recovered column as a cost column will double count the whole of the year 1 capex and then wonder why the totals refuse to close.

## What it refuses

The pool earns no uplift and no interest, so a dollar carried nine years is worth the same nominal dollar when it comes out. There is no ring fence, so nothing separates one cost type from another. The pool never expires and never resets, but neither does it survive year 25: whatever is still in it when the horizon closes is simply never recovered.

## Exercise

Name the pool balance at the end of years 1 and 5 and say what entered the pool in year 2. Then say why cost recovered equals profit oil in every row of the table, and what limit would break that equality.
