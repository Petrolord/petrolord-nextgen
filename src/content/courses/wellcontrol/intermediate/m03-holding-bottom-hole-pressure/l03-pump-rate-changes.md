# Pump rate changes

Why they are made carefully, and what has to move with them.

{{panel:wc-killsheet-explorer}}

## The problem

The bottom hole pressure is the drill pipe surface pressure plus the head in the string plus the FRICTION of circulating.

Change the pump rate and the friction changes. So the surface pressure has to change by the same amount in the opposite direction, or the bottom hole pressure moves.

## The rule

Change the rate SLOWLY, holding the CASING pressure constant while it changes.

Holding the casing pressure constant holds the bottom hole pressure constant, because the annulus is not changing while the rate is being adjusted: nothing is being displaced that would not have been.

Once at the new rate, read the drill pipe gauge. That reading is the new schedule's starting point.

## Why the casing gauge and not the drill pipe

Because the drill pipe pressure is SUPPOSED to change: the friction term in it is changing.

The casing pressure at a fixed annulus content and fixed bottom hole pressure is fixed, so holding it constant is exactly the right instruction while the rate moves.

That is a genuine reversal of the usual rule, and it is the one place in a kill where the casing gauge is the one being controlled.

## The scaling

The slow circulating rate pressure at one rate can be scaled to another approximately:

    p2 = p1 x (rate2 / rate1)^n

with n around 1.8 for turbulent flow in the string, which is where most of it is.

That is an approximation and it is why the slow circulating rate pressure is measured at more than one rate whenever there is time.

## When the rate has to change

**Pump trouble.** A liner washes out, a valve fails, and the rate has to come down while it is fixed.

**The choke runs out of range.** If it is fully open and the pressure is still too high, the rate has to come down.

**A deliberate reduction** as gas approaches the surface, to give the operator more time.

## What happens if it is done wrongly

The bottom hole pressure steps, up or down, for the duration of the transition.

Down means more influx. Up means the shoe sees more pressure. Both are avoidable by holding the casing gauge while the rate moves, which takes a minute.

## Exercise

The slow circulating rate pressure is 4500000 Pa at 30 strokes a minute. Estimate it at 20 strokes a minute with an exponent of 1.8.

Then say what the initial circulating pressure would become for the horizontal well's moderate scenario at the lower rate.
