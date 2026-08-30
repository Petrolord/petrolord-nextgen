# Annulus capacity rows

The annulus is a list, and every entry is a constant.

{{panel:cm-volume-explorer}}

## The structure

    annulusRows -> [{ fromMd, toMd, capM2, boreIdEffM, openHole }, ...]

One row per interval of constant bore, from surface down to the casing shoe, in order. The slant well gets two rows and so does the horizontal one.

| well | from | to | capacity (m2) | kind |
|---|---|---|---|---|
| slant | 0 | 1400 | 0.013356688045922537 | cased |
| slant | 1400 | 3000 | 0.013548091222369345 | open hole |
| horizontal | 0 | 1200 | 0.013356688045922537 | cased |
| horizontal | 1200 | 2800 | 0.013548091222369345 | open hole |

The two wells have IDENTICAL capacity numbers, because they have the same casing in the same two hole sizes. Only the depths differ.

## Volume between two depths

    volume = sum over rows of capacity x (overlap of [from, to] with the row)

That is a three-line function and it is the whole of the volume calculation. Every volume in the Associate tier is that sum with different endpoints.

## What a row is not

It is not a survey station and it is not a lithology. The rows carry no inclination, no formation, no pore pressure. The only thing a row knows is how many square metres of annulus there are per metre of hole.

The inclination comes back in two other places, and it is worth knowing where: the hydrostatic head uses the true vertical depth of each end, and the centralization uses the inclination at the midpoint. Neither of those is a property of the row.

## The effective bore

Each row carries a `boreIdEffM` alongside its capacity. In a cased row it is just the casing bore. In an open hole row with excess it is BACK-SOLVED from the inflated capacity, and module 3 is about why.

## Where the shoe stops the list

The rows run to the casing shoe and no further. There is hole below the shoe on a well that has been drilled deeper, and it is not part of this job: nothing is being cemented there.

## Exercise

Using the two rows for the slant well, compute the annular volume between 1200 m and 3000 m by hand.

Check it against the published annular slurry volume of 24.34828356497546 cubic metres, and note which row contributes more.
