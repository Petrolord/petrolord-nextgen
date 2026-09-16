# The twelve-stage cap

The search that finds a temperature-driven stage count has to stop somewhere. It stops at twelve, and what happens past twelve is a refusal rather than a twelfth-best answer.

{{panel:fc-compressor-explorer}}

## What the search does

The engine tries stage counts from one upward, works out the equal ratio each count implies, and asks whether a stage at that ratio starting from the inlet the count would really have stays under the stated discharge limit. The first count that does is the answer. If none does by twelve, the search refuses.

A cap is the right shape for that loop. Without one, a duty whose limit cannot be met at any count would either run forever or return whatever the last trial produced, and the second of those is the dangerous one because it looks like an answer.

## The refusal is hard to reach on purpose

Every cheaper explanation is caught at the door first, which is why the cap is almost never what a user meets. Reaching it takes all of these at once: a discharge limit above the suction temperature, because a limit at or below the suction is refused by name as impossible; a readable polytropic efficiency; a workable per-stage ratio limit; and an overall ratio large enough that twelve equal stages are still too hot.

The probe that reaches it uses a discharge limit of 110.0000 degF against a suction of 100.0000 degF and an overall ratio of 1000.000000000. Every one of those passes an earlier guard, and only the combination gets through to the cap.

## What it says

The return is an object carrying an error string: "no practical stage count keeps the discharge temperature under the limit: 12 equal stages still reach 318.0 F against a stated limit of 110.0 F, from an inlet of 100.0 F".

Read what that sentence contains. It names the count it gave up at, the temperature the best trial reached, the limit it was measured against and the inlet it was measured from. Nothing there requires the reader to re-run anything to understand what went wrong.

## A cap is a policy and it says so

Twelve is a practical bound rather than a thermodynamic one. No physics forbids a thirteenth stage. What the cap encodes is that a duty needing more than twelve equal stages usually has something wrong with its inputs, and that a refusal is more useful than a count nobody will build. That is defensible as long as it is stated, and stating it is what the message does.

## The mistake

The mistake is reading a refusal at the cap as a message about stage counts. It is almost never about stage counts. It is about a limit that was typed wrong, an approach that cannot be reached, or a discharge pressure that was entered in the wrong units. The evidence on the return is what tells you which.

## Exercise

Describe the search the engine runs and say where it stops. List the four conditions a duty has to satisfy before it can reach the cap at all, quote what the refusal says, and explain why twelve is a policy rather than a physical limit.
