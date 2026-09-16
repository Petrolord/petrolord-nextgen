# Four faults, four refusals

A refusal that names the wrong cause is worse than a bare one, because it sends a reader off to fix an input that was correct. Four faults in the compression module now have four messages, and each names the input that is actually wrong.

{{panel:fc-compressor-explorer}}

## The four

| the fault | what comes back |
| --- | --- |
| a polytropic efficiency of zero | { error: "polytropic efficiency must be greater than 0 and at most 1 (got 0)" } |
| a polytropic efficiency above one | { error: "polytropic efficiency must be greater than 0 and at most 1 (got 1.5)" } |
| a suction below absolute zero | { error: "the suction temperature is at or below absolute zero (-600 F)" } |
| a discharge limit below the suction temperature | { error: "the maximum discharge temperature of -100 F is at or below the suction temperature of 100 F: compression raises the temperature of a gas, so no stage count can meet this limit" } |

Those are four unrelated faults. One is an efficiency, one is a different mistake with the same efficiency, one is a temperature that is not physical, and one is a pair of temperatures that cannot both be honoured. Nothing is gained by answering them with a single sentence.

## Two values, one rule, one message with the value in it

The first two rows reach the same guard from opposite directions. A polytropic efficiency of 0 and one of 1.5 are not the same mistake: the first is probably an empty field or a missing default, the second is probably a percentage typed where a fraction belonged.

The message carries the typed value for that reason. A reader told only the rule has to work out which side of it they landed on before they can act, and the return already knows. That is why two of these four quote what was entered.

## The fourth one explains itself

The discharge-limit refusal does more than compare two numbers. It says why the comparison is fatal: compression raises the temperature of a gas, so no stage count can meet a limit that sits at or below the suction.

That sentence forecloses the wrong fix. Without it the obvious response to a rejected limit is to add stages, and adding stages here can never work, because even a stage of vanishing ratio leaves the gas at least as hot as it arrived. The message saves that afternoon.

## The same fault through two doors

A per-stage ratio limit of one refuses identically whether it is asked through the stage-count function or through the whole-train function: { error: "the maximum ratio per stage must be greater than 1: a stage at a ratio of 1 adds no pressure, so no number of them reaches the discharge" }.

In that call the rate, the suction pressure, the gas gravity and k are all good. The fault is the ratio limit and the message is about the ratio limit, at both entry points, so a user cannot be told two different stories about one input depending on which tab they were on.

## The mistake

The mistake, when writing a guard, is to reach for the message that covers the most cases. Coverage is not the goal. A reader has one input to correct and the job of the message is to name it. A generic refusal is a correct sentence that costs somebody an hour.

## Exercise

List the four faults and the message each returns. Explain why two of the messages carry the value that was typed, say what the discharge-limit message adds beyond the comparison, and why the same fault must read the same through both functions.
