# Apportioning the drive

The terms are computed and the influx is solved. What remains is to say who drove the field, and it is the shortest arithmetic in the module and the easiest to publish wrongly. Three separate things can go wrong here, and only one of them is arithmetic. The other two are a convention and a label.

## The four numerators

Every index has the same shape: one supplier's contribution in reservoir barrels, over the withdrawal being apportioned. On Ahmed Example 11-1 the four numerators are

| supplier | numerator | value rb |
|---|---|---|
| oil expansion | $N E_o$ | 750000.000000000 |
| gas cap expansion | $N m E_g$ | 592500.000000000 |
| net water influx | $W_e - W_p B_w$ | 361281.250000001 |
| rock and connate water | $N E_{fw}$ | 6418.75000000000 |

They sum to 1710200.00000000 rb. Hold on to that number, because it is not $F$.

## Layer one: the denominator

$F$ is 1760200.00000000 rb. The four numerators sum to 1710200.00000000 rb. The difference is 50000 rb, which is the produced water, $W_p B_w$.

The Associate tier proved why the denominator has to be the net withdrawal $A = F - W_p B_w$: subtract the produced water from both sides of the balance and every term divides by its own left hand side. Here is what that identity is worth on a case where it bites.

$$A = 1760200 - 50000 = 1710200.00000000 \ \text{rb}$$

| index | divided by $A$ | divided by $F$ | book prints |
|---|---|---|---|
| DDI | 0.438545199391884 | 0.426087944551755 | 0.4385 |
| SDI, the gas cap | 0.346450707519588 | 0.336609476195887 | 0.3465 |
| WDI | 0.211250877090399 | 0.205250113623452 | 0.2112 |
| EDI | 0.00375321599812887 | 0.00364660265878877 | 0.0038 |
| sum | 1.00000000000000 | 0.971594137029883 | 1.0000 |

One convention reproduces the printed table and closes to one. The other misses every printed value and closes to 0.971594137029883.

Now read that shortfall correctly, because this is the trap. A sum of 0.9716 looks like a 2.8 percent closure failure, and closure failure is a real thing that happens to real drive splits when the data is inconsistent. It is not what happened here. The shortfall is

$$\frac{W_p B_w}{F} = \frac{50000}{1760200} = 0.0284058629701170$$

exactly and by construction, because dividing the same numerators by a denominator that is larger by $W_p B_w$ scales the whole sum by $A/F$. Nothing about the data is wrong. The denominator was.

So when a set of drive indices misses one, compute $W_p B_w / F$ before you touch anything else. If it matches your shortfall, you have found the problem and it is a convention, not a measurement. The book prints its net withdrawal as 1710000 rb, rounded from the 1710200.00000000 rb the full arithmetic gives, and states the convention explicitly. Your published split should do the same.

## Layer two: comparing against a printed number

Our water drive index is 0.211250877090399. Round it to four decimals and you get 0.2113. The book prints 0.2112.

You have not made an error and neither has Ahmed. The book divided a rounded influx by a rounded net withdrawal, and the fourth decimal of the result carries the accumulated rounding of everything upstream of it. Chase that difference and you are chasing the author's arithmetic housekeeping, not the physics.

This is worth a rule, because it applies to every benchmark you will ever check by hand.

**Against a printed number whose intermediates you cannot see, the honest test is agreement to within one unit in the last printed place.** The book prints four decimals, so the test is agreement within 0.0001. On the net withdrawal convention the four differences are 0.0000451993918837434, 0.0000492924804116335, 0.0000508770903991929 and 0.0000467840018711255. All four pass. On the gross withdrawal convention the differences are 0.0124120554482448, 0.00989052380411315, 0.00594988637654773 and 0.000153397341211226. All four fail, including the small one.

Do not assert a tight relative tolerance against a printed value. A tolerance of one part in ten thousand on a number the author printed to four decimals is a test of whether the author rounded the way you would have, and it will fail on correct work and pass on incorrect work at roughly the rate that rounding is kind to you. If you need a tighter check than the last printed place allows, you need a different benchmark, one that publishes its intermediates.

## Layer three: the engine's own indices are not these indices

This is the part to read twice, because the tool you are about to use disagrees with the book you have just checked, in two separate ways, and it does not tell you.

The oil drive index block in `mbalEngine.ts` computes, for each timestep:

$$\text{ddi} = \frac{N E_o}{F}, \quad \text{sdi} = \frac{N E_{fw}}{F}, \quad \text{gdi} = \frac{N m E_g}{F}, \quad \text{wdi} = \frac{W_e - W_p B_w}{F}$$

**The denominator is gross $F$, not net $A$.** The produced water is netted inside the water index's numerator and not taken off the denominator, so on any tank that has produced water the engine's four indices will not sum to one. On Ekene they do sum to one, because Ekene produced no water at any survey and $A$ and $F$ are the same number. On this example they would sum to 0.971594137029883.

And the engine's validation string for this very path claims otherwise. It says the engine reproduces the printed indices in the "book index convention, denominator F - Wp*Bw". The harness case behind that claim does reproduce them, by recomputing the indices in the book's convention from the engine's per timestep terms. The runtime fields do not. Both statements are true at once, and only one of them is what you get back from a run.

**The field names do not mean what the literature means.** The field called `sdi` holds $N E_{fw} / F$, the rock and connate water term, which Ahmed calls EDI. The field called `gdi` holds the gas cap term, which Ahmed calls SDI, for segregation drive. Two names crossed over, on a tank where the crossing is invisible until there is a gas cap to expose it. Ekene has $m = 0$, so `gdi` is zero and `sdi` carries the whole rock and water story unambiguously.

The habit that survives both of these: **read the numerator, never the acronym.** Before you quote any drive index from any tool, find the expression that produced it and say out loud what is on top and what is underneath. If you cannot, you are quoting a label.

None of this is a defect in the physics and none of it means the engine is wrong about the reservoir. It means a published benchmark is the only thing that can tell you what a tool's outputs actually are, and that checking one is not optional work you do if there is time.

## The graded values

Three of the Expert capstone's six fields come from this fixture, and all three are on the net withdrawal convention:

- the water influx, 411281.250000001 bbl, tolerance 500
- the water drive index, 0.211250877090399, tolerance 0.002
- the four indices summed, 1, tolerance 0.002

The sum is graded for a reason. It is the one field that catches the denominator mistake on its own, and a submission of 0.9716 is not a near miss.

## Exercise

Suppose this field had produced twice as much water, 100000 stb instead of 50000, with everything else in the case unchanged.

Recompute the gross withdrawal, the net withdrawal, the water influx the balance requires, and all four indices in both conventions. You should find $F$ = 1810200.00000000 rb, $A$ = 1710200.00000000 rb, $W_e$ = 461281.250000001 bbl, and a gross convention sum of 0.944757485360734, a shortfall of 5.52425146392664 percent.

Then explain, in two sentences, the result that surprises most people: the water drive index on the net convention is 0.211250877090399, unchanged to the last digit from the published case, even though the influx rose by 50000 bbl. Say which two quantities moved together to leave it fixed, and what that tells you about what the water drive index is actually measuring.
