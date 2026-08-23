# The Archie equation

This lesson assembles the pieces from the previous two into the single most used equation in petrophysics. Archie's relationship converts a resistivity reading, a porosity and an $R_w$ into water saturation. It is worth building it in two steps rather than memorising the final formula, because each step carries its own physical meaning.

## Step 1: the formation factor

Start with a rock that is fully water bearing, $S_w = 1$. Its resistivity, written $R_0$, is higher than the brine resistivity $R_w$ alone, because the insulating grains force the current to wind through the pore network. The ratio of the two is the formation factor:

$$F = \frac{R_0}{R_w} = \frac{a}{\phi^m}$$

The formation factor depends only on the pore geometry. Archie found empirically that it follows a power law in porosity. The exponent $m$ is called the cementation exponent: it describes how tortuous the electrical paths are. A loose sand with straightforward pore connections has $m$ near 1.8; a well cemented or more complex rock pushes $m$ toward 2.2 or higher, because cement pinches the pore throats and forces longer current paths. The constant $a$ is a fitting factor usually close to 1. The typewell givens are $a = 1$ and $m = 2$, the classic textbook pair for a consolidated sandstone.

With those values, a sand of porosity 0.21 has $F = 1/0.21^2 = 22.7$: the water filled rock is about 23 times more resistive than the brine it contains.

The product $F R_w$ predicts what the rock should read when wet. This wet-rock prediction, $R_0 = F R_w$, is the baseline that everything else is judged against.

## Step 2: the resistivity index

Now let hydrocarbons displace part of the brine. The measured true resistivity $R_t$ rises above $R_0$. Archie's second empirical finding is that the ratio follows a power law in water saturation:

$$\frac{R_t}{R_0} = S_w^{-n}$$

The saturation exponent $n$ describes how the remaining brine stays connected as it is displaced. In a water-wet rock the brine clings to grain surfaces and keeps a connected film, and $n$ comes out near 2. The typewell given is $n = 2$.

Solve for $S_w$ and substitute $R_0 = a R_w / \phi^m$:

$$S_w = \left( \frac{a\, R_w}{\phi^m\, R_t} \right)^{1/n}$$

That is the working form. With the typewell givens ($a = 1$, $m = 2$, $n = 2$) it reduces to a square root, which makes hand checks quick.

## Worked example at 2020 m

Take the typewell sample at 2020.0 m, in the heart of SAND_A. The inputs are:

| Quantity | Value | Source |
|---|---|---|
| $\phi$ | 0.2100 | density porosity, module 3 |
| $R_t$ | 9.2554 ohm.m | deep resistivity curve |
| $R_w$ | 0.05 ohm.m | given, at formation conditions |
| $a$, $m$, $n$ | 1, 2, 2 | givens |

Work through it step by step:

1. $\phi^m = 0.2100^2 = 0.0441$
2. $\phi^m R_t = 0.0441 \times 9.2554 = 0.40824$
3. $\dfrac{a R_w}{\phi^m R_t} = \dfrac{0.05}{0.40824} = 0.12248$
4. $S_w = 0.12248^{1/2} = 0.3500$

Water saturation is 0.35, so hydrocarbon saturation is $1 - 0.35 = 0.65$. Nearly two thirds of the pore space at this depth holds hydrocarbons.

It is worth also computing the wet baseline. $R_0 = a R_w / \phi^m = 0.05 / 0.0441 = 1.134$ ohm.m. The sand actually reads 9.2554 ohm.m, a resistivity index of about 8. A clean sand reading eight times its wet baseline is unambiguous pay. Carrying both numbers, the prediction and the measurement, is a good habit: the ratio between them is where the saturation information lives.

## Reading the equation

A few practical observations fall straight out of the algebra:

- $S_w$ scales as $\sqrt{R_w}$ when $n = 2$. Doubling $R_w$ multiplies every saturation by 1.41. This is why the previous lesson insisted on pinning $R_w$ down.
- $S_w$ scales as $1/\sqrt{R_t}$. Resistivity has to change by a factor of four to move saturation by a factor of two, which is why the log is displayed on a logarithmic scale.
- Porosity enters as $\phi^m$ inside the bracket, so with $m = 2$ and $n = 2$ the result scales as $1/\phi$. An optimistic porosity gives an optimistic (too low) $S_w$ twice over: once through the porosity itself and again through the saturation. Errors compound along the workflow.

## Exercise

Using the typewell givens ($R_w = 0.05$, $a = 1$, $m = 2$, $n = 2$), compute $S_w$ for a sample with $\phi = 0.15$ and $R_t = 5$ ohm.m. Work the steps in order: $\phi^m$, then $\phi^m R_t$, then the ratio, then the square root. Check yourself: $\phi^m = 0.0225$, $\phi^m R_t = 0.1125$, ratio $= 0.4444$, $S_w = 0.667$. With the pay cutoff at $S_w \le 0.6$, this sample would fail the saturation test even though it is a decent porosity sand.
