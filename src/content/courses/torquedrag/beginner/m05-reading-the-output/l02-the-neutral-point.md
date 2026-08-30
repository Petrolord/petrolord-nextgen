# The neutral point

The depth where the tension changes sign, and the two things people mean by it.

## The definition this course uses

The neutral point is where the axial tension in the string is zero. Above it the string is in tension, below it in compression.

On the vertical well rotating on bottom, that is 1940 m: the bottom 60 m of a 2000 m string carries the 89 kN of weight on bit in compression, and everything above is in tension.

## Why it moves

It moves down when you reduce weight on bit and up when you increase it. It moves in a deviated well because friction changes the tension gradient. It moves during the operation, because tripping out puts the whole string in more tension than tripping in.

So it is a property of the operation, not a fixed depth in the well.

## The other definition

Some texts define a neutral point in terms of STRESS rather than force, taking account of the mud pressure acting on the pipe's ends and walls. That neutral point sits at a different depth, and both definitions are in common use.

For torque and drag work the force definition is the one that matters, because it is the sign of the axial force that determines whether the pipe can buckle.

Knowing that two definitions exist is enough. Confusing them is how a "neutral point" gets quoted with a depth that nobody else can reproduce.

## What it is for

**Bottom hole assembly design.** Traditionally you put enough drill collar below the neutral point that the weight on bit is supplied entirely by collars, and the drill pipe is never in compression. That rule was written for vertical wells and it is why collars exist.

**Buckling.** Only the section below the neutral point can buckle, because buckling needs compression. So the neutral point bounds where you have to look.

## Why the traditional rule breaks in a deviated well

In a horizontal well the compression is not confined to the bit end at all. Look at the horizontal well sliding: the minimum tension is -422023.82665557245 N and the string is flagged as buckled from 0 m.

There is no single neutral point there. Friction in the lateral is generating compression along its whole length, and no amount of drill collar at the bit fixes it, because the problem is not the weight on bit, it is the drag.

That is the transition from a vertical-well mindset to a deviated-well one, and it is the reason heavy weight drill pipe and rotary steerable systems exist.

## Exercise

For the vertical well rotating on bottom, confirm the neutral point at 1940 m by hand: take the weight on bit, divide by the buoyed weight per metre of the component it sits in, and see where that lands from the bit.

Then say why the same calculation gives the wrong answer on the build-and-hold well.
