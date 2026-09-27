# An intra group transfer and a PEL

{{panel:farmout-deal-calculator}}

Reg. 19(2) sets one fee for one kind of consent. Two cases sit at its edges. An intra group transfer pays the processing fee alone, by the regulation's own proviso. A petroleum exploration licence (PEL) needs the Commission's consent, and reg. 19(2) sets no fee for that.

## An intra group transfer

The proviso to reg. 19(2):

> "provided that consent to an Assignment in an intra group transfer shall only be subject to the payment of two per cent processing fee." (AOI Regulations 2024 reg. 19(2), proviso)

Whether a transfer is intra group is a stated input with no default. The deal calculator's "Intra group transfer (stated)" control writes true or false, and "not stated" is refused:

> intraGroup must be true or false (stated; no default); got nothing

The Ekene fee with the transfer stated as intra group:

| case | processing percent | premium percent | processing fee | premium | fee |
| --- | --- | --- | --- | --- | --- |
| the Ekene fee | 2.000000 | 5.000000 | 112000.000000 | 280000.000000 | 392000.000000 |
| intra group | 2.000000 | 0.000000 | 112000.000000 | 0.000000 | 112000.000000 |

> PPL: 2% processing on the value of the transaction 5600000 (the amount payable to the Assignor stated in the contract, reg. 19(3)) = 112000 (an intra group transfer: the processing fee alone); paid by the Assignor and not tax deductible

## A PEL

A PEL is assigned with the consent of the Commission. The regulations say so of a change in control:

> "(c) a change in control of a company that holds an interest in a PEL shall require prior written consent of the Commission." (AOI Regulations 2024 reg. 16(c))

Reg. 19(2) sets the fee for the consent of the Minister, so the engine refuses a PEL under the gazetted basis and says where to go:

> licence must be "PPL" or "PML" under basis "nuprc-2024-r19": reg. 19(2) sets the fee for the consent of the Minister, and a PEL assignment needs the consent of the Commission (reg. 16); state its rates under basis "stated"; got "PEL"

## The stated basis

Under basis "stated" the caller supplies the rates, and the engine charges them. The course's PEL case states 1.500000 percent processing and 0.000000 percent premium on a value of 1000000.000000 the Commission determines, a fee of 15000.000000. Those rates are no gazetted figure. They are inputs, chosen to show the arithmetic.

The stated basis has its own rules, each a refusal by name. Rates are required:

> ratesPct must be an object { processingPct, premiumPct } under basis "stated" (no default); got nothing

And the gazetted basis refuses stated rates, since reg. 19(2) fixes them:

> ratesPct must be left out under basis "nuprc-2024-r19" (2% processing and 5% premium, reg. 19(2)); got {"processingPct":1,"premiumPct":1}

## Exercise

Work in the course's own deal calculator.

1. Open the view "The consent fee and its day rules" and start from "An intra group transfer". Check the five fee tiles against the second row of the table.
2. Start from "The Ekene consent fee, paid on time" and set "Licence (stated)" to "a petroleum exploration licence (PEL)". Read the refusal.
3. Start from "A PEL under stated rates". Read the fee and the reason, then change "Processing fee, percent (stated)" and watch the fee follow it.
4. Back on the Ekene fee, add `"ratesPct": {"processingPct": 1, "premiumPct": 1},` to the box and read the refusal.
