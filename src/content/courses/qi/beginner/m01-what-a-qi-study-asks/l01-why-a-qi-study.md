# Why a QI study

A seismic volume is amplitude in time. A well is rock, fluid and depth at one point. A quantitative interpretation, QI for short, is the work that joins the two and asks how much of the seismic amplitude can be read as rock and fluid away from the wells. Before anyone spends months on that, a study asks two questions: is the data good enough, and can the seismic see the fluid? The Associate tier answers both as a feasibility study, with stated engines on stated data, and writes the answer as a verdict.

{{video:qi-a1}}

## What the engines compute

Every figure in this course is a return value of a Petrolord engine, the same files QI Studio and Rock Physics Studio run. Each function takes plain numbers and arrays and returns numbers. No engine reads a file, a clock or a random number of its own, so the same inputs always give the same answer, and a reader can repeat any figure the course prints.

| engine file | what the Associate tier asks of it |
| --- | --- |
| seismicQc.js | the amplitude spectrum, its band edges and centroid, signal to noise, footprint |
| elasticSet.js | the elastic set at a point, the local shear trend and its prediction |
| vsEstimate.js | shear from Vp by Greenberg and Castagna |
| fluids.js, minerals.js | brine, live oil, the fluid mix, the mineral mix |
| gassmann.js | substitution of one pore fluid for another |
| avoTrend.js, avo.js | the wet trend, the distance from it, modelled reflections at the zone top |

When a function cannot answer, it refuses with a message that says why. The last lesson of this module reads those refusals.

## What the engines decline to do

Three things are left to the interpreter, and the course states each one where it is used.

The engines hold no Ekene figure. Every temperature, pressure, salinity, oil gravity, gas-oil ratio, porosity, shale volume, saturation, mineral, taper, window, block length, angle and cut-off is an input the caller states.

The engines do not pick the samples. Which samples are net sand, which are the water leg and which are the cap rock is a selection made before a function is called.

The engines do not decide whether a study should go ahead. They return spectra, trends, moduli and reflection coefficients. The verdict is written by a person from those numbers, and it carries every choice that moved them.

## The methods behind the engines

Each method is named by its authors and year, as the engines' own headers name it, and the course explains each in its own words.

| method | reference |
| --- | --- |
| brine and live oil | Batzle and Wang (1992) |
| the fluid mix | Wood (1955) |
| the mineral mix | Voigt, Reuss and Hill (Hill 1952) |
| fluid substitution | Gassmann (1951) |
| shear from Vp | Greenberg and Castagna (1992) |
| the wet background trend | Castagna, Swan and Foster (1998) |
| intercept and gradient | Shuey (1985) |
| AVO classes | Rutherford and Williams (1989), with class IV |
| signal to noise from coherency | Hatton, Worthington and Makin (1986) |
| lambda-rho and mu-rho | Goodway, Chen and Downton (1997) |

The Rock Physics course teaches the fluid, substitution, shear, intercept and class methods in full. This course recaps each one once and applies it to the two questions.

## Why feasibility comes first

A seismic attribute can be computed on any volume. Whether it means anything depends on the band of the data, on how much of each trace is signal, on whether the acquisition left stripes in the amplitudes, and on whether the fluid in the rock changes the elastic properties enough to change a reflection. Each of those has a number, and each number rests on stated choices. A feasibility study collects them before the expensive work begins, so a later team knows what the seismic can and cannot be asked.

{{panel:qi-feasibility-explorer}}

## Exercise

Open the feasibility explorer and set Data to "Ekene pack: Ekene-1". Step the View selector through all seven views, from Data inventory to Modelled AVO. In each view that carries them, list the controls marked "(stated)" and sort them into three groups: choices about the samples, choices about the conditions and fluids, and choices about the seismic measurement. Keep the list: the verdict at the end of this tier names every one.
