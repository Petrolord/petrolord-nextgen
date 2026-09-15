# What it refuses to guess

A figure the plan does not carry is refused by name. The engine states which field is missing, on which item, and stops. Nothing is substituted quietly.

{{panel:ec-plan-explorer}}

## The refusals, word for word

| what is wrong | the message |
| --- | --- |
| no capex at all | "the concept carries no capex: enter a drilling, facilities or subsea capex" |
| no oil price | "the scenario oil price is missing" |
| a blank oil price | "the scenario oil price is missing" |
| no operating cost | "the concept annual operating cost is missing" |
| no peak rate | "the concept peak production rate is missing" |
| a negative capex | "the drilling capex may not be negative: -500" |
| a negative oil price | "the scenario oil price may not be negative: -5" |
| a discount rate that is not a number | "the scenario discount rate is not a number: abc" |
| a royalty rate that is not a number | "the scenario royalty rate is not a number: x" |
| a capex that is not a number | "the concept capex is not a number: lots" |

Every one of these is a FdpInputError, and every one names the field. Five of them go further and quote the value back: -500, -5, abc, x and lots all appear in the message that rejected them, so the reader can find the cell they typed.

## The same refusals on a real concept

None of that is a property of a contrived test. Strip the capex fields off the EGINA FPSO concept and the same message comes back: the concept carries no capex. Remove its operating cost, or its peak rate, and the engine names those instead. Type a drilling capex of -520 and it comes back as "the drilling capex may not be negative: -520".

## Why the name matters

A generic error sends the reader back through the whole plan. A message that names the concept annual operating cost sends them to one box. The difference between "the scenario oil price is missing" and "the scenario discount rate is not a number: abc" is the difference between a field nobody filled in and a field somebody filled in wrongly, and those need different fixes. Refusals that quote the offending value are cheaper still, because the value is searchable: anyone who sees lots in the message can find the cell that holds it.

## A missing figure and a zero are different

A zero is an answer. Price the same concept at zero and the engine runs it and returns an NPV of -3517.4133 million USD, because somebody decided the price. A blank price is not a decision, and the engine will not decide it for you.

## Before the repair

This behaviour is recent. Before the repair that preceded this course, a concept with no capex, no operating cost and no peak rate, priced by a scenario with no oil price, still produced a full set of screening economics. The engine filled the four gaps with figures of its own and said nothing, so a plan that had been costed by nobody returned an NPV, an IRR and a payback that looked exactly like a plan that had. The numbers that came out were arithmetic on inputs the reader never saw.

## The mistake

The mistake is to read a clean result as a complete plan. An engine that answers every time teaches its users that a result means the inputs were there. The refusal is the useful output: it tells you which field to go and find. When the studio names a field, the answer is to fill the field in, never to work around it by pre-totalling something into a box that happens to accept numbers.

## Exercise

Write out the messages for a concept with no capex and for a scenario with no oil price. Then explain why a scenario priced at zero returns -3517.4133 million USD while a scenario with a blank price returns nothing at all.
