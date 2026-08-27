# Reading a drive split

You can compute a drive split. This lesson is about what to say when someone asks you what it means.

## The Ekene split

| index | value | what it means |
|---|---|---|
| DDI | 0.607003891050583 | oil expansion supplied 60.7 percent of the space |
| SDI | 0.392996108949419 | rock compaction and connate water supplied 39.3 percent |
| GDI | 0.00000000000000 | no gas cap, and no free gas anywhere |
| WDI | 0.00000000000000 | nothing arrived from outside |
| sum | 1.00000000000000 | the books close |

The engine puts a label on that pattern: drive mechanism `depletion_drive`, aquifer strength `none`. Both follow from the numbers rather than from anything told to the engine. There is no aquifer in the fixture, the water drive index came back at zero, and a water index at or below a couple of percent is what the engine calls no aquifer.

Said in a sentence a manager can use: Ekene is a closed, undersaturated tank producing entirely on its own stored energy, with no external support of any kind.

## Read the sum first

Before the split means anything, the set has to close. Ekene sums to one, so the four numerators between them account for the whole withdrawal and nothing has been left out.

When a set does not close, work through the causes in this order. First the denominator convention from lesson 3, because it is the commonest and it is free to check. Then a missing term: a gas cap that was set to zero when the field has one, or an aquifer supplying water that no term in your model accounts for. Only then the data itself.

A set that misses one by a large amount and cannot be explained by the convention is usually a missing mechanism, and a missing mechanism means the oil in place you fitted alongside it is also wrong. Closure is not cosmetic.

## Read the water index second

WDI is the index that changes what you do next. Ekene's is zero, and that zero is consistent with everything module 3 showed: a flat $F/E_t$ column, an intercept at machine zero, six subset fits that agree. Several independent diagnostics all saying the same thing is what confidence looks like.

If WDI came back at 0.3 on a tank you had modelled as closed, none of the rest of the split would be worth reading, because the oil in place that produced those numerators would have been fitted without the water term that the data is demanding. You would go back to the model before you went forward to the interpretation.

## Read the movement third

A single split is a snapshot. The sequence is the story. Ekene's holds still:

| n | date | DDI | SDI |
|---|---|---|---|
| 1 | 2020-07-01 | 0.607003891050567 | 0.392996108949418 |
| 6 | 2023-01-01 | 0.607003891050583 | 0.392996108949419 |

Lesson 2 explained why: both expansion terms are proportional to the same drawdown, so their ratio cannot move. A split that stays put is a tank whose physics has not changed over the observation period.

Splits that do move are common and each movement has a meaning. A depletion index that falls while a water index rises says an aquifer has woken up and is taking over the job. A gas cap index that climbs says the gas cap is expanding into the oil column. A depletion index that jumps says the tank has crossed its bubble point and gas is coming out of solution.

So plot the indices against time whenever you have more than two surveys, and read the trend before the value. The trend is what tells you whether next year's tank is the same tank.

## What this split means for the field

Two numbers put Ekene's drive in perspective. To produce $261475.039999678$ stb, which is $2.15397114609312$ percent of the tank, the pressure had to fall $1103.99173733300$ psi from 3200 psia.

That is what depletion drive costs. There is no outside source refilling the space, so every barrel is paid for in pressure, and the pressure budget is finite: production stops being possible long before the oil runs out. Depletion drive fields are low recovery fields, which is why the industry spends money on pressure maintenance and on the displacement processes the later reservoir courses cover.

Two forward looking observations follow directly from the split, and both are readable at this tier.

The tank is losing 287.979367719385 reservoir barrels of capacity per psi of drawdown, and 113.174770971432 of that comes from rock and connate water. That contribution is a one time asset. Rock compaction and water expansion do not replenish.

The bubble point sits at 2000 psia and the last survey came in at 2096.00826266700 psia, a margin of 96.0082626669955 psi. When the tank crosses that pressure, gas comes out of solution, and everything in the drive split changes at once. A split computed above the bubble point does not describe the tank below it. That is a Professional tier subject, and the Associate's contribution is to see the crossing coming and flag it.

## Writing it down

A drive split belongs in a memo in this form, and no shorter: the four indices, their sum, the convention used for the denominator, the survey the split is quoted at, and one sentence of interpretation. Ekene at 2023-01-01, net withdrawal convention, DDI 0.607, SDI 0.393, GDI 0, WDI 0, sum 1.000: a closed undersaturated tank on depletion drive with no external support, whose split has been constant across all six surveys.

Every element of that sentence is checkable by the person reading it. That is the standard.

## See it in the panel

{{panel:mb-tank-explorer}}

Read the drive index tiles and confirm the four values above. Then work down the survey table with the split in mind and check that the ratio of $E_o$ to $E_t$ on any row you pick reproduces that row's depletion index, so you can see the split is a property of the expansion terms and not of the fit.

Then set the aquifer selector to the pot option and watch what happens to the oil in place tile. Do not try to interpret the new number: an aquifer model on a tank with no aquifer is the Professional tier's lesson, and the only thing to take from it here is that adding a term the data does not need is never free.

## Exercise

Using the survey table, compute the depletion index at survey 3 as $E_o / E_t$ from $E_o = 0.00918514279964078$ rb/stb and $E_t = 0.0151319339712031$ rb, and check it against the 0.607003891050589 that the engine reports for that survey.

Then write two sentences of interpretation for a hypothetical tank whose indices at its latest survey are DDI 0.42, SDI 0.05, GDI 0.00, WDI 0.53. Say what is driving that field, and say what you would want to see from its earlier surveys before you believed the number.
