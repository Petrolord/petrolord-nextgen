# More than one mechanism

Every tank in this course so far has had one story. Ekene depleted, and its rock and connate water helped. The Professional tanks imported water, and the argument was about how fast. A combination drive reservoir runs several of those stories at once, and the arithmetic that separates them is the last piece of classical material balance you have not met.

The equation does not change. That is the first thing to be clear about, because the phrase combination drive suggests something more elaborate than what is actually happening:

$$F = N \left( E_o + m E_g + E_{fw} \right) + W_e$$

Four suppliers on the right. The oil expanding, the gas cap expanding down onto it, the rock and connate water squeezing in, and water arriving from an aquifer. You have met all four separately. What is new is that they are all live at once, they are all competing for the same withdrawal, and none of them can be dropped as negligible without an argument.

## What actually gets harder

The algebra is not harder. The identification is.

With one mechanism, a single number falls out of a slope and there is nothing to argue about. With four, the equation has as many unknowns as you choose to leave unknown, and every one of them buys the same currency: reservoir barrels of voidage filled. Give the gas cap more room and the aquifer needs to supply less. Get the rock compressibility wrong and the oil expansion absorbs the error. Nothing in the equation tells you which supplier deserves the credit. That has to come from outside: a map that sizes the gas cap, a geological argument that sizes the aquifer, a lab report that fixes the compressibilities.

This is why the classical worked examples of combination drive all give you something. They give you the oil in place, or they give you the gas cap ratio, or they give you both and ask only for the water. The published example this module works, Ahmed Example 11-1, gives you $N$ and $m$ and asks for $W_e$. That leaves exactly one unknown in an equation with one equals sign, and the answer is a subtraction rather than a fit.

Do not read that as a limitation of the example. Read it as the shape of the real problem. When you cannot be told $N$, you must recover it from a regression, and a regression can only separate two terms to the extent that they vary differently across your surveys. The Professional tier showed you what happens when they do not: six surveys collapse onto one point and the split between oil and aquifer becomes arbitrary. Adding a gas cap term to that regression adds a third way to be wrong.

## The published case

| given | value |
|---|---|
| $N$ | 10000000 stb |
| $m$ | 0.25 |
| $p_i$ | 3000 psia |
| $p$ at the second survey | 2800 psia |
| reservoir temperature | 150 F |
| $N_p$ | 1000000 stb |
| $G_p$ | 1100000000 scf |
| $W_p$ | 50000 stb |
| $S_{wi}$ | 0.2 |
| $c_w$ | 0.0000015 per psi |
| $c_f$ | 0.000001 per psi |

| PVT | at 3000 psia | at 2800 psia |
|---|---|---|
| $B_o$ rb/stb | 1.58 | 1.48 |
| $R_s$ scf/stb | 1040 | 850 |
| $B_g$ rb/scf | 0.0008 | 0.00092 |
| $B_t$ rb/stb | 1.58 | 1.655 |

One pressure step, 200 psi of drawdown, ten percent of the oil produced. Notice what the PVT is doing across those 200 psi. The oil formation volume factor falls from 1.58 to 1.48 because gas is coming out of solution, while the two phase factor $B_t$ rises from 1.58 to 1.655 because that liberated gas takes up room. Below the bubble point those two numbers pull in opposite directions, and $B_t$ is the one the balance uses.

## Worked example: the underground withdrawal

Start where every material balance starts, with what came out. For an oil tank with free gas,

$$F = N_p \left[ B_t + B_g (R_p - R_{si}) \right] + W_p B_w$$

The produced gas oil ratio is cumulative gas over cumulative oil:

$$R_p = \frac{1100000000}{1000000} = 1100.00000000000 \ \text{scf/stb}$$

Against an initial solution gas oil ratio of 1040 scf/stb, that is an excess of 60.0000000000000 scf for every stock tank barrel produced. That excess is gas which was free in the reservoir rather than dissolved in the produced oil, and it occupied reservoir volume on its way out. Convert it at the current $B_g$:

$$N_p B_g (R_p - R_{si}) = 1000000 \times 0.00092 \times 60 = 55200.0000000000 \ \text{rb}$$

The oil and its dissolved gas take the two phase factor:

$$N_p B_t = 1000000 \times 1.655 = 1655000.00000000 \ \text{rb}$$

And the produced water, at $B_w = 1.0$ rb/stb, contributes 50000.0000000000 rb. Add them:

$$F = 1655000 + 55200 + 50000 = 1760200.00000000 \ \text{rb}$$

That is the hole in the reservoir, in reservoir barrels, at the second survey. Everything the rest of this module does is decide who filled it.

Keep the produced water in view. It is inside $F$ because it genuinely came out of the reservoir, and the next lessons will need to take it back off again for a reason that has nothing to do with whether it belongs here. It belongs here.

## Exercise

Rework the withdrawal for a version of this field that produced less gas. Hold everything else at the published values and set $G_p$ to 1000000000 scf.

Compute the produced gas oil ratio, the gas term $N_p B_g (R_p - R_{si})$, and the total withdrawal $F$. You should find a gas term of $-36800.0000000000$ rb and a withdrawal of 1668200.00000000 rb.

Then answer two questions in a sentence each. First, what does a negative gas term mean physically, given that the oil at 2800 psia still holds 850 scf/stb in solution? Second, if you now solved the same balance for water influx with the four expansion terms untouched, by exactly how much would the answer move, and why is that number equal to the change in $F$ rather than merely related to it?
