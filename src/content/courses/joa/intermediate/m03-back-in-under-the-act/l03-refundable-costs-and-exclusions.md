# Refundable costs and the exclusions

{{panel:joa-recovery-calculator}}

A party that backs in late has not paid its share of what was spent before. The Act makes it refund that share, and then limits which costs count. This lesson sorts the Ekene cost lines by the Act's rule, and then by a contract's own stated list, and compares the two refunds.

## What the Act says

Section 85(4)(c) of the Petroleum Industry Act 2021 (Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, read on 2026-09-26) states the refund and its limits in two parts:

> "(c) the contract shall stipulate that Government shall refund fully its proportionate share of the unrecovered proven costs from the date of its participation" (PIA s.85(4)(c))

> "such refunded cost shall relate to development and production and shall not include bonuses and penalties, interest, premium or markups on cost ;" (PIA s.85(4)(c))

The engine reads the second part into its basis, verbatim:

> development and production costs only; bonuses, penalties, interest, premium and markups excluded (PIA s.85(4)(c)); exploration is not development or production

## The Ekene cost lines under the Act

Every line is a synthetic stated input with a stated kind:

| cost line | kind | amount | refundable under s.85(4) |
| --- | --- | --- | --- |
| exploration wells Ekene-1 and Ekene-2 | exploration | 136000000.000000 | false |
| front end engineering design | development | 40000000.000000 | true |
| development wells and facilities to date | development | 450000000.000000 | true |
| signature bonus | bonus | 10000000.000000 | false |
| interest on partner loans | interest | 8000000.000000 | false |
| operator markup on shared services | markup | 2000000.000000 | false |

The refundable costs are 490000000.000000 and 156000000.000000 is excluded. NOC backs in by 20 points, so the refund is 98000000.000000. Each exclusion carries its reason, for example:

> exploration wells Ekene-1 and Ekene-2: 136000000 (exploration) is not refundable (PIA s.85(4)(c): development and production costs only, no bonuses, penalties, interest, premium or markups)

Under the Act's basis the kinds are fixed, and a call that states its own list is refused:

> refundableKinds must be left out under basis "pia-s85-4" (development and production, s.85(4)(c)); got ["exploration"]

## The same lines under a contract's list

Under basis "contract", the contract states which kinds are refunded, and there is no list until it does:

> refundableKinds must be an array of cost kinds stated under basis "contract" (exploration, development, production, bonus, penalty, interest, premium, markup; no default); got nothing

The golden input for the contract case states exploration and development. Its refundable costs are 626000000.000000, only 20000000.000000 is excluded, and the refund for the same 20 points is 125200000.000000. The bonus, the loan interest and the markup are each excluded as "not a stated refundable kind". The exploration wells alone move 136000000.000000 between the two answers, and the list of kinds is the whole difference.

A kind the engine does not recognise is refused by name:

> costs[0].kind must be one of "exploration", "development", "production", "bonus", "penalty", "interest", "premium", "markup"; got "appraisal"

## Exercise

Work in the course's own recovery calculator, view "A back-in under the Act".

1. Start from "The Ekene back-in under PIA s.85(4)". Check the cost line table and the tiles "Refundable", "Excluded" and "Refund".
2. In the box, add `"refundableKinds": ["exploration"]` at the top level and read the refusal. Remove it.
3. Start from "The same back-in under contract terms, paid at once". Check the three tiles against the contract figures above.
4. In that box, take `"exploration"` out of `refundableKinds`, and read the tiles again. Compare them with the Act's figures and say why they now agree.
5. Change the kind of the first cost line to `"appraisal"` and read the refusal.
