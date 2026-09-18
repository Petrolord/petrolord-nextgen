# Stokes, and the Reynolds number it is stated to

A method that is honest about where it stops is worth more than a method that answers everywhere. This module states its rise velocity to creeping flow, reports the Reynolds number beside every velocity it gives, and warns when the droplet it just sized sits outside that band.

## Two routes to the same velocity

The engine can produce a rise velocity two ways. The first is the closed form, solved in one line under the creeping flow assumption. The second is a full drag balance, a damped iteration on the Schiller-Naumann drag coefficient, which does not assume the flow is slow. Those are two different methods rather than two copies of one, which is what makes their agreement evidence of anything at all. Run both across droplet size in the UZERE water:

| droplet micron | Stokes m/s | Reynolds | full drag balance m/s | Stokes over the balance | in band |
| --- | --- | --- | --- | --- | --- |
| 5 | 0.000002729456 | 0.000020 | 0.000002729215 | 1.000088 | yes |
| 20 | 0.000043671293 | 0.001273 | 0.000043604293 | 1.001537 | yes |
| 60 | 0.000393041638 | 0.034359 | 0.000387364475 | 1.014656 | yes |
| 120 | 0.001572166551 | 0.274873 | 0.001484057918 | 1.059370 | yes |
| 240 | 0.006288666203 | 2.198987 | 0.005136559522 | 1.224295 | no |
| 500 | 0.027294558174 | 19.883778 | 0.015286135319 | 1.785576 | no |

## The departure grows with the Reynolds number

Read the fifth column, which is the two velocities on each row divided. It rises on every row of the table. At 5 micron and a Reynolds number of 0.000020 the two routes agree to 8.83e-5. At 120 micron and a Reynolds number of 0.274873 they already differ by 5.937008 percent. At 500 micron and a Reynolds number of 19.883778 the closed form overstates the rise by 78.557612 percent. There is no cliff in that column and no threshold where the answer suddenly breaks. The band is a line drawn across a smooth departure, which is why the module reports the Reynolds number itself rather than only the verdict about it, and why a reader should look at the figure rather than the label.

## Where the module draws the line

The module states the closed form to a Reynolds number of 1 and warns above it, which is the declared limit sitting in the same frozen object as every other choice in the engine. The warning is not a refusal. The velocity still comes back, and the reader is told that the assumption behind it has been left behind. That is the right treatment for a smooth departure: a number just past the line is nearly as good as a number just inside it, and refusing would throw away a usable answer to make a point about a boundary.

## The direction of the error, which is the reason for the warning

Notice which way the departure goes. The closed form gives the larger velocity on every row where the two disagree, so a droplet is being credited with rising faster than it will. A rise velocity that is too high produces a cut size that is too small, which says the equipment catches finer droplets than it really does. The error is in the optimistic direction, and an optimistic error is the one a designer is least likely to catch by looking at the answer. That is why the module warns rather than leaving the reader to notice.

{{panel:pw-water-explorer}}

## Exercise

Describe in one sentence what the fifth column of the table measures. Then explain why an overstated rise velocity produces an understated cut size, and why that particular direction of error earns a warning.
