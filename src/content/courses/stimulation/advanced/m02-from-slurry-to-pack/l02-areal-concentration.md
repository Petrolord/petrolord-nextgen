# Areal concentration

Mass alone tells you nothing until you know the area it has to cover.

{{panel:st-pack-explorer}}

## The quantity

Areal concentration is the placed mass divided by the area of fracture face it is spread over:

    C_A = M / (2 xf hf)

On this case the mass is 28915.069473784468 kg, the half-length is 150 m and the fracture height is 30 m, and the areal concentration is 3.212785497087163 kg/m2.

## Which area, exactly

The denominator counts the wings. A fracture has two wings, each of half-length xf and each of height hf, so the propped plan area is twice xf times hf. Both wings, once each.

That is not the area the leakoff calculation used. Fluid leaks through both walls of both wings, so the material balance in the tier below worked with twice this area. The distinction is not pedantry, it is a factor of two, and it goes in opposite directions in the two calculations.

The rule to remember is what the answer is for. The areal concentration here is going to be divided by a pack density to give a width, and that width is the full gap between the two walls, not the thickness of proppant on one of them. So the area must be counted once per wing.

## Why the industry quotes this number

Because it is the number that is actually the same in the laboratory and in the well.

A conductivity cell is loaded with a stated mass of proppant over a stated area of platen, held at a stated closure stress, and flowed. Its result is quoted against that areal loading. Mass alone would be meaningless, since it depends on the size of the cell, and width alone would beg the question, since width is what the test is trying to establish.

Areal concentration is also the number a design engineer thinks in. It says directly how much sand is sitting on each square unit of rock face, which is the quantity that scales with pack thickness and therefore with conductivity. The field convention is pounds per square foot rather than kilograms per square metre, but it is the same quantity in different clothes.

## How it moves

The mass is fixed by the schedule, so the areal concentration is inversely proportional to the fracture area. Double the half-length at the same mass and you halve the areal concentration, halve the width, and halve the conductivity. The next lessons make that trade explicit.

## Exercise

Read the areal concentration from the panel, then halve the half-length and read it again. Confirm the ratio is exactly what the formula demands.

Then explain to a colleague why the leakoff area and the areal concentration area differ by a factor of two, using no algebra.
