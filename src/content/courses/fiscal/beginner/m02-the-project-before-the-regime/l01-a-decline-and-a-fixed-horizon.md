# A decline and a fixed horizon

Production is not an input to this model. Two numbers per stream, an initial rate and an annual decline, are turned into 25 annual volumes, and the 25 is not negotiable.

{{panel:ec-regime-explorer}}

## Reading the profile back out

`generateProductionProfile` is not exported, so the volumes have to be recovered rather than read. The probe runs the project with a royalty of zero, a cost recovery limit of 100 percent, a flat 100 percent contractor split and every tax at zero, with two of the three streams zeroed and the surviving stream priced at 1.0. The `grossRevenue` the engine returns is then that stream's annual volume divided by one million.

That is worth doing once yourself, because it teaches the only reliable habit in a closed engine: if a quantity is not exported, find an input setting that makes an exported quantity equal to it.

## The first year is undeclined

The Designer's default project declares oil at 10000 bbl/d declining 10 percent a year. Year 1 is 3.650000 million bbl. The teaching field ODIDI declares oil at 8000 bbl/d declining 14 percent a year, and year 1 is 2.920000 million bbl.

| year | default project oil, million bbl | ODIDI oil, million bbl |
| --- | --- | --- |
| 1 | 3.650000 | 2.920000 |
| 2 | 3.285000 | 2.511200 |
| 3 | 2.956500 | 2.159632 |
| 25 | 0.291148 | 0.078225 |

The decline is applied after the year is booked. Year 1 is the initial rate times 365 days with no decline taken, and the first reduction appears in year 2.

## The horizon is fixed at 25

The profile never stops. Year 25 of the default project still produces 0.291148 million bbl, and year 25 of ODIDI still produces 0.078225 million bbl. `PROJECT_LIFE` is 25 rows, and the engine returns 25 rows for every regime and every project. No input shortens it and no input extends it.

Nothing tests whether the last rows are worth producing. On the default project year 25 carries opex of 11.5851 million USD against gross revenue of 24.3216 million USD, which pays. Nothing would have stopped it if it did not.

## The mistake

The careful reader applies the decline to year 1 and gets a smaller first year, because that is what a mid year convention would do. On the default project that error is the difference between 3.650000 and a lower number, and it propagates into every one of the 25 rows, into cost recovery, into the R factor and into payback.

The tell is arithmetic you can do in your head. Year 1 oil in million bbl should be the daily rate times 365 divided by one million, exactly, with no decline in it. If your year 1 does not survive that check, nothing after it will.

## What the profile refuses

It refuses a build up, a plateau, a workover, a ramp and an economic limit. It is one exponential per stream from day one, and the field lives exactly 25 years whatever the prices do.

## Exercise

Confirm year 1 of both projects from the declared daily rates. Then say which year of the ODIDI oil column first falls below one tenth of its year 1 value, and why the answer would move if the decline were applied before the year was booked instead of after.
