# Cash flows at the working interest

{{panel:prms-reserves-calculator}}

The volumes are reported on a stated basis. The money is reported twice: at 100 percent, as the canonical cash flow computes it, and at the working interest, the company's share. The engine runs the cash flow once, at 100 percent, and scales the undiscounted net cash flow and the NPV by the stated working interest through the canonical applyJV of cashflow.ts. It applies no royalty a second time.

## The figures on EKN-1

| case | undiscounted net cash flow at 100% | at the working interest | NPV at 100% | NPV at the working interest |
| --- | --- | --- | --- | --- |
| low | 156927914.662500 | 109849540.263750 | 147205926.399797 | 103044148.479858 |
| best | 382377266.937500 | 267664086.856250 | 318649106.969712 | 223054374.878798 |
| high | 651707494.450000 | 456195246.115000 | 493006746.199924 | 345104722.339947 |

On the best case, 382377266.937500 at 100 percent is 267664086.856250 at the stated 70.000000 percent. The NPV at 10.000000 percent scales the same way, to 223054374.878798.

## Why the royalty is not taken twice

The royalty is already in the cash flow. The canonical ledger charges it as a cost of production before any tax, whether it is stated as a royalty interest or as a production tax. The net entitlement basis takes the royalty out of the volumes for reporting, and the cash stays as the ledger computed it. Scaling the cash by the net entitlement share would charge the royalty holder's share twice.

## Why the test runs at 100 percent

The economic test and the economic limit of each case are run on the whole project. A project either pays or does not; the company's share of it does not change that. So the verdict on each case is the same at any working interest, and only the share columns move.

## What these figures are for

The net cash flow at the working interest is the company's undiscounted share, after tax and abandonment. The NPV at the working interest is its share discounted at the stated rate. A reserves report quotes them beside the quantities to show what the Reserves are worth to the company, each with its basis and its rate. The discounting and the NPV as a subject belong to the cash flow course.

## The stated interest

The working interest is a percent above 0 and at most 100. A working interest of 0 would give the company nothing to report and is refused, verbatim:

> workingInterestPct must be a number above 0 and at most 100; got 0

At 100, the share columns equal the 100 percent columns, and the working-interest basis equals the gross.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". Read the four money columns of the best case.
2. Check the best undiscounted net cash flow at the working interest as the figure at 100 percent scaled by the stated 70.000000 percent.
3. Set "Working interest, percent (stated)" to 100 and read which columns change. Then set it to 0 and read the refusal.
4. Set "Royalty form (stated)" to a production tax and read whether any money column moves.
