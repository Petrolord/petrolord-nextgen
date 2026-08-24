# Minerals and mixtures

The last module treated the pore fluid on its own. This module treats the other half of the rock. Take the fluid out of the Ekene sand and what remains is solid material: grains, cement and clay. That solid material is the mineral frame, and before you can say anything about how the rock responds to a seismic wave you have to say how stiff and how heavy the solid part is.

The problem is that no reservoir rock is made of one mineral. A sandstone is quartz with clay in it, often with a carbonate cement, sometimes with feldspar and heavy minerals in the accessory fraction. Each of those has its own bulk modulus, its own shear modulus and its own density. What you need is a single set of three numbers for the mixture, and the rest of this module is about how to get them and how much to trust them.

## The engine's mineral table

The rock physics engine carries a small table of mineral constants taken from the Rock Physics Handbook mineral tables. Four minerals cover most clastic and carbonate work:

| mineral | K (GPa) | mu (GPa) | rho (kg/m3) |
| --- | --- | --- | --- |
| quartz | 36.6 | 45.0 | 2650 |
| clay | 20.9 | 6.9 | 2580 |
| calcite | 76.8 | 32.0 | 2710 |
| dolomite | 94.9 | 45.0 | 2870 |

Three things in that table are worth reading before you use any of it.

The first is that the moduli are quoted in GPa and the densities in kg/m3. The engine stores the moduli internally in Pa, so quartz is held as 36.6e9 Pa. You will change units several times in this course, and the capstone is graded on numbers in specific units, so make the habit now of writing the unit next to every value.

The second is that the carbonates are stiff in bulk and the clay is soft. Dolomite at 94.9 GPa is more than four times the bulk modulus of clay at 20.9 GPa. That is why a limestone and a shale of the same porosity are nothing like the same rock on seismic.

The third, and the one that drives the rest of this module, is the shear column. Quartz has a shear modulus of 45.0 GPa and clay has 6.9 GPa. The gap in shear is far wider than the gap in bulk, where the same two minerals sit at 36.6 and 20.9 GPa, within a factor of two of each other. Hold on to that asymmetry. It is the reason the frame gives you one number you can rely on and one you cannot.

## The Ekene frame

The Ekene sand is modelled as 70 percent quartz and 30 percent clay by volume. That split is a lithology description, not a measurement of any one grain. It says that if you took a representative piece of the solid material and sorted it, seven tenths of the solid volume would be quartz and three tenths would be clay.

Volume fractions must sum to one, and the engine throws rather than guessing if they do not. There is no fluid in this fraction and no porosity. You are describing the solid material only. Porosity enters later, and the softening that pore space causes is the next tier's work with Gassmann.

## Density mixes exactly

Density is the one property of a mixture that needs no theory at all. Mass adds and volume adds, so the density of a mixture is the volume-weighted sum of the component densities. For the Ekene frame:

$$\rho_{frame} = 0.7 \times 2650 + 0.3 \times 2580 = 2629 \text{ kg/m3}$$

That is exactly what the engine returns. Not an estimate, not a bound, not an average of two guesses. If you know the volume fractions and the mineral densities you know the mixture density, and there is nothing further to argue about.

Note where 2629 kg/m3 sits. It is seven tenths of the way from clay to quartz, because that is what the volume fractions said. A mixture density always lands between its end members at exactly the position the fractions put it.

## Why the moduli do not mix that way

Now try the same move on the bulk modulus and it fails.

The reason is geometry. Density does not care how the quartz and the clay are arranged, because mass is mass wherever it sits. Stiffness cares enormously. A rock in which the clay sits as isolated blobs inside a continuous quartz framework is stiff, because a load applied to it is carried by quartz all the way through. The same 70/30 mixture with the clay smeared as continuous films around every grain contact is soft, because the load has to pass through clay at every contact and the clay gives way first.

Same minerals, same fractions, same density, different stiffness. So there is no single correct mixing formula for a modulus. What you can do is bracket the answer, and that is what the next lesson does.

## What the frame is for

The mixed frame goes on to two jobs. Its density combines with the pore fluid density to give the density of the saturated rock, which is what the density log reads and what an impedance calculation needs. Its bulk modulus is the mineral modulus that Gassmann requires when you substitute one fluid for another, and Gassmann is the reason this course spends a module on it.

For now the frame is a three number summary of the solid part of the Ekene sand: a density you can state exactly, a bulk modulus you can state with confidence, and a shear modulus you can state only with a wide caveat.

## Exercise

Using only the engine mineral table and the Ekene lithology split, work out the frame density. Then say why you cannot use the same arithmetic on the bulk modulus, in one sentence about geometry.

Self check: the frame density is $0.7 \times 2650 + 0.3 \times 2580 = 2629$ kg/m3, which is the value the engine returns and is exact rather than approximate. You cannot repeat that arithmetic on the bulk modulus because density is blind to how the minerals are arranged while stiffness is not, so the same 70/30 mixture can be stiff or soft depending on whether the clay carries load or the quartz does.
