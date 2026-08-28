# Scaling to a target

The pattern ledger says the South element is at 0.61 and the target is 1.00. The obvious next question is how much more water. This lesson gives the engine's answer, which is deliberately the simplest defensible one, and is explicit about what that simplicity assumes.

## The rule

$$\text{scale} = \frac{\text{target VRR}}{\text{current VRR}}$$

and the recommended injection is the recent allocated injection times that scale. "Current" means the rolling VRR over a chosen window, not the instantaneous value and not the cumulative one.

For the South element at target 1.0 with a three-period window:

$$\text{current VRR} = 0.6082528252875008, \qquad \text{scale} = \frac{1.0}{0.6082528252875008} = 1.644053193714856$$

The recent allocated injection into the element averages 1631.9738070945923 barrels per period, so

$$\text{recommended} = 1631.9738070945923 \times 1.644053193714856 = 2683.051749612857 \text{ bbl per period}$$

An increase of a little over a thousand barrels a month.

For the North element at the same target:

$$\text{current VRR} = 1.240523853264427, \qquad \text{scale} = 0.8061110613621087$$

taking 3320.2225730545156 barrels per period down to 2676.4681423234074.

## Why rolling and not cumulative

Because you are setting a rate for next month, not settling a historical account.

Scaling on the cumulative VRR would try to correct the entire accumulated deficit in one step. The South element's cumulative VRR is 0.6097477559533482, close enough to its rolling value that the difference is small here, but on a field whose performance has changed the two can be far apart. A pattern that was badly under-injected for two years and has been on target for six months has a poor cumulative VRR and needs no change at all.

Scaling on the instantaneous VRR would chase a single month's noise. The window is the compromise, and choosing it is the same trade the Associate tier met: short reacts fast and is jumpy, long is stable and slow.

## What the rule assumes

**That VRR responds proportionally to injection.** Double the injection, double the VRR. That is exactly true of the arithmetic, since injected voidage is linear in $W_i$ and the denominator does not contain $W_i$ at all. It is not true of the reservoir over any length of time: more injection eventually means more produced water, which raises the produced voidage and lowers the VRR again. The rule is a one-step correction, not a steady-state solution.

**That the extra water goes where the allocation says.** The scale is applied to allocated injection, so it inherits the matrix entirely. If Ekene-5's real connection to Ekene-4 is weaker than 0.10, most of the recommended increment goes out of zone and the element's VRR barely moves.

**That the injectors can deliver it.** The rule is arithmetic and knows nothing about injectivity, pump capacity or fracture pressure. Module 4 is about the first of those.

## Why so simple

A more sophisticated rule is available: solve for the injection that drives the pattern to target while accounting for the produced water response, using a capacitance resistance model or a simulator. That is a real technique and it is better when you have the model.

The case for the simple rule is that it is transparent. Every number in it can be checked by hand in a minute, it has no fitted parameters, and when it is wrong you can see immediately which assumption broke. A recommendation that an operator can audit is worth more than one that is slightly better and opaque, particularly when the whole thing rests on an allocation matrix that is judgement anyway.

{{panel:wf-pattern-explorer}}

Move the target VRR slider and watch the scale and the recommended injection move with it. The relationship is exactly inverse-proportional to the current VRR, which is the whole rule.

## The misconception to avoid

"The recommendation is the answer." It is the arithmetic consequence of a target, an allocation and a window. It is an input to a decision, not the decision. The engine deliberately provides no opinion about whether the recommended rate is achievable, affordable, or wise; those are the next three conversations.

## Exercise

First, compute the recommended injection for the South element at a target of 1.1 rather than 1.0, using the same current VRR and baseline. Check your scale against the value 1.8084585130863418 that the engine reports for that target.

Second, the South element's recommendation raises its injection by about 64 percent. Estimate what that does to the FIELD cumulative VRR if the North element is left alone, using the field injected voidage of 229474.93559224083 rb and the South element's share.
