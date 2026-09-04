# Working the capstone

A capstone of this kind is one chain worked end to end. This lesson is the method, and the checks that catch each way it goes wrong.

{{panel:st-pack-explorer}}

## Before anything else

The capstone runs its own conditions. Every number quoted in this lesson comes from the published golden case and is here only to show you what a check looks like. None of them is an answer. If a value you compute matches the published case exactly, you have read the wrong case.

Work the chain in order. Each stage takes the stage above it, so an error at the top survives all the way to the skin and looks like a plausible number when it gets there.

## Step one, the efficiency

Solve the material balance for the pumping time at which the fracture volume and the leaked volume account for everything injected. It is iterative. Take the fluid efficiency from that solve.

Do not take an efficiency from anywhere else, and do not assume the value from the published case. Efficiency is the most condition-sensitive number in the tier, and it moves everything downstream.

## Step two, the pad fraction

Use the correct form. The pad fraction is one minus the efficiency, divided by one plus the efficiency. It is not one minus the efficiency.

**The check.** The pad fraction must come out SMALLER than one minus efficiency. In the published case one minus efficiency is 0.8271433276366944 and the pad fraction is 0.7052381992848291, a gap of 0.12190512835186529. If your pad fraction equals one minus efficiency to the digit, you have used the wrong form, your pad is too long, and every proppant number after it is too small.

## Step three, the placed mass

Only the fluid pumped after the pad carries proppant. Over that time the slurry concentration ramps from zero to the final design concentration on a power law whose exponent comes from the efficiency, so the mass is the injection rate multiplied by the integral of concentration over the ramp, not by its final value.

**The check.** The placed mass must be well below the final concentration multiplied by the whole ramp volume, because the ramp spends most of its time below the final concentration. If you get the product of the two, you have not integrated.

## Step four, the areal concentration

The pack fills the gap between the two faces of a fracture that has two wings. Spread the placed mass over that fracture area, half-length by height, taken over both wings, and you have an areal concentration in kilograms per square metre. The published case gives 3.212785497087163 kg per m2 from 28915.069473784468 kg over a 150 m half-length and a 30 m height.

**The check.** A factor of two here is the commonest error in the whole chain, and it is silent. Recompute the mass back out of your areal concentration and confirm it returns what you placed.

## Step five, the propped width

Divide the areal concentration by the bulk density of the pack, which is the proppant grain density times one minus the pack porosity, 3270 kg per m3 and 0.35 in the published case. Dividing by the grain density alone gives a width too small by that porosity.

**The check.** The propped width must be far below the created width. In the published case the average created width on the PKN model is 0.004015981871358954 m and the propped width is 0.0015115434001821517 m. A propped width anywhere near the created width means the porosity has been left out or the mass is wrong.

## Step six, the conductivity

Take the proppant permeability from its stress table at the closure stress, 250, 180, 120 and 70 darcy at 2, 4, 6 and 8 thousand psi for the published proppant, then multiply by the damage factor. Damage acts on permeability, not on width.

Form the dimensionless conductivity as the pack permeability times the propped width, divided by the formation permeability times the half-length. Convert the formation permeability with 9.869233e-16 m2 per mD. A factor of a thousand between darcy and millidarcy lands here more often than anything else.

## Step seven, the skin

Put the dimensionless conductivity through the correlation, and confirm it is inside 0.1 to 1000 first.

**The check.** The pseudo-skin must be negative, and the effective wellbore radius must be far above the drilled radius. In the published case they are -5.3116380662677045 and 21.889652014700083 m against a wellbore of 0.108 m. A positive pseudo-skin from a propped fracture means an error upstream, not a bad fracture.

## Exercise

First, write the seven steps as a checklist with the check for each, then work the chain once in the panel on conditions of your own choosing and run every check.

Second, deliberately use one minus efficiency as the pad fraction and follow it through to the pseudo-skin. Record how far the final number moves, and whether it still looks reasonable.
