# Depth, units and sampling

Petrophysics is bookkeeping as much as physics, and the books are kept against depth. Before computing anything you should know exactly what the depth axis means, what units every curve carries, and how the discrete sampling of a log turns into the thicknesses and averages that end up in a reserves table.

## Measured depth and true vertical depth

**Measured depth (MD)** is distance along the well path from a surface reference, usually the drill floor. **True vertical depth (TVD)** is the vertical distance below that same reference. In a deviated well the two diverge, and thickness sums done in MD overstate the vertical thickness of a bed.

This course works on a vertical teaching well, so MD and TVD coincide and we can simply say "depth". Keep the distinction in mind anyway: the first question to ask of any real net pay number is whether it is measured or vertical thickness.

## The units of this course

All numbers in this course and in the Learning Mode app are metric:

| Curve | Meaning | Unit |
|---|---|---|
| DEPT | Depth | m |
| GR | Natural gamma ray | API |
| RHOB | Bulk density | g/cc |
| RT | Deep (true) resistivity | ohm.m |
| DT | Sonic slowness | us/m |
| NPHI | Neutron porosity | fraction (v/v) |

Two habits save endless grief. First, porosity and saturations in calculations are **fractions**, so a porosity of 21 percent enters every formula as 0.21. Second, watch sonic units: this dataset carries slowness in microseconds per metre (the matrix value for sand is 182 us/m), while much of the older literature uses microseconds per foot. A formula fed with mixed units fails silently and produces confident nonsense.

## Sampling: the log as a list of numbers

A digital log is a list of samples at a fixed increment. The typewell runs from 2000 m to 2100 m sampled every 0.5 m, which gives 201 samples (both ends included). When you later see the workflow code or the app, each curve is literally an array of 201 numbers, and "the reading at 2020 m" means the array element whose depth equals 2020.0 m.

The increment matters for anything that sums thickness. Each sample stands for an interval of rock equal to the sampling increment, so counting samples and multiplying by the increment gives thickness:

$$h = n_{samples} \times \Delta z$$

A worked example with the typewell numbers: zone SAND_A is defined from 2010 m to 2030 m. At 0.5 m sampling with both endpoint samples included, that window contains 41 samples, which the summary logic treats as a gross interval of 20.5 m. If 36 of those samples pass all pay criteria, net pay is $36 \times 0.5 = 18.0$ m. You will meet exactly these numbers again in the net pay module; the point here is only that a thickness is always a sample count times an increment.

The same discreteness shapes averages. A "zone average porosity" is the average of the porosity samples inside the zone that pass the relevant flags. Change the sampling increment or the zone boundaries by half a metre and the count, and hence the average, can shift slightly. Sensible petrophysicists therefore quote zone boundaries explicitly, as this course always will.

## Interval notation used in this course

Zones are written as top to base in metres, for example SAND_A spans 2010 to 2030 m and the water leg used at higher tiers spans 2075 to 2078 m. A sample belongs to a zone when its depth lies inside the window, endpoints included. All summaries you will compute (gross, net, net to gross, averages) are defined over these windows.

## Exercise

The typewell zone SAND_B is defined from 2050 m to 2080 m. With 0.5 m sampling and both endpoints included, how many samples fall in the window, and what gross thickness does that represent? If 11 of those samples were flagged as pay, what net thickness is that? Check yourself: 61 samples, gross 30.5 m, and 11 samples make $11 \times 0.5 = 5.5$ m of net pay.
