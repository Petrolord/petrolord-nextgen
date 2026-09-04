# Working the capstone

Six steps in one order. A graded answer that is wrong is wrong at a step you can name.

{{panel:pd-profile-explorer}}

## Step one: sort the conditions into three objects

The traverse is a list of stations, each carrying its own pressure, temperature, z and inside diameter. The fluid is two numbers, an interfacial tension and a liquid density. The plunger takes a depth, a diameter, a slug length and gravity, a plunger weight, a line pressure, a casing pressure and an average temperature.

Sorting first is how you notice a temperature given in degF where the door wants degR, or a nominal tubing size standing in for an inside diameter.

## Step two: ask for the correlation once, and record where you asked

`recommendCorrelation` takes one pressure and returns guidance, not a decision. On EBOCHA-5 it returns coleman at the 880.0 psia wellhead and turner at the 1500.0 psia shoe, and the answer you carry through the whole study is whichever station you handed it. Write the station down beside the name.

## Step three: run every station and read the column, not the verdict

The ratio at each station, top to bottom. Report the crossing as a pair: the deepest station still reading healthy and the shallowest reading loading. On EBOCHA-5 that is 4500.0 ft at 1.0340528848 and 6000.0 ft at 0.9979085215.

## Step four: name the controlling station before sizing anything

The controlling profile point already carries `pPsia`, `tempR`, `z` and `idIn`, so it can be handed straight to the sizing. Nothing makes a caller do it. Hand the gauge's conditions in instead and the same candidate list returns 3.740 in rather than 3.476 in on EBOCHA-5, which is 0.264 in of tubing bought at the top of the well.

## Step five: screen the plunger flag by flag

`pressureOk` is casing against required lift. `glrOk` is what the cycle needs against what the well makes. `feasible` is those two and nothing else. Read all three, then read `liquidPerDayBbl` separately, because no verdict uses it.

## Step six: state every choice beside its number

The correlation, the station, the rate, the sample of candidates, the slug length, the shut-in.

## The checks

**Turner over Coleman must read 1.200000000000 at every station.** If it does not, the two runs were not the same station.

**Critical rate rises with depth on a normal traverse.** The EBOCHA-5 increments run 100.530141186, 108.952764374, 117.306240181, 108.584738855 and 116.116224791 Mscf/d. A fall means a station is out of order or a pressure is wrong.

**The five plunger terms must sum.** The published case sums to 225.8581556122 psia, and friction is linear, so adding 40.0 psi of friction gives 265.8581556122 psia.

**Slug length and slug volume are inverses.** 200.0 ft gives 1.1576450988 bbl and that volume returns 200.0000000000 ft.

## The failures to expect

Quoting the wellhead ratio as the well's. Sizing at the gauge. Taking the 400.0 scf per bbl per 1000 ft rule as the requirement when the balance asked 1.96264971 times more on the published case. Reading `ok = true` as a feasible plunger. Leaving the correlation unstated.

## Exercise

Work a well in the panel in that order and write the six answers with the choice that produced each.

Then say which one would move if you changed only the station you asked the correlation for.
