# The tool projection allowance

The smallest term, and the reason it is there.

## What it covers

The survey sensor is not at the bit. It sits behind it, typically ten to twenty metres, in a non-magnetic collar.

So at any moment the deepest SURVEYED point is well above the deepest DRILLED point, and the position of everything between them is a projection rather than a measurement.

The allowance covers the resulting geometric uncertainty about where the metal actually is relative to the computed centreline.

## The other thing it covers

The drill string does not sit on the centreline of the hole. It lies against the low side under gravity, it is pushed against the wall by a bent housing, and it buckles under compression.

So even at a surveyed station the steel is displaced from the computed path by up to the difference between the hole radius and the pipe radius.

## Its size

The standard clearance examples use 0.3 m.

That is small next to the uncertainties in a deep well and comparable to everything else in a shallow one. In the worked example of the previous lesson it was more than a third of the geometric deduction.

## Why it is a constant rather than a model

Because modelling it properly would require the assembly, the hole size, the inclination and the weight on bit, all of which vary continuously and none of which is in the survey record.

A fixed conservative allowance is the standard's simplification and it is a reasonable one. The panel's sensitivity view shows what setting it to zero does: on the kicked-off case it moves the factor by about a sixth of a unit, which is not nothing.

## Where it should be larger

**A long bottom hole assembly.** A rotary steerable with a long sensor offset projects further.

**A large hole.** More room for the string to lie off centre.

**A high build rate.** The assembly is bent, so it is deliberately not on the centreline.

**Sliding.** During a slide the bend is oriented and the string is pressed to one side by design.

Operators that care about the shallow section sometimes carry a larger allowance there for exactly these reasons.

## What it is not

It is not the projection ahead to the bit for STEERING purposes. That is a separate calculation, done in real time, and it produces an estimated position for the unsurveyed section rather than an allowance.

The two are related and they are not the same. A scan of the plan uses the allowance; a scan while drilling uses the projected position plus the allowance.

## The while-drilling case

This is the situation the allowance was designed for. The last survey is twenty metres up the hole and the bit is approaching the offset well.

What is cleared is not the surveyed point but the projected one, and the projection is made by extending the current attitude. If the assembly is building or turning, the projection is an arc rather than a line, and the uncertainty of the projection grows with the distance from the last survey.

That is why surveys are taken more often through a close approach: shortening the projection is the cheapest way to shrink the least certain part of the geometry.

## The misconception to avoid

"The allowance is a safety margin." It is a geometric correction for a known displacement between the computed centreline and the actual steel, and it is separate from the uncertainty terms and separate from the threshold margin. Treating it as spare conservatism, and removing it to clear a well, removes a real deduction rather than a cushion.

## Exercise

A bottom hole assembly has its survey sensor 18 m behind the bit and is building at 3 degrees per 30 m.

Compute how far, laterally, the bit is displaced from the straight-line projection of the last survey's attitude. Compare it against the 0.3 m standard allowance and say what that implies for surveying frequency through a close approach.
