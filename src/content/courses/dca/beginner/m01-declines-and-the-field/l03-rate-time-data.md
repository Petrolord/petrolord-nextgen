# Rate-time data

Decline curve analysis needs exactly one input: a table of dates and rates. This lesson fixes what that table means in this course, down to the units, because unit slips are where decline work quietly goes wrong.

## The monthly rate table

Each Ekene producer carries one row per calendar month, dated the first of the month, from its own start date through 2025-12-01. Ekene-1's table begins:

| Date | Oil rate (stb/d) |
|---|---|
| 2020-01-01 | 120 |
| 2020-02-01 | 115.61801032730659 |
| 2020-03-01 | 111.66370749734469 |
| 2020-04-01 | 107.58613072177782 |

Read the column heading carefully. Each entry is a **daily rate**, in stock tank barrels per day, sampled on that date. It is not the month's production volume. The February row does not say "Ekene-1 made 115.6 barrels in February"; it says "on the first of February, the well was flowing at 115.6 barrels per day." Volumes come from rates by integration, and that is module 3's whole subject. Confusing a sampled rate with a monthly volume is the first classic error of decline work.

## The three working units

This course computes in a fixed unit system, the same one the engine uses:

- **Rate**: stb/d (stock tank barrels per day).
- **Time**: days, counted from the first row of the well in question. That first row is $t = 0$.
- **Decline rate $D_i$**: per day.

A per-day decline looks strangely small on the page. Ekene-1's is $D_i = 0.0012$ per day. Multiply by 365 and it is $0.438$ per year, which sounds more like the annual decline numbers quoted in reports. Nominal decline rates scale linearly with the time unit, so per-day and per-year forms carry identical information; you convert by a bare factor of 365. What you may NOT do is mix them: a per-year $D_i$ fed into a formula expecting days is a factor-of-365 catastrophe, and it happens in practice more often than anyone admits. (There is a second, different distinction between nominal and effective decline; that one is not a unit conversion and gets its own lesson in module 2.)

## One row, by hand

The exponential decline you will meet formally in module 2 is

$$q(t) = q_i\,e^{-D_i t}$$

Ekene-1 has $q_i = 120$ stb/d and $D_i = 0.0012$ per day. Its second row is dated 2020-02-01, which is $t = 31$ days after its start (January has 31 days). So

$$q(31) = 120 \times e^{-0.0012 \times 31} = 120 \times e^{-0.0372}$$

Now $e^{-0.0372} = 0.963483\ldots$, so $q(31) = 115.61801032730659$ stb/d, which is precisely the value in the table above, to the last digit.

Stop and do it yourself: compute $120\,e^{-0.0372}$ on a calculator. If you get 115.618, you have just verified a committed data point of this course from first principles. This is what "noise free by design" buys you: the table and the formula are the same object.

## Open the panel

{{panel:dca-fit-explorer}}

The fit explorer above is the instrument you will use throughout the course. For now, ignore the fitting controls entirely and just look at data. Select each of the four producers in turn with the model on Auto-select and the window on Primary. Blue points are monthly rate samples; the horizontal axis is days on that well's own clock; the dashed yellow line marks the flood start, where this module's story ends.

Toggle the rate axis between Semilog and Linear and watch Ekene-1: on the linear axis its decline is a sagging curve, on the semilog axis it is a perfect straight line. Module 2 explains why that straightness is the exponential model's fingerprint. Notice too that the other three wells are NOT straight on semilog; they bend upward, fading more slowly. Those are your first hyperbolic and harmonic sightings.

## The per-well clock, again

The panel's time axis restarts at zero for every well, because $t$ in every decline formula is time since THAT well's first row. Ekene-3's $t = 31$ days is 2020-04-01, not 2020-02-01. When module 6 asks you for a cumulative "at the flood start," each well will have its own $t$ for the same calendar date: 1096 days for Ekene-1 but only 852 for Ekene-6. Calendar dates are for people; the formulas eat days on the well's own clock.

## Exercise

Ekene-1's third row is dated 2020-03-01, which is $t = 60$ days after its start (31 days of January plus 29 of leap-year February). Compute $q(60) = 120\,e^{-0.0012 \times 60}$ by hand, then check it against the table at the top of this lesson. You should land on 111.66370749734469 stb/d, matching the committed data exactly.
