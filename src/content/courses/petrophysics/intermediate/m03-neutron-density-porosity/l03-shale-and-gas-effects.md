# Shale and gas effects

The average from the previous lesson is honest arithmetic, but arithmetic cannot tell clay-bound water from pore water. This lesson looks at the two great disturbers of the neutron-density pair, shale and gas, quantifies the shale effect on the typewell, and introduces the correction the engine offers for it.

## The shale effect, measured

Take the typewell shale at 2000 m and put numbers on everything.

The density porosity is low: RHOB = 2.55 g/cc gives

$$\phi_D = \frac{2.65 - 2.55}{1.65} = 0.0606.$$

The neutron is high: $\phi_N = 0.30$, pushed up by hydrogen bound in and on the clay minerals. The average is

$$\phi_{ND} = \frac{0.0606 + 0.30}{2} = 0.1803.$$

An apparent porosity of 18 percent in a rock that produces nothing. Almost all of it is clay-bound water: hydrogen the neutron faithfully counted, sitting in micropores and on platelet surfaces where no hydrocarbon will ever displace it. The averaging halved the neutron's exaggeration but could not remove it, because the density curve in shale is not a clean estimate of effective porosity either; it is responding to a grain density that differs from the sand matrix value.

The lesson generalises: in shaly rock, $\phi_{ND}$ is a total-porosity-flavoured number, not an effective porosity. Book it uncorrected in a shaly interval and every downstream volume is optimistic.

## The linear shale correction

The engine offers the standard first-order fix:

$$\phi_e = \phi - V_{sh}\,\phi_{sh,app}$$

where $\phi$ is the uncorrected porosity, $V_{sh}$ is the shale volume at that depth, and $\phi_{sh,app}$ is the apparent porosity that the same tool combination reads in a pure nearby shale. The logic is a mixing argument: if a fraction $V_{sh}$ of the rock behaves like the reference shale, it contributes $V_{sh} \times \phi_{sh,app}$ of apparent porosity that is not effective, so subtract it.

Worked example at 2000 m. The shale point itself has $V_{sh} = 1.0$ by construction (GR sits on the clay anchor). Choosing an apparent shale porosity of 0.10 for the correction:

$$\phi_e = 0.1803 - 1.0 \times 0.10 = 0.0803.$$

The corrected value, about 8 percent, is a far more believable description of a compacted shale than 18 percent, and in a working study you would tune $\phi_{sh,app}$ so that the corrected porosity in pure shale lands near zero or near whatever core says.

Two cautions come with the formula. First, it is linear and crude; it assumes the shale in the reservoir behaves like the reference shale, which laminated, dispersed and structural clay each violate differently. Second, it makes the result only as good as your $V_{sh}$ curve, so the anchor-picking discipline from module m01 is now load-bearing twice, once in saturation and once in porosity.

## The gas effect

Gas disturbs the pair in the opposite pattern, and it is worth being precise about the directions.

Gas is light, so the bulk density falls and $\phi_D$ reads too high. Gas is hydrogen-poor per unit volume, so the hydrogen index falls and $\phi_N$ reads too low. Plot both curves on a compatible matrix scale and they cross over in a gas zone: density porosity swings to the high side, neutron to the low side, and the curves separate in the reverse of the shale pattern. That crossover is one of the most reliable quicklook fluid indicators in logging.

On the typewell there is no crossover anywhere, because the fluids are oil and water only. That absence is itself diagnostic. A professional scanning the typewell tracks reads the consistent neutron-below-density behaviour in the clean sands, notes that it never inverts into the wide density-above-neutron split of a gas leg, and concludes the porosity pair carries no gas complication. Interpretation is as much about recognising which effects are absent as which are present.

If gas were present, this is also where the choice of combination method would matter: the plain average under-corrects for the strong neutron suppression, and the root-mean-square variant exists precisely to lean toward the higher reading in gas. On this course the average stands, and the reasoning is on record.

## Direction as a flag

Summarise the module's diagnostic so far as a two-way switch. Neutron pulled up relative to density porosity: suspect clay. Neutron pulled down with density porosity pulled up: suspect gas. Curves together: clean liquid-filled rock, believe the pair. The professional reads separation direction first and magnitude second, before any equation is applied, and the crossplot in the next lesson turns this habit into a picture.

## Exercise

A depth in some other well reads RHOB = 2.40 g/cc and NPHI = 0.09 on a sandstone scale, with the same matrix and fluid parameters as the typewell. Compute $\phi_D$, $\phi_{ND}$, and state which effect the separation direction suggests. As a self-check: $\phi_D = (2.65 - 2.40)/1.65 = 0.1515$, the average is $(0.1515 + 0.09)/2 = 0.1208$, and the density reading well above the neutron is the gas pattern, not the shale pattern. Then compute the corrected porosity if instead the interval were shaly with $V_{sh} = 0.4$ and $\phi_{sh,app} = 0.10$: the answer is $0.1208 - 0.04 = 0.0808$.
