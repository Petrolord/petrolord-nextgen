# Cased hole and open hole

Two factors, one string, and where the boundary sits.

{{panel:td-friction-explorer}}

## The geometry list

The engine takes a list of hole sections, each with a depth range, a diameter, a cased flag and its own friction factor. In this course:

| well | cased to | cased factor | open-hole factor |
|---|---|---|---|
| vertical | 1200 m | 0.25 | 0.35 |
| slant | 1400 m | 0.25 | 0.35 |
| build and hold | 1800 m | 0.25 | 0.35 |
| horizontal | 1200 m | 0.25 | 0.35 |
| three-dimensional turn | 900 m | 0.25 | 0.35 |

The cased sections are 0.2204974 m in diameter and the open holes are 0.2159 m, which is a 8.5 inch bit inside 9 5/8 inch casing.

## Which factor applies where

The engine takes the section at the MIDPOINT of each integration interval. So an interval that straddles the shoe gets one factor for its whole length, whichever section its midpoint falls in.

At a 10 m step that is a discretisation of up to 10 m at one boundary, and it is one of the reasons the step matters. Refine the step and the boundary is resolved more finely.

## Where the boundary actually matters

It matters where the string is generating side force. If the shoe sits in the vertical section above the kick-off, as it does on the vertical and horizontal wells here, then the cased-hole factor is being applied to a length of string that produces no side force at all, and its value is irrelevant.

Set the cased factor to zero on the horizontal well and nothing changes, because the casing is all in the vertical section.

On the build-and-hold well the shoe at 1800 m sits inside the build, so there the cased factor does matter, and changing it moves the answer.

## The lesson

Before caring about a friction factor, find out what side force it multiplies.

A factor applied over a long interval with no contact force contributes nothing. A factor applied over a short interval in a hard dogleg contributes a lot. The DEPTH DISTRIBUTION of side force decides which factors in the input actually matter, and the panel's side-force view is where to look.

## The practical consequence

When a calibration is done, it fits ONE parameter, usually the open-hole factor, holding the cased one at a book value. That is defensible when most of the side force is in open hole and indefensible when it is not.

Fitting both from one observation is not possible, and the last lesson of module 4 is about what people do instead.

## Exercise

On the build-and-hold well, set the cased-hole factor to 0.15 and then to 0.35, leaving open hole at 0.35, and record the pick-up hookload each time.

Repeat the experiment on the horizontal well. Explain the difference between the two results using the shoe depths and the kick-off depths.
