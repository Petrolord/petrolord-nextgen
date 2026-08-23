# Pickett plot theory

The previous lesson showed that in a water leg, Archie collapses to $R_t = a R_w / \phi^m$. This lesson turns that equation into a picture. The transformation is nothing more than taking logarithms, but the picture it produces, the Pickett plot, is one of the most used quality-control displays in petrophysics.

## Taking logs of Archie

Start from the water-leg form and take the logarithm of both sides:

$$\log R_t = \log(a R_w) - m \log \phi$$

Read this as the equation of a straight line. If you plot $\log \phi$ on the x axis and $\log R_t$ on the y axis, water-saturated points fall on a line whose slope is $-m$ and whose intercept, the value of $\log R_t$ where $\log \phi = 0$, is $\log(a R_w)$. Since $\log \phi = 0$ means $\phi = 1$, the intercept has a physical reading: extrapolate the water line to 100 percent porosity, and the resistivity you land on equals $a R_w$. A block of pure formation water has no rock matrix to obstruct the current, so its resistivity is the water's own, scaled by $a$.

In practice you do not compute logarithms by hand. You plot the raw values on log-log axes, porosity on x and deep resistivity on y, and the logarithmic graph paper does the work. Straight lines on that paper are power laws in the raw variables.

## What each feature of the plot means

* The water line. All samples at $S_w = 1$ fall on one straight line. Its steepness is $m$: a rock with $m = 2$ doubles its resistivity response faster than one with $m = 1.8$ as porosity falls.
* The intercept at $\phi = 1$. Equal to $a R_w$. Note carefully that the plot hands you the product, one number, not $a$ and $R_w$ separately. Any pair with the same product draws the same line: $a = 1$ with $R_w = 0.05$ and $a = 1.25$ with $R_w = 0.04$ are indistinguishable here. Separating them needs outside information, a laboratory measurement of the water or a regional $a$ convention, which is why this course reports the fitted product $a R_w$ as a single quantity.
* Points above the line. At a given porosity, adding hydrocarbon removes conductive water and raises $R_t$. Hydrocarbon-bearing samples therefore plot above the water line, and the vertical distance is a direct reading of saturation. The next lessons quantify that distance with iso-$S_w$ lines.

Points meaningfully below the line deserve suspicion rather than interpretation: shale conductivity, bad hole or a wrong porosity input are the usual culprits, because ordinary rock physics gives no way to be more conductive than the fully water-saturated case.

## Why this became the standard check

G. R. Pickett published the method in 1966 and extended it in 1973, and it earned its place for three reasons that still hold.

First, it uses only measured curves. Porosity and deep resistivity go in as they are; no saturation model, no shale correction, no prior parameter estimates. The plot is a check on the parameters, so it must not depend on them.

Second, it makes parameter errors visible as geometry. A wrong $m$ shows as a slope mismatch between your assumed line and the data trend. A wrong $R_w$ shifts the whole line up or down. Transition zones smear points diagonally between the water line and the reservoir cluster. Each failure mode has its own visual signature, and an experienced interpreter reads them at a glance.

Third, it degrades gracefully. Even without a clean water leg, the lower envelope of a large cloud of points often approximates the water line, because the wettest samples in every interval crowd toward it. That is a weaker fit and should be labelled as such, but it beats guessing.

## From picture to numbers

For the typewell the picture is deliberately simple: six water-leg samples that fall on a perfect line. The next lesson fits that line by least squares in log space and reads off the two numbers the capstone grades, the slope giving $m = 2.000$ and the intercept giving $a R_w = 0.0500$ ohm.m. Keep the theory of this lesson in mind as you fit: the slope is a claim about pore geometry, and the intercept is a claim about the water. The plot does not know which claim is wrong when the line misfits; that judgement is yours.

## Exercise

A water line on a Pickett plot passes through $R_t = 0.05$ ohm.m at $\phi = 1$ with slope $-2$. Without a calculator, state the water-line resistivity at $\phi = 0.1$ and at $\phi = 0.01$. As a self-check: each factor of 10 decrease in porosity multiplies $R_t$ by $10^m = 100$, so the line passes 5 ohm.m at $\phi = 0.1$ and 500 ohm.m at $\phi = 0.01$. Then explain in one sentence why a sample at $\phi = 0.1$ reading 20 ohm.m must contain hydrocarbon if the line is correct.
