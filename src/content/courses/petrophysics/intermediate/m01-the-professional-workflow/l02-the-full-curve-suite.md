# The full curve suite

The Associate course used four curves: depth, gamma ray, bulk density and deep resistivity. The typewell has always carried six. This lesson brings the remaining two, the neutron porosity NPHI and the sonic transit time DT, into the working set, and lays out the complete parameter block the Professional workflow will treat as its givens.

## The six curves

The typewell is sampled every 0.5 m over roughly 1990 to 2090 m. The curves are:

* DEPT, measured depth in metres. The reference for everything else.
* GR, gamma ray in API units, reading about 20 in the clean sands and about 120 in the shales. Your shale-volume input.
* RHOB, bulk density in g/cc. The density porosity source you already know.
* NPHI, neutron porosity in porosity units (v/v). New to the workflow at this tier.
* DT, compressional interval transit time in microseconds per metre. Also new.
* RT, deep resistivity in ohm.m. The saturation input.

## What the neutron log measures

The neutron tool bombards the formation with fast neutrons and counts how quickly they slow down. Hydrogen is by far the most effective element at slowing neutrons, so the count rate is governed by the hydrogen index of the formation, the amount of hydrogen per unit volume. In a clean water-filled or oil-filled rock, hydrogen lives almost entirely in the pore fluid, so hydrogen index tracks porosity, and the tool's output is reported directly in porosity units.

The catch, which module three explores properly, is that hydrogen does not only live in pores. Clay minerals hold bound water in their structure, so shales read high on the neutron log even when their effective porosity is small. Gas contains less hydrogen per unit volume than liquid, so gas zones read low. Neither effect is noise; both are information once you know how to read them.

## What the sonic log measures

The sonic tool times a compressional sound pulse over a fixed span of formation and reports the interval transit time, the reciprocal of velocity. Slow rock means a long transit time. Porosity slows rock down, because pore fluid transmits sound far more slowly than mineral grains, so transit time increases with porosity.

On this well DT is recorded in microseconds per metre. The two anchor values the workflow uses are the matrix transit time $\Delta t_{ma} = 182$ us/m and the fluid transit time $\Delta t_{fl} = 656$ us/m. If you have seen imperial sonic logs, these are the classic sandstone pair in disguise: 182 us/m is 55.5 us/ft and 656 us/m is 200 us/ft. Module two turns these anchors into porosity.

## The parameter block

Here is the complete set of givens for the Professional interpretation, as the app presents them:

| Group | Parameter | Value |
| --- | --- | --- |
| Vsh anchors | gr_clean | 20 API |
| | gr_clay | 120 API |
| Density porosity | rho_ma | 2.65 g/cc |
| | rho_fl | 1.0 g/cc |
| Sonic porosity | dt_ma | 182 us/m |
| | dt_fl | 656 us/m |
| Saturation | rw | 0.05 ohm.m |
| | a, m, n | 1, 2, 2 |
| | rsh | 2.0 ohm.m |
| Cutoffs | phi, Vsh, Sw | 0.08, 0.5, 0.6 |

One parameter deserves a comment now. The shale resistivity $R_{sh} = 2.0$ ohm.m is not a laboratory constant. It is read from the well itself: in the thick shale, for example around 2000 m, the deep resistivity flattens at 2 ohm.m. That flat reading is the resistivity of fully compacted shale in this section, and it is exactly the number the shaly-sand models of module five will need. Reading it from the log is your first taste of parameter validation from data.

## Zones and the water leg

The interpretation targets are unchanged from the Associate course: SAND_A from 2010 to 2030 m and SAND_B from 2050 to 2080 m. New at this tier is a named interval at the base of SAND_B: the water leg from 2075 to 2078 m, where the sand is fully water-bearing. Module four builds the Pickett plot from these few samples, so keep the interval in mind; three metres of honest water is worth more to a petrophysicist than thirty metres of ambiguous pay.

## Worked example

Read the full suite at one depth, 2020 m, in the middle of SAND_A: GR 20 API, RHOB 2.3035 g/cc, NPHI 0.13, DT 281.54 us/m, RT 9.2554 ohm.m. Without computing anything, the qualitative read is: clean (GR at the clean anchor), porous (density well below matrix), and resistive relative to the 2 ohm.m shale baseline, so probably hydrocarbon-bearing. Now the same read at 2076 m in the water leg: GR 20, RHOB 2.4883, NPHI 0.098, RT 5.2062. Still clean, visibly less porous, and much less resistive despite similar cleanliness. Clean plus low resistivity is the signature of water. The numbers behind these impressions occupy the rest of the course.

## Exercise

Using the shale sample at 2000 m (GR 120, RHOB 2.55, NPHI 0.30, DT 238.88, RT 2 ohm.m), state which of the six curves reads at or near a parameter-block anchor value, and name the anchor in each case. As a self-check, you should find three: GR sits at gr_clay (120 API), RT sits at rsh (2.0 ohm.m), and RHOB sits at the shale density of 2.55 g/cc, a value the parameter table does not carry as an anchor but which module three will use when discussing shale effects. NPHI at 0.30 matches none of the givens; explain in one sentence why a shale with little effective porosity can still read 30 porosity units on the neutron log.
