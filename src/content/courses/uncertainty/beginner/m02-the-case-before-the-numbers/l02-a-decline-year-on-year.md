# A decline year on year

The quick form turns an initial rate and a decline percentage into twenty annual volumes. Each year is the one before it times the same ratio, so the profile shrinks by a constant fraction and never reaches zero.

{{panel:ec-screening-explorer}}

## The first year is undeclined

ISIALA is entered at 4400 bopd declining 12 percent a year. The first year, 2027, is 1606000.0000 bbl, the daily rate over a full year with no decline taken. The first reduction appears in 2028.

| year | oil bbl |
| --- | --- |
| 2027 | 1606000.0000 |
| 2028 | 1413280.0000 |
| 2029 | 1243686.4000 |
| 2030 | 1094444.0320 |
| 2036 | 508264.2812 |
| 2046 | 141552.0984 |

Year 2 over year 1 is 0.880000, which is one minus 12 percent. Every later pair of years has the same ratio. Year 20 over year 1 is 0.088140, so the last year of the life produces a little under a tenth of the first.

## Everything that follows the volume

Two ledger lines are built directly on the volume, and both shrink by the same ratio. Gross revenue is volume times 70 USD per bbl divided by 1e6, 112.4200 million USD in 2027 and 9.9086 in 2046. Variable opex is volume times 13 USD per bbl divided by 1e6, 20.8780 in 2027 and 1.8402 in 2046. Fixed opex does not follow, and stays at 2.5000 in every year.

That is why late years get thin. By 2046 ISIALA's ledger opex of 4.3402 is almost half its gross revenue, and net cash flow is 2.6534.

## The mistake

The careful mistake is to decline the first year. A reader who applies 12 percent before booking 2027 writes 1413280.0000 bbl in 2027, which is the engine's 2028. Every row after that slides one year early, gross revenue falls in every column, and the NPV is lower for a reason that has nothing to do with the field.

The second mistake is to read 12 percent a year as a fixed number of barrels lost each year. Taking 12 percent of the 2027 volume away every year would run ISIALA dry well inside twenty years. The engine takes 12 percent of the year before instead, so the barrels lost each year shrink along with the field.

## What the decline refuses

It refuses a build up, a plateau, a hyperbolic tail, a workover and an economic limit. The profile is one exponential from the first day to the last row, and it declines at the same rate whatever the price, the costs or the cash flow are doing. Other fields in this course differ only in their numbers: OKPOMA declines 18 percent a year from 6800 bopd, and NTEJE declines 20 percent a year from 3000 bopd.

A decline also carries no uncertainty of its own. The Scenario Builder's Monte Carlo has a reserves range, which draws each year's volume around its base value, and no range for the decline itself, so a steeper decline from the same first year is a case it never samples.

## Exercise

Confirm ISIALA's 2027 volume from 4400 bopd, then write 2028 and 2029 from it using the ratio 0.880000. Say which year a reader who declined the first year would show as 2027, and why ISIALA's 2046 volume is 0.088140 of its 2027 volume and not zero.
