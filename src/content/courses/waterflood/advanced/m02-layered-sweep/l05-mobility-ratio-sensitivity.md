# Mobility ratio sensitivity

The mobility ratio enters this course three times: it sets the displacement efficiency in the SCAL construction, it sets the vertical sweep through the Dykstra-Parsons frontal positions, and it sets the areal sweep through the five-spot correlation in the next module. This lesson isolates the vertical contribution and asks what changing $M$ is actually worth.

## Where $M$ comes from

$$M = \frac{k_{rw,\max}/\mu_w}{k_{ro,\max}/\mu_o}$$

For Ekene, endpoints 0.3 and 0.9 with viscosities 0.5 and 1.8 cp give exactly 1.2. That number was constructed in the SCAL course and this course imports it.

Only two of the four inputs are ever adjustable in practice. The endpoints are rock properties. The oil viscosity is a reservoir property. The WATER viscosity is the one lever, and raising it is what a polymer flood does.

## The vertical sweep sensitivity

Coverage at first breakthrough on the Ekene column:

| $M$ | coverage | change from $M = 1.2$ |
|---|---|---|
| 0.5 | 0.582878889525386 | +0.06818815442605086 |
| 1.0 | 0.5283542009271434 | +0.013663465827808197 |
| 1.2 | 0.5146907350993352 | 0 |
| 2.0 | 0.4814021171236619 | -0.033288617975673285 |
| 5.0 | 0.44357724095944917 | -0.07111349413988599 |

Read the shape. Halving the mobility ratio from 1.2 to 0.5 buys about 6.8 coverage points. Quadrupling it from 1.2 to 5 costs about 7.1. The response is compressed: a factor of ten in $M$ moves the coverage by less than 14 points in total.

That compression is worth internalising. Vertical sweep is dominated by the permeability distribution, and the mobility ratio modulates it. A column with $V = 0.5$ will lose roughly half its coverage at first breakthrough no matter what you do to the fluids.

## The water oil ratio sensitivity

| $M$ | WOR at 1st BT | multiple of the $M = 0.5$ value |
|---|---|---|
| 0.5 | 0.7293534481099888 | 1 |
| 1.0 | 0.9829435665757289 | 1.35 |
| 1.2 | 1.099451244867303 | 1.51 |
| 2.0 | 1.6079096864163949 | 2.20 |
| 5.0 | 3.7041953452008216 | 5.08 |

Here the response is not compressed at all. A factor of ten in $M$ produces a factor of five in the water oil ratio at first breakthrough.

So the mobility ratio hurts mainly through the water it brings, not through the rock it fails to sweep. That is the practical shape of an unfavourable flood: you reach a similar fraction of the column, and you pay far more to do it.

## Where Ekene sits

$M = 1.2$ is a mildly unfavourable flood, close enough to unity that most of the sensitivity above is hypothetical for this field. Between $M = 1$ and $M = 1.2$ the coverage moves by 0.013663465827808197 and the water oil ratio by 12 percent.

That is a useful conclusion in its own right: for Ekene, nothing about the fluids is the problem. The vertical sweep limitation is entirely the permeability spread, and a fluid intervention would address the smaller of the two effects.

{{panel:wf-design-explorer}}

Sweep the mobility ratio slider from 0.5 to 5 in layers mode and watch the coverage tile move slowly and the water oil ratio tile move fast. That asymmetry is the lesson.

## What a polymer flood would and would not do

Raising the water viscosity by a factor of four takes $M$ from 1.2 to 0.3, which is off the bottom of the table. Extrapolating the trend, coverage at first breakthrough would improve by something under ten points and the water oil ratio would roughly halve.

Both are real gains. Neither transforms the flood, because the column's $V = 0.5$ heterogeneity is untouched by anything you do to the fluid. Polymer helps conformance most where the mobility ratio is badly unfavourable, which for a light oil at 1.8 cp it is not.

That is a screening judgement and it is as far as this course goes on the subject. The engine that would price it does not exist centrally, and module 5 says so plainly.

## The misconception to avoid

"Improving the mobility ratio improves the sweep proportionally." The relationship is strongly compressed in coverage and roughly proportional in water oil ratio, and the two are often confused because both are called "sweep improvement". Be specific about which quantity you are claiming to improve, because a factor of two in one is not a factor of two in the other.

## Exercise

First, compute the percentage change in coverage and in water oil ratio at first breakthrough going from $M = 1.2$ to $M = 2.0$, and state which of the two you would put in a screening summary and why.

Second, Ekene's water viscosity is 0.5 cp. Compute the water viscosity that would bring $M$ to 1.0, and comment on whether that is a plausible polymer target.
