# Downhill, where the drop is negative

Run the SOKU trunk 3000.000000 ft downhill and it carries 29457958.5967 scfd when its outlet stands at 880.000000 psia, which is 30.000000 psia above its inlet of 850.000000 psia. Hand the solver that rate and it returns an outlet of 880.000000 psia and a drop of -30.000000 psi.

{{panel:fc-gasline-explorer}}

## The inverse agrees with the forward call exactly

The forward direction says that pressure carries that rate. The inverse direction, given the rate, returns {"p2Psia":880,"dpPsi":-30}, and the two differ by 0.000000 psi. A negative drop is not an error state and not a sign convention to be tidied up. It is the honest reading of a descent: the line arrives higher than it left, because the column of gas gave back more than the friction spent.

## The control, which is what makes the case conclusive

| the same descent | outlet psia | rate scfd | recovered psia | error psi |
| --- | --- | --- | --- | --- |
| outlet above the inlet | 880.000000 | 29457958.5967 | 880.000000 | 0.000000 |
| outlet below the inlet | 700.000000 | 65259103.7761 | 700.000000 | 0.000000 |

Both rows are the same hill, the same trunk and the same bisection. The second row puts the outlet genuinely below the inlet at 700.000000 psia, the line carries 65259103.7761 scfd, and the solve recovers 700.000000 psia with an error of 0.000000 psi.

That control is the point of the table. Both rows run the same bisection, so a result that came out right on one and wrong on the other could not be the search. What separates them is where the answer sits against the interval, and only the first row's answer sits above the inlet.

## Where 880 sits

The ceiling for this descent is 920.423606 psia. So 880.000000 psia is comfortably inside the bracket the physics defines, and comfortably outside a bracket that stopped at the inlet of 850.000000 psia. An answer that lies outside the interval being searched cannot be returned however good the search is, and what comes back instead is whatever the ends of that interval imply.

## Reading a negative drop in a report

A drop of -30.000000 psi means the terminal sees more pressure than the station sent, which is an ordinary fact about descending lines and a useful one. It is also the figure most likely to be typed back in as a positive number on its way into a summary, at which point the terminal is reported 30.000000 psi below the station rather than 30.000000 psi above it.

## Why the descent is the case that exposes the range

A descent is the only ordinary situation in which the correct answer lies above the inlet, which makes it the only one in which a bracket capped at the inlet is provably unable to hold the answer. It is the case where the failure is not a matter of degree.

## The mistake

The mistake is treating the negative sign as a defect and taking the absolute value. The sign is the answer.

The second mistake is testing an inverse solve only on flat lines. Every bracket bug in this family of code is invisible on a flat line, because on a flat line the ceiling and the inlet are the same number.

## Exercise

Give the rate at an outlet of 880.000000 psia on the 3000.000000 ft descent, and what the inverse returns for that rate. Give the control row at 700.000000 psia. Then state the ceiling for this descent and explain why the control shows the solver was not at fault.
