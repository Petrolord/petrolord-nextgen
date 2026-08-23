# The K coefficient

The SP deflection is a voltage; formation water resistivity is what we are after. The bridge between them is a single temperature-dependent coefficient, K, and it is worth a short lesson on its own because every millivolt of SSP is worth a different amount of salinity contrast at different temperatures.

## The relationship

The electrochemical potentials of lesson 1 grow with the logarithm of the salinity contrast between filtrate and formation water. Written in resistivity terms, the quicklook form of the SP equation is:

$$SSP = -K \log_{10}\!\left(\frac{R_{mfe}}{R_{we}}\right)$$

K is the number of millivolts the SSP moves for each factor of ten between the two resistivities. It is not a constant of nature; it rises with absolute temperature because the underlying potentials are thermodynamic. The engine uses the standard linear form, with temperature in degrees Fahrenheit:

$$K = 61 + 0.133\,T(\mathrm{degF})$$

The formula is one of the few places in the platform where a temperature must be supplied in degF: the coefficient was defined that way in the original literature, and the engine keeps it in its native units rather than converting the constants. The app's interface converts at the boundary and says so.

## Worked example

Evaluate K at the two temperatures this course actually uses, step by step.

At formation temperature, 180 degF:

1. Multiply: $0.133 \times 180 = 23.94$.
2. Add the constant: $61 + 23.94 = 84.94$.

So $K(180) = 84.94$ mV per decade. This is the value the typewell quicklook uses, because SSP is generated at formation temperature, so K must be evaluated there too.

At laboratory temperature, 75 degF:

1. Multiply: $0.133 \times 75 = 9.975$.
2. Add: $61 + 9.975 = 70.975$.

So $K(75) = 70.975$ mV per decade, about 16 percent smaller. The same salinity contrast produces a noticeably smaller deflection in a cool formation than in a hot one, which is why applying a room-temperature K to a deep hot well systematically distorts the derived $R_{we}$.

## What a decade of contrast looks like

The cleanest way to internalise K is the one-decade check. At 180 degF, suppose the formation water is exactly ten times more resistive-contrasted than the filtrate, that is $R_{mfe}/R_{we} = 10$. Then $\log_{10}(10) = 1$ and:

$$SSP = -84.94 \times 1 = -84.94\ \text{mV}$$

One decade of contrast, one K of millivolts. Flip it around: if you ever read an SSP of about $-85$ mV at 180 degF, you can say before touching a calculator that $R_{we} \approx R_{mfe}/10$. The typewell's reading of $-93$ mV is a little beyond one decade, so its $R_{we}$ must be a little below $0.62/10 = 0.062$ ohm.m. The exact arithmetic in the next lesson lands at 0.0498 ohm.m, right where this estimate says it should.

Two more anchor points help. An SSP of 0 mV means $\log_{10}(R_{mfe}/R_{we}) = 0$, so $R_{we} = R_{mfe}$: no deflection, no contrast. And half a K, about $-42$ mV at 180 degF, means half a decade, a factor of $10^{0.5} \approx 3.16$.

## Temperature discipline

The practical rule this lesson exists to plant: evaluate K at the temperature where the potential is generated, which is formation temperature, and make sure $R_{mfe}$ is quoted at that same temperature. The typewell brief hands you $R_{mfe} = 0.62$ ohm.m already at 180 degF, so the chain is consistent as given. In your own work the mud report usually quotes $R_{mf}$ at surface temperature, and you would Arps-correct it to formation temperature first, using exactly the technique of module 2. Temperature consistency across the inputs matters more than any refinement of the coefficient itself.

## Exercise

Compute K at 100 degF and at 200 degF, and then state the SSP you would expect at 200 degF for a formation whose water is exactly one hundred times saltier-contrasted than the filtrate ($R_{mfe}/R_{we} = 100$). As a self-check: $K(100) = 61 + 13.3 = 74.3$ mV; $K(200) = 61 + 26.6 = 87.6$ mV; two decades at 87.6 mV each gives $SSP = -175.2$ mV. Deflections that large are rare, which tells you most real contrasts sit within a decade or two.
