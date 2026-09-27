# Seven per cent of the value of the transaction

{{panel:farmout-deal-calculator}}

At Associate you read the consent process in words: an assignment of an interest in a Nigerian licence needs consent, and the fee is a percentage of the value of the transaction. This module computes that fee. The rates come from a gazetted text, and they are the only figures the engine holds of its own; every figure of the deal is stated.

## The texts

The Petroleum Industry Act 2021 (Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, read on 2026-09-27) tells the Commission to prescribe the fee by regulation (PIA s.95(12)). The Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024 (S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 9 April 2024, read on 2026-09-27) set it:

> "(2) The consent of the Minister in respect of an assignment pursuant to these Regulations shall be by the payment of seven per cent of the value of the transaction, comprising two percent processing fee and five per cent premium," (AOI Regulations 2024 reg. 19(2))

## The engine's rule

> seven per cent of the value of the transaction: two per cent processing fee and five per cent premium; an intra group transfer two per cent (reg. 19(2))

The fee basis is a stated input. The deal calculator's "Fee basis (stated)" control offers "nuprc-2024-r19", the gazetted rates of reg. 19(2), and "stated", rates the caller supplies. Left unstated, the engine refuses:

> basis must be one of "nuprc-2024-r19", "stated"; got nothing

## The Ekene Deep consent fee

The fixture states a PPL, a value of the transaction of 5600000.000000 from the contract, and a transfer that is not intra group:

| figure | engine |
| --- | --- |
| processing percent | 2.000000 |
| premium percent | 5.000000 |
| processing fee | 112000.000000 |
| premium | 280000.000000 |
| fee | 392000.000000 |

The engine's reason:

> PPL: 2% processing + 5% premium on the value of the transaction 5600000 (the amount payable to the Assignor stated in the contract, reg. 19(3)) = 392000; paid by the Assignor and not tax deductible

The fee is 392000.000000 on the stated 5600000.000000. The two parts are reported apart because the regulation names them apart, and because the intra group proviso of the third lesson keeps one and drops the other.

## What the engine does not decide

The engine applies the rates to whatever amount the call states, and the next lesson shows it decides nothing about the amount. The caller states the licence and the basis, and the engine refuses combinations the regulation does not cover.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The consent fee and its day rules" and start from "The Ekene consent fee, paid on time". Read the five fee tiles and the reason.
2. With the control "Value of the transaction (stated)", set the value to 1000000. Read the processing fee, the premium and the fee, and check each against its rate.
3. Set "Fee basis (stated)" to "not stated" and read the refusal. Restore the 2024 Regulations basis.
