# Only free gas counts

The gas term in the voidage equation is the one people get wrong, and the reason is that the equation contains a subtraction that looks like it should not be there. This lesson explains the subtraction, shows what happens when it is left out, and gives you a way to remember which side of it you are on.

## The double-counting problem

Consider a stock tank barrel of Ekene oil. In the reservoir it occupied 1.21584 barrels of pore space, and part of the reason it was that large is that it had 400 scf of gas dissolved in it. On the way to the surface the gas came out, the oil shrank to one barrel, and the gas showed up at the gas meter as 400 scf of production.

Now count the voidage. The oil term $N_p B_o$ already includes the space that dissolved gas occupied, because $B_o$ is defined at reservoir conditions where the gas was still in solution. If you also add the metered gas as a separate voidage term, you have charged the reservoir twice for the same molecules.

The fix is to subtract the solution gas from the metered gas before converting:

$$G_{\text{free}} = \max\left(0,\ G_p - \frac{R_s N_p}{1000}\right)$$

with $G_p$ in Mscf, $R_s$ in scf/stb and the thousand converting between them. Only what is left over, the gas that came out of the rock as free gas rather than out of the oil, gets multiplied by $B_g$ and added to the produced voidage.

## Ekene has no free gas at all

The Ekene fixture is built so that this is exactly checkable. In January 2023:

$$\frac{R_s N_p}{1000} = \frac{400 \times 4727.034315745669}{1000} = 1890.8137262982677 \text{ Mscf}$$

and the reported $G_p$ is 1890.8137262982677 Mscf, the same number to the last digit. The subtraction gives zero, and the $\max(0, \cdot)$ is what keeps a tiny negative rounding from becoming a negative voidage.

That is not a coincidence in the data; it is a statement about the reservoir. Ekene stayed above its 2000 psia bubble point through the primary period and the flood arrived before it dropped through. No gas ever came out of solution in the rock, so there was never any free gas to produce. Every molecule at the gas meter had been dissolved in oil moments earlier.

This is why the ledger can set $B_g = 0$ without losing anything. There is no free gas for it to multiply.

## What it costs to get it wrong

Suppose someone read the same January 2023 numbers with a PVT set that had $B_g = 0.9$ rb/Mscf and $R_s = 0$, meaning "treat all produced gas as free". The subtraction disappears and 1890.8137262982677 Mscf of gas gets 0.9 reservoir barrels each:

$$V_p = 4727.034315745669 \times 1.21584 + 0 + 1890.8137262982677 \times 0.9 = 7449.049756124655 \text{ rb}$$

and the VRR drops from 0.85 to

$$\frac{4885.219792087782}{7449.049756124655} = 0.6558178495278708$$

The same field, the same month, the same meters, and a flood that was under-injecting by 15 percent now appears to be under-injecting by 34 percent. An operator reading that would increase injection substantially, chasing a deficit that does not exist.

## Gas as a solvent for the confusion

Here is the mental model that keeps it straight. $B_o$ is a container. It is sized to hold the oil AND everything dissolved in it, at reservoir conditions. Anything already inside that container must not be counted again outside it. Solution gas is inside. Free gas, which existed as a separate phase in the pores, is outside and must be counted separately.

The question "is this gas inside or outside" has a physical answer that depends on one thing: whether the reservoir pressure was below the bubble point. Above it, all gas is inside. Below it, some is outside and the subtraction starts doing real work.

## The injected side

Injected gas gets no subtraction. $G_i B_g$ goes in whole, because injected gas enters the reservoir as a free phase, occupying its own space. There is no container it is already inside. Gas injection is not part of the Ekene story, but the term is in the equation and you will meet fields where it dominates.

## The misconception to avoid

"The gas term is small so I can drop it." Sometimes true, and the way to know is to compute the subtraction, not to assume it. A field just below its bubble point produces a rapidly rising gas oil ratio, and the free gas term can grow to dominate the produced voidage within a year while the oil rate is still nearly flat. Dropping the term then makes the flood look far better than it is, at exactly the moment when the pressure is falling fastest.

## Exercise

First, a field produces 5000 stb of oil and 4,000,000 scf of gas in a month, with $R_s = 500$ scf/stb and $B_g = 0.8$ rb/Mscf. Compute the free gas and its contribution to produced voidage, then express that contribution as a percentage of the oil term if $B_o = 1.3$.

Second, using the same field, state what happens to the free gas term if the produced gas rises to 6,000,000 scf while everything else stays the same, and explain in one sentence what that rise physically means about the reservoir.
