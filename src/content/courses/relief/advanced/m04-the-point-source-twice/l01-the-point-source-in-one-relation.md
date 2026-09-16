# The point source, in one relation

A flare radiates, and the screening model for how much of that reaches a distance treats the flame as a point. This engine carries that model, and it is the second copy of it in this package, which turns out to be the most interesting thing about it.

{{panel:fc-blowdown-explorer}}

## The relation, and the constant measured out of it

The heat release spreads over a sphere, a stated fraction of it goes out as radiation, and a stated fraction of that survives the air between the flame and the receiver. That leaves one geometric constant, the solid angle, and it is not exported.

So the digest measures it. Rearrange one returned intensity against its own stated release, radiated fraction, transmissivity and distance and the only number left over is 12.566370614359.

That is a computed quantity rather than a held one. The validation oracle finds the sphere area by quadrature, which is an independent route to the same figure, so this is one of the constants in the module that something actually checks.

## The AFIESERE flare

The vessel this module has been depressuring discharges to a flare, and the flare is stated as a relief rate of 210000.0000 lb/hr at a lower heating value of 19400.0000 Btu/lb, with a radiated fraction of 0.320000 and a transmissivity of 0.920000.

The heat release is derived from the first two of those through the conversion from Btu per hour to kilowatts: 1193971.5392 kW. Note where the derivation happens. The engine takes a heat release in kilowatts and does not know about rates or heating values, so the mass rate and the heating value are the caller's arithmetic and the caller owns any error in them.

| distance m (stated) | intensity kW/m2 |
| --- | --- |
| 40.000000 | 17.482435 |
| 60.000000 | 7.769971 |
| 80.000000 | 4.370609 |
| 100.000000 | 2.797190 |
| 140.000000 | 1.427138 |
| 200.000000 | 0.699297 |
| 300.000000 | 0.310799 |
| 450.000000 | 0.138133 |

At the stated 140.000000 m the intensity is 1.427138 kW/m2.

## The one comparison you are invited to make

The intensity falls with the square of the distance, and the digest says so and tells you how to see it: read any two rows of the sweep and form the ratio of the intensities against the ratio of the squared distances. That is an unusual licence in this course and it is granted because the relation is exact and stated. Take it, on a pair of rows of your own choosing, and watch the two ratios meet.

## What the call returns

One number. The intensity route returns an object carrying a single field, the intensity in kW/m2, with no note, no warning and no flag. The blowdown march returns eleven fields because it integrates and owes you an account of how. The point source evaluates one relation and has nothing to account for, so it accounts for nothing.

That contrast is worth holding. The size of a return is a statement about how much the route had to decide.

## Exercise

Name the four inputs the intensity relation takes and record the solid angle measured out of it, saying what checks it. Record the flare's stated rate, heating value, radiated fraction and transmissivity, and the heat release derived from the first two. Record the intensity at 140.000000 m. Then pick two rows of the sweep, form both ratios the digest invites, and say what the point source route returns.
