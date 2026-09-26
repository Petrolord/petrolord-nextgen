# Interests after a back-in

{{panel:joa-recovery-calculator}}

A back-in raises one party's participating interest to a stated target after the venture has already spent money. The Act gives the Government that right from any time after the grant, up to its ceiling:

> "(b) the right to participate shall be from any time upon the granting of the licence or lease ;" (PIA s.85(4)(b))

The interest the back-in party gains has to come from the others. This lesson works out how much each gives up.

## The rule

The engine's basis on the Ekene back-in, verbatim:

> new interest of another party = old x (100 - target) / (100 - current); refund = (target - current) / 100 x refundable costs, received in proportion to the interest given up

Every other party keeps the same fraction of its interest, so their interests stay in the same proportion to each other. Only the back-in party's target and the parties' current interests enter the rule; the target is a stated input, and under the Act's basis it is capped.

## The Ekene back-in to 40 percent

NOC holds 20.000000 and backs in to a stated target of 40.000000. Every other party keeps (100 - 40) / (100 - 20) of its interest:

| party | before | after | interest given up |
| --- | --- | --- | --- |
| EKO | 40.000000 | 30.000000 | 10.000000 |
| PA | 25.000000 | 18.750000 | 6.250000 |
| PB | 15.000000 | 11.250000 | 3.750000 |
| NOC | 20.000000 | 40.000000 | 0.000000 |

The engine's reason opens with the same fraction:

> NOC backs in from 20% to 40%: the others keep 60 / 80 of their interests; refund 20% x refundable costs 490000000 = 98000000 (156000000 excluded)

The refund in that reason is the subject of the next two lessons. Each party receives it in proportion to the interest it gives up, which is why that column is printed.

## At the ceiling, and beyond it

A target of 60.000000, the Act's ceiling, is accepted. The others then keep 40 / 80 of their interests: EKO 20.000000, PA 12.500000 and PB 7.500000. One point more is refused under the Act's basis:

> targetPct must be at most 60 under basis "pia-s85-4" (the right to participate up to 60%, PIA s.85(4)(a)); got 61

A back-in must also raise the interest. A target equal to the current interest is refused:

> targetPct must be above the back-in party's current interest 20; got 20

The ceiling belongs to the Act's basis. Under basis "contract", a target is whatever the contract states, and the engine applies no Act figure to it.

## A back-in and a carry

The Ekene carry and the Ekene back-in are separate teaching cases on the same parties. The carry changes who pays cost and leaves every participating interest where it is. The back-in changes participating interests themselves, and with them each party's share of production from the date of participation.

## Exercise

Work in the course's own recovery calculator, view "A back-in under the Act", starting from "The Ekene back-in under PIA s.85(4)".

1. Check the before and after table against the table above, and check that each other party keeps 60 / 80 of its interest.
2. With the control "Target interest, percent (stated)", set 60. Check the after column against the figures above.
3. Set 61 and read the refusal. Then set 20 and read the refusal.
4. Set the target back to 40. With the control "Basis (stated)", switch to the contract's stated terms and read what the engine asks for next.
