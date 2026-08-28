# What VRR promises about pressure

Voidage replacement is a proxy. It is a very good proxy, it is cheap to compute from data you already have, and it is not the thing itself. The thing itself is reservoir pressure, and this module closes the loop by computing the pressure the Ekene ledger implies and checking whether the promise was kept.

## The promise, stated carefully

The claim behind voidage replacement is a material balance claim. A reservoir is a closed container of nearly incompressible fluid and rock. Take volume out and the remaining contents must expand to fill the space, which they can only do by dropping pressure. Put volume back and the contents are compressed again, and the pressure rises.

So: replace every reservoir barrel you remove, and the pressure holds. That is the promise. Written as a balance for an undersaturated oil reservoir with no aquifer and no gas cap:

$$N_p B_o + (W_p - W_i) B_w = N B_{oi} \left(c_o + c_{efw}\right) \Delta p$$

The left side is net withdrawal in reservoir barrels. The right side is what the tank gives up to supply it: the oil in place $N$, times its initial formation volume factor, times the total effective compressibility, times the pressure drop.

Set the left side to zero, which is what a VRR of exactly one on these conventions does, and $\Delta p$ is zero. Pressure holds.

## The compressibility term

$c_o$ is the oil compressibility, $1.2 \times 10^{-5}$ per psi for Ekene. $c_{efw}$ is the connate water and formation term, which the engine computes from the water and formation compressibilities and the initial water saturation:

$$c_{efw} = \frac{S_{wi} c_w + c_f}{1 - S_{wi}} = \frac{0.35 \times 3\times10^{-6} + 4\times10^{-6}}{0.65} = 7.76923076923077\times10^{-6} \text{ per psi}$$

Their sum, $1.976923076923077 \times 10^{-5}$ per psi, is the total effective compressibility. It is a small number, and its smallness is the entire reason waterflooding works. Multiply it by Ekene's 12139208.107496763 stb and its $B_{oi}$ of 1.2 and you get about 288 reservoir barrels of expansion per psi. Take out 288 rb without putting anything back and you have spent a psi.

That also tells you the scale of the pressure response you should expect. Ekene's whole 36 month flood carries a net surplus of 7738.498783101561 reservoir barrels, which at 288 rb per psi is roughly 27 psi of repressurization. The actual answer, computed properly in the next lesson, is 34.4931292839633 psi from the trough, and the difference between the two is worth understanding rather than glossing over.

## Why the proxy is worth having

Pressure is measured by shutting a well in and letting it build up, which costs production and takes days. Nobody does it monthly. Ekene's record has six flood-era pressure surveys in 36 months.

Voidage is computed from the allocation meters that run continuously anyway. It costs nothing extra and it exists at monthly resolution. A proxy that is available every month beats a measurement available twice a year, provided you keep checking the proxy against the measurement whenever the measurement arrives. That checking is what the rest of this module does.

## The three ways the promise breaks

**The reservoir is not closed.** An aquifer supplies water, or a gas cap expands, or fluid crosses a fault to a neighbour. Then the balance has terms the ledger cannot see, and the pressure will not follow the voidage.

**The conventions are not neutral.** The next lesson but one shows that Ekene's own conventions put pressure break-even at a VRR of 0.9869719699960521 rather than 1.0. The promise is kept, but not at the number you expected.

**The pressure is not one number.** A reservoir has a pressure field, not a pressure. Near an injector it is high, near a producer it is low, and the "tank pressure" the balance computes is an average that no gauge will ever read exactly. On a well connected sand that average is meaningful. On a compartmentalised one it is a fiction.

## The misconception to avoid

"If VRR is one and pressure is still falling, the VRR calculation is wrong." Sometimes. More often the reservoir is not the closed tank the balance assumes, and the pressure is telling you something the ledger structurally cannot: that fluid is leaving somewhere you are not measuring, or that the part of the reservoir your producers are draining is not the part your injectors are filling. That is information, not an error, and it is the single most valuable thing a pressure survey can tell you.

## Exercise

First, compute the reservoir barrels of expansion per psi for Ekene from $N B_{oi}(c_o + c_{efw})$, and use it to estimate the pressure change from the 7738.498783101561 rb surplus. Compare with the 34.4931292839633 psi quoted above and suggest one reason the simple estimate is low.

Second, a field holds a cumulative VRR of 1.00 for two years and its pressure falls 200 psi over that period. List three physical explanations, and for each name one measurement that would confirm or eliminate it.
