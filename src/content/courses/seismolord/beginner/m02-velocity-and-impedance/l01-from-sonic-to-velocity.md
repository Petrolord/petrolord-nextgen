# From sonic to velocity

The synthetic seismogram is built from rock properties, and the first of those properties is velocity. No logging tool writes a velocity curve directly. What the sonic tool records is interval transit time, the time a compressional wave takes to travel a fixed distance of formation. That curve is conventionally called DT, and the property it carries is called slowness.

Slowness is the reciprocal of velocity. That single sentence is the whole of this lesson, but it is worth unpacking, because the reciprocal is where beginners most often go wrong.

## The reciprocal relationship

Velocity answers the question "how much distance per unit time". Slowness answers the inverted question "how much time per unit distance". A rock that transmits sound slowly takes a long time to cross each metre, so it has a HIGH transit time and a LOW velocity. A fast, tight rock crosses each metre quickly, so it has a LOW transit time and a HIGH velocity.

The confusion is understandable. The curve is called the sonic log, it is displayed alongside velocity discussions, and the word "transit time" does not shout "reciprocal". Many people read a high DT deflection and say "fast rock" out of habit. It is the opposite. Whenever you look at a DT track, say to yourself: high on the DT track means slow.

## The conversion in this course

In this teaching well the sonic curve is recorded in microseconds per metre, written US/M in the LAS curve header. A microsecond is one millionth of a second, so a transit time of $\Delta t$ microseconds per metre is $\Delta t \times 10^{-6}$ seconds per metre. Inverting that gives metres per second:

$$v = \frac{1}{\Delta t \times 10^{-6}} = \frac{10^{6}}{\Delta t}$$

So the working formula for this course is:

$$v \ \text{(m/s)} = \frac{1000000}{\Delta t \ \text{(us/m)}}$$

The engine implements exactly this. The function `slownessToVelocity` in the Seismolord synthetics engine walks the DT curve sample by sample and writes `1e6 / dt` into a velocity array. Where the sample is a null or a non-positive slowness, it writes a gap instead of a number, which is the null discipline the Well Data course established. Nothing is guessed and nothing is filled in.

## Worked examples from the teaching well

Take three depths from the log and turn each one into a velocity.

At 1500 m, the top of the log, DT is 399.737 us/m:

$$v = \frac{1000000}{399.737} = 2501.65 \ \text{m/s}$$

At 1580 m, DT is 305.142 us/m:

$$v = \frac{1000000}{305.142} = 3277.17 \ \text{m/s}$$

At 1650 m, the base of the log, DT is 277.473 us/m:

$$v = \frac{1000000}{277.473} = 3603.96 \ \text{m/s}$$

The transit times are quoted to three decimal places and the velocities to two, while the engine carries full precision through the division, so a calculator may disagree in the final digit. That is rounding and nothing more.

Read those three lines as a set. The transit times fall from 399.737 to 305.142 to 277.473, and the velocities rise from 2501.65 to 3277.17 to 3603.96. That is the inverse relationship made visible. If you ever compute a velocity that moves in the same direction as DT, you have made an arithmetic slip.

Two further checks on the same formula. Note that the shortest transit time of the three gives the largest velocity, and that every velocity here is in the low thousands of metres per second, which is the right order of magnitude for clastic sediments at this depth. If a conversion ever gives you a velocity of a few metres per second, or a few million, you have almost certainly dropped or doubled the factor of $10^{6}$.

## The whole-log mean

Applying the formula to all 301 samples of the log, from 1500 m to 1650 m at a half metre step, and averaging the finite results gives a mean velocity of **3145.29 m/s**. That number is one of the six values the capstone grades, so it is worth understanding what it represents: the simple arithmetic mean of the sample velocities, taken over finite samples only, with nulls excluded rather than counted as zero.

It is not the average velocity a wave would experience travelling the interval. That quantity, the time-weighted average, belongs to the depth-to-time module. The distinction matters in real work, and it is a good habit to know which average you are quoting.

## Units come first

The conversion above is correct only because the curve is in microseconds per metre. Sonic logs are also routinely recorded in microseconds per foot, and a DT in us/ft fed into $10^{6} / \Delta t$ produces a number that looks plausible and is wrong, because the answer would be in feet per second while everything downstream assumes metres per second. The Well Data course covered depth units and curve unit strings for exactly this reason. Read the unit in the curve header before you convert, every time. The engine expects US/M, and a foot-based curve has to be converted before it reaches this step.

## Exercise

Convert the transit time at 1582 m, which is 313.949 us/m, and at 1600 m, which is 383.856 us/m. Then state which of the two depths holds the slower rock, and say whether your answer came from the DT values or the velocities.

Self-check: at 1582 m, $1000000 / 313.949 = 3185.23$ m/s. At 1600 m, $1000000 / 383.856 = 2605.15$ m/s. The slower rock is at 1600 m, and both curves agree, because 1600 m has the higher transit time and the lower velocity. Compare both against the whole-log mean of 3145.29 m/s: 1582 m sits just above it and 1600 m sits well below it.
