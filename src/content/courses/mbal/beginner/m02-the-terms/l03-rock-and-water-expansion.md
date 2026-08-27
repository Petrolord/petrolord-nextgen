# Rock and water expansion

Oil expansion accounted for 192982.830457568 rb of the 317926.842484584 rb withdrawn from the Ekene tank by the last survey. Something supplied the missing 124944.012027016 rb, and in a closed undersaturated reservoir there is only one candidate left: the rock and the water that were never going anywhere.

The term is written $E_{fw}$, for formation and water, and it is the piece of the material balance equation that beginners are most likely to drop and most likely to regret dropping.

## Two physical effects, one term

**The rock compacts.** Pore space in a reservoir is held open against the weight of the overburden by the pressure of the fluid inside it. Produce that fluid, drop the pressure, and the grain framework takes more of the load. The pore volume shrinks. Shrinking pore volume pushes oil out just as surely as expanding oil does, and the property that measures it is the formation compressibility $c_f$, 0.000004 per psi for Ekene.

**The connate water expands.** Water at initial saturation fills 35 percent of Ekene's pore space and none of it flows: it is held immobile at irreducible saturation. But immobile is not the same as inert. As pressure falls, that water expands like any other fluid, at a water compressibility $c_w$ of 0.000003 per psi, and its expansion displaces oil into the space the oil is leaving.

Both effects do the same thing, both are proportional to the same pressure drop, and material balance bundles them into a single term.

## The formula

$$E_{fw} = B_{ti} \, (1 + m) \, \frac{S_{wi} c_w + c_f}{1 - S_{wi}} \, \Delta p$$

Take it apart piece by piece, because every factor is there for a reason.

$\Delta p$ is the drawdown from initial pressure. Both effects scale with it, which is why $E_{fw}$ grows linearly through a depletion history.

$S_{wi} c_w + c_f$ is the compressibility group, and it deserves a whole lesson to itself. The next one gives it one.

$1 / (1 - S_{wi})$ converts from pore volume to oil volume. The compressibility group describes what happens to the whole pore volume, but the balance is written per stock tank barrel of OIL, and oil occupies only the fraction $1 - S_{wi}$ of that pore space. Dividing by 0.650000000000000 scales the pore volume effect up onto the smaller oil volume that has to carry it.

$B_{ti}$ converts stock tank barrels of oil into the reservoir barrels the pore volume is measured in, so the term comes out in rb/stb like every other expansion.

$(1 + m)$ accounts for a gas cap, if there is one, because a gas cap sits in pore volume too and its rock and water expand as well. Ekene has $m = 0$, so this factor is 1 and disappears.

## Work the term

Collapse the constants first, since for a given tank they never change. For Ekene:

$$S_{wi} c_w + c_f = 0.35 \times 0.000003 + 0.000004 = 0.00000105 + 0.000004 = 0.00000505000000000000$$

$$B_{ti} \times 0.00000505000000000000 = 0.00000606000000000000$$

$$\frac{0.00000606000000000000}{1 - 0.35} = \frac{0.00000606000000000000}{0.650000000000000} = 0.00000932307692307692$$

That last number is the whole term reduced to a slope: 0.00000932307692307692 rb/stb per psi of drawdown. Now the last survey, where the drawdown is 1103.99173733300 psi:

$$E_{fw} = 0.00000932307692307692 \times 1103.99173733300 = 0.0102925998895969 \text{ rb/stb}$$

Stop and reproduce that slope on your own calculator before going on. Multiply 0.35 by 0.000003, add 0.000004, multiply by 1.2, divide by 0.65. If you land on 0.00000932307692307692 you have the structure right, and the rest of the term is one multiplication for any survey you like.

## What it is worth in barrels

A slope of nine millionths of a reservoir barrel per stock tank barrel per psi sounds like something you could safely ignore. Multiply it by the tank:

$$N \, E_{fw} = 12139208.1074968 \times 0.0102925998895969 = 124944.012027016 \text{ rb}$$

One hundred and twenty five thousand reservoir barrels supplied by compacting rock and expanding connate water. That is the missing volume the lesson opened with, and it is very close to two thirds of what the oil itself contributed. The next lesson puts a percentage on it that surprises almost everyone.

Notice also what this means about the tank's total compressibility. The rock and its immobile water together are stiffer than the oil per unit volume, but they occupy the whole pore space rather than just the oil fraction, and that is how a small compressibility ends up carrying a large share of the drive.

## The misconception, named

**"Connate water is immobile, so it does no work."** This is the reasoning that leads people to drop the term. It confuses flow with expansion. The connate water never moves toward a well and never appears in the produced water column, which stayed at zero for all six Ekene surveys. What it does is occupy less space at 3200 psia than it does at 2096.00826266700 psia, and that difference in space is oil that had to go somewhere.

**"cf is a rock property so it does not belong in a fluid balance."** Material balance is a VOLUME balance, not a fluid balance. Any mechanism that changes the volume available to the oil belongs in it. Compaction changes the container, so it counts.

## Exercise

Compute $E_{fw}$ at survey 4, dated 2022-01-01, whose drawdown is 822.291312194102 psi, using the slope of 0.00000932307692307692 rb/stb/psi. Check yourself against 0.00766628515676347 rb/stb.

Then redo the slope for a hypothetical tank identical to Ekene except that its initial water saturation is 0.25 rather than 0.35. Work out the compressibility group first, then divide by the new value of $1 - S_{wi}$. You should get a slope of 0.00000760000000000000 rb/stb/psi. Explain in one sentence why the slope fell even though the pore space now holds more oil, and notice that both of the factors you changed push the slope the same way.
