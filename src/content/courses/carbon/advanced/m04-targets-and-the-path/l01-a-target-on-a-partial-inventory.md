# A target on a partial inventory

A target is a fraction of a baseline, and the baseline is an inventory total. If the inventory is missing a line, the baseline and the target are built on less than the whole. SECTION 22 prints that case on the invented AGBOR records. Every figure here is invented for this course.

{{panel:carbon-abatement-explorer}}

## The full baseline

The Agbor baseline is the inventory total on the course's set, IPCC AR6 GWP100, fossil methane: 56100.276 tCO2e. It carries five lines, among them Purchased electricity at 10988.000 tCO2e on Scope 2 (SECTION 21). SECTION 21 computes the curve's target as 30 percent of that total, 16830.083 tCO2e, as the Carbon Studio computes it. The path of SECTION 22 draws its target falling in a straight line from the baseline in 2026 to 30 percent below it in 2033.

## The partial baseline

With the electricity factor blank, SECTION 22 prints: the inventory totals 45112.276 tCO2e and is reportable false (1 line(s) could not be computed). A target and a path built on that total give:

| baseline | target in the end year t | finalGapTonnes | firstShortfallYear |
| --- | --- | --- | --- |
| the full inventory | 39270.193 | 1370.083 | 2027 |
| the partial inventory | 31578.593 | 0.000 | 2027 |

Read the two rows. On the full inventory the path ends with an unabated gap of 1370.083 t. On the partial inventory it ends with 0.000. The measures are the same six. What moved is the baseline, and with it the target the path is measured against. SECTION 22 prints the difference: the full baseline less the partial is 10988.000 tCO2e, the purchased electricity line of SECTION 21, so the partial inventory is the full one without it.

## Why a partial total is still a total

The partial inventory computed. It printed a total, 45112.276 tCO2e, and the path engine accepts it as a positive tonnage. What it is not is reportable. The inventory carries that status and the reason, and a target built on it inherits the same limit: it is a target on a total that leaves a line out.

The engine refuses the case where nothing computed:

REFUSED: The baseline must be a positive tonnage. An inventory that computed nothing is not a baseline of zero.

A partial inventory is not refused. It is a number, and its reportable status is the warning a reader has to carry across to the target.

## Reading a zero gap

A final gap of 0.000 t looks like a target met. On the partial baseline it is a gap measured against a target of 31578.593 t in 2033, a target built on an inventory that does not count Agbor's purchased electricity. On the full baseline, 56100.276 tCO2e, the same measures leave 1370.083 t unabated in 2033.

The first shortfall year reads 2027 on both baselines. The partial baseline hides the final gap and does not hide the early one. This module's last lesson reads that year.

## What to carry

Before a target or a path is read, read the reportable status of the inventory beneath it. A gap of 0.000 t on an inventory that is reportable false is a gap on a partial total.

## Exercise

Read the full and partial inventory totals, the reportable status of the partial one, and the target in the end year, finalGapTonnes and firstShortfallYear on each baseline. Say what the two final gaps, read with the two baselines, show about a path built on an inventory that is not reportable.
