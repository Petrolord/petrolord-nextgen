# Sliding

The operation where the string does not turn, and drilling gets hard.

## What it is

Directional drilling with a mud motor. The bit turns, driven by mud flow through the motor, and the string above the motor does not turn at all. That is what lets a bent housing point in a chosen direction and hold it.

In the model: axial velocity down at 0.3 m/s, rpm zero, bit on bottom.

    fa = 1,  ft = 0

## The two consequences

**No torque above the motor.** The surface torque is exactly the bit torque, 2700 N.m, on every well in this course. Nothing above the bit is turning, so there is no tangential friction anywhere.

**All the friction is axial and it opposes going down.** That is the same as tripping in, except that the string also has to push 89000 N of weight onto the bit.

The second is what makes sliding hard.

## The numbers

| well | slide-drill hookload | minimum tension |
|---|---|---|
| vertical | 643311.4682840452 N | -89000 N |
| slant | 529697.2412837633 N | -89000 N |
| build and hold | 327378.8858397913 N | -89000 N |
| three-dimensional turn | 209589.2191127977 N | -89000 N |
| horizontal | -156755.75915568782 N | -422023.82665557245 N |

Read the last row against the others. On four wells the minimum tension is exactly the weight on bit, meaning the compression is confined to the bit end where it belongs. On the horizontal well it is nearly five times that, meaning the compression has spread far up the string.

## Weight transfer

The real name for the problem in that last row is weight transfer. To put 89 kN on the bit you have to slack off 89 kN more than the string needs to hang, and the friction in the lateral eats it before it arrives.

What actually happens is that the driller slacks off, nothing reaches the bit, more is slacked off, and the string buckles in the lateral and locks up. The rate of penetration goes to zero and the hookload readings stop making sense.

## What is done about it

**Rotate.** Rotating the string, even slowly, converts the static axial friction into a mostly tangential one, and the axial component drops. That is exactly the direction-cosine split from module 2, and it is why rocking the string while sliding is standard practice.

**Do not slide at all.** A rotary steerable system steers while the whole string rotates. It costs more per day and it removes this problem entirely, which is why extended reach wells use them.

**Change the string.** Heavier pipe in the lateral, or a friction reducer in the mud.

## The model's honest limit

The model computes sliding as a steady state with kinetic friction. Real sliding is a series of stalls and releases with static friction in between, and the surface hookload during it is a sawtooth rather than a line.

So a slide-drilling hookload from this model is a best case, and the real one is worse.

## Exercise

For the build-and-hold well, compute the difference between the slide-drill hookload and the trip-in hookload.

Confirm it is the weight on bit, explain why it is exactly that on this well, and say why the horizontal well breaks the pattern.
