# The gradient

The gradient is the slope of the reflection against $\sin^2\theta$. It is the quantity that carries information a stacked section cannot, and it is where the shear velocity finally enters.

## The two values

$$B_{brine} = -0.16766246414664518, \qquad B_{gas} = -0.2565633444602355$$

Both negative, meaning both reflections become more negative with offset. The gas case is steeper by 53 percent.

## The formula

$$B = \frac{1}{2}\frac{\Delta v_p}{\bar{v}_p} - 2\left(\frac{\bar{v}_s}{\bar{v}_p}\right)^2\left(\frac{\Delta \rho}{\bar{\rho}} + \frac{2\Delta v_s}{\bar{v}_s}\right)$$

Three contributions: the compressional contrast, the density contrast, and the shear contrast. All three are weighted, and the last two share a factor of $(\bar{v}_s/\bar{v}_p)^2$, which is roughly 0.33 for these rocks.

## Why the gradient is negative for both cases

Look at the shear term. $\Delta v_s$ is positive in both cases, because the sand is stiffer in shear than the shale. It enters with a factor of $-4(\bar{v}_s/\bar{v}_p)^2$, so a positive shear contrast drives the gradient negative.

That is the usual situation at a shale over sand interface. Shales have low shear stiffness, sands have more, so the shear contrast is positive and the gradient is negative almost regardless of what fluid is in the sand.

The fluid changes how negative, not whether.

## Why the gas case is steeper

Two of the three contributions move when the fluid changes, and they move in the same direction.

The shear contrast grows, from 406 m/s to 496.98 m/s, because the gas case has a higher shear velocity. A larger positive shear contrast makes the gradient more negative.

The density contrast grows in the negative direction, from -200 to -411.29 kg/m3. That enters as $-2w\Delta\rho/\bar{\rho}$ with $w$ positive, so a more negative density contrast makes the gradient less negative. It works the other way.

The compressional contrast shrinks, from 457 to 162.70 m/s, which makes the gradient less negative too.

Two of the three push toward a shallower gradient and one toward a steeper one, and the shear term wins. The next lesson is about how comprehensively it wins.

## What the gradient is for

A stacked section shows something close to the intercept. Two rocks with the same impedance contrast produce the same stack amplitude regardless of what else differs between them.

The gradient distinguishes them, because it depends on the shear contrast and the stack does not. That is the whole reason for looking at gathers rather than stacks in a fluid study.

It is also why the AVO technique needs the shear velocity in the model. A forward model built without a shear estimate can predict a stack amplitude and cannot predict a gradient, which means it cannot predict the thing the technique measures.

## Reading it off the panel

The gradient is the slope of each curve near the left of the chart.

{{panel:rp-avo-explorer}}

Both curves fall to the right, which is both gradients being negative. The amber gas curve falls faster, which is its steeper gradient.

The gradient tiles read -0.167662 and -0.256563. Note that neither curve is a straight line on this chart, because the horizontal axis is angle rather than $\sin^2\theta$, and because the curvature term is present in what is drawn.

## Worked example

Compute the weighting factor and see how much it suppresses the last two terms.

For the gas case, $\bar{v}_s = (1394 + 1890.9758806113214)/2 = 1642.4879403056607$ and $\bar{v}_p = 2824.3486140148097$.

$$w = \left(\frac{1642.4879403056607}{2824.3486140148097}\right)^2 = 0.338195462$$

So the density and shear contrasts enter with a factor of $-2 \times 0.338195462 = -0.676391$, and the shear contrast is doubled inside the bracket, giving it an effective weight of $-1.352782$.

That is why the shear term dominates: it carries about 2.7 times the weight of the compressional term's $\tfrac{1}{2}$, before any contrast is considered.

## Exercise

State what happens to the gradient at a shale over sand interface where the sand and shale have the same shear velocity, and give an example of when that might occur.

Self check: the shear contrast term vanishes, and the gradient reduces to the compressional and density terms, which for a typical shale over sand interface leaves it small and possibly positive. That can occur in a very shaly sand, where the sand's shear stiffness has been reduced toward the shale's by clay content, which is one reason a shaly sand can show a muted or reversed AVO response even when it holds hydrocarbon.
