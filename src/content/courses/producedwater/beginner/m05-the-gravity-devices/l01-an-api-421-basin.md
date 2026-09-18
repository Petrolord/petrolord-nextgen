# An API 421 basin

The simplest treating device in this module is a box of water with the flow going through it. An API 421 basin removes the droplet that can rise the depth of the water in the time the water spends inside, and everything else about it follows from that sentence.

## The argument, in one line

Write that sentence as algebra and the depth cancels out of it. The droplet has further to rise in a deeper basin and it is given proportionally longer to do it, so what is left is the flow divided by the plan area. That quantity is the surface loading, it has units of velocity, and it is the rise velocity a droplet must beat to get out. Multiply it by an allowance for turbulence and short-circuiting, invert the rise balance at the result, and the cut size falls out.

## The UZERE basin, read through

Put the stream this tier follows through a basin of 10 by 2.6 by 1.4 m at the default allowance of 1.5. The surface loading is 0.001981679246 m/s. The design rise velocity the droplet must achieve is 0.002972518869 m/s, which is the loading with the allowance on it. Inverting the balance at that velocity gives a cut size of 165.003927 micron, and the droplet at that size sits at a Reynolds number of 0.714614, inside the band. The horizontal velocity through the basin is 0.014154851756 m/s against a fixed limit of 0.015000 m/s, and the water spends 706.471546 s in the vessel. The engine returns no warning on any of it.

## What that cut size means for this water

Hold that figure against the droplets. The UZERE population has a median of 26 micron and this basin catches half of what arrives at 165.003927 micron. The basin is therefore taking the coarse tail of the distribution and very little else, which is the honest answer for a plain gravity box on a real produced water stream. It is also why nobody treats produced water with one basin and stops. The basin earns its place by being cheap, by being robust to upsets, and by handing a much easier duty to whatever stands downstream of it.

## The published cases behind it

Four basin cases in the golden file exercise this device against published inputs, and the engine reproduces every one of them to six decimals: 44.331033 micron, 99.128864, 188.080643 and 54.820774. They are not a single comfortable case repeated, and they include one whose cut droplet sits outside the creeping flow band on purpose.

{{panel:pw-water-explorer}}

## Exercise

State in one sentence what an API 421 basin removes, and explain why the water depth cancels out of that statement. Then say what the 165.003927 micron cut size implies about how much of a 26 micron population this basin will take out.
