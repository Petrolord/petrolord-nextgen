# Reading the pD table

Three lessons have each taken one feature of the ratio between the bounded and the line source solutions. This one is about reading the whole column at once, because that is what you will actually do in front of a real aquifer: compute where your problem sits in dimensionless time, then look at what the two families are doing there and decide whether the difference is something you can ignore.

## The shape of the column

Here is the full sweep the panel plots, at $r_{eD}$ 5.

| tD | pD line source | pD finite | ratio |
|---|---|---|---|
| 0.05 | 0.000574120044316035 | 0.230067044098774 | 400.729858461673 |
| 0.1 | 0.0124579758814885 | 0.314234102016849 | 25.2235278833518 |
| 0.25 | 0.109691965000000 | 0.465928533480575 | 4.24760859631400 |
| 0.5 | 0.279886755436223 | 0.616825117756523 | 2.20383818017812 |
| 1 | 0.522141348689828 | 0.806338198206283 | 1.54429102431663 |
| 2 | 0.811712741277082 | 1.02004764769790 | 1.25666087992291 |
| 5 | 1.23394913648790 | 1.37833683634457 | 1.11701268357594 |
| 10 | 1.56825412848160 | 1.80855893114353 | 1.15323077956415 |
| 15 | 1.76686313479696 | 2.22547179278442 | 1.25956094105737 |
| 25 | 2.01896475466764 | 3.05835790311119 | 1.51481490503516 |
| 40 | 2.25209917806353 | 4.31198218870627 | 1.91465022087256 |
| 50 | 2.36304771266407 | 5.14233216847433 | 2.17614402828833 |
| 75 | 2.56494867317444 | 7.22552783016789 | 2.81702628428249 |
| 100 | 2.70837365292708 | 9.30886079703705 | 3.43706666433432 |

The ratio falls, reaches a floor, and climbs again. A fine numerical search puts the minimum at about 1.1118, near a $t_D$ of 6.06. The panel sweep does not carry that exact point, so the smallest value you can read off the tiles is the one at $t_D$ 5, which is 1.11701268357594, close enough for the purpose.

The two branches have nothing to do with each other. On the left, the falling branch is the point source idealisation dying out, and lesson 2 showed that it is indifferent to $r_{eD}$. On the right, the rising branch is the outer wall taking over, and lesson 3 showed that it is linear in $t_D$ with slope $2/(r_{eD}^2 - 1)$. The minimum is simply where the second overtakes the first. It is not a physical event and nothing special happens in the aquifer when you pass it.

You can confirm the split by dividing out the idealisation floor, which is what the same ratio reads for an effectively infinite aquifer. At $t_D$ 25 the floor is 1.02133856311489 and the $r_{eD}$ 5 ratio is 1.51481490503516, so the boundary is contributing a factor of 1.48316626801524, or 48.3166268015243 percent. At $t_D$ 50 the boundary contributes 115.307252422280 percent, and at $t_D$ 100 it contributes 241.873702563470 percent, against an idealisation contribution that has fallen to half a percent. Past the minimum, the column is essentially a pure boundary measurement.

## Where the minimum sits, and why you care

The floor moves with aquifer size, and so does its location. Running the same search at each of the panel's settings gives a minimum ratio of about 1.8096 near $t_D$ 1.21 at $r_{eD}$ 2, about 1.3162 near $t_D$ 1.56 at $r_{eD}$ 3, about 1.1118 near $t_D$ 6.06 at $r_{eD}$ 5, about 1.0309 near $t_D$ 20.98 at $r_{eD}$ 10 and about 1.0088 near $t_D$ 71.24 at $r_{eD}$ 20.

Two readings. The floor approaches one as the aquifer grows, which it must, because a very large bounded aquifer at moderate time is an infinite acting aquifer and the only thing separating it from the line source is the idealisation, which is itself dying. And the floor arrives later as the aquifer grows, because the wall takes longer to make itself felt. For a small aquifer there is barely a floor at all: at $r_{eD}$ 2 the best agreement the two families ever reach is a factor of 1.81, and outside a narrow window around $t_D$ 1 it is far worse than that.

That is the practical content of this table. If your aquifer is small, there is no region of the history where the unbounded solution is an acceptable substitute, so the question of whether to use the finite form does not arise. If your aquifer is large, there is a broad window in the middle of the history where the difference is a few percent and you may reasonably not care. The table tells you which of those two situations you are in.

## Worked example: locating Dake 9.2 on this curve

Module 2 works Dake Exercise 9.2, a wedge aquifer with $r_{eD}$ 5 and ten annual pressure surveys. Using the `aquiferInflux.js` dimensionless time coefficient of 0.0155402253700930 per day on 365 day years, the march visits these points, and this is the ratio it meets at each of them.

| year | tD | finite / line source |
|---|---|---|
| 1 | 5.67218226008394 | 1.11247888812149 |
| 2 | 11.3443645201679 | 1.17847497234367 |
| 4 | 22.6887290403358 | 1.45459202044814 |
| 6 | 34.0330935605037 | 1.75485193284668 |
| 8 | 45.3774580806716 | 2.05457728304385 |
| 10 | 56.7218226008395 | 2.35068916414175 |

Read that as a story. The first survey lands almost exactly on the floor of the curve, at 1.1124, which is as close as these two families ever come for this aquifer. By the end of the ten years the bounded solution is asking for 2.35 times the dimensionless pressure drop the unbounded one would give. So the finite correction is negligible in year 1, worth about eighteen percent by year 2, and worth more than a doubling by year 10. Any influx model that ignores the outer boundary on this field will look defensible for the first survey or two and then drift steadily away, which is precisely the behaviour that makes an early history match reassuring and a late one impossible.

## At the panel

{{panel:mb-pd-explorer}}

Keep the selector at $r_{eD}$ 5 and read the three ratio tiles across the top row, which are shown to six figures: 25.2235 at $t_D$ 0.1, 1.11701 at $t_D$ 5, 3.43707 at $t_D$ 100. Those three numbers are the left branch, the floor and the right branch of the curve you have just read. On the plot, put your eye on the vertical gap between the blue and orange curves and sweep left to right: wide, narrowing, narrowest a little past the middle, then widening again. That gap is the ratio column drawn as a picture.

## Exercise

Record the three ratio tiles at $r_{eD}$ 3 and again at $r_{eD}$ 10, six numbers in all. Then answer three questions.

First, for each of the two aquifers, say which of the three tiles is nearest the floor of its curve, and use the minimum locations quoted above to justify the answer. Second, an aquifer has $r_{eD}$ 10 and your ten year history spans $t_D$ 2 to $t_D$ 20. Using the numbers in front of you, argue either for or against using the infinite acting solution over that history, and state the largest error your argument tolerates. Third, the same aquifer is re-mapped and turns out to be $r_{eD}$ 3 rather than 10, with the dimensionless times unchanged. Say what happens to your recommendation and, in one sentence, why the re-mapping matters more at the end of the history than at the start.
