# The operating range

`region` is computed two different ways, and the returned word does not say which one you got.

{{panel:pd-stage-explorer}}

## Two rules behind one field

Inside the published range, `region` comes from a band around the scanned BEP rate: below 0.75 of it the reading is `downthrust`, above 1.25 of it `upthrust`, otherwise `recommended`.

Outside the published range the BEP is never consulted. Below the low end the reading is `downthrust`, above the high end `upthrust`, and that is the whole rule.

So `upthrust` can mean the duty is past a band around a peak the vendor's data supports, or that it is past the last rate the vendor measured. The field returns the same string for both.

## Watching the switch happen

Reference stage ref-540-2500 has a published range of 1250.00 to 3500.00 bbl/d and a BEP rate of 2498.7500 bbl/d, so its recommended band runs 1874.0625 to 3123.4375 bbl/d.

| Rate at 60 Hz, bbl/d | Region | Inside published range |
| --- | --- | --- |
| 1250 | downthrust | true |
| 1950 | recommended | true |
| 3350 | upthrust | true |
| 3800 | upthrust | false |
| 4400 | upthrust | false |

At 3350 bbl/d the stage is above 3123.4375 bbl/d and still below 3500.00, so the band produced that word off measured data. At 3800 bbl/d the range produced it, and the head of 15.15808000 ft behind it came from a polynomial evaluated where nothing was measured.

The published golden vendor curve behaves the same way. At 3500 bbl/d and 60 Hz the region is `upthrust` with inside the published range true, at 3250 bbl/d `recommended`, and the golden's own extrapolated row, 3200 bbl/d at 40 Hz mapping to 4800.0000 bbl/d, is `upthrust` with inside the published range false.

## The band is not the range

The recommended band and the published range are different intervals. On ref-540-2500 the range runs 1250.00 to 3500.00 bbl/d and the band 1874.0625 to 3123.4375, so there are measured rates the band disapproves of at both ends.

## The mistake

Acting on `region` without reading `inRange` beside it. An in-range `upthrust` is a duty the vendor measured and the band advises against, which is an operating decision. An out-of-range `upthrust` is a duty nobody measured, carrying a number off a fit that has left its data, which is a data problem. Treating the second as the first is how a design gets approved on arithmetic.

`recommended` is the one word that carries a guarantee of provenance, because it is only ever awarded inside the published range.

## What it refuses

At zero frequency the region comes back `invalid` with inside the published range false and a head of NaN. That is the only value of the field that reports the reading itself failed rather than where on a curve it landed.

## Exercise

Read region and inside the published range for ref-540-2500 at 1250, 1950, 3350 and 3800 bbl/d at 60 Hz.

Two of those rows say `upthrust`. Write one sentence for each saying which rule produced the word and what it entitles you to conclude.
