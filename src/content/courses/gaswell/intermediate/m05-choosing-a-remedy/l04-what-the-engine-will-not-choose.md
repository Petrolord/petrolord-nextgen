# What the engine will not choose

Every function in this domain computes a consequence. Not one of them computes a preference.

{{panel:pd-profile-explorer}}

## Read the returned objects for what is absent

`sizeTubingForRate` gives back `rows`, `largestUnloaded` and `ok`, and each row carries `idIn`, `ok`, `correlation`, `adjustment`, `rhoGasLbFt3`, `terminalFtS`, `velocityFtS`, `constant`, `areaFt2`, `criticalVelocityFtS`, `criticalRateMscfd`, `actualVelocityFtS`, `ratio` and `loaded`.

`screenPlungerLift` gives back `lift`, `gasPerCycleScf`, `liquidPerCycleBbl`, `requiredGlrScfBbl`, `wellGlrScfBbl`, `ruleOfThumbGlrScfBbl`, `ruleOfThumbAgrees`, `timing`, `liquidPerDayBbl`, `gasPerDayMscf`, `pressureOk`, `glrOk`, `feasible` and `warnings`.

Between them there is no cost, no duration, no rig time, no deferred production and no date. There is nothing to compare a 3.476 in workover against 16.01716223 plunger trips a day with, because neither answer is expressed in anything the other one is.

## The one preference that is encoded

`largestUnloaded` is the largest inside diameter whose ratio clears one. On EBOCHA-5 under Coleman that is 3.476 in at 1.0022156322, while 3.068 in at 1.2865006128 and 2.441 in at 2.0322875149 also clear.

That is a preference for the biggest bore that works, and it is a reasonable one, since a bigger bore is cheaper to run and easier to intervene through. It is still a preference, made once by an engine author, and the returned object does not say so.

## Guidance is not a decision

`recommendCorrelation` takes one pressure and returns a name and a sentence. It does not switch the correlation for anybody and it cannot see which station the pressure came from. Asked at 880.0 psia on EBOCHA-5 it returns coleman; asked at the 1500.0 psia shoe on the same well it returns turner.

The sizing has the same shape of silence. It records the correlation on every row, as coleman or turner with its adjustment of 1.0000 or 1.2000, and it records the station nowhere, so two sizings run at two depths on one well are indistinguishable from what they return.

## What is missing from all of it

There is no inflow performance in these modules, so the rate is an input, and every verdict is a verdict at a rate somebody supplied rather than a forecast. The plunger's rise and fall speeds, its afterflow and its shut-in are operating inputs with typical bands, not computed and not optimised. And the screen never compares the 14.83375148 bbl/d it carries to the 194.91525424 bbl/d the well makes.

## The mistake

Handing a decision maker `largestUnloaded = 3.476 in` as a recommendation. It is the answer to a narrow question: the biggest listed bore whose ratio clears one, at one station, at one rate, under one correlation. The recommendation is the part you add.

## Exercise

List the fields the sizing returns and mark every one that would change if the workover cost doubled.

Then write the sentence you would put in front of a manager, and say which of its clauses came from the engine.
