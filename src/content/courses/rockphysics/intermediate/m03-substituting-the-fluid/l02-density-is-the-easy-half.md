# Density is the easy half

Two of the three quantities a substitution produces need Gassmann. The third needs arithmetic that a bookkeeper would recognise, and it is worth doing separately because it is the half that never goes wrong.

## The rule

$$\rho' = \rho + \phi(\rho_{fl}' - \rho_{fl})$$

Take out the old fluid, put in the new one, in the pore volume fraction.

For Ekene, with gas replacing brine:

$$\rho' = 2250 + 0.25(172.66679461728904 - 1017.8249875) = 2250 - 211.2895482206777 = 2038.7104517793223 \ \mathrm{kg/m^3}$$

which is the fifth capstone value, reached in one line with no equation at all.

## The long way round

It is worth doing it once by composition, because that is what the rule is short for.

A cubic metre of the logged rock weighs 2250 kg and is 25 percent pore. The pore holds 0.25 cubic metres of brine, weighing $0.25 \times 1017.8249875 = 254.456$ kg. The remaining mass is mineral: $2250 - 254.456 = 1995.544$ kg in 0.75 cubic metres, giving a grain density of 2660.7 kg/m3, which is a sensible number for a 70/30 quartz and clay mixture.

Now the gas case. The mineral is unchanged at 1995.544 kg. The gas weighs $0.25 \times 172.66679461728904 = 43.167$ kg. Total 2038.710 kg in the same cubic metre.

The two routes agree because the second is the first written out.

## Why it matters that this half is easy

Three reasons, and the third is the one to remember.

It is exact. There is no approximation, no assumption about frequency or pore connectivity, and no equation whose derivation could be violated. Given the porosity and the two fluid densities, the answer is arithmetic.

It is a check. The density change is large and predictable, so it is the first thing to verify in somebody else's substitution. A 25 percent porosity sand losing brine for gas must lose about 211 kg/m3, and if it has not, either the porosity or a fluid density is wrong.

And it carries more of the seismic response than people expect. The next module but one shows that at the Ekene interface the density change, not the velocity change, is what flips the sign of the reflection. A quantity computed by bookkeeping ends up driving the headline result of the whole ladder.

## The grain density check

There is a useful consistency test hiding in the long calculation above.

Back out the grain density from the log and the assumed porosity:

$$\rho_{grain} = \frac{\rho - \phi \rho_{fl}}{1 - \phi} = \frac{2250 - 0.25 \times 1017.8249875}{0.75} = 2660.7 \ \mathrm{kg/m^3}$$

Quartz is 2650 and clays run from about 2550 to 2800, so a 70/30 mixture landing at 2661 is entirely consistent. Had this come out at 2400 or 2900, the porosity or the lithology model would be wrong, and the whole substitution would be built on it.

That check costs one line and it tests the most leveraged assumption in the tier against an independent expectation. It is worth doing every time.

## Worked example

Run the check on a case where it fails, to see what it catches.

Suppose the same log, 2250 kg/m3, is handed to you with an assumed porosity of 0.15 rather than 0.25. Then

$$\rho_{grain} = \frac{2250 - 0.15 \times 1017.8249875}{0.85} = \frac{2250 - 152.674}{0.85} = 2467.4 \ \mathrm{kg/m^3}$$

which is below quartz and below every common clay. No mineral mixture in a clastic reservoir gives 2467.

So the grain density check rejects a porosity of 0.15 for this rock on its own, without any velocity information. Recall from the last module that 0.15 would also have produced a dry frame of 1.36 GPa, nearly zero, and that below 0.14 the calculation refuses outright. Three independent signals pointing at the same bad input.

## Exercise

A sand logs 2300 kg/m3 with an assumed porosity of 0.30 and brine at 1020 kg/m3. Compute the implied grain density and say whether the inputs are consistent.

Self check: $\rho_{grain} = (2300 - 0.30 \times 1020)/0.70 = (2300 - 306)/0.70 = 2848.6$ kg/m3. That is high for a quartz rich sand and would suit a rock with heavy minerals or dolomite, so either the porosity is too high, the density log is reading high, or the lithology is not what the model assumes.
