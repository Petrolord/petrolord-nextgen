# Reading it backwards

A correlation that relates five quantities can be solved for any of them, and which one you solve for changes what the answer means.

## The same relation, two questions

Standing relates bubble point, solution gas, oil gravity, gas gravity and temperature. Fix four and you get the fifth.

**Given Rs, find Pb.** "This oil holds 400 scf/stb. At what pressure does it start to bubble?" The answer for Ekene is 1912.19 psia.

**Given Pb, find Rs.** "This oil bubbles at 2000 psia. How much gas is it holding?" The answer is 421.94 scf/stb.

Those are the same disagreement with the designed fluid, expressed twice. Neither is more correct.

## Which question your data asks

This is the practical point. Use the direction your measurement supports.

If a laboratory measured the bubble point, feed it the bubble point and let the correlation give you Rs. The measurement is the input.

If a production test gave you a producing gas-oil ratio that you believe is the solution gas ratio, feed it that and let the correlation give you the bubble point.

Feeding a correlation a number it should have produced, and then quoting the number it produces as though it were independent, is circular. It happens more often than it should, usually when a value has been copied between documents and its origin lost.

## The inversion has to be consistent

A correlation and its inverse must round-trip: put Rs in, get Pb out, put that Pb back in, and the original Rs must return. The engine's gates check exactly this for all three correlations, because a single mistyped exponent breaks the round trip while leaving each direction looking plausible on its own.

That check is worth doing on any correlation you implement yourself. It costs two lines and it catches the class of error that is invisible by inspection.

## Where inversion is not free

Standing's Rs form is an algebraic rearrangement, so it is exact.

Glaso's is not. Its bubble point form runs through a quadratic in the logarithm, so inverting it means solving that quadratic and picking the physical root. The engine does this and takes the lower root, and there is a guard for the case where the discriminant goes negative, which should not happen on a physical fluid.

That is a general pattern: a correlation published in one direction may need real numerical work to run in the other, and the numerical work introduces its own edge cases. A correlation that returns something suspiciously round, or that fails on an extreme input, may be hitting one of those guards.

## Above the bubble point

All three Rs correlations take a pressure AND a bubble point, and above the bubble point they return the value at the bubble point rather than continuing to climb.

That is physics, not a convenience. An undersaturated oil has released no gas, so its solution gas ratio is constant at Rsb all the way up. A correlation that kept increasing Rs with pressure above Pb would be describing an oil that dissolves gas which is not there.

## The misconception to avoid

"Running the correlation backwards gives me an independent check." It gives you the same relation read the other way, so it can only confirm that your arithmetic inverted correctly. An independent check needs a different source: a measurement, a different correlation, or an equation of state tuned to something. The Professional tier is where a genuinely independent check appears.

## Exercise

First, take Standing's bubble point for Ekene, feed it back in as the bubble point, and confirm the solution gas that comes out is the 400 scf/stb you started with. State what a failure of this round trip would have told you.

Second, explain in two sentences why an Rs correlation must be given a bubble point as well as a pressure.
