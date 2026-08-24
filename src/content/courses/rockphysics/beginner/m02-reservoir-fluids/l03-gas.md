# Gas

Gas is the reason this course exists. It is the fluid that makes a reflection bright, and it is the fluid whose presence a seismic survey has any real chance of detecting. It is also the fluid that people picture most wrongly, because the picture in their head comes from gas at surface.

## The two numbers

At the Ekene conditions, which are 60 degC, 25 MPa and a gas gravity of 0.6, the Batzle and Wang gas relation returns

| Property | Value |
| --- | --- |
| density | 172.66679461728904 kg/m3 |
| bulk modulus | 55.71865290286663 MPa |

The engine does not return a compressional velocity for gas, so this course does not quote one. Two numbers is what you get and two numbers is what the downstream calculation needs.

Read the unit on that modulus carefully. It is MPa. Brine and live oil in this course are quoted in GPa, and gas is quoted in MPa, because writing the gas value in GPa would push its leading figures past the decimal point and make it awkward to read against the mineral and brine values. The unit change is a warning label. Every time you see it, you are being told that this fluid is on a different scale from the others.

## Brine is 48.42 times stiffer

Set the two moduli side by side at identical conditions.

| Fluid at 60 degC and 25 MPa | Bulk modulus |
| --- | --- |
| brine | 2.6978112899395996 GPa |
| gas | 55.71865290286663 MPa |

Brine is 48.42 times stiffer than the gas. That ratio is the most important number in the Associate tier, and it deserves to be stated plainly rather than filed away.

Everything seismic can say about saturation rests on it. Replacing brine with gas in a pore removes a stiff fluid and puts a soft one in its place, and the substitution changes the compressibility of the pore contents by a factor of nearly fifty. A rock whose pore fluid becomes fifty times more compressible becomes markedly slower, and the reflection at its top changes enough to be seen from the surface. If that ratio were two rather than 48.42, nobody would be looking for gas with seismic.

The density difference matters too, and it runs the same way. Gas at 172.66679461728904 kg/m3 against brine at 1017.8249875 kg/m3 means the rock also gets lighter when gas arrives. Lower modulus pushes velocity down. Lower density pushes velocity up. The modulus effect wins by a wide margin for the compressional wave, which is why gas sands are slow.

## This is not the gas you know

At 25 MPa and 60 degC, this gas has a density of 172.66679461728904 kg/m3. The brine sitting next to it in the same pore space has a density of 1017.8249875 kg/m3, so the gas is a substantial fraction of it rather than a rounding error. This is a dense fluid.

It is also supercritical. Above its critical temperature and pressure, a hydrocarbon gas has no distinct liquid phase to condense into, and it behaves as a single fluid with the density of something closer to a light liquid and the compressibility of something closer to a gas. It fills its container the way a gas does and it carries mass the way a liquid does.

The picture to discard is the one from a laboratory cylinder or a domestic supply, where gas is thin, nearly weightless, and negligible in every calculation. That picture leads to two specific errors. It leads people to expect a gas sand to be almost empty and therefore to have almost no mass, which understates the density and therefore the reflection. And it leads people to assume gas properties are roughly constant, which is the opposite of the truth.

## Pressure moves it steeply

Hold the temperature at 60 degC and the gravity at 0.6 and move only the pressure.

| Pressure (MPa) | Density (kg/m3) | K (MPa) |
| --- | --- | --- |
| 10 | 69.5252 | 17.7074 |
| 25 | 172.6668 | 55.7187 |
| 40 | 237.8996 | 111.3929 |

Both columns climb steeply, and they do so for the same reason. Squeezing a compressible fluid packs more mass into the same volume, which raises the density, and it also makes the fluid harder to squeeze further, which raises the bulk modulus.

The practical consequence is that the depth of your reservoir changes what a gas effect looks like. Shallow gas at 10 MPa has a bulk modulus of 17.7074 MPa, which is very soft indeed against the brine, so the contrast is dramatic and gas sands stand out. Deep gas at 40 MPa has a bulk modulus of 111.3929 MPa, which is still far below brine but much less extreme, so the same saturation produces a weaker seismic signature. Bright spot workflows that succeed at shallow depths in a basin often stop working deeper in the same basin, and this table is a large part of the reason.

## Gravity moves it too

Gas gravity stands in for composition, and heavier gas means both more mass and more resistance to compression.

| Gas gravity at 60 degC and 25 MPa | Density (kg/m3) | K (MPa) |
| --- | --- | --- |
| 0.6 | 172.6668 | 55.7187 |
| 0.8 | 254.4526 | 73.5316 |
| 1.0 | 337.4248 | 119.8581 |

The Ekene gas at gravity 0.6 is near the dry methane end of that range. A wetter gas, carrying more of the heavier components, moves along the table and becomes both denser and stiffer, which mutes its seismic signature relative to a dry gas at the same saturation and the same depth. If a nearby analogue field produced a spectacular bright spot on dry gas and your prospect is expected to be wetter, the analogue is not telling you what you think it is.

## Exercise

Write down the two Ekene gas properties with their units, and state without looking why the modulus is quoted in MPa rather than GPa. Then answer one question in a sentence. Two prospects in one basin hold the same gas at the same saturation, one at 10 MPa and one at 40 MPa. Which will produce the stronger seismic fluid effect, and which numbers say so?

Self check: the Ekene gas has a density of 172.66679461728904 kg/m3 and a bulk modulus of 55.71865290286663 MPa, quoted in MPa because it sits far below the brine and oil moduli and reads clearly in MPa while its leading figures would fall past the decimal point in GPa. The shallow prospect at 10 MPa produces the stronger effect, because its gas bulk modulus is 17.7074 MPa against the brine at 2.6978112899395996 GPa, while the deep prospect at 40 MPa has a gas modulus of 111.3929 MPa, so the contrast between the gas and the brine it replaces is much larger in the shallow case.
