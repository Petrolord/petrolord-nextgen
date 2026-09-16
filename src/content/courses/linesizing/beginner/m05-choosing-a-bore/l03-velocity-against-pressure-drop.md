# Velocity against pressure drop

Two columns of the sweep answer two different questions. The velocity says whether the bore is acceptable. The pressure drop says what it costs.

{{panel:fc-liquid-explorer}}

## The two columns at the ends of the table

| nominal | schedule | bore in | velocity ft/s | total psi | ratio |
| --- | --- | --- | --- | --- | --- |
| 2 | 40 | 2.067000 | 33.463911 | 20803.315944 | 2.470444 |
| 3 | 40 | 3.068000 | 15.189621 | 2820.384450 | 1.121360 |
| 6 | 40 | 6.065000 | 3.886834 | 97.306913 | 0.286942 |
| 8 | 40 | 7.981000 | 2.244621 | 25.660631 | 0.165707 |
| 16 | 40 | 15.000000 | 0.635441 | 1.236026 | 0.046911 |

## They move together and they are not the same thing

Both columns fall as the bore opens, so on this duty a bore that is acceptable on velocity is usually cheap on pressure as well. That agreement is a property of this particular line rather than a rule, and it hides the fact that the two columns are answering different questions.

The velocity column is checked against a ceiling that came from the fluid density and a c factor. The pressure column is checked against whatever pressure the system has to spare. One is a limit and the other is a budget.

## A budget can be argued with

If 97.306913 psi is more than the available pressure, there are answers other than a larger bore. Pumping can be added, the route can change, or the duty can be reduced. The number is a cost and costs can be traded.

If the velocity ratio reads 2.470444 there is nothing to trade. The line is running at more than twice the ceiling the check allows, and the only answers are a larger bore, a different c factor with a reason behind it, or a different fluid.

## Reading the ratio column directly

The ratio is the line velocity over the erosional ceiling, so 1.000000 is the boundary. The 3 in row at 1.121360 is the interesting one: its pressure drop of 2820.384450 psi would already have ruled it out on cost, and its ratio rules it out on its own.

## The row in the middle

The 6 in schedule 40 row is where a designer's eye lands. It runs at 3.886834 ft/s, sits comfortably inside the ceiling at a ratio of 0.286942, and spends 97.306913 psi.

Whether that is the answer depends on the pressure available. With plenty to spare it is a smaller and cheaper pipe than the 8 in line that was built. With little to spare, 97.306913 psi against 25.660631 psi is the whole argument for the larger bore, and the erosional check has nothing to say either way.

## The mistake

Choosing the bore where the pressure drop first becomes tolerable. On this duty that would land near the 3 in row, which fails the erosional check. The cost curve falls smoothly through a bore that is not allowed.

## Exercise

Say which of the two columns is a limit and which is a budget, and give one answer available for a budget that is not available for a limit. Then give the velocity, the pressure and the ratio on the 3 in row, and say what each of the two checks concludes about it.
