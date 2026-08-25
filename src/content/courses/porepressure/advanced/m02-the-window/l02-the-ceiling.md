# The ceiling

The window's upper wall is the fracture pressure, converted. Same operation as the floor, different physics behind the numerator, and one structural fact that changes how its uncertainty is felt.

## The graded value

At total depth:

$$\frac{76551571.17548856}{9.80665 \times 4100} = \frac{76551571.17548856}{40207.265} = 1903.9238599165737 \ \mathrm{kg/m^3}$$

Tolerance 0.5. A mud at TD heavier than this fractures the rock and the well starts losing.

## The ceiling's anatomy, in mud units

The coefficient form converts term by term. The mixture reading, two thirds overburden plus one third pore pressure, survives the division intact, because both terms divide by the same column:

$$EMW_{FP} = \tfrac{2}{3}\,EMW_S + \tfrac{1}{3}\,EMW_{PP} = \tfrac{2}{3} \times 2266.333384047207 + \tfrac{1}{3} \times 1179.1048116553065$$

$= 1510.8889226981378 + 393.0349372184355 = 1903.9238599165733$ kg/m3, agreeing with the direct conversion in all but the last two floating-point digits. Every sensitivity from the Professional tier's module 5 carries over with the same weights: a third of any floor move passes to the ceiling, in kg/m3 as in MPa.

The anatomy says where the ceiling's confidence comes from: two thirds of it is the overburden, frame arithmetic, and one third rides on the prognosis. The ceiling is structurally more certain than the floor on this well, with the honest caveat that its K is calibration, priced at the Professional tier as about 2.2 MPa, or 54 kg/m3 at TD, per five points of K.

## The shape down the well

Engine values: 1647.2071369571245 kg/m3 at 1000 m, 1745.6442457002613 at 2000, 1780.090931942938 at 2500, 1830.7745332550903 at 3000, 1871.0137691854095 at 3500, 1903.9238599165737 at 4000.

Rising everywhere, but not smoothly: 98.4 kg/m3 across the second kilometre, slowing to 34.4 over the 500 m into the shoe depth of 2500 m, then JUMPING to 50.7 across the first 500 m of ramp before easing to 40.2 and 32.9. The slowdown is mud-unit compression at work on a smooth pressure curve; the jump at 2500 m is the floor's break arriving through the mixture, one third of the overpressure's EMW climb added on top. The ceiling's kink is not subtle in the rate column even where the eye barely sees it on the curve.

The shallow rock is still the weak rock in mud units, 1647 at 1000 m against 1904 at TD, which is the original reason casing strings exist: the lightest mud a deep section demands can exceed what the shallow section tolerates.

Note also the ceiling never approaches the overburden EMW dashed curve: the gap $\tfrac{1}{3}(EMW_S - EMW_{PP})$ stays open, 362.41 kg/m3 at TD.

## The kink it inherits

Below 2500 m the ceiling steepens slightly, inheriting one third of the floor's break through the mixture. On the panel the effect is visible but subtle, roughly a third of the floor's kink, which is exactly the coefficient passing through. On wells with harder ramps this inherited lift is operationally welcome: the same overpressure that squeezes from below props the ceiling up, one of the few mercies in overpressured drilling, though module 5 of the Professional tier showed the window still loses two thirds of every overpressure megapascal net.

## What the ceiling binds

The mud's ceiling over a section is the curve's MINIMUM over the exposed hole, and since this ceiling rises monotonically, that minimum sits at the TOP of the open hole, usually the last casing shoe. The operational sentence: the shoe sets the ceiling. After cementing at 2500 m, the deep section's mud may not exceed 1780.090931942938 kg/m3, the ceiling at the shoe, regardless of how strong the rock at TD is. Combine with the floor's demand at the bottom, 1179.1048116553065 at TD, and the section's operational window is 1179.10 to 1780.09: the numbers module 1's worked example found, now with their proper names, floor-at-bottom against ceiling-at-shoe.

That pairing, deepest floor against shallowest ceiling, is the general law of sectioning, and it is why leak-off tests are taken at shoes: the shoe is where the ceiling binds, so the shoe is where the ceiling is measured.

## Worked example

The ceiling at the 2500 m shoe from its anatomy, checking the engine. Overburden at 2500 m: 54.95258938967901 MPa, EMW over the 2600 m column: $54952589.38967901 / (9.80665 \times 2600) = 2155.23255176056$ kg/m3. Pore pressure there is hydrostatic, EMW 1029.8076923076924. Mixture: $\tfrac{2}{3} \times 2155.23255176056 + \tfrac{1}{3} \times 1029.8076923076924 = 1780.0909319429372$ kg/m3, and the engine's direct conversion of the fracture pressure reads 1780.090931942938: agreement to twelve decimals. The mixture identity survives the unit change exactly, because all three quantities at one depth divide by the same column, so every audit trick from the Professional tier's module 5 works unmodified in mud units.

## Exercise

Using floor-at-bottom against ceiling-at-shoe: if the 2500 m shoe were instead set at 3000 m, what would the deep section's operational window become, and did the later shoe help or hurt?

Self check: floor at TD stays 1179.1048116553065; ceiling at the 3000 m shoe is 1830.7745332550903; window 1179.10 to 1830.77, which is 651.67 kg/m3 wide against 600.99 before. The later shoe helped, as it usually does on a well whose ceiling rises with depth: casing deeper raises the binding ceiling. What it costs is drilling the 2500 to 3000 m interval on the previous section's mud program, which its own floor, still hydrostatic there, permits on this well. On a well with a shallower onset that free lunch disappears, which is exactly the trade casing design is made of.
