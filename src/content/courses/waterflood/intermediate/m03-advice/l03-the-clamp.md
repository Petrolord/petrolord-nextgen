# The clamp

Ask the engine to take the South element from its current 0.6082528252875008 to a target VRR of 3.0 and it does not return the arithmetic answer. It returns a scale of exactly 2.0, and a flag saying `clamped: true`. This lesson is about that clamp: what it is, why it exists, and why reporting it matters more than the clamp itself.

## The rule

$$\text{scale} = \min\left(2.0,\ \max\left(0.5,\ \frac{\text{target}}{\text{current}}\right)\right)$$

A recommendation may at most double an injector's rate or halve it. Anything outside that gets pulled to the boundary, and the returned object carries `clamped: true` so the caller knows the reported scale is not the arithmetic one.

At a target of 3.0 on the South element the raw scale would be $3.0 / 0.6082528252875008 = 4.93$. Clamped to 2.0, the recommended injection becomes $1631.9738070945923 \times 2 = 3263.9476141891846$ barrels per period, with both injectors' shares doubled.

## Why a clamp at all

Because a step change of more than a factor of two in an injector's rate is not an operational instruction; it is a project.

Doubling an injector means the pump, the lines, the water treatment and the disposal capacity all have to carry double. It means the injection pressure rises, and whether it stays below the formation parting pressure is now a real question. It means the near-wellbore region sees a step change in velocity, which can mobilise fines. None of that is impossible, and all of it needs more than a valve turn.

A tool that cheerfully recommends quadrupling a rate is not being more accurate; it is producing a number outside the domain where "recommendation" means anything.

## Why the flag matters more than the clamp

Any bound is arbitrary at the edges. Someone will reasonably argue that 2.0 is too tight or too loose, and they may be right for their field.

What is not arbitrary is that the caller must be able to tell the difference between "the arithmetic says 2.0" and "the arithmetic said 4.93 and we capped it". Those two situations call for completely different responses. The first is a normal recommendation. The second is a statement that the pattern is so far from target that no single-step correction will get there, and the honest next move is to plan a multi-step ramp or to question the target.

Silently returning 2.0 in both cases would hide exactly the information that distinguishes them. The flag is the feature; the specific bound is a parameter.

{{panel:wf-pattern-explorer}}

Push the target slider to its maximum on the South element and watch the scale tile stop at 2 and the clamped label appear. Then bring the target back down until the label disappears, and note the target at which it does. That is the largest target this element can be given as a single-step recommendation.

## Where the boundary sits for Ekene

The South element at a current rolling VRR of 0.6082528252875008 hits the upper clamp when

$$\frac{\text{target}}{0.6082528252875008} = 2.0 \implies \text{target} = 1.2165056505750016$$

so any target above about 1.2165 gets clamped. The realistic targets, 1.0 and 1.1, are both well inside, at scales of 1.644053193714856 and 1.8084585130863418.

The North element at 1.240523853264427 would need a target below $0.5 \times 1.240523853264427 = 0.6202619266322135$ to hit the lower clamp, which no one would ask for. In practice the clamp only fires on badly starved patterns.

## The asymmetry

The bounds are 0.5 and 2.0, which are reciprocal, so the clamp is symmetric in ratio terms. It is not symmetric in consequence. Halving an injector is operationally easy and reversible: close a valve. Doubling it may be physically impossible with the installed equipment. If you were tuning these bounds for a specific field, the argument for a tighter upper bound than lower bound is a real one.

## The misconception to avoid

"The clamp makes the recommendation conservative and therefore safe." A clamped recommendation is not a conservative version of the right answer; it is a truncated one, and following it will leave the pattern short of target by however much was truncated. Treat a clamped result as a flag that the situation needs a plan rather than a setting, not as a safe number you can act on and forget.

## Exercise

First, compute the target VRR at which the North element's recommendation would hit the lower clamp, and say whether any operator would ever set it.

Second, the South element is clamped at a target of 3.0. Design a two-step ramp that reaches a target of 2.0 without either step being clamped, and state the VRR the element must reach after step one for step two to be legal.
