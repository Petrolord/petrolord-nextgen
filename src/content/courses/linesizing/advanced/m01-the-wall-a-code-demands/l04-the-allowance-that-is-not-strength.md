# The allowance that is not strength

The corrosion allowance is metal added to the wall that holds no pressure on the day the line is commissioned. It is the only term in the wall calculation placed there for a pipe that does not exist yet.

{{panel:fc-wall-pig-explorer}}

## Added on top, never divided in

At Class 3 on the SOKU pipe the pressure part of the wall is 0.294231 in and the required wall is 0.419231 in. The difference is the 0.125000 in allowance, added on top.

That is a different kind of arithmetic from the three factors. The design factor, the joint factor and the derate all divide, so each of them scales the pressure wall. The allowance adds, so it is the same 0.125000 in at every class.

| code | class | pressure wall in | required wall in |
| --- | --- | --- | --- |
| B31.8 | 1 | 0.204327 | 0.329327 |
| B31.8 | 2 | 0.245192 | 0.370192 |
| B31.8 | 3 | 0.294231 | 0.419231 |
| B31.8 | 4 | 0.367788 | 0.492788 |

Both columns grow down the table while the step between them holds, which is what an added term looks like standing beside scaled ones.

## What it is for

It holds no pressure on the day it is installed, and it is what lets the pipe still hold pressure years later. A design life is buried inside it: a corrosion rate somebody measured or assumed, multiplied by the years the line is meant to run, is what produced 0.125000 in.

Neither of those two numbers appears anywhere in this engine. The allowance arrives as an input, already reduced to a single thickness, so it carries the same honesty problem as any assumed input. The engine cannot tell whether the rate behind it came from a coupon or from a habit.

## It cannot be negative, and it can be too large

Metal added to a wall cannot be negative, and the engine says exactly that: "a corrosion allowance is metal added to the wall and cannot be negative". A negative allowance is metal removed, which is a different physical claim wearing the same argument name.

At the other end an allowance can eat the whole wall. A rating with nothing left underneath returns "no pressure-bearing wall left after corrosion allowance", which is the engine declining to rate a pipe that has already corroded through on paper.

## The mistake

The mistake is counting the allowance as strength. A line built to Class 3 with 0.419231 in of wall has 0.294231 in doing structural work, and reporting the larger figure as the pressure-carrying wall overstates the pipe by the whole allowance from day one.

The second mistake is comparing a wall carrying an allowance against one that is not. The published B31.4 case at 1440.000000 psig was called with an allowance of 0.000000 in, so its 0.2451923077 in is a pure pressure wall and is not the same quantity as SOKU's 0.419231 in.

## Exercise

Give the SOKU pressure wall and required wall at Class 3 and name what separates them. Then explain why the step between the two columns holds across all four classes while both columns grow, and give the two refusal messages that involve a corrosion allowance.
