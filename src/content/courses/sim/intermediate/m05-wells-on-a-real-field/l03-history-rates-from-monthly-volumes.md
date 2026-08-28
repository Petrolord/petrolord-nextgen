# History rates from monthly volumes

The waterflood course's ledger holds monthly VOLUMES. A schedule wants RATES. The conversion is one division and it is the place a production history most often goes wrong.

## The conversion

$$\text{rate} = \frac{\text{volume in the month}}{\text{days in that month}}$$

Ekene-1 produced 998.5247575266284 stb of oil in January 2023. January has 31 days, so the deck's schedule carries

$$\frac{998.5247575266284}{31} = 32.210476049246076 \text{ stb/d}$$

The injectors the same month: Ekene-2 at 92.69866778155182 bbl/d and Ekene-4 at 61.799111854367894 bbl/d.

## Why the month length matters

Because months are not the same length, and a schedule that uses a constant divisor misallocates volume.

Take the same 998.52 stb and divide by a mean month of 30.4375 days instead of 31. You get 32.804 stb/d, which the simulator will then apply over the 31 days that the DATES block actually spans, producing 1016.9 stb.

That is 1.8 percent too much oil, in one month, from one division. Over 36 months the errors do not cancel, because they follow the calendar rather than anything random: every 31-day month is over-produced and every 30-day month is under-produced, and February is over-produced by nearly ten percent.

## The check

Multiply back. Take the rate the deck carries, multiply by the days the DATES block spans, and confirm you recover the ledger's volume.

$$32.210476049246076 \times 31 = 998.5247575266284$$

Do that for every well and every period and sum, and the total must equal the ledger's total. This deck's history is built to satisfy that exactly, and the check is one line of arithmetic that catches every divisor mistake at once.

## Why the deck uses DATES here and not TSTEP

Because DATES advances to a calendar date, so the period the rate is applied over is the real month. TSTEP advances by a fixed number of days, so it cannot express a 28-day February followed by a 31-day March.

The prediction tail after the history uses TSTEP with a mean month, which is correct there because nothing in a forecast is tied to a calendar.

## The convention behind the ledger

The waterflood course stated it: a monthly volume is the rate on the first of the month held flat for that month. So the ledger and the schedule agree by construction, and the conversion between them is exact.

A real production database usually holds daily allocated volumes and monthly totals that do not quite agree, because allocation is redone. Which one the deck uses is a decision, and it should be recorded, because a history match against one set of numbers does not reproduce the other.

## What the schedule does not carry

Anything the ledger did not have. Ekene's ledger has oil, water, gas and injection per well per month, so the schedule has WCONHIST and WCONINJH per well per month.

It has no bottom-hole pressures, so the model's pressures are unconstrained by observation. That is normal and it is a limitation worth stating: a rate-controlled history match reproduces rates by construction and tests the model only through the pressures it predicts.

## The misconception to avoid

"The history is the data, so it is exact." The history is an allocation. Field measurements are at the separator and the export meter, and per-well rates come from well tests interpolated between them. A monthly per-well oil volume is typically good to a few percent, and the deck carries it to fifteen digits, which is precision rather than accuracy.

## Exercise

First, take Ekene-1's January rate of 32.210476049246076 stb/d, multiply by 31, and confirm the ledger volume. Then compute what volume a mean-month divisor of 30.4375 would have produced over the same 31 days, and the percentage error.

Second, explain in two sentences why a rate-controlled history match tests the model through pressures rather than through rates.
