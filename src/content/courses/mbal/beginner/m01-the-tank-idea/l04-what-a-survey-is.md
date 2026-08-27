# What a survey is

Material balance consumes one kind of record: the survey row. Everything the method knows about a reservoir arrives in that shape, so it is worth taking one apart field by field before using any of them in an equation.

A survey row is four things bundled together: a date, a pressure, cumulative volumes, and the fluid properties at that pressure.

## Row 3 of the Ekene fixture, verbatim

| field | value |
|---|---|
| observation_date | 2021-07-01 |
| pressure_psia | 2562.14286113606 |
| cum_oil_stb | 151911.968683336 |
| cum_gas_scf | 60764787.4733342 |
| cum_water_stb | 0 |
| bo_rb_stb | 1.20918514279964 |
| rs_scf_stb | 400.000000000000 |
| bw_rb_stb | 1.02 |

That is a complete survey. There is no rate anywhere in it, no well name, no choke size and no water cut. Material balance does not want any of those.

## The date

The date does two jobs. It orders the surveys, and it supplies the elapsed time that some aquifer models need. The Ekene surveys are half-yearly, and the intervals in days are 182, 184, 181, 184, 181 and 184, for 1096 days of history from first oil on 2020-01-01 to the final survey on 2023-01-01.

Dates must be present and strictly increasing. Whenever a run needs the elapsed time between surveys, the engine checks the dates first and throws a named error identifying the offending timestep rather than guessing an order. That is the right behaviour, and it is worth applying by hand even on a run that does not need elapsed time, such as this depletion tank, because a survey recorded out of order silently corrupts every cumulative that follows it.

## The pressure

One number, in psia, meant to represent the entire tank. It should be a stabilised shut-in pressure, not a flowing pressure, and not a wellhead pressure. The previous lesson showed what a 20 psi error does, and how much worse it is early in life.

Note what the pressure is measured FROM. Nothing in material balance uses the absolute pressure directly. What the equations want is the drawdown from initial pressure:

$$\Delta p = p_i - p$$

At row 3 that is $3200 - 2562.14286113606 = 637.857138863942$ psi. Both expansion terms in this course are proportional to that drawdown, so the initial pressure is as load bearing a number as any survey pressure. Get $p_i$ wrong and every row is wrong by the same amount.

## The cumulative volumes

Three totals, all measured from first oil, all in surface units: oil in stb, gas in scf, water in stb.

The word cumulative is the one that trips people. Row 3 says 151911.968683336 stb, and that is everything the field has produced since 2020-01-01, not what it produced in the six months before the survey. The period volume for that step is the difference between consecutive rows:

$$151911.968683336 - 99594.7403971816 = 52317.2282861540 \text{ stb}$$

Feed the period volume into a slot expecting a cumulative and the resulting in place volume is nonsense, usually low by roughly the number of surveys you have. It is the single most common data handling error in the subject, and it does not announce itself: the run completes, the plot looks plausible, and the answer is wrong.

Ekene's cumulative water is 0 at every survey. No water has been produced at all, which is what you expect from a closed undersaturated tank with no aquifer.

## The fluid properties

The row carries the oil formation volume factor $B_o$, the solution gas ratio $R_s$, and the water formation volume factor $B_w$ at that survey pressure. These convert surface volumes into the reservoir volumes the balance is written in. $B_o = 1.20918514279964$ rb/stb at row 3 says that one stock tank barrel of Ekene oil occupies 1.20918514279964 reservoir barrels down there, because it is hot and still holds 400 scf of dissolved gas.

Ekene's rows carry laboratory PVT directly, which is why its arithmetic is exact rather than approximate. Where PVT comes from, and what happens when a table does not span the pressures you have, is Professional tier material.

## Work the produced gas ratio

Here is a two line calculation that tells you a great deal about a tank, and it uses only fields you have just met. The cumulative produced gas oil ratio is

$$R_p = \frac{G_p}{N_p}$$

At the last Ekene survey that is

$$R_p = \frac{104590015.9998713}{261475.039999678} = 400.000000000000 \text{ scf/stb}$$

Stop and do that division yourself. Then compare the answer with $R_{si} = 400.000000000000$ scf/stb.

They are identical, and identical at every one of the six surveys. That equality is the fingerprint of an undersaturated tank: every cubic foot of gas that reached the surface was dissolved in oil when it left the reservoir, because no gas was ever free down there to be produced separately. The moment a tank crosses its bubble point, $R_p$ climbs above $R_{si}$ and keeps climbing. Watching that ratio is the cheapest bubble point check you own.

## See it in the panel

{{panel:mb-tank-explorer}}

Work across the survey table row by row and rebuild each row's F from its own raw fields, the way you did the division above. Confirm that the pressures fall monotonically, that cumulative oil never decreases, and that cumulative water stays at zero. Those three checks are what a practising engineer does to a new dataset before running anything at all.

## The misconception to name

A survey row is often mistaken for a snapshot of the wells. It is not. It is a snapshot of the TANK, assembled from whatever the wells happened to measure. The pressure is an average that no single gauge read. The cumulative oil is the sum over every producer including the ones that have since been shut in. And the fluid properties belong to the reservoir fluid, not to what happens to be flowing up any particular string today.

## Exercise

Using the cumulative oil column of the Ekene table, compute the period production for each of the six steps. Check your first two answers against 38864.2338744572 stb and 60730.5065227243 stb.

Then answer this: the period volumes rise for one step and fall thereafter, while the cumulative rises throughout. Which of those two behaviours does material balance actually use, and would the method notice at all if the field had produced its 261475.039999678 stb in a completely different order?
