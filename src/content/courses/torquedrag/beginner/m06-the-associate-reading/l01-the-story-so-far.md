# The story so far

Five modules, one string, and three hookloads.

## The claim

The hookload a driller reads is the buoyed weight of the string resolved along the hole, plus or minus a friction force that comes entirely from the shape of the hole, and the difference between reading it going up and going down is the only part that carries information about the hole's condition.

## What each module established

**Module 1.** The soft-string model is a heavy flexible cable with no bending stiffness. Torque and drag are not two calculations; they are one friction force resolved in two directions. Buoyancy is a single factor because the string is in one fluid, 0.8165605095541402 in this course's mud, and on a vertical well it gives the hookload in closed form.

**Module 2.** Side force has exactly two sources: tension times curvature, and the weight component perpendicular to an inclined hole. Both vanish in a vertical well. The calculation marches UP from the bit because that is where the boundary condition is known, and one pair of direction cosines splits the friction between axial and tangential according to the ratio of trip speed to tool joint surface speed. The step is the only numerical knob, and it matters where the string is in compression and nowhere else.

**Module 3.** Pick up, rotate off bottom, slack off, in that order always. Their differences are the drag, and there are three different differences people call by that name. On the vertical well all three collapse to one number. On the horizontal well the slack-off hookload is negative, which means the string will not go in under its own weight, and the model has left its own domain.

**Module 4.** Six operations, three columns of difference: axial velocity, rotation, and whether the bit is on bottom. Tripping produces no torque at all. Sliding produces only the bit torque and is where weight transfer fails. Back reaming shares the friction between the two directions and converts drag into torque at a rate the driller controls.

**Module 5.** The profile is where the information is; the summary is its top row. In a lateral the tension gradient IS the drag. The neutral point is a property of the operation rather than of the well, and in a deviated well there may not be one. Warnings point at numbers and the numbers have to be read.

## The numbers to carry

- The buoyancy factor in this course's mud: 0.8165605095541402.
- The vertical well's hookload, which is a closed form: 732311.468284047 N.
- The engine's error against that closed form: about 4e-9 N. The oracle's: 42.6 N.
- The slant well's three hookloads: 1103695.4071581454, 819840.7115634651 and 604424.8115063506 N.
- The horizontal well's slack-off hookload: negative.
- Drill pipe buoyed weight per metre in this mud: 265.26806749988424 N/m.

## The one sentence

A hookload is a weight plus a friction force, the friction force is entirely a property of the shape of the hole and one chosen constant, and the constant is the subject of the next tier.
