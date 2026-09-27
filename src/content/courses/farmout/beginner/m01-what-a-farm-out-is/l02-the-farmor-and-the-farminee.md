# The farmor and the farminee

{{panel:farmout-earning-calculator}}

Every farm-out has two sides. The engine calls the party that gives up part of its participating interest the farmor, and the party that earns it the farminee. The texts this course reads use other names for the same two parties, and the licence usually has other parties too, who stand outside the trade. This lesson sets out the names and the rules the course uses for them.

## One party, several names

The texts are quoted as they print them, so a learner meets several names for the incoming party. HMRC's manual says Farmer Out and Farmer In (HMRC Oil Taxation Manual OT30020), and on another page it uses a third pair of words:

> "The increasing interest party (farmer-in or farmee) undertaking a work programme at his own expense," (HMRC Oil Taxation Manual OT18320)

The Petroleum Industry Act 2021 uses "farmee" when it sets a condition on a marginal field farm-out:

> "(5) The consent of the Commission to the farm-out of a marginal field under subsection (4) (b) shall, amongst others, be subject to the farmee presenting a field development plan" (PIA s.94(5))

This course writes farmor and farminee in its own sentences and keeps each text's words inside its quotation marks.

## The words the course legislates

Seven words carry a narrower meaning here than in conversation. Four matter at once:

* **interest** is always qualified. A share of the licence is a participating interest, a working interest, a carried interest or a vested interest. Money added to a carry is "simple interest" or an "uplift".
* **promote** is the share of the gross cost the farminee pays less the participating interest it holds after the event, in points.
* **carry** is the part of the farmor's cost share the farminee pays.
* **consideration** is what the farmor receives for the participating interest: the carry, the cash bonus and the reimbursement.

The other three (EMV, break-even, and the two party names) are used the same way throughout.

## The parties of the Ekene licence

| party | name (synthetic) | participating interest before the farm-out |
| --- | --- | --- |
| EKO | Ekene Operator | 70.000000 |
| PA | Partner A | 30.000000 |
| FIN | Farminee Energy | 0.000000 |

EKO is the farmor and FIN the farminee. PA holds 30.000000 percent and takes no part in the trade: it pays its own share of each cost and keeps its own participating interest.

## The engine checks the two roles

The farmor must be a party of the licence, and the farminee must be a newcomer. The engine refuses each mistake by name:

> farmor must be one of "EKO", "PA"; got "XX"

> farminee.id must be an id no licence party has (EKO, PA); got "PA"

A farm-in by a party already on the licence would be a different trade between partners, and this call does not compute it.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "The Ekene Deep well, a gross-cost cap". In the box, find the `farmor` value and the farminee's `id`. Change the farminee's id to "PA" and run the call: read the refusal and the field it names. Restore "FIN", then change the farmor to a party the licence does not have, and read the second refusal. Restore the case and check that the result returns.
