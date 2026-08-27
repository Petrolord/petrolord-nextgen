# The Weaver worked examples

Four of the eight armed cases come from one document: Weaver, James R., P.E., "Forecasting Oil and Gas Using Decline Curves", CED Engineering continuing-education course No. P03-004, fetched and read page by page on 2026-07-18. It is a good anchor document for a specific reason. It works every example in the same nominal Arps forms the engine implements, it prints intermediate values, and it does its unit conversions on the page where you can see them.

Here are the four cases, with what each one is for.

| id | reference | model | given | published | tolerances |
|---|---|---|---|---|---|
| `ced-p03-004-exponential-oil` | p. 11 | exponential | $q_i$ 150 bbl/d, $d_e$ 0.15/yr | $t$ 3 yr, $q$ 92.1 bbl/d, $N_p$ 129995 bbl | rate_abs 0.05, np_rel 0.0002 |
| `ced-p03-004-shale-gas-hyperbolic` | p. 14 | hyperbolic | $q_i$ 2500 Mscf/d, $b$ 1.2, $d_e$ 0.65/yr | $t$ 2 yr, $q$ 876 Mscf/d, $N_p$ 1014165 (rate form) and 1014083 (time form) Mscf | rate_abs 0.5, np_rel 0.0005 |
| `ced-p03-004-harmonic-rate-cumulative-table` | pp. 21-22 | harmonic | $q_i$ 120 bbl/d, $d_e$ 0.35/yr | 11-row daily-rate table, $t$ 0 to 5 yr | rate_abs 0.6, np_rel 0.0002, np_abs 25 |
| `ced-p03-004-hyperbolic-b115-cumulative` | pp. 18-19 | hyperbolic | $q_i$ 4563 bbl/month, $b$ 1.15, $d_i$ 0.0545/month | $t$ 109 months, $q$ 762 bbl/month, $N_p$ 171883 bbl | rate_abs 1.0, np_rel 0.001 |

Lesson 1 worked the exponential case, and lesson 3 takes the $b = 1.2$ shale gas case apart on its own. This lesson is about the other two, because between them they carry the two things that actually break validation attempts: rounding and units.

## The rounding trap, measured

The harmonic case prints an 11-row table of daily rate and cumulative at half-year steps. The document's nominal decline is $-\ln(1 - 0.35)$, printed as 0.4308 per year; carried unrounded that is 0.430782916092454 per year, or 0.0011802271673765868 per day.

Run the engine down the table and compare:

| $t$ (yr) | printed $q$ | engine $q$ unrounded | printed $N_p$ | engine $N_p$ | $\Delta N_p$ |
|---|---|---|---|---|---|
| 0.5 | 99 | 98.7336213411464 | 19833 | 19833.4237325343 | +0.4237 |
| 1.0 | 84 | 83.8701655228918 | 36422 | 36422.3225620864 | +0.3226 |
| 2.0 | 64 | 64.4618621191370 | 63183 | 63182.8850590649 | -0.1149 |
| 3.5 | 48 | 47.8518467333277 | 93478 | 93478.4817861973 | +0.4818 |
| 5.0 | 38 | 38.0479549900846 | 116789 | 116788.811883199 | -0.1881 |

Every cumulative agrees to within half a barrel out of tens of thousands. The rates disagree by up to 0.46186211913695274 barrels a day, at $t = 2$, which is the worst row in the table and comfortably inside the case's `rate_abs` of 0.6.

Now do the thing the doctrine forbids. Take the **printed** rate of 99 bbl/d at half a year and push it through the harmonic cumulative:

$$N_p = \frac{q_i}{D_i}\ln\!\left(\frac{q_i}{q}\right) = \frac{120}{0.0011802271673765868}\ln\!\left(\frac{120}{99}\right) = 19559.477832566186 \text{ bbl}$$

That is 273.5221674338136 barrels below the printed 19833, against a tolerance of 25 absolute. The validation fails, the engine is blameless, and the analyst spends a day hunting a bug in a cumulative formula that is correct. The same substitution at $t = 1$ misses by 156.95335835550213 barrels low, and at $t = 5$ by 128.04256681443076 barrels high. The sign flips because the rounding of the rate flips direction, which is a useful tell: a systematic bug does not change sign down a table, a rounding artefact does.

The rule that falls out is short. **Rounded values are for reading, unrounded values are for computing.** When a document prints a rate to whole units and a cumulative to six figures, the cumulative is the harder constraint and the rate is the softer one, and you build your comparison accordingly.

## The units trap, measured

The fourth case is the hyperbolic leg of a hyperbolic-to-exponential example, and it is stated entirely in months. The document derives its initial rate as 150 bbl/d $\times$ 365/12, which is 4562.5 bbl/month, printed as 4563. Its decline is monthly: $-\ln(1 - 0.0530) = 0.0544561857960589$, printed as 0.0545 per month.

The temptation is to convert everything to days before handing it to the engine. Do not. Nominal declines scale linearly with the time unit, so the Arps forms are unit-agnostic as long as $q_i$, $D_i$ and $t$ agree. Feed the engine $q_i = 4563$ volume per month, $D_i = 0.0545$ per month, $b = 1.15$, $t = 109$ months and it returns

$$q(109) = \frac{4563}{(1 + 1.15 \times 0.0545 \times 109)^{1/1.15}} = 762.062115355870 \text{ bbl/month}$$

against a printed 762, a gap of 0.0621153558696506 inside the `rate_abs` of 1.0. The cumulative from that unrounded rate is 171883.377500690 bbl against a printed 171883, a relative error of $2.19626542742215 \times 10^{-6}$ against an allowance of $10^{-3}$.

Note what the answer is **not**. The rate 762.062115355870 is a monthly volume. Divide by 365/12 and it is 25.0540969432067 bbl/d. If you had assumed the column was a daily rate you would be wrong by a factor of thirty and every downstream number would be wrong with it, while your fit statistics stayed perfect. There is no diagnostic inside the fit that catches a units error. Only an external number catches it, which is the whole argument of this module.

## Worked example: reproduce a table row from scratch

Take the harmonic case at $t = 3.5$ years and do it on paper.

1. Nominal decline: $d_i = -\ln(1 - 0.35) = 0.430782916092454$ per year, so $D_i = 0.0011802271673765868$ per day.
2. Time in days: $3.5 \times 365 = 1277.5$ days.
3. Harmonic rate: $q = 120 / (1 + 0.0011802271673765868 \times 1277.5) = 47.8518467333277$ bbl/d. Printed: 48.
4. Harmonic cumulative from the **unrounded** rate: $(120 / 0.0011802271673765868)\ln(120 / 47.8518467333277) = 93478.4817861973$ bbl. Printed: 93478.

Four steps, no software, and you have independently confirmed one row of a published table against the engine. Stop here and do step 4 twice, once with 47.8518467333277 and once with the printed 48, and watch the second one drift.

## Exercise

Reproduce the $t = 4.5$ row of the harmonic table the same way. The fixture prints $q = 41$ bbl/d and $N_p = 109597$ bbl. Report your unrounded rate, your cumulative, and the signed difference from each printed value, then state which of the case's three tolerances (`rate_abs` 0.6, `np_rel` 0.0002, `np_abs` 25) is the binding one for your cumulative and by what margin. Second part, one sentence: the harmonic case is the only one of the four that carries both an `np_rel` and an `np_abs` tolerance. Why would a table that spans 0 to 116789 barrels need both?
