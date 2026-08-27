# Bt and the bubble point

The oil expansion term is not built from the oil formation volume factor. It is built from the two phase formation volume factor, and on a tank that stays above its bubble point the difference between them vanishes. That is why the Associate tier could work Ekene without ever meeting $B_t$. This lesson introduces it, shows why it collapses, and then shows what the engine substitutes when the collapse is the only thing holding your answer up.

## The two phase factor

$B_o$ answers a narrow question: one stock tank barrel of oil, brought to reservoir pressure and temperature, occupies how many reservoir barrels? Below the bubble point that is no longer the whole story, because some of the gas that was dissolved in that barrel at the start is now sitting in the reservoir as free gas, and it is still part of the original barrel's account. $B_t$ covers both phases:

$$B_t = B_o + B_g (R_{si} - R_s)$$

The bracket is the gas that has come out of solution since the start, in scf per stock tank barrel, and multiplying it by the gas formation volume factor in reservoir barrels per scf converts that gas to the reservoir volume it now occupies. The units work, and the engine's own comment on the line says so.

Above the bubble point nothing has come out of solution. $R_s$ equals $R_{si}$, the bracket is zero, and

$$B_t = B_o \quad \text{exactly}$$

The oil expansion, which is defined as $E_o = B_t - B_{ti}$, is then pure oil expansion. No gas term, no gas deviation factor, no gas formation volume factor. That is the situation the whole Ekene tank sits in.

## Ekene never crosses the line

The fixture's bubble point is 2000 psia. The initial pressure is 3200 psia and the lowest survey pressure, at 2023-01-01, is 2096.00826266700 psia. The tank is undersaturated at every survey, with 96.0082626669955 psi still to spare at the last one.

So $R_s$ holds at 400.000000000000 scf/stb across the whole history, the two phase factor equals the oil factor everywhere, and the oil expansion at the last survey is a subtraction you can do in your head:

$$E_o = 1.215897481017595 - 1.2 = 0.0158974810175951 \ \text{rb/stb}$$

That is the number the Associate capstone graded, and this is where it comes from. It is one barrel of oil swelling as the pressure on it falls, and nothing else.

## What the engine does above the bubble point when nothing was supplied

Now take the per-row values away, as lesson 2 did. The row no longer qualifies for level one, the pressure is above the bubble point, and the engine reaches this branch:

$$B_o = B_{ob}\left(1 - c_o (p - p_b)\right)$$

$B_{ob}$ is the oil formation volume factor at the bubble point, and $c_o$ is the compressibility of the undersaturated oil. Read the source and you find that $c_o$ is not sourced from your case at all. It is a hard coded constant of $1 \times 10^{-5}$ per psi, and the comment beside it calls it exactly what it is: an undersaturated oil compressibility placeholder, with a note that the proper correlation will land when a later phase needs it.

The Ekene fixture's own design compressibility, the one its pressure history was built from, is $1.2 \times 10^{-5}$ per psi. The placeholder is 16.6666666666667 percent below it.

## Worked example: the placeholder decides the answer

Here is the result that makes this the most important caveat in the module.

Lesson 2 ran Ekene without per-row values twice, once with the laboratory table working and once with no table at all. The laboratory table recovered the oil formation volume factor at the last survey to 1.21611131062021 rb/stb against a true 1.21589748101760, a difference of 0.0175861539277053 percent. The correlation managed only 1.25041043403039, off by 2.83847557475905 percent. One of those two is a good number and the other is not.

They return the same oil in place. 13296089.9738367 stb with the table, 13296089.9738372 stb without it.

The algebra explains it in three lines. Above the bubble point the withdrawal is $F = N_p B_{ob}(1 - c_o(p - p_b))$, because no gas or water is produced. The oil expansion is $E_o = B_{ob}(1 - c_o(p-p_b)) - B_{ob}$, since the engine takes $B_{ti}$ at the bubble point too. And the rock and water term carries $B_{ti}$ as its scale, so it is $B_{ob}$ times a function of pressure as well. Every quantity on both axes of the Havlena and Odeh plot is proportional to $B_{ob}$, so $B_{ob}$ cancels out of the slope completely.

What does not cancel is $c_o$. It is the only thing left setting the shape of $B_o$ against pressure, and the shape is what a slope reads.

So on an undersaturated tank with no per-row fluid properties, the oil in place the engine returns is governed by a placeholder constant. A laboratory table does not rescue it: the table is consulted for the level of $B_{ob}$, and the level cancels. Buying a better $B_{ob}$ buys you nothing here.

This is why supplying per-row or laboratory fluid properties is not a nicety. Between a traceable answer and one resting on a stand-in constant, the difference on Ekene is 1156881.86634040 stb, and the fit statistic never drops below 0.999999978398381.

## Exercise

First, confirm the collapse. Write out $B_t = B_o + B_g(R_{si} - R_s)$ for Ekene's survey of 2022-07-01 and evaluate every term. State in one sentence why you did not need to look up a gas formation volume factor to do it.

Second, work the placeholder by hand. Using $c_o = 1 \times 10^{-5}$ per psi and a bubble point of 2000 psia, compute the factor $(1 - c_o(p - p_b))$ at the initial pressure of 3200 psia and at the last survey pressure of 2096.00826266700 psia. Then redo both with the fixture's design compressibility of $1.2 \times 10^{-5}$ per psi.

Finally, answer this in two sentences. If a colleague proposes to fix the correlation run by buying a laboratory measurement of $B_o$ at the bubble point, what do you tell them, and what would you buy instead?
