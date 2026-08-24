# The beginner workflow map

This course has four working modules after this one, and they build one calculation in a fixed order. Each module produces an ingredient, and every ingredient is consumed by something later. This lesson lays the whole path out so that no module arrives without a place to sit.

There are four steps and they are done in this sequence: state the conditions, build the three fluids, build the mineral frame, mix the pore fluids. Nothing in the sequence can be reordered, because each step needs the output of the one before it.

## Step 1: the conditions

The Ekene SAND at 60 degC and 25 MPa, with brine salinity 0.035 weight fraction, gas gravity 0.6, oil of 0.85 g/cc at surface with a solution gas to oil ratio of 50 L/L, and a frame of 70 percent quartz and 30 percent clay. Module 1 covered why these are stated and what each one controls.

Nothing is computed at this step. It exists so that everything after it is reproducible by anybody who has the same seven lines.

## Step 2: the three fluids

Module 2 runs the Batzle and Wang relations at those conditions and returns a density and a bulk modulus for each fluid, plus a compressional velocity where the engine provides one.

| Fluid | Density (kg/m3) | Bulk modulus | vp (m/s) |
| --- | --- | --- | --- |
| brine | 1017.8249875 | 2.6978112899395996 GPa | 1628.0555893189182 |
| gas | 172.66679461728904 | 55.71865290286663 MPa | not returned by the engine |
| live oil | 777.0630099023522 | 1.1427945726905131 GPa | 1212.7072294996883 |

Read the modulus column with the units attached, because the three values are not on the same scale. Brine and oil are quoted in GPa. Gas is quoted in MPa. Brine is 48.42 times stiffer than the gas at these conditions, and module 2 finishes by making that comparison properly.

These three feed everything downstream. The brine and the gas go into the Wood mix at step 4. All three are inputs to Gassmann substitution at the Professional tier.

## Step 3: the mineral frame

Module 3 mixes 70 percent quartz with 30 percent clay and returns the moduli of the solid mineral mixture. There is no single correct way to average two minerals, because the answer depends on how they are arranged in the rock, so the module works with bounds and their average.

| Property | Voigt (upper) | Reuss (lower) | VRH average |
| --- | --- | --- | --- |
| K | 31.890000 GPa | 29.868801 GPa | 30.87940062475596 GPa |
| mu | 33.570000 GPa | 16.939444 GPa | 25.25472176759411 GPa |

Density mixes exactly linearly, with no bounds and no ambiguity: 0.7 times 2650 plus 0.3 times 2580 gives 2629 kg/m3.

The two bulk modulus bounds sit about 6.8 percent apart. The two shear modulus bounds sit nearly a factor of two apart. That difference in bound spread is the teaching point of module 3, and it says something uncomfortable about how much you are entitled to claim from the same rock description.

## Step 4: mixing the pore fluids

A pore does not usually contain one fluid. Module 4 uses Wood's equation to combine brine and gas at a chosen water saturation into a single effective pore fluid.

Bulk modulus mixes as a harmonic average, which means the compliances add rather than the stiffnesses. Density mixes linearly. At the capstone saturation of Sw 0.8, that is 80 percent brine and 20 percent gas, the engine returns

- mixed fluid bulk modulus: 257.3340919366766 MPa
- mixed fluid density: 848.7933489234579 kg/m3

Compare those two lines against the pure brine values in step 2. The density fell from 1017.8249875 to 848.7933489234579 kg/m3, a modest move. The bulk modulus fell from 2.6978112899395996 GPa to 257.3340919366766 MPa, which is a fall of about a factor of ten for a 20 percent change in saturation. That asymmetry is the whole of module 4 and it is why saturation is detectable.

## What the six graded numbers are

The capstone at the end of this tier asks for six values, and every one of them is produced by the four steps above.

| Number | Value |
| --- | --- |
| brine density | 1017.8249875 kg/m3 |
| brine bulk modulus | 2.6978112899395996 GPa |
| gas bulk modulus | 55.71865290286663 MPa |
| live oil density | 777.0630099023522 kg/m3 |
| frame K, VRH 70 to 30 quartz to clay | 30.87940062475596 GPa |
| Wood mixed fluid K at Sw 0.8 | 257.3340919366766 MPa |

You are not expected to reproduce those digits from memory. You are expected to be able to say, for each one, which step produced it, what conditions it depends on, and roughly what would happen to it if one of those conditions moved.

## Where this path leads

The Professional tier takes the frame from step 3 and the mixed fluid from step 4 and runs Gassmann fluid substitution, which returns the velocity and density of the saturated rock. The tier above that takes the substituted rock and screens its amplitude response against angle, which is where the bright spot from lesson 1 finally gets answered.

Neither of those is reachable without the four steps in this tier being right. A substitution built on a fluid modulus computed at the wrong conditions is arithmetic performed correctly on the wrong reservoir.

The panel below runs the whole path at once. Move the water saturation and read the three fluids, the mineral frame and the Wood mix as they respond.

{{panel:rp-fluid-explorer}}

## Exercise

Write the four steps in order and, beside each, write what it needs as an input and what it hands to the next step. Then answer two questions in one sentence each. Which step could you carry out knowing nothing about the fluids at all? Which of the six capstone numbers would change if the reservoir turned out to be at 40 MPa rather than 25 MPa?

Self check: the four steps are state the conditions, build the three fluids from those conditions, mix the mineral frame from the lithology split, and mix brine with gas into an effective pore fluid at a chosen saturation. Step 3, the mineral frame, needs only the 70 to 30 quartz to clay split and the mineral constants, so it can be done with no knowledge of the fluids whatever. A change of pressure to 40 MPa would move all five of the fluid derived numbers, which are the brine density, the brine bulk modulus, the gas bulk modulus, the live oil density and the Wood mixed fluid modulus, while the frame K of 30.87940062475596 GPa would be untouched, because the mineral constants and the lithology split do not depend on pressure at this tier.
