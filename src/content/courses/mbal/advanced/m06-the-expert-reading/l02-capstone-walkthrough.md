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
| Ahmed 11-1 depletion drive index, net convention | none | 0.002 | module 3 lesson 4, and below |

This lesson does not hand you six answers. It takes two of them all the way through on worked examples beside the graded cases, by panel and by hand, and points at the lesson that owns each of the rest. The six values are yours to produce.

## Worked example one: the dimensionless pressure drop, by tile and by formula

{{panel:mb-pd-explorer}}

The panel has exactly one control, a selector labelled **Aquifer radius ratio reD**, offering reD 2, 3, 5, 10 and 20; it opens on 10. Only one of them is the graded case: the Dake aquifer has an outer radius five times the reservoir radius, so for the capstone the selector must read `reD = 5 (Dake 9.2)`. Work the method here on reD 3, then run it on 5.

The tile labelled **pD finite at tD 100** gives the value to nine significant figures, against a tolerance of 0.05 on the graded case. Now earn it, because a number you can only read is a number you cannot defend.

**The asymptote first.** Once a bounded circular aquifer has felt its outer boundary everywhere, it depletes at a uniform rate and its dimensionless pressure drop climbs linearly with dimensionless time:

$$p_D \to \frac{2 t_D}{r_{eD}^2 - 1} + \ln(r_{eD}) - 0.75$$

At reD 3 the first term is $200/8 = 25$. The second group is on the panel: the tile labelled **ln(reD) - 0.75** reads 0.348612289, the same group that sits in the denominator of the Fetkovich productivity index, for the same physical reason. Add them and the asymptote is 25.34861228866811, which is what the tile labelled **PSS asymptote at tD 100** shows and what the dashed yellow line on the chart is drawing.

**Then the real solution.** The graded kind of number is not the asymptote. It is the bounded circle van Everdingen and Hurst constant terminal rate solution, obtained by Stehfest inversion of the radial Laplace form; at reD 3 and tD 100 it is 25.577955313403997, a little above the asymptote and running parallel to it. Read that as a sanity check on both tiles: the solution should be a little above the straight line. Module 1 lesson 3 showed that the offset is a property of $r_{eD}$, so at reD 5 expect a different, smaller offset.

**And the family it is not.** The tile labelled **tD 100, finite / line source** compares the bounded solution with the line source at the same dimensionless time, 2.70837365292708. A bounded aquifer delivers water at a much larger dimensionless pressure drop, which means far less water per psi of drawdown. Module 1 established the direction and it is the whole reason this field is graded.

**The one way to fail this field.** Not arithmetic. The selector. The panel opens on reD 10, and every other setting misses the 0.05 tolerance by a wide margin. If this field fails, check the selector before you check anything else.

## Worked example two: the water drive index, and the convention that decides it

{{panel:mb-tank-explorer}}

Start at the tank panel on its default setting, `None (the truth)`, and look at one tile: **Drive indices sum**. On Ekene it reads 1.00000000000000.

That tile is the reason this capstone field exists. The engine forms every index over gross withdrawal $F$ and folds the produced water into the numerator of the water index. Ahmed apportions net withdrawal $A = F - W_p B_w$ instead. On Ekene no water has been produced, so $A$ and $F$ are the same number and the two conventions are indistinguishable. Five modules of this course went by without the question arising, and this tile is why.

Ahmed Example 11-1 produced 50000 stb of water, and now the conventions separate. Work it on module 3's variant, with the oil in place at 9200000 stb; the capstone asks for the published case.

**Step one, the produced gas ratio.** The case produced 1000000 stb of oil and 1100000000 scf of gas, so

$$R_p = \frac{1100000000}{1000000} = 1100.00000000000 \ \text{scf/stb}$$

**Step two, the underground withdrawal.** At 2800 psia the two phase formation volume factor is 1.655 rb/stb and the gas formation volume factor is 0.00092 rb/scf, and the initial solution gas ratio was 1040 scf/stb:

$$F = N_p \left[ B_t + B_g (R_p - R_{si}) \right] + W_p B_w$$

$$F = 1000000 \times \left[ 1.655 + 0.00092 (1100 - 1040) \right] + 50000 = 1760200.00000000 \ \text{rb}$$

**Step three, the net withdrawal.** The water you produced back comes off the top before you ask what drove the rest:

$$A = F - W_p B_w = 1760200.00000000 - 50000.0000000000 = 1710200.00000000 \ \text{rb}$$

**Step four, the index.** Take the water influx the balance requires, 519194.75 bbl on the variant, subtract the water produced back, and divide by the net withdrawal:

$$WDI = \frac{W_e - W_p B_w}{A} = \frac{469194.75}{1710200} = 0.27435080692316716$$

On the published case the same four steps give the graded value, which agrees with the book's printed four decimals to within one unit in the last place. Do not tighten that comparison further. Ahmed divided a rounded influx by a rounded withdrawal, so a tight relative tolerance would be a test of his rounding rather than of the physics.

**The trap, priced.** Divide by gross $F$ instead and the variant's influx gives 0.2665576354959666, 0.0078 away, far outside a 0.002 tolerance. The depletion drive index goes with it: the oil expansion term $N E_o$ over the same net withdrawal, moved by the same factor $A/F$ when the gross denominator is used. The four indices then sum to 0.9715941370298828 instead of 1. And that sum is not a closure failure. It is exactly $A/F$, the two denominators divided, which is what module 3 proved.

## Where the other three come from

**The Dake oil in place and the Dake influx.** Module 2 lesson 3, the Carter-Tracy run on the Exercise 9.2 performance history with the radius ratio set to 5: the tank explorer's Dake mode with Carter-Tracy, finite. Both fields come from the same run, so if one is wrong they usually both are, and the usual cause is the aquifer geometry rather than the method. Watch the units: one field wants MMSTB and one wants MMrb, and the engine reports both in single barrels.

**The Ahmed influx.** Module 3 lesson 3, solved out of the combined material balance equation with the published oil in place of 10000000 stb (the lesson worked it at 9200000). It is graded in barrels, not million barrels.

## Submitting

The capstone form is on the Learning Mode page. Enter each number at whatever precision you carried; every tolerance here is far wider than any rounding you could commit, so a miss is a setup error rather than a precision error.

Three things to check before you decide a field is wrong. The reD selector, for the third field. The denominator, for the fifth and sixth. And the units, for the first, second and fourth, where a factor of a million is one keystroke away.

## Exercise

Predict, before checking, what each of four setup errors does to each of the six fields: setting the reD selector to 10; using the infinite acting solution on the Dake run by omitting the radius ratio; dividing the Ahmed indices by gross withdrawal; and entering the Dake oil in place in stock tank barrels rather than million stock tank barrels.

Write which fields fail and in which direction for each, then verify two of your four predictions. Two of these errors move a pair of fields each, one moves a single field, and one moves a single field by a factor of a million rather than by a difference. Say which is which before you look, and say for each pair why the two fields travel together.
