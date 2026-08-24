# Why in situ conditions matter

Three lessons have each moved one dial and watched the fluid answer move with it. This one puts the dials back together and states the rule they add up to, because the rule is what you will actually carry into work.

A fluid property quoted without its conditions is not a result. It is a number with no address.

## The composition case: live oil against GOR

The clearest illustration is the oil, because oil carries a composition dial that changes underneath you between the reservoir and the surface. Hold the Ekene conditions at 60 degC and 25 MPa with a stock tank density of 0.85 g/cc, and move only the gas oil ratio.

| GOR (L/L) | rho (kg/m3) | K (GPa) | vp (m/s) |
| --- | --- | --- | --- |
| 0 | 820.9856 | 1.475341 | 1340.5357 |
| 50 | 777.0630 | 1.142795 | 1212.7072 |
| 150 | 693.8631 | 0.715855 | 1015.7240 |

GOR 0 is dead oil, meaning oil with no dissolved gas left in it. GOR 50 is the Ekene live oil, the one you have been carrying since module two. GOR 150 is a lighter, gassier oil of the sort that is common in deeper or hotter parts of a basin.

Dissolved gas makes the oil lighter and much softer at the same time. Density falls from 820.9856 to 693.8631 kg/m3 across the table. Bulk modulus falls harder, from 1.475341 GPa to 0.715855 GPa, so the gassiest oil in the table is far softer than the dead one. Velocity, which carries both effects, falls from 1340.5357 to 1015.7240 m/s.

## Why that table is a trap and not just a curve

Here is what makes GOR different from temperature and pressure. When you take an oil sample to surface, it loses its dissolved gas on the way. The sample that arrives at the laboratory is dead oil. If you measure that sample and use the measurement in a reservoir calculation, you have used the GOR 0 row for a fluid that lives on the GOR 50 row.

Size the error against the capstone. The graded live oil density is 777.0630099023522 kg/m3 with a tolerance of 0.5 kg/m3. The dead oil value of 820.9856 kg/m3 misses that by a wide margin. The stiffness error is worse in proportion, 1.475341 GPa in place of 1.142795 GPa, and stiffness is what carries into every velocity the model predicts.

Nothing about the dead oil measurement is wrong. It is an accurate measurement of a fluid that does not exist in the reservoir. That is the specific failure this module exists to prevent.

## The rule, stated properly

Put the four lessons of this module side by side.

Temperature moved the brine bulk modulus between 2.511437 and 2.697811 GPa across 20 to 100 degC, and it did so without being monotonic, peaking between 60 and 80 degC. Pressure moved the gas bulk modulus from 17.7074 MPa at 10 MPa to 111.3929 MPa at 40 MPa. Salinity moved the brine from 2.534420 GPa at 0 wt% to 3.611999 GPa at 20 wt%. GOR moved the oil from 1.475341 to 0.715855 GPa.

Every one of those movements is larger than every capstone tolerance on this course. So the rule follows without any argument about significant figures. A fluid property is a value on a surface over temperature, pressure and composition, and you have to evaluate it at the conditions of the rock you are modelling. You cannot inherit it from a report written for a different depth, borrow it from a neighbouring field at a different temperature, or measure it at surface and carry it down.

## What a surface fluid does to a rock physics model

The reason to insist on this is that the fluid does not stay in its own box. It goes into a rock.

At the tier above, Gassmann's equation takes the frame you built in module three, the porosity, and the pore fluid modulus you built in module four, and predicts what the saturated rock does. Feed it a fluid modulus computed at surface conditions and the substituted velocity comes out wrong. That wrong velocity becomes a wrong impedance, the impedance becomes a wrong reflection coefficient, and the reflection coefficient becomes an AVO response that says the wrong thing about the wrong fluid. Nothing in the chain flags the original error. Each step is arithmetic, and arithmetic does not know that its input was measured in a different place.

That is the whole case for spending a module on conditions. The fluid step is early, it is cheap to get right, and it is the last point where getting it wrong is still visible.

The panel below works at the fixed Ekene conditions of 60 degC and 25 MPa, and it lets you move the water saturation and re read the fluids, the frame and the Wood mix. Use it to fix the in situ numbers in your head. The condition tables in this module are read from the lessons, since the panel holds the conditions steady.

{{panel:rp-fluid-explorer}}

## Exercise

An operator hands you an oil property set measured on a stock tank sample and asks you to use it for a Gassmann substitution at 60 degC and 25 MPa. Write down what you would ask for instead, and what the error would be if you used the sample as given. Then write the one sentence rule this module ends on.

As a self check: you would ask for a live oil property set at reservoir conditions, or for the PVT report giving the solution gas oil ratio, the stock tank density and the gas gravity, so the engine can compute the live fluid at 60 degC and 25 MPa. Used as given, the stock tank sample stands at GOR 0 and gives 820.9856 kg/m3 and 1.475341 GPa in place of the true 777.0630 kg/m3 and 1.142795 GPa, so the oil would be reported too heavy and far too stiff, and the substituted velocity built on it would be wrong in a way nothing downstream can detect. The rule is that a fluid property quoted without its temperature, pressure and composition is not a result.
