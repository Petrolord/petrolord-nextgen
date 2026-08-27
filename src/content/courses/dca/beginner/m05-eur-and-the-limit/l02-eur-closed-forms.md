# EUR closed forms

You now have a limit. This lesson turns it into a volume. There is one formula per decline model, all three are short enough to work on paper, and all three say the same sentence in different algebra: EUR is the cumulative production evaluated at the moment the rate reaches the limit.

That sentence is worth holding on to, because it means you already derived these formulas in module 3. The cumulative curves are there. EUR just stops reading them at a particular rate instead of at a particular date.

## Exponential: the rate drop divided by the decline

Module 3 gave the exponential cumulative in two equivalent forms, and the second one is the useful one here:

$$N_p = \frac{q_i - q}{D_i}$$

Cumulative equals the rate drop divided by the decline. Substitute the limit rate for the current rate and the cumulative becomes the ultimate:

$$EUR = \frac{q_i - q_{limit}}{D_i}$$

Ekene-1, primary window, exponential, $q_i = 120$ stb/d and $D_i = 0.0012$ per day, at the 10 stb/d limit:

$$q_i - q_{limit} = 120 - 10 = 110 \text{ stb/d}$$

$$EUR = \frac{110}{0.0012} = 91666.6666666667 \text{ stb}$$

Ninety one thousand, six hundred and sixty seven barrels, and it took one subtraction and one division. Notice what it is not. The ceiling of this well, $q_i / D_i = 100000$ stb, is the volume it would deliver if you produced it forever at no cost. The EUR is 8333.33333333333 stb less than that, which is 8.33333333333333 percent of the ceiling left in the ground because nobody will pay to lift it. Confusing the ceiling with the EUR is the first error this module wants to prevent.

## Harmonic: a logarithm, and no ceiling to fall back on

The harmonic cumulative grows like a logarithm, so the harmonic EUR carries one:

$$EUR = \frac{q_i}{D_i}\ln\!\left(\frac{q_i}{q_{limit}}\right)$$

Ekene-5, $q_i = 100$ stb/d, $D_i = 0.0015$ per day, limit 10 stb/d:

$$\frac{q_i}{D_i} = \frac{100}{0.0015} = 66666.6666666667$$

$$\frac{q_i}{q_{limit}} = \frac{100}{10} = 10, \qquad \ln 10 = 2.30258509299405$$

$$EUR = 66666.6666666667 \times 2.30258509299405 = 153505.672866270 \text{ stb}$$

Ekene-5 starts lower than Ekene-1 and declines faster at first, and it still books 1.67460734035931 times the volume. The whole difference lives in the tail, where a harmonic rate falls off slowly enough to keep contributing barrels for a very long time.

There is no ceiling term to lean on here, because there is no ceiling. Follow Ekene-5 out to 60000 days and the cumulative is 300723.967101123 stb; out to 600000 days it is 453567.017173889 stb, still climbing. That is the divergence lesson 1 warned you about, and it is why for a harmonic well the limit is not a refinement of the answer, it is the reason there is an answer.

## Hyperbolic: the general case

For $0 < b < 1$,

$$EUR = \frac{q_i^{\,b}}{D_i(1-b)}\left(q_i^{\,1-b} - q_{limit}^{\,1-b}\right)$$

It looks heavier than it is. The leading fraction is a constant you compute once from the fit. The bracket is where the limit enters, and it is the only part that moves when the limit moves.

Ekene-3: $q_i = 150$ stb/d, $D_i = 0.002$ per day, $b = 0.5$, so $1 - b = 0.5$ and both powers are square roots.

$$\frac{q_i^{\,0.5}}{D_i(1-b)} = \frac{12.2474487139159}{0.002 \times 0.5} = \frac{12.2474487139159}{0.001} = 12247.4487139159$$

$$q_i^{\,0.5} - q_{limit}^{\,0.5} = 12.2474487139159 - 3.16227766016838 = 9.08517105374751$$

$$EUR = 12247.4487139159 \times 9.08517105374751 = 111270.166537926 \text{ stb}$$

Ekene-6 next, with $q_i = 90$ stb/d, $D_i = 0.001$ per day, $b = 0.35$, so $1 - b = 0.65$:

$$\frac{90^{0.35}}{0.001 \times 0.65} = \frac{4.83041982711865}{0.00065} = 7431.41511864408$$

$$90^{0.65} - 10^{0.65} = 18.6319208725352 - 4.46683592150963 = 14.1650849510256$$

$$EUR = 7431.41511864408 \times 14.1650849510256 = 105266.626461929 \text{ stb}$$

Stop here and do the Ekene-6 chain yourself before reading on. Three keystrokes get you 4.83041982711865 and 18.6319208725352; the rest is one division, one subtraction and one multiplication. If you land on 105266.6 you have the formula working, and you have booked a hyperbolic well by hand, which most people never do.

One structural note worth carrying: the exponential formula is not a separate rule, it is what the hyperbolic formula becomes as $b$ goes to zero, and the harmonic formula is what it becomes as $b$ goes to one. Three formulas, one family.

{{panel:dca-fit-explorer}}

Set the panel to each well in turn, primary window, auto-select, and compare the EUR at 10 stb/d tile against the four numbers above. They agree to every digit, because the fits recover the planted parameters exactly and the tile runs the same closed form you just ran.

## The misconception this lesson exists to kill

Say the four numbers out loud: 91666.6666666667, 111270.166537926, 153505.672866270 and 105266.626461929 stb. It is tempting to read them as facts about four pieces of rock. They are not. Each one is a fact about a decline model, a fitted parameter set and a commercial limit, and the limit came from a price, a cost and a fiscal split. Change the price next quarter and every one of these numbers changes while the rock sits there unmoved. Never write an EUR without the limit beside it, and never let a reader treat it as a measurement.

## Exercise

Ekene-1's operator renegotiates its water handling contract and the economic limit falls from 10 stb/d to 8 stb/d. Recompute Ekene-1's EUR by hand with the exponential closed form, then compute how many extra barrels the new contract books and what fraction of the well's 100000 stb ceiling is still left below the new limit. Do the same for Ekene-5 with the harmonic form, using $\ln(100/8)$, and write one sentence explaining why the same 2 stb/d change in the limit is worth so much more on Ekene-5 than on Ekene-1.
