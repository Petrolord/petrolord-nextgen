# The crossing

Two curves run down the same hole in opposite directions of advantage, and the point of injection is where the gas stops winning by enough.

{{panel:pd-unloading-explorer}}

## The condition, stated

The deepest injection point is the depth where the injection pressure exceeds the flowing production pressure by exactly the transfer differential. Above it the gas has more than enough to enter the tubing. Below it the production side has caught up. On the published case, surface 1014.7 psia, gas gravity 0.65, transfer differential 100.0 psi, maximum depth 8000.0 ft, wellhead 100.0 degF and bottom 190.0 degF at 8000.0 ft, the committed answer is 7739.814701036 ft with an injection pressure of 1209.238206006 psia and a production pressure of 1109.233316949 psia.

## Two curves and one of them is a table

The injection side is the static gas column marched down the annulus, read at any depth off a tabulation of 40 samples. The production side is the traverse the caller passed in, read between its rows. The engine returns 7739.815725361 ft, 1209.238141416 psia and 1109.233464452 psia, and reports a residual of 4.67696e-3 psi against the 0.5 psi its own gate allows. Against a converged column and a continuous traverse the crossing sits at 7741.133436499 ft, where the injection pressure is 1209.271050491 psia and the production pressure is 1109.271050491 psia, a pair separated by exactly the 100.0 psi the case declares.

## Three ways this function returns

| limitedBy | Meaning | Example |
| --- | --- | --- |
| pressure, depth above the table's end | a real crossing was found | 7739.815725361 ft at 1014.7 psia |
| depth | the table ran out with gas still winning | 8000.000000000 ft at 1214.7 psia |
| pressure, depth 0 | gas lost at the first row, the well will not lift | 0 ft |

Only the first is a crossing. At 1214.7 psia the returned injection pressure is 1460.125387434 psia against a production pressure of 1146.7000 psia, which is not 100.0 psi apart and was never solved for.

## The mistake

Taking the residual as a measure of how good the depth is. Both sides of that residual are read off straight lines drawn between tabulated points, so a small value says the two straight lines agree with each other at the depth the function picked. It says nothing about whether either line is near its curve. The published answer reports 4.67696e-3 psi and sits -1.317711139 ft and -0.032909074 psi from the converged crossing, where the true residual is 1.58211e-1 psi, 33.83 times the number reported.

## What it refuses

It refuses to check the traverse it was given, it refuses to tell you the tabulation spacing that produced the answer, and it refuses to convert depth into anything. There is no inflow relation and no multiphase outflow in the module at all.

## Exercise

Read the published crossing in the panel and write down the depth, both pressures and the limitedBy value.

Then raise the surface injection pressure to 1214.7 psia and say, using the two pressures it returns, why the answer is not a crossing.
