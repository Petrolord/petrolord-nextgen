# The screen and its verdict

Three flags come back and only two of them are about the well.

{{panel:pd-profile-explorer}}

## The flags on OGUTA-2

The teaching well is 8200.0 ft of 2.441 in tubing making 1150.0 Mscf/d at 5900.0 scf/bbl, screened for a 160.0 ft slug of 1.060 SG liquid behind an 8.20 lb plunger, at 145.0 psia line and 720.0 psia casing.

`ok = true` with no errors. That is a statement about the inputs: a depth, a diameter, a slug shorter than its tubing, a plunger weight and a temperature were all present and usable.

`pressureOk = true`. The casing stands at 720.0 psia against a required lift pressure of 248.1897322873 psia, exceeding it by 471.8102677127 psi. There is pressure to spare.

`glrOk = false`. The cycle needs 9561.17363265 scf/bbl and the well makes 5900.0 scf/bbl.

`feasible` is those last two joined: `pressureOk` and `glrOk`, so it is false. Nothing else enters it.

## The warning names the fix

The screen raises `insufficientGas`: "A cycle needs 9,561.2 scf of gas per barrel and the well makes 5,900.0. There is not enough gas to drive the plunger at this slug size."

The last four words are the useful ones. The requirement is per barrel and the barrels come from the slug, so this is not a verdict about plunger lift on this well, it is a verdict about plunger lift on this well at a 160.0 ft slug.

Which way to move it is a separate question the screen does not answer. Slug length sets the barrels a trip carries and it sets the lift pressure too, so it moves both halves of the ratio at once.

## What the object hands back

`lift`, `gasPerCycleScf`, `liquidPerCycleBbl`, `requiredGlrScfBbl`, `wellGlrScfBbl`, `ruleOfThumbGlrScfBbl`, `ruleOfThumbAgrees`, `timing`, `liquidPerDayBbl`, `gasPerDayMscf`, `pressureOk`, `glrOk`, `feasible` and `warnings`.

Most of it is working, offered so you can audit the verdict rather than accept it. `ruleOfThumbAgrees` is false here and changes nothing, and `liquidPerDayBbl` reads 14.83375148 bbl/d and is compared to nothing.

## The mistake

Quoting `ok` as the answer. It is true on OGUTA-2, where the plunger cannot be driven, and it would be true on a well with any self-consistent set of inputs. The pair that carries a verdict is `feasible` and the flag underneath it that failed.

The second mistake is quoting `feasible = false` as "no plunger here". A pressure failure and a gas failure lead to different conversations, and on this well the pressure has 471.8102677127 psi of margin.

## What it refuses

Bad input, rather than guessing around it. A zero tubing diameter returns "The tubing needs an inside diameter."

Set the depth to zero and two errors come back together, "The plunger has to travel a depth. The slug is longer than the tubing it sits in.", because a 160.0 ft slug is longer than a well of no length. The engine reports the consequence beside the cause rather than resolving one into the other.

## Exercise

Read all three flags on OGUTA-2 and write the verdict as a sentence naming the failing flag and its two numbers.

Then say what you would look at first, and why the 471.8102677127 psi of pressure margin is the reason.
