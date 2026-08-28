# The FVF convention

A formation volume factor is a function of pressure. A ledger needs a number. Bridging that gap is a choice, the choice has consequences, and the consequences are usually small and occasionally not. This lesson makes the choice explicit, because an unstated convention is the most common reason two engineers compute different VRRs from the same data.

## The three honest options

**Freeze at a representative pressure.** Pick one pressure that characterises the period, evaluate the factors there, and use them throughout. Ekene freezes at 2100 psia, giving $B_o = 1.21584$, $B_w = 1.02$, $B_g = 0$, $R_s = 400$.

**Track pressure period by period.** Attach a reservoir pressure to each period and read the factors off a PVT table at that pressure. More faithful, more machinery, and it requires a pressure history you trust.

**Use per-period overrides where you have them and a global set elsewhere.** This is what the Petrolord engine actually supports: any period may carry its own $B_o$, $B_w$, $B_g$ or $R_s$, and where it does not, the global set applies. That is the practical shape, because real records have good pressure data for some periods and none for others.

All three are defensible. None of them is discoverable from the answer, which is why the convention has to travel with the number.

## Where 1.21584 comes from

Ekene's PVT line for the undersaturated oil is

$$B_o(p) = B_{oi}\left(1 + c_o (p_i - p)\right) = 1.2\left(1 + 1.2\times10^{-5}(3200 - p)\right)$$

At the initial 3200 psia this gives exactly 1.2, which is the $B_{oi}$ the volumetric booking used, so the flood ledger and the volumetric booking are consistent by construction. At the frozen 2100 psia:

$$B_o = 1.2 \times \left(1 + 1.2\times10^{-5} \times 1100\right) = 1.2 \times 1.0132 = 1.21584$$

The choice of 2100 was made to be representative of the flood era. The actual pressure at the flood start was 2096.0082626669955 psia, and by the end of the record it had recovered to 2123.4461408278908 psia, so the flood-era pressure spans roughly 2089 to 2123. Freezing at 2100 puts the convention near the middle of that range rather than at either end.

## Why the choice is small here and might not be elsewhere

The whole flood-era pressure range is about 35 psi wide. Over 35 psi, $B_o$ changes by

$$1.2 \times 1.2\times10^{-5} \times 35 = 5.04 \times 10^{-4}$$

which is 0.04 percent of 1.216. A convention that is wrong by half the range is wrong by 0.02 percent in $B_o$, and the VRR inherits roughly that. Module 5 measures it properly by recomputing the whole ledger on a tracked $B_o$; the answer is 0.004486031110162436 percent, which rounds to nothing.

Now change one thing. Suppose the reservoir had fallen through its bubble point. Below the bubble point $B_o$ falls steeply with pressure as gas leaves solution, and $B_g$ rises steeply as the remaining gas expands. A 35 psi window near the bubble point can move $B_o$ by a percent and $B_g$ by several. Freezing then is not a rounding choice, it is a modelling assumption, and it should be stated in a sentence rather than buried in a spreadsheet cell.

## The water factor is not exempt

$B_w = 1.02$ looks like a formality, and it is the term most often set to 1.0 by accident. It multiplies the injected volume, which is the entire numerator of the VRR. Setting it to 1.0 when it should be 1.02 reduces the reported VRR by very nearly two percent, in the direction that makes an operator inject more. Two percent is small; two percent applied for three years to an injection budget is not.

## A checklist you can reuse

When you inherit a flood ledger, four questions settle the convention:

1. At what pressure were the factors evaluated, and is that pressure inside the period's actual range?
2. Is $B_g$ zero because there is no free gas, or zero because nobody filled it in?
3. Is $R_s$ populated, and does the solution gas subtraction actually fire on this data?
4. Do any periods carry overrides, and if so, do the overridden and non-overridden periods sit on the same PVT curve?

Question 2 is the one that catches people. A blank field and a physically justified zero look identical in a spreadsheet and mean opposite things.

## The misconception to avoid

"Freezing the factors is an approximation, so tracking them is more correct." Tracking is more correct only if your pressure history is more correct than your convention is wrong. Attaching a shaky pressure track to a ledger can inject more error than the frozen convention it replaced, and it does so invisibly, because the result now looks sophisticated. Prefer the simpler convention until you can demonstrate the pressure track is worth having, and then demonstrate it, as module 5 does.

## Exercise

First, compute $B_o$ on the Ekene PVT line at 2089 psia and at 2123 psia, and express the spread as a percentage of the frozen 1.21584. Compare that percentage with the 0.004486031110162436 percent effect on the cumulative VRR and explain why the VRR effect is smaller than the $B_o$ spread.

Second, write the one-line note you would attach to a reported cumulative VRR so that a reader could reproduce it. It should fit on one line and answer all four checklist questions.
