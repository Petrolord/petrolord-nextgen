# What a mass is for

Two helpers, one purpose. An annulus and a bore become lbm/ft so that a specific heat can turn them into the heat capacity a shutdown is measured against.

{{panel:pd-thermal-explorer}}

## The pair on the published pipe

Steel from 6.065 in to 6.625 in at 490.0 lbm/ft3 gives 18.9921056882 lbm/ft. The bore at 55.0 lbm/ft3 gives 11.0344753586 lbm/ft. With Cp 0.11 on the steel and Cp 0.50 on the contents, the two become one M Cp of 7.6063693050 Btu/(ft degF), and nothing after that point sees the masses again.

## A mass that could not be computed becomes zero

Both helpers return a NaN when they are asked for something that does not exist. The cooldown reads its masses as `(contents?.massLbPerFt || 0)`, and a NaN is falsy in JavaScript, so a NaN arrives as a mass of zero rather than as a failure.

The consequence depends entirely on how many of them are bad. With both masses NaN the total heat capacity is zero and the call refuses: `ok = false`, "Cooldown needs a heat capacity for what is cooling and a heat transfer coefficient." With only the contents mass NaN, one term is dropped and the call succeeds. No note, no error, `ok = true`.

## What the dropped term was worth

On the published case both masses good give a no-touch time of 4.6627248553 hr. The same call with only the contents mass NaN gives 1.2806433091 hr, which is short by 72.534444 percent.

That percentage is not a coincidence. It is the contents share of the M Cp, exactly, because dropping a term from a sum divides the time constant in the same proportion. The wrong answer is not noise around the right one. It is the right answer with one named piece missing, which is far harder to spot.

## The mistake

Trusting `ok: true` to mean the masses arrived. It means the call found enough heat capacity to divide by, and one good mass out of two is enough for that. The only defence is to look at both masses before handing them over, because after they are summed there is no way to tell how many terms went into the sum.

## What a mass is for, stated plainly

It is an intermediate. Nobody reports lbm/ft as a flow assurance result, and no verdict in this course is quoted in it. It exists so that the heat a line is holding can be set against the heat it is losing, and every mistake made building it arrives later, in hours, wearing the units of an answer.

## Exercise

Take the two published masses in the panel and record the total heat capacity per foot.

Then set the contents density to zero, record what comes back for the mass, and say what the call built on it would report.
