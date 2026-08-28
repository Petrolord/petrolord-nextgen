# Mixing rules and BIPs

The equation is for a pure substance. A reservoir fluid is a mixture, and the step from one to the other is where a fitted parameter enters.

## The problem

Peng-Robinson gives a and b for a pure component from its critical properties. A mixture has no critical properties in that sense, so it needs values of a and b that represent the mixture.

## The van der Waals one-fluid rules

$$b_m = \sum_i x_i b_i, \qquad a_m = \sum_i \sum_j x_i x_j \sqrt{a_i a_j}\,(1 - k_{ij})$$

The covolume mixes linearly, which is intuitive: molecular volumes add.

The attraction mixes quadratically, over every PAIR, because attraction is between two molecules. The geometric mean of the two pure attractions is the natural first guess for how strongly an i attracts a j.

## What the binary interaction parameter is

The kij correction on that geometric mean.

If molecules i and j attract each other exactly as the geometric mean predicts, kij is zero. Real pairs deviate, particularly between molecules of very different size or polarity, and kij is fitted to binary phase-equilibrium data for that pair.

It is a fitted parameter with a physical role, and it is small: typical hydrocarbon-hydrocarbon values are a few hundredths.

## Where they matter

**Methane against the heavy end.** The largest size difference in the mixture, and the pair whose kij matters most for a black oil's saturation pressure.

**Nitrogen and carbon dioxide against hydrocarbons.** Different polarity, larger values, and they matter whenever the non-hydrocarbon content is non-trivial.

**Hydrocarbon against hydrocarbon, similar sizes.** Usually near zero and often set to zero.

## What the engine carries

A published table for the library components, from Whitson and Brule's Monograph 20.

For the C7+ pseudo-component there is no published table, because the pseudo-component does not exist until it is characterized. The engine uses a modified Chueh-Prausnitz correlation for the C1 to C7+ pair, and treats nitrogen, carbon dioxide and hydrogen sulphide against the pseudo by reusing the table's heaviest column, nC6, as a heavy-paraffin convention. Other hydrocarbon pairs against the pseudo are zero.

Each of those is a decision. The engine's documentation records that a different published choice was investigated and could not be verified in any accessible source, so the modified Chueh-Prausnitz was shipped instead and the substitution written down.

That is the right way to handle an unverifiable reference: use something you can cite, and say that you did.

## Why the C1 to C7+ BIP is a tuning knob

Because it is the least constrained number in the mixing rules and the most influential.

It governs how strongly methane and the heavy fraction attract, which governs how readily methane leaves the liquid, which governs the saturation pressure. And it is a correlation applied to a pseudo-component rather than a fitted value for a real pair.

The Expert tier's second knob is exactly this parameter, and it is a knob for exactly this reason.

## The misconception to avoid

"Binary interaction parameters are small so they can be set to zero." Small in magnitude and large in effect for the pairs that matter. Setting the methane to heavy-end kij to zero moves the saturation pressure substantially, which is precisely why the regression is allowed to adjust it. A parameter's importance is not its size.

## Exercise

First, write the two mixing rules and say why one is linear and the other quadratic.

Second, explain in two sentences why the C1 to C7+ binary interaction parameter is a reasonable thing to tune, and name two other parameters that would not be.
