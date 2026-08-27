# Common errors

Five mistakes account for most of the wrong DCA numbers that reach a reserves report. None looks wrong on the page: each produces a plausible figure with plausible units, which is why they survive review. This lesson names each one, shows what it does to Ekene-1, and gives the check that catches it.

## Error 1: fitting through the flood rows

The rate table for every Ekene producer runs from first oil to 2025-12-01, and the waterflood starts at 2023-01-01. Feed the whole table to auto-select on Ekene-1 and the engine does exactly what you asked: it finds the best single Arps curve through primary depletion, the flood response and everything after. It returns a hyperbolic with $q_i$ of 97.2058663778433 stb/d, $D_i$ of 0.00196150586036441 per day, and $b$ pinned at 1.95, the ceiling of the engine's search range. R2 falls well below 1.

Note what each symptom says. A $q_i$ of 97 stb/d on a well whose first recorded rate is 120 stb/d means the curve cannot reach the early data. A $b$ sitting exactly on the search boundary means the optimizer wanted to go further and was not allowed to. Neither is subtle once you look. The error is not reading the output, it is never having chosen a window before fitting.

**The check.** Before fitting, write down the date of every operational change you know about, and fit inside one regime. Afterwards, if the fitted $b$ landed on a boundary or the fitted $q_i$ misses the early rates, stop and revisit the window rather than reporting the parameters.

## Error 2: per day and per year, a factor of 365

Ekene-1's nominal decline is 0.0012 per day, which is 0.438 per year. Both are the same decline, and neither is wrong. Mixing them is catastrophic and quiet.

Put 0.438 into the exponential EUR formula while thinking in daily rates:

$$\frac{q_i - q_{limit}}{D_i} = \frac{110}{0.438} = 251.141552511416$$

Two hundred and fifty one barrels, against the true 91666.6666666667 stb. Wrong by a factor of exactly 365, and absurd enough that this version usually gets caught. The dangerous cousin is time to limit, where the same swap gives $\ln 12 / 0.438 = 5.67330285339726$, which is not wrong at all: it is the right answer in years, because the units of $t$ always follow the units of $D_i$. It becomes an error only when it is written into a field labelled days, where the capstone tolerance of 10 days rejects it and a real report would simply carry it.

**The check.** State the unit of $D_i$ in the same sentence as its value, every time, and confirm that the output unit follows. If a colleague hands you a decline with no unit, ask before using it.

## Error 3: nominal, effective, and the gap between them

Ekene-1's annual nominal decline is 0.438 per year. Its tangent effective annual decline is $1 - e^{-0.438} = 0.354674217142705$, or 35.4674217142705 percent per year. Two conventions, one decline: the reserves world quotes the effective form, and the Arps equations consume the nominal form.

Substituting the effective decline into an EUR calculation because it was the number on the summary sheet overstates the booking by the ratio $0.438 / 0.354674217142705 = 1.23493611553886$, which is 23.4936115538863 percent. Large enough to matter, small enough to look like a difference of modelling opinion. It is neither. It is a units error with a percent sign on it.

**The check.** Effective declines are always smaller than nominal declines and are always quoted as a percentage between 0 and 100. If your $D_i$ came out of a table headed "annual decline, percent", convert it back with $D_i = -\ln(1 - D_e)$ before it touches a closed form.

## Error 4: expecting EUR to include the tail below the limit

EUR stops at the limit. It is not the volume the well would produce if left alone, and the gap is real. Ekene-1's exponential ceiling is $q_i / D_i = 100000$ stb, its EUR at 10 stb/d is 91666.6666666667 stb, and the 8333.33333333333 stb between them, 8.33333333333333 percent of the ceiling, stays in the reservoir because nobody will pay to lift it.

On a harmonic well the misunderstanding is worse, because there is no ceiling to compare against. Ekene-5's cumulative at 60000 days is 300723.967101123 stb against its 153505.672866270 stb booking at the 10 stb/d limit, and it keeps rising. Anyone reading a harmonic EUR as "what the well contains" has read a commercial decision as a rock property.

**The check.** Write the limit into the label. "EUR at the 10 stb/d limit", never "EUR".

## Error 5: summing the monthly snapshots

The rate table gives one reading on the first of each month, in stb/d. It is tempting to get cumulative production by taking each month's rate, multiplying by the days in that month, and adding up. Do that for Ekene-1 from first oil to the flood start and you get 74502.9269694921 stb. The exact integral over the same span is 73157.9366256283 stb.

The snapshot sum is 1344.99034386380 stb too high, a little under two percent. The reason is structural, not arithmetic: for a declining well the rate on the first is the highest rate of that month, so holding it for thirty days credits barrels that were never produced, once a month, for three years. The bias always points the same way, so it does not average out over a long history, it accumulates. It is also enough to fail the capstone, whose tolerance on cumulative at the flood start is 400 stb. That tolerance was chosen this way on purpose.

**The check.** Use the closed-form cumulative from module 3. If you must sum a table, sum it and then compare against the closed form; a systematic one-sided gap of a percent or two is the signature of this error.

## Worked example: auditing a one-paragraph booking

A colleague sends you this. "Ekene-1, full history fit, hyperbolic. Di 0.438. EUR 251 stb. Time to limit 5.67. Cumulative to 2023-01-01 by summing the monthly rates, 74502.9269694921 stb."

Work through it before reading the verdict. The window is the full history, so error 1 has already decided the model family and every parameter after it. The decline carries no unit, and the EUR of 251 stb shows it was consumed as if per day, so error 2 appears twice. The time to limit of 5.67 has no unit either and is in years where the format wants days. The cumulative is a snapshot sum. Four of the five errors in one paragraph, and the only figure printed to full precision is the one that is wrong on purpose. Precision is not accuracy.

## Exercise

Rewrite that paragraph correctly, using the primary window and the values you derived in modules 4 and 5, with a unit on every number and the economic limit named beside the EUR. Then, for each of the five errors, write the single sentence you would add to a booking template to make that error impossible for the next person. Keep the list. It is the start of the governance habit the Expert tier turns into a formal memo.
