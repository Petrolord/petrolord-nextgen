# Working the capstone

Six numbers on a longer, wider string in a hotter well.

{{panel:ct-tubing-explorer}}

## What is different

**The tubing.** 4-1/2 inch 12.75 lb/ft, not 3-1/2 inch 9.3. Outside diameter 0.1143 m, inside 0.1005332 m.

**The length.** 3200 m, not 2500.

**The packer.** A 5 inch seal bore, not 4. Rated to 900000 N, not 670000. Two metres of stroke, not 1.5.

**The load case.** 32000000 Pa on the bore and 6000000 Pa on the annulus. The lessons ran the annulus at zero on two of their three cases.

**The temperature.** A mean change of 100 degrees, hotter than anything in the lessons.

**The casing.** Still 7 inch 29 lb/ft, so the clearance has CHANGED even though the casing has not, because the tubing is bigger.

## The six

1. The **piston** force, in newtons.
2. The **ballooning** force, in newtons.
3. The **thermal** force, in newtons.
4. The **total** force at the packer, in newtons.
5. The **helical buckling limit**, in newtons.
6. The **total length change**, in metres.

## The order to do them in

Geometry first. Ai, Ao, Ap and the steel area A, all four, before touching a force. Every one of the six depends on at least one of them and three of them depend on more than one.

Then 1, 2 and 3 in any order, then 4 as their sum.

Then 5, which needs the buoyed weight and the new clearance, and 6, which needs all three length forms.

## The traps

**Field 3 is NEGATIVE.** The temperature change is positive, the formula carries a minus sign, and a positive answer here means the sign was dropped. It is also the largest of the three by a wide margin, so getting its sign wrong flips field 4 as well.

**Field 4 is negative too.** The string is in compression. If your total comes out positive, check field 3.

**Field 5 needs the NEW clearance.** The tubing grew from 3-1/2 to 4-1/2 inches inside the same casing, so the radial clearance fell by half an inch of diameter, a quarter of an inch on the radius. The limit rises as a result, and if you reused the lessons' clearance you will be low.

**Field 5 also needs the buoyed weight at 1080 kg/m3,** which is the external density given in the load case, not the 1150 the lessons used.

**Field 6 is in METRES and it is positive.** Compression at the packer goes with elongation, and the thermal term at 100 degrees over 3200 m is large enough to beat both pressure terms.

**The annulus pressure is not zero.** It reduces the piston force and the ballooning force, and it does so by different amounts because they act on different areas. Dropping it gives two wrong answers, not one.

## Free checks

Fields 1, 2 and 3 add to field 4 exactly. That is the arithmetic check and it catches a sign error in one of the three but not in two.

Field 5 divided by the sinusoidal limit must be 1.8284271247461903. Compute the sinusoidal one as well even though it is not graded, purely to run that check.

The absolute value of field 4 must EXCEED field 5, because this string buckles helically. If it does not, one of the two is wrong.

Field 6 must exceed 2 metres, because this string strokes out. Both of those last two checks say the completion fails, which is the correct answer.

## The one qualitative question

Both limits are violated. Say which one you would fix first and what you would change, and note that the answer is not a heavier tubing.

## Exercise

Do the six in the panel. Then reduce the mean temperature change until the string no longer buckles, and read off the temperature.

Then reduce it further until the string is within stroke, and say which of the two happened first.
