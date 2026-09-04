# A wave in a rod string

A rod string is a wave guide, and the number that decides whether a design is dynamic is how many times the wave crosses it in one stroke.

{{panel:pd-card-explorer}}

## The wave has a speed and the string has a length

A 7/8 rod carries a longitudinal wave at 16288.760984482 ft/s. That is slower than the bare steel acoustic velocity of 16981.875572480 ft/s computed from Young's modulus of 30500000 psi and a density of 490 lb/ft3, because the couplings add weight without adding section: the published weight over the bare steel weight of a 7/8 rod is 1.086914062177.

The published taper is 5000.0 ft long. One way transit is 0.306960118 s and a round trip is 0.613920237 s. Those two numbers do not change when the unit speeds up. The stroke period does.

## Round trips per stroke

| Speed, spm | Stroke period, s | Round trips per stroke | Speed over the fundamental |
| --- | --- | --- | --- |
| 5.0 | 12.000000000 | 19.546513181 | 0.093699419 |
| 7.0 | 8.571428571 | 13.961795130 | 0.131179186 |
| 9.0 | 6.666666667 | 10.859173990 | 0.168658954 |
| 11.0 | 5.454545455 | 8.884778719 | 0.206138721 |
| 13.0 | 4.615384615 | 7.517889685 | 0.243618489 |
| 15.0 | 4.000000000 | 6.515504394 | 0.281098256 |

Take the same string down to 0.5 spm and the wave makes 195.465131814 round trips in one stroke, at 0.009369942 of the fundamental. A string the wave crosses two hundred times a stroke is behaving as a spring: every point of it has heard about the surface motion long before the surface motion has finished. A string it crosses six or ten times a stroke is a wave machine, and the two rules for the plunger stroke separate over exactly that range.

## What the march does with the wave

The step size is set by the wave, not by the operator. On the published taper the time step is 1.023192e-3 s at 5 spm and 1.023123e-3 s at 9 spm, both tied to the fastest section wave speed of 16288.760984 ft/s. The slower run therefore takes more steps in a cycle, 11728 against 6516, because the cycle is longer and the step is not.

Damping enters as a coefficient rather than as a friction model: kappa is 1.023453037 per s on the published taper at both speeds, since it is built from the damping ratio and the string, not from the speed.

## What it refuses

An undamped string is refused, and the message says why: with no damping the string never settles into a repeating stroke. Both published runs settle, converged after 3 cycles with no warnings.

The wave picture also stops being an approximation of anything near the string's own note. The engine refuses a design at or above the fundamental, naming the number in the message.

## Exercise

Read the round trips per stroke at 5, 9 and 15 spm in the panel, and write the one way transit and the round trip time that produced them.

Then say which of the six speeds is the first where the wave crosses the string fewer than ten times in a stroke.
