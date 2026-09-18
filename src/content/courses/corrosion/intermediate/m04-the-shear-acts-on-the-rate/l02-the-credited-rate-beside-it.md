# The credited rate beside it

{{panel:fc-inhibitor-integrity-explorer}}

The engine reports two rates on every case: the rate, and the rate the
datasheet corrosion inhibitor efficiency would have given. It reports both
whether or not the credit was actually taken. On a case where the film survives
the two are the same number, and printing a figure twice looks redundant until
you meet the case where they differ.

On the studio's shipped default case the rate is 0.754524 mm/yr and the rate
with the film credit kept is 0.754524 mm/yr. The film is not stripped, the wall
shear is 14.408065 Pa and the film risk is low, so nothing was taken away and
the two columns agree.

## The case where they separate

Take that same shipped case and raise the velocity from 10 to 60 ft per second.
The wall shear becomes 362.474888 Pa against the measured stripping threshold of
100.000000 Pa, the film risk is high, the credit is removed, and the rate is
13.080024 mm/yr against a credited 1.896603 mm/yr. The remaining life falls from
4.207953 yr to 0.242737 yr.

Nothing about the chemistry changed between those two screens. The temperature,
the pressure, the CO2 and H2S fractions, the pH and the corrosion inhibitor
programme are all identical. One flow input moved and the module changed which
rate it was willing to stand behind.

## Why report the credited rate at all

Because it is the rate a reader already has in their head. Somebody who has been
working from a datasheet efficiency has been carrying the credited figure
around, and a screen that showed only the stripped rate would look like a
different calculation rather than the same calculation with one credit removed.
Printing both makes the change legible and lets the reader see exactly what the
shear verdict cost.

It also makes the verdict arguable. The stripping threshold is held for
literature and carries no source in this repository, so a reader may reasonably
want to know what the answer would be if the film did survive. That answer is
already on the screen.

## Reading the pair as a bracket

On a stripped case the two rates are a pair of bounds on one question. The
stripped rate is what the line sees if the held stripping threshold is right.
The credited rate is what it sees if the film in fact survives these
conditions. Nothing in this repository settles which of those is true, so a
reader who quotes both and says which assumption produces which is giving an
honest account of what the module knows.

## Two numbers, one chain

Both rates are computed through the same correlation with the same inputs. They
differ in one factor, which is the corrosion inhibitor credit. Everything else
in the chain, every held constant and every correction factor, appears
identically in both. That is worth holding onto, because it is what makes the
relationship between them arithmetic rather than a second model.

## Exercise

Record the rate, the rate with the film credit kept, the wall shear and the
remaining life for the shipped case and for the same case at 60 ft per second.
State which of the four figures are unchanged between the two screens, and
which inputs you altered to get from one to the other.
