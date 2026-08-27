# After breakthrough

Breakthrough is a milestone, not a finish line. When the front arrives at the producer, water cut jumps and the easy part of the flood is over, but most floods produce oil for years afterwards. What changes at breakthrough is the arithmetic: before it, every barrel injected pushed a barrel of oil out; after it, some of each injected barrel short-circuits to the producer as water, and the question becomes how much extra oil each additional pore volume of injection still buys. Welge answered that question with the same tangent construction that located the front, extended past the front point.

## The relations

Pick any outlet saturation $S_{w2}$ above the front saturation. The Welge construction gives three numbers for the moment the outlet reaches that saturation:

$$Q_i = \frac{1}{f_w'(S_{w2})}$$

$$\bar{S}_w = S_{w2} + \frac{1 - f_w(S_{w2})}{f_w'(S_{w2})}$$

$$E_D = \frac{\bar{S}_w - S_{wc}}{1 - S_{wc}}$$

$Q_i$ is the cumulative injection in pore volumes, the reciprocal of the slope of the fractional flow curve at the outlet saturation. $\bar{S}_w$ is the average water saturation in the swept system, always higher than the outlet value because the inlet end has been flooding longer. $E_D$ converts that average into displacement efficiency: the fraction of the oil that was in place which has now been displaced.

At breakthrough itself the outlet saturation is the front saturation, 0.6372 on the Ekene curves, and the relations collapse onto the numbers you met in the previous module: $Q_i$ at breakthrough is 0.33077027444818546 pore volumes, the average behind the front is 0.6807702744481854, and the displacement efficiency is 0.5088773453049006. From the producer's point of view the arrival is abrupt. One day the well is making clean oil with a water fraction of zero; when the front lands, the water fraction jumps straight to the front value of 0.8682763300877854. There is no gentle ramp in the ideal one dimensional displacement. The shock carries the jump.

## Diminishing returns, quantified

The engine evaluates these relations at forty one outlet saturations between the front and residual oil and returns them as the recovery profile. Reading that profile at round injection volumes, and rounding deliberately because these are interpolated between profile rows rather than engine outputs at exactly those volumes, the displacement efficiency is about 0.534 at half a pore volume injected, about 0.565 at one pore volume, and about 0.586 at two pore volumes.

Set those beside the breakthrough figure. The first 0.33 pore volumes of injection displaced just under 0.509 of the oil. The next 1.67 pore volumes, five times as much injection, added roughly 0.077. That asymmetry is the economic heart of waterflooding: the tangent construction front-loads the recovery, and everything after breakthrough is bought at a steepening water cost. The fractional flow at the outlet tells you the price directly. By one pore volume injected the outlet fractional flow is around 0.976, meaning fewer than three barrels in a hundred produced are oil.

{{panel:sc-displacement-explorer}}

Open the panel and look at the recovery curve on the right hand side. Find breakthrough where the curve begins, then trace how flat it becomes as injection grows. Now raise the oil viscosity slider and watch both things move: breakthrough comes earlier in pore volumes, and the after breakthrough tail carries more of the total recovery. The shape of the tail is the fractional flow curve near residual, replotted.

## The average is not the outlet

Keep the two saturations separate in your head. The outlet saturation $S_{w2}$ is what the producing end of the system has reached. The average $\bar{S}_w$ is what the whole swept volume holds, and it is the average, not the outlet, that pays you: recovery is proportional to $\bar{S}_w - S_{wc}$. The gap between them, $(1 - f_w)/f_w'$, shrinks as the flood matures, because the outlet fractional flow climbs toward one and the numerator dies. At residual oil the two would meet.

## The honest small print

The forty one row profile is engine output; the values at half, one, and two pore volumes above are linear interpolations between neighbouring rows, quoted here to three figures on purpose. If you need a graded number, take it from an engine row, not from an interpolation. The other caution is about the derivative: the engine computes $f_w'$ numerically with a central difference, which is why the profile is a table of discrete rows rather than a formula. The next lesson shows what happens to $Q_i$ when that derivative gets small.

## Worked example

Rebuild the breakthrough row of the profile by hand from the tangent numbers. The tangent slope at the front is 3.023246274678918, so

$$Q_i = \frac{1}{3.023246274678918} = 0.33077027444818546 \text{ PV}$$

The average behind the front is the connate saturation plus that same number, 0.35 + 0.33077027444818546 = 0.6807702744481854, a special property of the breakthrough moment. The displacement efficiency follows as (0.6807702744481854 - 0.35) / 0.65 = 0.5088773453049006. One reciprocal, one addition, one ratio, and you have reproduced the first row of the engine's table.

## Exercise

Part one: using the relations above and the front values, show that at breakthrough the general formula for $\bar{S}_w$ reduces to $S_{wc} + Q_i$. Start from $\bar{S}_w = S_{w2} + (1 - f_w)/f_w'$ and use the fact that at the front the tangent from $(S_{wc}, 0)$ passes through $(S_{wf}, f_{wf})$.

Part two: in the panel, set oil viscosity to 5 cp and read the breakthrough displacement efficiency from the tiles. Compare it with the 1.8 cp value of 0.5088773453049006 and write one sentence on which flood leaves more of its recovery to the after breakthrough tail, and why the fractional flow curve says so.
