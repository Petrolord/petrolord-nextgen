# Why the high-probability label is the low cost

{{panel:pr-contract-calculator}}

The exceedance definition works naturally for reserves. A P90 volume is a volume the field is 90 percent likely to meet or exceed, so it is the cautious, low figure. Apply the same definition to a cost and the caution flips: the figure the job is 90 percent likely to meet or exceed is a low cost, and it is the optimistic one. This lesson walks through why, on the Ekene contract types.

## The reversal, stated plainly

For a cost, P90 is the LOW figure: a 90 percent probability that the cost meets or exceeds it. Nine outcomes in ten cost at least that much. P10 is the HIGH figure: only one outcome in ten costs that much or more. P50 sits between them.

So a budget set at the P90 cost is a budget the job meets or exceeds in nine outcomes of ten. The figure that protects a budget is the P10 cost, the high one. A reader who carries the reserves habit into a cost table, where the high-probability label felt safe, picks the wrong column.

## The Ekene contract types

On 20000 iterations with seed 20270211, the engine returns for the company's cost under each contract:

| contract type | P90 (low) | P50 | P10 (high) | P90 at or below P50 at or below P10 |
| --- | --- | --- | --- | --- |
| lump sum | 900000.000000 | 900000.000000 | 900000.000000 | true |
| day rate | 837897.131515 | 912667.421771 | 1029964.481686 | true |
| reimbursable, cost plus 12 percent | 809775.400015 | 916146.832457 | 1058436.038354 | true |

Every row reads in the same order: the P90 cost at or below the P50, the P50 at or below the P10. That order is the check on any cost table labelled under this convention. If the P90 of a cost prints above its P10, the labels have been swapped somewhere between the engine and the page.

## The lump sum has no spread

The lump sum reads 900000.000000 at every percentile, because the company pays that figure whatever happens. Its whole distribution is one point. The day rate and the reimbursable contract spread from their P90 up to their P10, because the company pays more when the job runs long or costs more a day.

## What the reversal does to a comparison

Compare the day rate and the reimbursable contract at P90, the LOW cost: the reimbursable contract is lower, 809775.400015 against 837897.131515. Compare them at P10, the HIGH cost: the reimbursable contract is higher, 1058436.038354 against 1029964.481686. The two labels answer different questions. The P90 cost asks how good a good outcome can be; the P10 cost asks how bad a bad one can get. A company worried about the bad outcome compares P10 costs, and a reader who reversed the labels would draw the opposite conclusion from the same table.

## Exercise

Open the contract calculator on the view "Contract types on one job" at 20000 iterations on seed 20270211. For each contract type, confirm that the P90 cost sits at or below the P50 and the P50 at or below the P10. Change the seed to any other whole number and check the order again. Then answer from the table: which contract would you choose to keep the HIGH cost, the P10, as small as possible, and which one has the smallest LOW cost, the P90?
