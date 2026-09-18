# A differential at or above the static pressure

Some inputs are not a difficult case. They are a mistake, and the useful thing a
tool can do with them is to say which mistake it is.

## The case

Ask this engine for a flow with a differential of 500 in H2O on a line at 14.7
psia and there is no flow to compute, because the pressure downstream of the
plate would be zero or below. What comes back is this:

   > the differential of 500 in H2O is 18.06 psi, which is at or above the static pressure
     of 14.7 psia. The downstream pressure would be zero or negative, so this is a
     differential range or a static pressure that is wrong rather than a flow

Read what that message is doing. It converts the differential into psi for you,
so you can see the two figures in the same units. It names both of them. And it
finishes by telling you which two inputs to go and look at.

## Why naming the case matters

The alternative is an engine that carries on and falls over somewhere further
down. Left unnamed, this case falls through the arithmetic to a message about
the Reynolds number, which is where the digest says it would land. That message is true and it is useless, because the Reynolds number is not where
the fault lies. Somebody then spends an afternoon on fluid properties when the
real fault is a transmitter range typed in the wrong units or a static pressure
entered in gauge where the equation wants absolute.

An error message is a diagnostic instrument. It is read at the moment its reader
knows least about what went wrong, and the measure of a good one is how quickly
it puts the reader in front of the right input.

## The other three refusals this function carries

The same function guards three more cases and each has its own sentence:

   > the orifice bore must be positive and smaller than the pipe bore
   > flow needs a positive differential, density and viscosity
   > a compressible flow needs a positive static pressure

The first is geometry that cannot exist. The second catches the empty field and
the sign error together. The third is the compressible case specifically, since
a static pressure is what the expansibility factor of the previous lessons is
computed against.

## What this means for you as a user

When one of these comes back, nothing is broken. You have been handed the
shortest correct description of the state your inputs are in. The wrong response
is to look for the setting that turns the check off. The right response is to
read which two quantities the message named and check them against the
instrument datasheet, because one of them is genuinely wrong.

## Exercise

Take the first message. Name the two inputs it tells you to go and check, and
say which of the two you would look at first on a run where the static pressure
was read off a gauge on the pipe.
