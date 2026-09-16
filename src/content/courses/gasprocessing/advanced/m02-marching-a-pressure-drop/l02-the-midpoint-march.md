# The midpoint march

The module marches the let-down in equal pressure steps. What makes the march second order rather than first is what it does inside each step, and it is worth reading carefully because half of it is easy to get right and the other half is easy to forget.

{{panel:fc-coldend-explorer}}

## Both halves of the half step

Within a step the module takes the half-step pressure and the half-step temperature, and evaluates the coefficient there. That pair is a midpoint Runge-Kutta step, and it is second order in the step size.

Taking the half-step pressure alone would be the obvious half of the idea, because the pressure is the variable being marched and its midpoint is known before the step begins. The temperature is different. The gas is cooling as it goes, so the temperature at the middle of a step has to be estimated from the slope at the start before the full step can be taken at the midpoint. Evaluating the coefficient at the midpoint pressure while holding the temperature the step began at gives up the second order and leaves a first-order march wearing a midpoint's clothes.

Both halves move. The engine moves both.

## What second order means here

A second-order march has an error that falls with the square of the step size. That is a statement about the method rather than a prediction about any particular let-down, and the convergence table in the next lesson is where it gets measured on this one.

On AGBADA from 1180.000000 psia to 640.000000 psia over twenty steps the gas arrives at 59.683516566 degF, having cooled 36.316483434 degF.

## What the march refuses, and why each is a different fault

The step count is an input and it has a shape, so three different wrong shapes come back as three different messages.

A march of zero steps comes back as { error: "the march needs a positive whole number of steps (got 0)" }. A march of -5 steps gives the same family with its own value. A march of 0.4 steps does too, because a fractional count is a different mistake from a missing one and the message shows you which you made.

The pressures have a shape as well. A let-down to a pressure above the inlet comes back as { error: "a Joule-Thomson let-down needs the inlet above the outlet: 640 against 1180 psia" }, and two equal pressures come back the same way with both values printed. Neither is treated as a zero-length march that quietly returns the inlet temperature.

That is the pattern to expect everywhere in this module. A refusal names the input, names the value it was handed, and says what shape it wanted.

## Exercise

Describe the two quantities the module takes at the half step, and say which of them needs an estimate before the step can be taken. Record the arrival temperature and the cooling over twenty steps on the AGBADA let-down. Then write down the three step-count refusals and say what distinguishes each from the other two.
