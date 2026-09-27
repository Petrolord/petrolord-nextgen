# A floor on the safety factor

{{panel:materials-stock-calculator}}

A cycle service level below one half asks for a reorder point below the mean demand over the protection period, so the safety factor and the safety stock come out negative. Whether a policy allows that is a decision, so a floor on the safety factor is a stated input: a number, or null for no floor.

## A level below one half

At a cycle service level of 0.5, k is exactly zero and the reorder point equals the mean demand. Below 0.5, k is negative. On the weekly data of the lecture 11 check, a demand over the lead time of 500 with sigma 258.088834, a cycle service level of 0.4 gives an exact k of -0.253347.

## With a floor of 0

With the floor stated as 0, the engine holds k at the floor. The safety stock is 0.000000 and the reorder point is the mean demand. The engine's reason, verbatim:

> a cycle service level of 0.4 gives k = Phi^-1(0.4) = -0.253347; below the stated minimum 0, so k = 0; safety stock 0 over a demand of 500 with sigma 258.088834 gives the reorder point s 500, held as 500 (up to a multiple of 1)

## With no floor

With the floor stated as null, the engine uses the negative k as it is. On the same data with no rounding, the reason, verbatim:

> a cycle service level of 0.4 gives k = Phi^-1(0.4) = -0.253347; safety stock -65.386058 over a demand of 500 with sigma 258.088834 gives the reorder point s 434.613942, held as 434.613942 (no rounding)

The reorder point sits below the mean demand over the lead time, and the policy expects to run short in more cycles than not.

## The floor is stated

A call that leaves the floor out is refused by name:

> minimumSafetyFactor must be a stated number or null for no floor; got undefined

Both answers have their place. A floor of 0 says the store never plans below the mean demand over the lead time. No floor says the stated level is the whole policy, as it may be for a cheap item whose shortage costs little. The floor acts only when k would fall below it: at the choke bean set's 0.95, k is 1.644854 and a floor of 0 changes nothing.

The vocabulary keeps its meaning here: the safety stock is k times sigma, whatever its sign, and a negative one is a stated choice written in the policy.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "A floor on the safety factor". Read k exact, k as used, the safety stock and the reorder point, and the reason naming the floor.

Now type null into the control "Safety factor floor (stated; type null for no floor)". Read k as used, the safety stock -65.386058 and the reorder point 434.613942, and note the held level under the case's rounding rule. Then set the floor to not stated and read the refusal.

Finally restore the floor to 0 and set the control "Service level (stated)" to 0.5. Confirm that k exact is 0.000000.
