# Two solution families

The Professional tier gave you two aquifer models and taught you what a wrong one costs. This module supplies the piece you need before you can choose between them on a real field: the mathematics of how a body of water gives up its pressure when it has an outer wall, and the mathematics of how it does so when it does not. Those are two different problems with two different solutions, and the engine keeps both. They live in `engines/aquifer/aquiferInflux.js` under the names `pD` and `pDFinite`, and the single most common mistake an engineer makes with them is to assume that the second is the first with a boundary bolted on.

## What each function actually is

`pD(tD)` is the line-source solution. Read the source and it is one line of arithmetic:

$$p_D(t_D) = \tfrac{1}{2} E_1\!\left(\frac{1}{4 t_D}\right)$$

where $E_1$ is the exponential integral, evaluated in the engine by the Abramowitz and Stegun rational approximations. The word that matters is line. This solution comes from shrinking the producing body to a line of zero radius and asking what the pressure field does around it. There is no reservoir radius in the equation. There is no aquifer radius either. There is only $t_D$, so the entire geometry of the problem has been thrown away except for the scaling that $t_D$ carries.

`pDFinite(tD, reD)` is a different animal. It is the van Everdingen and Hurst constant terminal rate solution for a bounded circle: an aquifer of dimensionless outer radius $r_{eD}$ with a no flow wall at that radius, producing into a reservoir of finite radius at the centre. The engine does not approximate it with a polynomial. It builds the Laplace space form from the scaled Bessel functions used by the well test radial model, applies a closed circle outer boundary at $r_{eD}$, and inverts it numerically by the Stehfest algorithm. Twelve Laplace evaluations per point, four Bessel functions each. If you hand it an $r_{eD}$ of one or less it gives up and returns the line source instead, which tells you plainly that the two are not interchangeable in general.

So one function knows about a wall and an inner radius, and the other knows about neither. That is a difference in the problem being solved, not a difference in a setting.

## The evidence that they are different families

If `pDFinite` were `pD` with a boundary added, the two would agree at early time and part company only when the pressure disturbance reached the wall. The numbers do the opposite. Here is the engine at $r_{eD} = 5$, which is the Dake Exercise 9.2 aquifer you will meet in module 2.

| tD | pD line source | pD finite, reD 5 | finite / line source |
|---|---|---|---|
| 0.1 | 0.0124579758814885 | 0.314234102016849 | 25.2235278833518 |
| 1 | 0.522141348689828 | 0.806338198206283 | 1.54429102431663 |
| 5 | 1.23394913648790 | 1.37833683634457 | 1.11701268357594 |
| 25 | 2.01896475466764 | 3.05835790311119 | 1.51481490503516 |
| 100 | 2.70837365292708 | 9.30886079703705 | 3.43706666433432 |

The worst disagreement in the whole table is the first row, at the earliest time, when no pressure signal has been anywhere near the outer wall. A factor of twenty five. Whatever is causing that, it is not the boundary.

The clean proof is to vary $r_{eD}$ and watch that first row refuse to move. At $t_D$ of 0.1 the ratio comes out at 25.2238601437433 for an aquifer of $r_{eD}$ 2, at 25.2235331808131 for $r_{eD}$ 3, at 25.2235278833518 for $r_{eD}$ 5, at 25.2235278884121 for $r_{eD}$ 10 and at 25.2235278854392 for $r_{eD}$ 20. Take the aquifer out to $r_{eD}$ 200, which is effectively infinite, and it is still 25.2235278874633. Six aquifers with outer radii spanning a factor of a hundred, and the early time disagreement with the line source is identical to seven significant figures. A boundary effect cannot behave like that. What you are looking at is the price of pretending the reservoir is a point, and that price is paid at early time whether or not there is a wall anywhere.

Later in the table the ordering reverses. By $t_D$ 25 and $t_D$ 100 the ratio climbs again, and there it really is the boundary: the bounded aquifer has felt its wall, has started to deplete, and its pressure drop is running away from the unbounded solution. Two mechanisms, opposite ends of the table, one shared column. Lesson 4 takes that column apart properly.

## Worked example: reading the first row

Take $t_D = 0.1$ at $r_{eD} = 5$. The line source gives $E_1(1/0.4) = E_1(2.5)$, halved, which the engine returns as 0.0124579758814885. The bounded solution at the same dimensionless time returns 0.314234102016849. The difference is 0.301776126135361 in dimensionless pressure, and the ratio is 25.2235278833518.

Now ask what that means physically. $p_D$ is a dimensionless pressure drop, so the line source is claiming that after this much elapsed time the drawdown at the contact is only four percent of what the bounded model says it is. An aquifer described by the line source at that moment would appear to be delivering water almost for free. It is a modelling artefact: at $t_D$ 0.1 the disturbance from a point source has barely spread at all, whereas a real reservoir of finite radius has been draining across its whole circumference since time zero.

## At the panel

{{panel:mb-pd-explorer}}

The panel opens at $r_{eD} = 5$. The horizontal axis is logarithmic in $t_D$, which is the only way to see both ends of this behaviour at once. The blue curve is the line source, the orange curve is the bounded circle at the selected $r_{eD}$, and the yellow dashed line is the pseudo steady state asymptote that lesson 3 is about.

Read the tile marked **tD 0.1, finite / line source**. The tiles round the ratios to six figures, so it reads 25.2235, the full engine value being 25.2235278833518. Now move the **Aquifer radius ratio reD** selector through its five options, 2, 3, 5, 10 and 20, and watch that tile. It moves once, to 25.2239 at $r_{eD}$ 2, and otherwise not at all. Watch the tile marked **tD 100, finite / line source** at the same time: it runs from 24.7316 at $r_{eD}$ 2 down to 1.01241 at $r_{eD}$ 20, which are the values 24.7315675449140 and 1.01240501395299. One tile is blind to the aquifer size and the other is dominated by it. That contrast is the whole lesson.

## Exercise

Set the panel to $r_{eD} = 2$ and write down all three ratio tiles. Then set it to $r_{eD} = 20$ and write them down again. Answer three questions in writing.

First, which of the three tiles changed least between the two settings, and what does that tell you about the origin of the disagreement it reports? Second, the tile at $t_D$ 100 changed by more than a factor of twenty. Name the physical mechanism responsible and say why it cannot be the same mechanism as the one in the first tile. Third, at $r_{eD} = 2$ the tile marked **ln(reD) - 0.75** reads a negative number, $-0.0568528194$. Without doing any arithmetic yet, say what a negative value in that group would do to a Fetkovich productivity index built on the same group, and therefore what kind of aquifer geometry that group is entitled to describe.
