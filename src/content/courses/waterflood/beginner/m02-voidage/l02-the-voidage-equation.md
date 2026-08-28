# The voidage equation

This lesson is the arithmetic core of the whole tier. Two expressions, one ratio, and a set of conventions that have to be stated. Everything later in the course is either an aggregation of this calculation or an interpretation of it.

## The two sides

Produced voidage is the reservoir volume that left the pore space in a period:

$$V_p = N_p B_o + W_p B_w + G_{\text{free}} B_g$$

where $N_p$ is stock tank oil, $W_p$ is produced water, and $G_{\text{free}}$ is the FREE produced gas, which is not the same as the produced gas. The next lesson is entirely about that distinction.

Injected voidage is the reservoir volume put back:

$$V_i = W_i B_w + G_i B_g$$

where $W_i$ is injected water and $G_i$ is injected gas.

The voidage replacement ratio is the ratio:

$$\text{VRR} = \frac{V_i}{V_p}$$

That is all of it. The subtleties are entirely in what goes into the symbols.

## The full worked month

January 2023 at Ekene. The period carries $N_p = 4727.034315745669$ stb, $W_p = 0$, $G_p = 1890.8137262982677$ Mscf, $W_i = 4789.431168713511$ bbl, $G_i = 0$. The frozen factor set is $B_o = 1.21584$, $B_w = 1.02$, $B_g = 0$, $R_s = 400$ scf/stb.

Solution gas first. Every stock tank barrel of oil carried 400 scf of dissolved gas in the reservoir, so the gas that came out of solution on the way to the tank is

$$\frac{R_s N_p}{1000} = \frac{400 \times 4727.034315745669}{1000} = 1890.8137262982677 \text{ Mscf}$$

which is exactly $G_p$. Every molecule of gas produced that month was solution gas. The free gas is therefore

$$G_{\text{free}} = \max(0,\ 1890.8137262982677 - 1890.8137262982677) = 0$$

Now the two sides:

$$V_p = 4727.034315745669 \times 1.21584 + 0 \times 1.02 + 0 \times 0 = 5747.317402456214 \text{ rb}$$

$$V_i = 4789.431168713511 \times 1.02 + 0 = 4885.219792087782 \text{ rb}$$

$$\text{VRR} = \frac{4885.219792087782}{5747.317402456214} = 0.85$$

Exactly 0.85, the designed target for the first month.

## A wet month for contrast

The last month, 2025-12, has water in it. $N_p = 3670.7384235169648$, $W_p = 962.9824550781937$, $W_i = 5605.427788705937$:

$$V_p = 3670.7384235169648 \times 1.21584 + 962.9824550781937 \times 1.02 = 5445.272709028624 \text{ rb}$$

$$V_i = 5605.427788705937 \times 1.02 = 5717.536344480056 \text{ rb}$$

$$\text{VRR} = 1.05$$

Notice what produced water does. It appears in the denominator, so a well that starts producing water increases the produced voidage and drives the VRR down, all else equal. To hold a target while water cut climbs, injection has to climb too. That is why mature waterfloods inject enormous volumes for modest oil: most of the injection is replacing the voidage created by the water it produced last month.

## The panel

{{panel:wf-ledger-explorer}}

The three lines are the same calculation at three time scopes. The cyan line is this month's VRR, the lime line is the trailing average over the window you choose, and the pink line is the running cumulative. Set the window to 1 and the lime line lands exactly on the cyan one, because a one-period trailing average is the period itself. That is worth doing once so that the rolling window stops being magic.

## Conventions that must be stated

Three choices are baked into the numbers above, and none of them is discoverable from the answer:

1. **Which pressure the factors were evaluated at.** Here, 2100 psia.
2. **Whether gas voidage is counted.** Here $B_g = 0$, so it is not.
3. **Whether the solution gas subtraction was applied.** Here it was, and for this fixture it happens to make no difference because there is no free gas at all.

A VRR quoted without those three is not reproducible. When you inherit someone else's flood ledger, these are the first three questions.

## The misconception to avoid

"Produced water in the numerator." It is a common slip, and it comes from thinking of VRR as a water balance. It is not. It is a VOIDAGE balance: what left the pore space against what was put back. Produced water left the pore space, so it belongs in the denominator alongside the oil. Only injected fluids appear on top.

## Exercise

First, take January 2023 and suppose the field had also produced 500 bbl of water that month, with everything else unchanged. Recompute the produced voidage and the VRR, then state how much extra water injection would have been needed to hold the 0.85 target.

Second, write down what the VRR would have been in January 2023 if the operator had reported the same volumes but evaluated $B_o$ at the initial 3200 psia instead of 2100 psia. Use the PVT line from the previous lesson and say whether the reported flood looks healthier or sicker.
