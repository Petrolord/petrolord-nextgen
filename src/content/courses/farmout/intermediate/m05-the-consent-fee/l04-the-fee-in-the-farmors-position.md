# The fee in the farmor's position

{{panel:farmout-deal-calculator}}

The fee has a payer, and the payer's EMV carries it. The assignor pays, and in a farm-out the assignor is the farmor. This lesson follows the Ekene fee from the fee view into the farmor's position on the deal, and reads what the texts say about its tax treatment.

## Who pays

The engine's reason ends with the payer and the tax:

> PPL: 2% processing + 5% premium on the value of the transaction 5600000 (the amount payable to the Assignor stated in the contract, reg. 19(3)) = 392000; paid by the Assignor and not tax deductible

The Ekene fixture states the same figure to the deal value as the assignor fees: 392000.000000, the fee the fee view returns. The two views are separate calls. The deal takes the fee as a stated input, so a learner who changes the value of the transaction in the fee view carries the new fee into the deal's "Assignor fees the farmor pays (stated, 0 for none)" control by hand.

## Where the fee sits in the positions

The engine's position rule puts the fee on the farmor in both outcomes. It lowers EKO's success and dry-hole payoffs after the farm-out by the same 392000.000000, and its EMV by the same. FIN's position does not carry it. In the transfer identity the fees are the one term that leaves both sides:

> farmor alone = farmor after the farm-out + farminee + assignor fees: the deal moves value between the two sides and the fees leave both

On the Ekene Deep deal, EKO's 19833033.704181 after the farm-out, FIN's -1806224.721864 and the fees of 392000.000000 add to EKO's 18418808.982316 alone, to the precision the course prints.

## Not tax deductible

The engine's tax basis:

> not tax deductible (reg. 19(5); PIA s.95(12)); fees paid for assigning rights to another party are not deductible (PIA s.264(f) and s.302(12)(c))

The regulation says it directly:

> "(5) Any payment made as processing fee, consent fee, or premium under these Regulations shall not be tax deductible." (AOI Regulations 2024 reg. 19(5))

The Act says the same of fees paid for assigning rights to another party, for hydrocarbon tax (PIA s.264(f)) and for companies income tax (PIA s.302(12)(c)). The engine reports the fee as not tax deductible and computes no tax on the deal. The Petroleum Industry Act course teaches the fiscal system these sections belong to.

## A deal without the fee stated

The assignor fees are a required term of every deal call. A deal with no fee states 0; a box that leaves them out is refused:

> deal.assignorFees must be a finite number at or above 0; got nothing

## Exercise

Work in the course's own deal calculator.

1. Open the view "The consent fee and its day rules" and start from "The Ekene consent fee, paid on time". Read the "Paid by" and "Tax deductible" tiles.
2. Switch to the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". Set "Assignor fees the farmor pays (stated, 0 for none)" to 0. Read EKO's farm-out EMV and FIN's EMV, and say which moved.
3. Set the fees to 112000, the intra group fee, and read EKO's best action.
