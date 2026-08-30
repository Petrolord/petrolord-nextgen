# The two depths

Measured and true vertical, and which one each calculation wants.

{{panel:wc-volume-explorer}}

## The rule

**Volumes use MEASURED depth**, because a volume is an area times a length along the hole.

**Pressures use TRUE VERTICAL depth**, because a hydrostatic pressure comes from vertical height.

Every error in this course of the confusing-the-two kind comes from applying one where the other belongs.

## The horizontal well

| quantity | value |
|---|---|
| bit measured depth | 2800 m |
| TVD at the bit | 1214.859173174 m |
| shoe measured depth | 1200 m |
| TVD at the shoe | 1172.343525979 m |

Read the last two rows together. The shoe is at 1200 m of measured depth and 1172.343525979 m of TVD, and the bit is at 2800 m of measured depth and 1214.859173174 m of TVD.

So 1600 m of measured depth between the shoe and the bit is only 42.515647195 m of true vertical depth.

## What that does

**To the formation pressure:** the mud column at the bit is only 1214.86 m tall, not 2800. A shut-in drill pipe pressure of 2 MPa on this well means a much higher pore pressure gradient than the same reading on a vertical well.

**To the kick tolerance:** the shoe and the bit are at almost the same pressure, so there is very little room for an influx to expand into before the shoe is at its limit.

That second consequence is the whole reason the two wells in this course have such different answers.

## The slant well for contrast

Its shoe and its bit are separated by more than 1200 m of true vertical depth. The influx has a long way to travel before it reaches the shoe, and the pressure falls a great deal on the way.

## Which one a driller reads

Measured depth, on the geolograph. True vertical depth comes from the survey, and it is on the kill sheet's standing part.

A kill sheet with a measured depth in the TVD box is a specific and dangerous error, and it is the reason both are written out in full rather than abbreviated.

## Exercise

Compute the mud hydrostatic pressure at the bit on the horizontal well with 1440 kg/m3 mud, using the TVD.

Then compute what you would get using the measured depth, and express the difference as a fraction. Say which way the error goes and what it would do to a computed formation pressure.
