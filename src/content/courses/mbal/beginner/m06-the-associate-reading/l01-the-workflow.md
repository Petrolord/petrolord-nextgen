# The workflow

Five modules have handed you pieces: the tank and its assumptions, the four terms, the straight line, the drive indices, the reconciliation. This lesson puts them in the order they must happen in, because the order is what protects you. Most bad material balance answers are not arithmetic failures. They are an engineer who computed the terms before checking whether the surveys deserved to be believed, or who read a slope before asking whether the points made a line.

Seven steps. Do them in this sequence, every time, on every tank.

## Step 1: Assemble the surveys

A survey is a matched set: a date, a static reservoir pressure, and the cumulative volumes produced up to that date. Nothing goes into the analysis unmatched. Before computing anything, confirm four things.

The dates are real and strictly increasing. The engine refuses a history whose observation dates are missing or out of order, and it is right to refuse, because a cumulative that goes backwards is not a cumulative.

The pressures are static reservoir pressures at a common datum. A flowing pressure describes a well, not a tank.

The cumulatives are cumulative and not periodic. Ekene's six run 38864.2338744572, 99594.7403971816, 151911.968683336, 195407.593210859, 230985.237096421 and 261475.039999678 stb, each larger than the last.

The fluid properties travel with the surveys. Ekene supplies an oil formation volume factor and a solution gas ratio on every row, which is why its chain is exact. Where those properties come from when they are not supplied is a Professional question. For now, check that every survey has them.

Ekene's initial condition is a pressure of 3200 psia on 2020-01-01 with nothing produced, an initial oil formation volume factor of 1.20000000000000 rb/stb, an initial solution gas ratio of 400.000000000000 scf/stb, an initial water saturation of 0.35, a rock compressibility of 0.000004 per psi and a water compressibility of 0.000003 per psi. Write that block down before you start. It is the header of every calculation that follows.

## Step 2: Compute the terms, survey by survey

For each survey, four numbers: underground withdrawal $F$ in reservoir barrels, oil expansion $E_o$ in rb/stb, rock and connate water expansion $E_{fw}$ in rb/stb, and their sum, the total expansion $E_t$. Compute them in that order and keep the units attached to each. At Ekene's last survey they are $F$ = 317926.842484584 rb, $E_o$ = 0.0158974810175951 rb/stb, $E_{fw}$ = 0.0102925998895969 rb/stb and $E_t$ = 0.0261900809071921 rb/stb.

Two sanity checks cost nothing. $F$ divided by the cumulative oil should be a plausible oil formation volume factor: 317926.842484584 divided by 261475.039999678 gives 1.21589748101760 rb/stb, exactly the value the fixture carries at that pressure. And $E_o$ plus $E_{fw}$ must equal $E_t$ to the last digit, because that is all $E_t$ is.

## Step 3: Plot F against Et

Not a table, a plot. $E_t$ on the horizontal axis in rb/stb, $F$ on the vertical in reservoir barrels. You are looking for one thing before fitting anything: do the points make a straight line through the origin?

The plot comes before the regression because a regression returns a slope whatever shape the points are in. The plot is your only chance to notice that they curve.

## Step 4: Read the slope

Now fit. The slope is the oil originally in place. On Ekene it is 12139208.1074968 stb with an intercept of -6.11180439591408e-10 rb and an R-squared of 1.00000000000000 across six points.

Read the intercept as well as the slope. A tank with nothing produced and no pressure drop has expanded by nothing and withdrawn nothing, so the honest line goes through the origin. An intercept that is a meaningful fraction of your withdrawals is telling you the model and the data disagree about the starting condition.

## Step 5: Check the indices close

The drive indices apportion the withdrawal among the mechanisms that supplied it, and they must sum to 1. At Ekene's last survey the depletion drive index is 0.607003891050583, the segregation slot carries 0.392996108949419, the water drive index is 0.00000000000000, and the sum is 1.00000000000000.

Know what you are reading. For an oil tank the engine puts the rock and connate water expansion drive into the segregation slot, so on this tank that 0.392996108949419 is the same quantity as the rock and water share of total expansion, 39.2996108949418 percent. It is not a gas cap. The mechanism reads back as depletion_drive with an aquifer strength of none, which is what a water drive index of exactly zero should give you.

If the indices do not close to 1, stop. Module 4 lesson 3 showed that the commonest reason is the denominator convention rather than the data, and chasing the data first will cost you a day.

## Step 6: Reconcile against volumetrics

Fetch the independent booking and compare. Ekene: 12139208.1074968 stb from the slope against 12139208.107496763 stb from the map and contact, an absolute gap of 7.45058059692383e-8 stb and a relative gap of 6.13761666407432e-15. State the gap in barrels first and name the denominator of any percentage. Say which direction it runs and offer a mechanism if it is material.

## Step 7: State what would change the answer

Finish by writing down the inputs your answer is most exposed to and what would tighten them. For material balance that usually means the representativeness of the static pressures and the amount of depletion behind the fit. Ekene has 1103.99173733300 psi of depletion, 34.4997417916564 percent of its initial pressure, which is a strong signal. Say so, because a reader cannot tell from the slope alone whether it was earned over a thousand psi or over forty.

## Worked example: the whole chain in one paragraph

Ekene tank, oil, six static surveys from 2020-01-01 to 2023-01-01, dates increasing, pressures at datum, per-row fluid properties present. Initial pressure 3200 psia, initial oil formation volume factor 1.2 rb/stb, initial water saturation 0.35. Terms at the last survey: $F$ 317926.842484584 rb, $E_o$ 0.0158974810175951 rb/stb, $E_{fw}$ 0.0102925998895969 rb/stb, $E_t$ 0.0261900809071921 rb/stb, and $F/N_p$ of 1.21589748101760 rb/stb reads as a sensible oil formation volume factor. Plot of $F$ against $E_t$: six points, straight, through the origin. Slope 12139208.1074968 stb, intercept -6.11180439591408e-10 rb, R-squared 1.00000000000000. Indices 0.607003891050583 depletion and 0.392996108949419 rock and water, water drive zero, sum 1.00000000000000, mechanism depletion drive. Reconciliation against the volumetric booking of 12139208.107496763 stb: gap 7.45058059692383e-8 stb, 6.13761666407432e-15 relative. Depletion behind the fit 1103.99173733300 psi, 34.4997417916564 percent of initial. Answer most exposed to the representativeness of the static pressures. That paragraph is a complete Associate reading of a tank.

## Exercise

Run the seven steps yourself using only the first three surveys of the Ekene history, and stop at step 4. Fit $F$ against $E_t$ on the surveys of 2020-07-01, 2021-01-01 and 2021-07-01 alone, and you will find a slope of 12139208.1074966 stb with an R-squared of 1.00000000000000, which differs from the six-survey answer by 1.56509224933894e-12 percent.

Then answer the question the exercise is really asking. On this dataset the first three surveys were enough. Why would that be a dangerous conclusion to carry to a real field, and what would you look at in a real three-survey dataset before believing a slope from it? Write two sentences. Step 7 exists for exactly this reason.
