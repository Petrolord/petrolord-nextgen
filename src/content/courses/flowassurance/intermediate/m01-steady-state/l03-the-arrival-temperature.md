# The arrival temperature

One closed form gives the far end: ambient plus the inlet excess times exp of minus the length in relaxation lengths. Nothing about the pipe between the two ends changes it.

{{panel:pd-line-explorer}}

## Three lengths of one line

The published fluid enters at 180.0 degF against a 40.0 degF ambient at 120000.0 lb/hr and Cp 0.5, through the published insulated build on the 6.065 in bore. The three published cases share a relaxation length: 28308.04630582 ft as the golden has it, 28308.04610085 ft as the engine returns it.

| Length, ft | Engine ntu | Engine arrival, degF | Excess lost, percent |
| --- | --- | --- | --- |
| 5280.0 | 0.186519407987 | 156.177943871283 | 17.01575427 |
| 26400.0 | 0.932597039935 | 95.094251524883 | 60.64696293 |
| 105600.0 | 3.730388159740 | 43.357693442744 | 97.60164748 |

The golden arrivals are 156.177944028181 degF, 95.094251896906 degF and 43.357693533435 degF, agreeing with the engine to relative differences of 1.004609e-9, 3.912144e-9 and 2.091692e-9.

## More pipe is not proportionally more cooling

At 5280.0 ft the line has lost 17.01575427 percent of its excess. At 26400.0 ft it has lost 60.64696293 percent, and at 105600.0 ft, 97.60164748 percent. The excess retained is 82.98424573 percent, then 39.35303707 percent, then 2.39835252 percent, and those three come from exp of minus the ntu and from nothing else. Length buys cooling fastest while the fluid is still hot.

## An arrival is not a verdict

`steadyStateProfile` returns `ok = true`, an arrival and its stations. It has no boundary field, no margin field and no verdict, because neither module computes where the hydrate boundary is. Not one of the three published arrivals above is safe or unsafe: no boundary was supplied to judge any of them against. An `ok = true` here means only that the call was given a length, a mass rate, a heat capacity and a heat transfer coefficient.

## The direction it does not refuse

Hand the same published build an inlet 20.0 degF below the 40.0 degF ambient and the call returns `ok = true` with an arrival of 39.5203295082 degF. That is correct and it should not be refused. A line colder than what surrounds it warms towards it on the same exponential, with the same relaxation length and the same ntu, and the engine needs no special case for it. The exponential does not know which way the heat is going.

## The careful mistake

Quoting an arrival to more figures than the boundary it will be compared against. The three arrivals here are reproducible to the ninth figure between two independent implementations, and the laboratory number they would be judged against is good to nothing like that. A margin inherits the worse of its two ends, and the engine end is not the weak one.

## Exercise

Run the published fluid at 5280.0 ft and at 105600.0 ft and record both arrivals and both values of ntu.

Then say how much of the total cooling happens in the first 5280.0 ft, and why the last stretch of a long line does so little.
