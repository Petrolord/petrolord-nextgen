# The shale over the sand

Three rocks, two interfaces, one fluid change. This lesson lays out the fixture before any reflection is computed, because the shape of the answer is already visible in the three property triples.

## The three rocks

| rock | $v_p$ (m/s) | $v_s$ (m/s) | $\rho$ (kg/m3) | $I = \rho v_p$ |
| --- | --- | --- | --- | --- |
| Ekene shale | 2743 | 1394 | 2450 | 6,720,350 |
| brine sand | 3200 | 1800 | 2250 | 7,200,000 |
| gas sand | 2905.6972280296195 | 1890.9758806113214 | 2038.7104517793223 | 5,923,875 |

The shale is the same in both cases. Only the lower halfspace changes, and it changes only in what fills its pores.

## Reading the contrasts

Take each property across the interface, from shale into sand.

The compressional velocity increases in both cases: by 457 m/s into the brine sand and by 162.70 m/s into the gas sand. The gas has reduced the contrast without reversing it.

The shear velocity increases in both cases too, and by more in the gas case: 406 m/s into brine, 496.98 into gas. That is the fluid blindness of the shear modulus working through the density, and it is the opposite direction from the compressional contrast.

The density decreases into the brine sand, by 200 kg/m3, and decreases much further into the gas sand, by 411.29.

## Where the interesting behaviour comes from

Two of the three contrasts move in the same direction when the fluid changes and one moves the other way.

The compressional contrast weakens, from +457 to +162.70.

The density contrast strengthens in the negative direction, from -200 to -411.29.

The shear contrast strengthens in the positive direction, from +406 to +496.98.

A reflection at normal incidence sees the first two. A reflection at angle also sees the third. So the fluid change does different things to the near and the far offsets, which is exactly why offset dependence carries fluid information that a stacked amplitude does not.

## The shale is not incidental

It is worth saying that the shale's own properties matter as much as the sand's, because a reflection has two sides.

The Ekene shale has a velocity ratio of $2743/1394 = 1.968$, which is high, as shales are. The brine sand's is 1.778 and the gas sand's is 1.537.

So the interface is a step down in velocity ratio in both cases, and a bigger step in the gas case. Since the AVO gradient is essentially a contrast in Poisson's ratio, and Poisson's ratio is a function of the velocity ratio, that step is where the gradient comes from.

Change the shale and every number in this tier changes. A tier that models one shale over one sand is answering a question about that pair, and swapping in a different overburden is not a small edit.

## Reading it off the panel

The panel draws both interfaces at once.

{{panel:rp-avo-explorer}}

The blue curve is the brine case and the amber the gas case. At zero degrees, on the left hand edge, the blue curve starts above the dashed zero line and the amber below it. Read those two starting values and you have the two intercepts.

Then follow both curves to the right. They do not diverge; they converge and then cross the axis at different places. The next module is about why.

## Worked example

Compute the normal incidence reflection coefficients from the impedances, which needs no AVO theory at all.

$$R_0 = \frac{I_2 - I_1}{I_2 + I_1}$$

For the brine case: $(7{,}200{,}000 - 6{,}720{,}350)/(7{,}200{,}000 + 6{,}720{,}350) = 479{,}650/13{,}920{,}350 = 0.034457$.

For the gas case: $(5{,}923{,}875 - 6{,}720{,}350)/(5{,}923{,}875 + 6{,}720{,}350) = -796{,}475/12{,}644{,}225 = -0.062991$.

Those are the exact normal incidence values, and they are worth comparing against the intercepts the next module computes, which are 0.034344 and -0.062825. The small differences are the subject of module four.

## Exercise

State which of the three property contrasts across this interface changes sign when the fluid is substituted, and which merely change size.

Self check: none of the three changes sign. The compressional velocity contrast stays positive and weakens, the shear velocity contrast stays positive and strengthens, and the density contrast stays negative and strengthens. What changes sign is the reflection coefficient itself, because the negative density contrast grows large enough to outweigh the shrinking positive velocity contrast.
