# Three capex fields

A development concept carries its capital cost in three fields, drilling, facilities and subsea, and the engine reads all three. The FPSO concept holds 520.0000, 1350.0000 and 380.0000, which is 2250.0000 million USD.

{{panel:ec-plan-explorer}}

## Two concepts, six fields

| concept | type | drilling | facilities | subsea | total capex |
| --- | --- | --- | --- | --- | --- |
| FPSO development | FPSO | 520.0000 | 1350.0000 | 380.0000 | 2250.0000 |
| Subsea tie-back | Subsea Tie-back | 240.0000 | 180.0000 | 310.0000 | 730.0000 |

The FPSO total is 520.0000 plus 1350.0000 plus 380.0000. The tie-back total is 240.0000 plus 180.0000 plus 310.0000. The split is not decoration. It tells you what kind of development each concept is: the FPSO puts most of its money into the vessel, 1350.0000 million USD of facilities against 380.0000 of subsea, while the tie-back puts more into subsea hardware, 310.0000 million USD, than into facilities at 180.0000, because it is hanging off something that already exists.

## Fields you leave blank are zero, not missing

A concept that carries only a facilities figure of 1350.0000 returns a total capex of 1350.0000 million USD. A concept that carries one pre-totalled capex of 2250.0000 returns 2250.0000. Both are accepted, because a concept with at least one capex figure has a capex. What the engine refuses is a concept with none of them: "the concept carries no capex: enter a drilling, facilities or subsea capex".

It also refuses what it cannot use. A drilling capex of -520 comes back as "the drilling capex may not be negative: -520", and a capex typed as text comes back as "the concept capex is not a number: lots".

## What the economics run on

Every screening result for a concept runs on the sum of its own three fields. The FPSO's NPV of 2015.4123 million USD is a return on 2250.0000 of capex and the tie-back's 1013.7182 is a return on 730.0000, and the year 0 cash flow row of the FPSO Base case is -2250.0000, the whole capex in the year before production starts.

## Value per million of capex

Because the capex is read in full, the two concepts can be compared on what each million buys. At 70.0000 USD a barrel the tie-back returns 1.388655 of NPV per million USD of capex and the FPSO returns 0.895739. The FPSO is worth more in absolute terms, 2015.4123 million USD against 1013.7182, and the tie-back is more efficient with the money it uses.

## The mistake

The mistake is reading a concept's capex from a field the form never wrote. A concept entered with its drilling and subsea numbers in two boxes and its facilities cost left for later is a perfectly legal concept: the engine adds what is there, returns a screening NPV on a capex that is missing its largest component, and complains about nothing, because a concept with one populated field has a capex. The refusal fires only when all three are empty. Check the three fields against the total before quoting anything downstream of them.

## Exercise

Write the three capex fields for each concept and show the addition that produces 2250.0000 and 730.0000 million USD. Then say what the engine returns for a concept whose three capex fields are all empty, and what it returns for one that carries only a facilities figure.
