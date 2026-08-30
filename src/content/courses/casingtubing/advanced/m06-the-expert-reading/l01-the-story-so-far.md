# The story so far

Five modules, three forces, two limits, and no design case.

## The claim

A tubing string is a casing string that is allowed to move, and everything different about it follows from that one permission.

## What each module established

**Module 1.** Casing is cemented and tubing is not, so tubing can change length, push and pull on its packer, and buckle. Only three things change over the life of a completion: bore pressure, annulus pressure and temperature, and every force in this tier is a CHANGE in one of them from the packer setting condition. Three areas do the work, the seal bore Ap at 0.008107319665559963, the outside Ao at 0.006207166618944346 and the bore Ai at 0.0045360777821594625 square metres, and a fourth, the steel section at 0.0016710888367848843, that no pressure ever touches. Positive is tension, and heating a string therefore puts it into COMPRESSION.

**Module 2.** Piston is a pressure change times an area difference at the packer, 0.0035712418834005005 square metres for the bore and 0.0019001530466156167 for the annulus. Ballooning is the Poisson effect at 0.6 times the pressures on the bore and outside areas. Thermal is minus E times A times alpha times the temperature change, which is 4146.974057365369 N per degree on this string and contains no length at all. One degree is worth 658993.7232542605 Pa of bore pressure change, so thermal dominates any realistic case. The three add straight, and the sum is compared with the packer rating and, if negative, with the buckling limits.

**Module 3.** Force and length are two answers to two different restraint conditions and neither follows from the other. Three length terms, all containing the length this time, and a fourth from buckling that this engine does not compute. The stroke window is exactly 2 times the stroke over alpha times the length wide, 100 degrees on this string, and the pressures slide it without widening it. This engine reports an ANCHORED force and a FREE length, and a real limited-motion packer is between them.

**Module 4.** Euler does not apply, because the string is lying in a hole. The Dawson-Paslay limits depend on stiffness, buoyed weight, hole angle and radial clearance, and NOT on length. Helical is exactly 1.8284271247461903 times sinusoidal on every string ever. This completion goes sinusoidal at 30.45640382594624 degrees and helical at 43.11622208089929, and the production case at 45 is helical by 1.88 degrees. The state is reported as a flag and nothing downstream uses it.

**Module 5.** The three published cases each hit a DIFFERENT limit: production heating buckles and strokes fine, injection cooling strokes out and does not buckle, stimulation has the worst packer force of the three and does not buckle either. There is no design case, because buckling responds to the sign of the force while the other two respond to its magnitude. Seven omissions are named, and the erosional velocity is kept because it is the standard rather than because it is good.

## The numbers to carry

- Positive force is tension. Heating gives compression.
- Thermal has no length in it. Thermal LENGTH does.
- The buckling limits have no length in them either.
- Helical over sinusoidal is 2 root 2 minus 1, always.
- The stroke window width is 2 stroke over alpha L, always.

## The one sentence

Three limits that respond to different functions of the same force, so the worst case for one of them is not the worst case for the others.
