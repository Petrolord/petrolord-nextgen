# Working the capstone

One order of work. Every step checks the step before it, and every check is an identity you can run without a solver.

{{panel:pd-string-explorer}}

## Step one: build the string before anything else

Sizes, lengths and the fluid specific gravity give weight in air, then the buoyancy factor, then buoyed weight. The factor is one minus the fluid specific gravity over 7.85 with no other coefficient in it: 0.872611464968 at specific gravity 1.00. If a factor has a 1.2 in it somewhere, it is the predecessor's, and it gives 0.847133757962 instead, removing 253.248408 lb of rod weight the polished rod is actually carrying.

## Step two: add compliances, then check against the softest section

Sum the section compliances and invert. The check is free and it catches the commonest error in the whole subject: a string must be softer than any section in it. The published taper's softest section alone is 509.452063888 lb/in and the whole string is 267.091373300 lb/in. If your spring rate is stiffer than a section's own rate, you added spring rates rather than compliances, and the published taper prices that at 1070.889032254 lb/in against 267.091373300, a factor of 4.009448.

## Step three: read the warnings the string raises

A section larger than the one above it is accepted, not refused: the same two sizes in the wrong order over 5000 ft return `ok = true` with a `taperStepsUp` warning and a spring rate of 267.091373300 lb/in becomes 251.236634246 lb/in. A rod size the parser cannot read is refused outright: "seven eighths" returns `ok = false`.

## Step four: get the note and compare the speed to it

The engine refuses any design at or above the string's fundamental, with a message that names the number. Get the fundamental before choosing a speed, not after.

## Step five: close the linkage

The stroke is the beam sweep times the front arm: 1.000197032783 rad by 106.6667 in gives 106.687716837 in. Check the upstroke fraction, 0.544444444444, and remember it is not a half. Two other numbers to keep: the largest torque factor of 56.305306799 in, and the ratings the API designation carries.

## Step six: do the pump

Differential times area for the load. Diameter squared times 0.116571155977 for the displacement. Identity: 2.405281875 in2 at 1950.0 psi gives 4690.299657039 lb, and that same plunger over 106.687717 in sweeps 0.026449601 bbl per stroke, reading 380.874258458 bbl/d at 10 spm.

## The traps

**Spring rates added.** 1070.889032254 lb/in against 267.091373300 lb/in.

**A buoyancy factor with a coefficient.** 0.847133757962 against 0.872611464968 at specific gravity 1.00.

**The area into the displacement constant.** Understated by 21.460184 percent at every plunger size.

**Twice the crank radius for the stroke.** The published unit's ratio is 3.704434612, and it is 3.921849154 at a crank radius of 32.000 in.

**A rating read as a production.** It assumes a full barrel and the whole surface stroke.

**Mixed units.** lb, lb/in, in/lb, in, ft, spm, bbl/d, in-lb, psia never psig.

## Exercise

Work a string's buoyed weight, spring rate and fundamental by hand, then close a linkage and size a pump on it.

Run the softest section check and the displacement identity on your own numbers before opening the panel. Any disagreement is in the build, not in a reading.
