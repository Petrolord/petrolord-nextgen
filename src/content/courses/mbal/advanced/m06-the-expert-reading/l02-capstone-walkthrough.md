# The capstone walkthrough

The Expert capstone is called "The finite aquifer and the published benchmark". It runs on two datasets. First you take Dake Exercise 9.2 through Carter-Tracy with a finite aquifer and report what the engine recovers, together with the dimensionless pressure drop that made the finite treatment necessary. Then you work the combination drive terms of Ahmed Example 11-1 and apportion the drive correctly, which means apportioning it in a convention you have stated.

Six fields, graded server side.

| Field | Unit | Tolerance | Where it is derived |
|---|---|---|---|
| Dake 9.2 oil in place from Carter-Tracy | MMSTB | 3 | module 2 lesson 3 |
| Dake 9.2 cumulative water influx | MMrb | 1 | module 2 lesson 3 |
| pD finite at reD 5 and tD 100 | none | 0.05 | module 1 lesson 4, and below |
| Ahmed 11-1 water influx | bbl | 500 | module 3 lesson 3 |
| Ahmed 11-1 water drive index, net convention | none | 0.002 | module 3 lesson 4, and below |
| Ahmed 11-1 drive indices summed, net convention | none | 0.002 | module 3 lesson 4, and below |

This lesson does not hand you six answers. It takes two of them all the way through, by panel and by hand, and points at the lesson that owns each of the rest.

## Walkthrough one: the dimensionless pressure drop, by tile and by formula

{{panel:mb-pd-explorer}}

The panel has exactly one control, a selector labelled **Aquifer radius ratio reD**, offering reD 2, 3, 5, 10 and 20. Only one of them is the graded case. The Dake aquifer has an outer radius five times the reservoir radius, so the selector must read `reD = 5 (Dake 9.2)`, which is where it loads.

With that set, read the tile labelled **pD finite at tD 100**. It gives the graded value to nine significant figures, against a tolerance of 0.05. Now earn it, because a number you can only read is a number you cannot defend.

**The asymptote first.** Once a bounded circular aquifer has felt its outer boundary everywhere, it depletes at a uniform rate and its dimensionless pressure drop climbs linearly with dimensionless time:

$$p_D \to \frac{2 t_D}{r_{eD}^2 - 1} + \ln(r_{eD}) - 0.75$$

At reD 5 the first term is $200/24 = 8.33333333333333$. The second group is on the panel: the tile labelled **ln(reD) - 0.75** reads 0.859437912434100, the same group that sits in the denominator of the Fetkovich productivity index, for the same physical reason. Add them and the asymptote is 9.19277124576743, which is what the tile labelled **PSS asymptote at tD 100** shows and what the dashed yellow line on the chart is drawing.

**Then the real solution.** The graded number is not the asymptote. It is the bounded circle van Everdingen and Hurst constant terminal rate solution, obtained by Stehfest inversion of the radial Laplace form, and at tD 100 it sits 0.116089551269612 above the asymptote, which is 1.26283520133346 percent high. It is converging on the asymptote from above as the last of the transient dies. Read that as a sanity check on both tiles: the solution should be a little above the straight line and closing.

**And the family it is not.** The tile labelled **tD 100, finite / line source** reads 3.43706666433432. The line source solution at the same dimensionless time is 2.70837365292708, so the finite aquifer is delivering water at a dimensionless pressure drop nearly three and a half times larger, which means far less water per psi of drawdown. Module 1 established the direction and it is the whole reason this field is graded.

**The one way to fail this field.** Not arithmetic. The selector. Leave it on reD 10 and the tile reads 3.61406650389498, which misses the 0.05 tolerance by 113.895885862841 times over. On reD 3 it reads 25.5779553134040, missing by 325.381890327339 times. If this field fails, check the selector before you check anything else.

## Walkthrough two: the water drive index, and the convention that decides it

{{panel:mb-tank-explorer}}

Start at the tank panel on its default setting, `None (the truth)`, and look at one tile: **Drive indices sum**. On Ekene it reads 1.00000000000000.

That tile is the reason this capstone field exists. The engine forms every index over gross withdrawal $F$ and folds the produced water into the numerator of the water index. Ahmed apportions net withdrawal $A = F - W_p B_w$ instead. On Ekene no water has been produced, so $A$ and $F$ are the same number and the two conventions are indistinguishable. Five modules of this course went by without the question arising, and this tile is why.

Ahmed Example 11-1 produced 50000 stb of water, and now the conventions separate.

**Step one, the produced gas ratio.** The case produced 1000000 stb of oil and 1100000000 scf of gas, so

$$R_p = \frac{1100000000}{1000000} = 1100.00000000000 \ \text{scf/stb}$$

**Step two, the underground withdrawal.** At 2800 psia the two phase formation volume factor is 1.655 rb/stb and the gas formation volume factor is 0.00092 rb/scf, and the initial solution gas ratio was 1040 scf/stb:

$$F = N_p \left[ B_t + B_g (R_p - R_{si}) \right] + W_p B_w$$

$$F = 1000000 \times \left[ 1.655 + 0.00092 (1100 - 1040) \right] + 50000 = 1760200.00000000 \ \text{rb}$$

**Step three, the net withdrawal.** The water you produced back comes off the top before you ask what drove the rest:

$$A = F - W_p B_w = 1760200.00000000 - 50000.0000000000 = 1710200.00000000 \ \text{rb}$$

The book prints 1710000 rb, an agreement of 0.0116959064327485 percent, which is its rounding.

**Step four, the index.** Take the water influx that module 3 lesson 3 derives, which is the fourth graded field, subtract the water produced back, and divide by the net withdrawal:

$$WDI = \frac{W_e - W_p B_w}{A} = \frac{361281.250000001}{1710200.00000000} = 0.211250877090399$$

Against a tolerance of 0.002, and against the book's printed 0.2112 that is a difference of 0.0000508770903991929, comfortably inside one unit in the last place the book printed. Do not tighten that comparison further. Ahmed divided a rounded influx by a rounded withdrawal, so a tight relative tolerance would be a test of his rounding rather than of the physics.

**The trap, priced.** Divide by gross $F$ instead and the same influx gives 0.205250113623452. That is 0.00600076346694700 away from the graded value, missing the 0.002 tolerance by 3.00038173347350 times over. The sixth field goes with it: the four indices then sum to 0.971594137029883 instead of 1, missing its own 0.002 tolerance by 14.2029314850585 times. And 0.971594137029883 is not a closure failure. It is exactly $A/F$, the two denominators divided, which is what module 3 proved.

## Where the other three come from

**The Dake oil in place and the Dake influx.** Module 2 lesson 3, the Carter-Tracy run on the Exercise 9.2 performance history with the radius ratio set to 5. Both fields come from the same run, so if one is wrong they usually both are, and the usual cause is the aquifer geometry rather than the method. Watch the units: one field wants MMSTB and one wants MMrb, and the engine reports both in single barrels.

**The Ahmed influx.** Module 3 lesson 3, solved out of the combined material balance equation with the oil in place given as 10000000 stb. It is graded in barrels, not million barrels.

## Submitting

The capstone form is on the Learning Mode page. Enter each number at whatever precision you carried; every tolerance here is far wider than any rounding you could commit, so a miss is a setup error rather than a precision error.

Three things to check before you decide a field is wrong. The reD selector, for the third field. The denominator, for the fifth and sixth. And the units, for the first, second and fourth, where a factor of a million is one keystroke away.

## Exercise

Predict, before checking, what each of four setup errors does to each of the six fields: setting the reD selector to 10; using the infinite acting solution on the Dake run by omitting the radius ratio; dividing the Ahmed indices by gross withdrawal; and entering the Dake oil in place in stock tank barrels rather than million stock tank barrels.

Write which fields fail and in which direction for each, then verify two of your four predictions. Two of these errors move a pair of fields each, one moves a single field, and one moves a single field by a factor of a million rather than by a difference. Say which is which before you look, and say for each pair why the two fields travel together.
