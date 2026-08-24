# Grain is conserved

The last lesson produced a number, 159.79553483785466 m, and asked you to accept it. This lesson shows you how to check it without trusting the engine, and turns that check into the standing quality control test for every restoration you will ever run.

## The round trip

The restoration went one way. It started from 100 m of shale with its top at 1000 m, computed the grain inside it, and found the thickness that the same grain occupies with its top at 0 m.

Send it back the other way. Take the restored layer, 159.79553483785466 m of shale with its top at 0 m, and compute its solid thickness directly from the compaction integral, exactly as you would for any layer. The answer is

**63.117281830772924 m.**

The grain that went into the restoration was 63.11728183077296 m. The grain that comes back out is 63.117281830772924 m. The two agree to within about 1e-13 m, which is a difference of roughly a tenth of a picometre in a layer 160 m thick. That is floating point noise from the iteration, and nothing else.

The restoration therefore conserved grain. It changed the layer from 100 m to 159.79553483785466 m, it changed the average porosity from a compacted value to a surface value, and it left the amount of rock alone.

## Why this is the right thing to check

There are other things you could compare after a restoration. You could ask whether the restored thickness looks plausible, or whether the past depths it implies match a seismic section, or whether the porosity it predicts matches a nearby well. All of those are useful and all of them are judgements. Grain conservation is not a judgement. It is an identity that the arithmetic either satisfies or does not.

That makes it a different kind of test. A plausibility check tells you that an answer is not visibly silly. An invariant check tells you that a specific step did what it claimed to do. When a burial history comes out wrong, the invariant is what tells you whether the geometry engine is at fault or whether the inputs are.

It is also cheap. Solid thickness is one closed-form expression, so re-deriving it from the restored layer costs a single evaluation, and it can be done after every layer at every time step without anyone noticing the cost.

## What a failure would look like

Suppose you run the round trip and the grain does not come back. The size and sign of the mismatch tell you a good deal.

A mismatch of a few times 1e-13 m, as here, is convergence noise from the Newton-Raphson search and means the step is correct. A mismatch of a metre or more is a real error, and there are only a few things it can be.

The first is a lithology mix-up. If the layer was restored with sandstone parameters and checked with shale parameters, the two integrals are different functions and there is no reason for them to agree. This is the most common cause in practice, because lithology is carried as a label and labels get lost when data is passed between tools.

The second is a top depth that does not match the geometry. Restoring the layer to a top of 0 m and then checking its solid thickness as though its top were at some other depth compares two different quantities. The check has to use the same top depth the restoration used.

The third is a solver that has not converged. If the iteration is stopped too early, or started from a bad first guess, it returns a thickness that is close to the right one and does not satisfy the integral. The residual shows up directly as a grain mismatch, which is the point of computing it.

The fourth is a unit error somewhere in the chain, usually a compaction constant in per kilometre being fed to a formula expecting per metre. That one produces a spectacular mismatch and is easy to spot once you are looking.

## What the invariant does not promise

Grain conservation says that the restoration solved the equation it was given. It does not say the equation describes your rock.

If the shale in your well does not follow the Sclater-Christie curve with $\phi_0 = 0.63$ and $c = 0.00051$ per m, every restoration in the model will conserve grain perfectly and every restored thickness will be wrong. If the layer has been buried deeper in the past than it is now, the curve reads its present depth and underestimates how much it has compacted, and the arithmetic will still balance to 1e-13. If the interval is really an interbedded sand and shale package logged as one layer, a single set of parameters cannot describe it, and again the invariant will hold.

This is worth stating plainly because a passing check is persuasive. The invariant is a test of the calculation rather than a test of the model, and the two failures it cannot see, wrong parameters and missing burial, are exactly the two that a basin study most often gets wrong. Reporting the check honestly means reporting what it covers.

## Make it a habit

The practical instruction from this lesson is short. Every time you decompact, re-derive the solid thickness of the restored layer and compare it with the solid thickness you put in. Record the largest mismatch seen anywhere in the run, in metres, and put that number in the project record next to the restored geometry. On a healthy run it will be somewhere near 1e-13 m and it will be the most boring line in the report, which is what you want from it.

## Exercise

You restore a 100 m shale from a top depth of 2000 m and get a restored thickness at the surface of 194.513330 m. Describe the check you would run to confirm the restoration, say what number you would expect it to return, and state one thing that a passing check would still not tell you.

Self check: compute the solid thickness of 194.513330 m of shale with its top at 0 m, using the same shale parameters, and compare it with the solid thickness of the layer in place, which the table in the previous lesson gives as 77.852091 m. A correct restoration returns that same grain thickness to within solver noise, on the order of 1e-13 m rather than anything you would round. A passing check does not tell you that the shale parameters are right for your rock, and it does not tell you whether the layer has been buried deeper in the past than 2000 m, because both of those are assumptions the integral inherits rather than things it tests.
