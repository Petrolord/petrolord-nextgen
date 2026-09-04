# Onward

The column says what the gas weighs at any depth. The Professional tier says what a valve does when it gets there, and a valve is a spring, a thermometer and an orifice at once.

## Spacing turns out to be a recursion

Valve 1 came from one condition. Every valve after it comes from the valve above it, so a string is not a list. On westTexasOil the increments shrink all the way down: 1563.466503048, 1219.124638408, 932.894452784, 695.704880900, 499.764326349, 338.419771412 and 131.375432376 ft. The surface pressure falls by a fixed amount per valve while the transfer pressure it must beat rises with depth, which is why a design runs out of room rather than out of valves.

Change the decrement and every depth below the change moves. westTexasOil at 15.00 psi per valve places 7 valves and stops on target depth, at 27.50 it places 7 and stops on minimum spacing, at 35.00 it places 6. Valve 1 never moves.

## A dome charge is a thermometer

A valve is set on a 60 degF test rack and then works at whatever temperature its depth gives it. A 600.0 psia charge reads 675.573876944 psia at 120.0 degF, a correction factor of 0.888133808. A 1200.0 psia charge reads 1720.461713076 psia at 250.0 degF, factor 0.697487187.

The old linear rule predicts a dome pressure 1.826123 psi high at 120.0 degF and 30.261713 psi low at 250.0 degF, so it drifts further the hotter and deeper the valve sits. Another flat rule of thumb, and another case where only the controlled comparison settles it.

## What a port passes

Thornhill and Craver, an orifice equation with a discharge coefficient of 0.865 and a critical pressure ratio of 0.551208318. A 0.25 in port on 1000.0 psia passes 1255.291661609 Mscf/d down to 300.0 psia and 796.940795075 Mscf/d down to 900.0 psia. It is an upper bound on what a valve passes, not a prediction, because it does not know a real valve throttles on its stem before it is fully open.

## What you take with you

The march, the reading at a depth, the fixed point, and the habit that matters most: refine and watch. That habit is what tells a truncation shrinking by a factor near 4 from a residual parked at -8.5879e-2 psi because two different things are being compared. It is the same habit that will tell a real defect in the valve work from a number that merely looks uncomfortable.

## Exercise

Write the westTexasOil spacing increments in order, then say what would happen to each of them if valve 1 moved deeper by 119.249955500 ft, and which increment would run out of room first.
