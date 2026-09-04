# What an unreachable note means

The engine has a sentence for a well whose ratio has turned back down. On the well that has turned back down, that sentence cannot print.

{{panel:pd-candidate-explorer}}

## The sentence

The note reads "A ratio that has turned back down is itself the coning signature, but confirm it against the plot rather than on this alone." It is attached to the `negativeDerivatives` count, which is read only inside the branch that fires when the derivative fit failed, and inside the flat branch.

## The one path that reaches it

A teaching demonstration of 8 samples, every one with a negative derivative, leaves no positive sample for the filter. The fit fails, the coning branch runs, and the engine returns `ok = true`, mechanism coning, treatable false, confidence low, with `worSlope` 0.143809349 at `worR2` 0.063449269, no derivative slope and no span, on a late window opening at t = 1276.416078 days. Its note is "The derivative turns negative over 8 of the late samples, so its slope cannot be read on a log-log plot." followed by the coning sentence.

That is a constructed demonstration, not a published case and not a real well.

## The well that has the evidence takes the other path

On teaching well ELELENWO-4 the negative count is 4 at every window fraction in the derived sweep from 0.20 to 1.00, and the fit succeeds at every one of them, so the coning branch never runs and the sentence never prints. The engine reports mechanism channelling at a derivative slope of 1.442132492, fitted on 15 samples over 0.900620470 log cycles in a window opening at t = 250.242976 days.

Enough contrary evidence to lose the reading gets the warning. Some contrary evidence, which is the harder and more common case, gets nothing.

## What the verdict is worth

Coning is `treatable = false` here: there is nothing to squeeze, because shutting off the bottom perforations lets the cone re-form above them. On the published coning history the screening returns the water shutoff squeeze blocked and rate reduction a candidate. On the published channelling history it returns the water shutoff a candidate and rate reduction no.

The two mechanisms buy opposite jobs, and the sentence that would have raised the second one is unreachable on the histories that argue for it.

## The mistake

Treating the printed notes as an inventory of what the engine considered. They are a record of which branch executed, and the silent branch here is the one holding the contrary reading.

## Exercise

Run the falling-only demonstration in the panel and copy out both notes it returns.

Then say what has to be true of a history for the second of those notes to appear, and why ELELENWO-4 never satisfies it.
