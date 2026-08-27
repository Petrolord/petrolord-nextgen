# The simplest aquifer

The pot aquifer is the smallest honest thing you can say about a water leg. One equation, one unknown, no time in it, and it can be written down before you know anything about the aquifer except that it exists.

$$W_e = (c_w + c_f) \, W \, (p_i - p)$$

$W$ is the aquifer water in place in reservoir barrels, $c_w$ and $c_f$ are the same water and formation compressibilities the reservoir uses, and $p_i - p$ is the drawdown. That is the whole model. The engine computes it exactly that way: in the pot branch it sets each timestep's influx to the compressibility group multiplied by the aquifer water in place multiplied by that timestep's pressure drop.

## Where it comes from

The aquifer is treated as a second tank, sitting against the first, at the same pressure, containing nothing but water.

Drop its pressure by $\Delta p$. The water expands, by its compressibility multiplied by its own volume and the pressure drop. The pore space shrinks, by the formation compressibility multiplied by the same volume and the same pressure drop. Both push water out, and the aquifer has nowhere to send it but the reservoir.

$$\text{volume freed} = (c_w + c_f) \, W \, \Delta p$$

If that looks familiar, it should. It is the same physics as the rock and connate water term the Associate tier built, applied to a body of rock that happens to contain no oil.

## The grouping, and why it is a different grouping

Put the two compressibility groups side by side, because a learner arriving from the Associate tier will expect them to match and they do not.

| term | group | value on this data |
|---|---|---|
| reservoir rock and connate water, $E_{fw}$ | $S_{wi} c_w + c_f$ | 0.00000505000000000000 |
| aquifer influx, $W_e$ | $c_w + c_f$ | 0.00000700000000000000 |

The aquifer group is 1.38613861386139 times the reservoir group, and the difference is not a convention. It is a statement about what is in the pore space.

In the reservoir, only the fraction $S_{wi}$ of the pore volume is water, so the water compressibility acts on that fraction and enters weighted. In the aquifer the water saturation is one. All of the pore volume is water, so $S_w c_w$ is simply $c_w$ and the weight disappears. The formation compressibility is unweighted in both, because rock compacts everywhere regardless of what is sitting in the pores.

A second difference. The reservoir term carries a $1/(1 - S_{wi})$ and a $B_{ti}$, because the balance wants it per stock tank barrel of original oil. The aquifer term carries neither, because $W_e$ is wanted as a volume. Check the units: reservoir barrels multiplied by a reciprocal pressure multiplied by a pressure leaves reservoir barrels.

## What one free parameter buys

The pot model has exactly one adjustable quantity, $W$, which the engine's input block calls `initial_aquifer_water_in_place_rb`. Everything else in the influx equation is already known from the reservoir description.

That is remarkable economy, and it is why the pot aquifer survives as a screening tool despite everything lesson 3 will say against it. One number, and you have an influx history at every survey.

It is also why the model is dangerous, because a free parameter placed inside a regression is a free parameter the regression will fit. Lessons 2 and 4 are about what it does with it.

## How much water an aquifer actually gives up

Put numbers on the equation and one thing will surprise you.

Take the constructed tank from module 1, with a 20000000 rb aquifer, and work its influx history. The compressibility group multiplied by the aquifer water in place is $0.00000700000000000000 \times 20000000 = 140.000000000000$ reservoir barrels per psi, so the influx is that constant multiplied by each survey's drawdown:

| n | $\Delta p$ psi | $W_e$ rb |
|---|---|---|
| 1 | 162.261240122535 | 22716.5736171549 |
| 2 | 417.084938203389 | 58391.8913484745 |
| 3 | 637.857138863942 | 89299.9994409519 |
| 4 | 822.291312194102 | 115120.783707174 |
| 5 | 973.754391988592 | 136325.614878403 |
| 6 | 1103.99173733300 | 154558.843226620 |

By the last survey the aquifer has delivered 154558.843226620 rb. Express that as a fraction of the aquifer itself:

$$\frac{154558.843226620}{20000000} = 0.772794216133100 \ \text{percent}$$

Under one percent. Water is nearly incompressible and rock is nearly rigid, so even 1104 psi of drawdown squeezes only three quarters of a percent out of a body of water. That fraction does not depend on how big the aquifer is; it is $(c_w + c_f) \Delta p$ and nothing else.

Turn that around and you have the practical consequence. To supply meaningful volumes on this timescale, an aquifer has to be very large compared with the reservoir. The 20000000 rb aquifer above is 1.38888888888889 times the reservoir barrels of oil in the tank it supports, and it supplies about a third of the drive. To supply the whole of Ekene's last survey withdrawal of 317926.842484584 rb over the same drawdown would take an aquifer of 41139909.6741980 rb, nearly three times the 14567049.7289962 reservoir barrels of oil Ekene holds.

Nobody should find that implausible. Water legs commonly are orders of magnitude larger than the oil accumulations perched on them. But it does mean that a small fitted $W$ and a large fitted influx cannot both be true, and that is a sanity check you can run in one line.

## Worked example

An engineer reports that a tank has taken 60000 rb of water influx by the time its pressure has fallen 400 psi from initial, with $c_w = 0.000003$ and $c_f = 0.000004$ per psi. How big is the aquifer that pot model implies?

Rearrange and substitute:

$$W = \frac{W_e}{(c_w + c_f)\Delta p} = \frac{60000}{0.00000700000000000000 \times 400} = \frac{60000}{0.00280000000000000} = 21428571.4285714 \ \text{rb}$$

Twenty one and a half million reservoir barrels of water. Now do the thing that makes this a piece of engineering rather than a division. If the reservoir holds 5000000 stb of oil at a $B_{oi}$ of 1.2, that is 6000000 reservoir barrels of oil, and the implied aquifer is 3.57 times the oil volume. That is entirely ordinary. Had the same influx come from an implied aquifer of a hundred times the oil volume, or of a tenth of it, the number would be telling you that the model is absorbing something that is not water.

## Exercise

Work the influx history for a 5000000 rb pot aquifer over the same six drawdowns as the table above. Start by computing the constant $(c_w + c_f) W$ in reservoir barrels per psi, then multiply. Check your first and last answers against 5679.14340428873 rb and 38639.7108066550 rb.

Then answer two questions in words. First, the fraction of itself that this aquifer gives up at the last survey is identical to the 20000000 rb aquifer's fraction. Say why, from the equation, without computing anything. Second, a colleague proposes that the aquifer is 400000 rb, roughly the size of the withdrawal it is supposed to be supplying. Say what is wrong with that proposal in one sentence.
