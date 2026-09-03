# The strength boost factor

The one calibration knob, what it stands for, and how to read a result that depends on it.

{{panel:ps-sand-explorer}}

## What it is

A multiplier on the unconfined compressive strength. The criterion compares the effective hoop stress against the boost factor times the strength, and the factor defaults to one.

## Why a knob exists at all

Because the criterion is deliberately simple, and the simplifications all point the same way.

An unconfined compressive strength is measured with no confining pressure. Rock at the cavity wall is confined, and confined rock is stronger. A cavity of finite radius has a stress gradient that an infinite-plate solution ignores, and a gradient makes failure harder to initiate. And a small amount of failure at a cavity wall does not necessarily produce sand: the failed material can arch and stay put.

Every one of those makes the real rock behave stronger than the criterion says. So the criterion is conservative, and the boost factor is where that conservatism gets removed.

## What sets it in practice

Thick-walled cylinder testing. A core is drilled with a central hole and loaded until the hole fails, which reproduces the cavity geometry directly. The ratio of the observed failure stress to the unconfined strength is the boost factor for that rock.

Typical values are above one, and the literature reports a wide range.

## What the engine does with it

Nothing except multiply. It is an input, it is reported back in the result, and the result is labelled screening grade whatever the value.

## How to read a result

The margin is linear in the boost factor, because the boost only scales the strength and the strength enters the expression once. So doubling the boost adds a fixed amount to the margin, and the sensitivity is easy to see.

That linearity is worth exploiting: rather than arguing about the right boost factor, compute the boost at which the margin reaches zero. If that number is far below anything the literature reports, the interval is safe under any reasonable calibration. If it is inside the plausible range, the calibration matters and the core test is worth paying for.

## Exercise

Name three simplifications the boost factor compensates for and say which way each one biases the criterion.

Say what measurement calibrates the factor.

Then describe the inverse question worth asking instead of arguing about the value, and say what its answer tells you.
