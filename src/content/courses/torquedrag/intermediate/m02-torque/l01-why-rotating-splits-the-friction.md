# Why rotating splits the friction

One friction force, two directions, and the ratio that decides the share.

## The physical picture

A tool joint pressed against the wall with normal force N. If it is sliding, the friction force on it has magnitude mu N and points OPPOSITE to the direction of sliding.

If the joint is only moving axially, that direction is along the hole. If it is only rotating, it is around the hole. If it is doing both, the sliding direction is the vector sum, and the friction points opposite to that sum.

## The decomposition

    va = axial velocity of the string
    vt = 2 pi r rpm / 60, the surface speed of the tool joint
    v  = hypot(va, vt), the total sliding speed

    axial share      fa = va / v
    tangential share ft = vt / v

The friction force is mu N in total, of which `fa mu N` opposes the axial motion and `ft mu N` opposes the rotation.

Note `fa^2 + ft^2 = 1`. The total is conserved. Rotating does not reduce friction; it moves it.

## The numbers for this course

Tool joint radius 0.0841375 m, rpm 120:

    vt = 2 pi (0.0841375)(120)/60 = 1.0573030075656449 m/s

Trip speed 0.3 m/s. So while back reaming:

    v  = hypot(0.3, 1.0573030075656449) = 1.0990... m/s
    fa = 0.273,  ft = 0.962

Roughly a quarter of the friction acts axially and almost all of it acts tangentially.

## Why that ratio is so lopsided

Because the tool joint's surface speed at 120 rpm is three and a half times the trip speed. The tangential motion dominates the sliding direction, so the friction aligns itself with it.

Slow the rotation to 30 rpm and vt drops to 0.2643257518914112 m/s, which is still just below the trip speed at 0.3, and the shares very nearly reverse: fa 0.7503, ft 0.6611.

## The consequences

**Tripping has no torque at all.** vt = 0 gives ft = 0.

**Rotating off bottom has the free-hanging hookload.** va = 0 gives fa = 0, so the axial friction vanishes and the only thing supporting the string is the string above it.

**Back reaming trades one for the other.** On the build-and-hold well it took 307114.43113561894 N off the pick-up hookload and added 708.5050583096299 N.m to the off-bottom torque.

**Rocking the string while sliding works.** Even slow rotation moves most of the friction out of the axial direction, which is why it improves weight transfer.

## The limitation

This is a kinematic decomposition of a Coulomb friction force. It assumes the friction magnitude does not depend on the sliding SPEED, only on its direction.

Real friction has a velocity dependence, and the transition from static to kinetic is not in here at all. So the shares are right and the magnitude is a model.

## Exercise

Compute `fa` and `ft` at 30, 60, 120 and 180 rpm with a trip speed of 0.3 m/s.

Find the rpm at which the two shares are equal, and say what that rpm means physically for a driller trying to get weight to the bit.
