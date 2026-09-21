# An unpriced cut

A blank cost is a question someone may mean to ask. A blank product price is almost always a gap. The engine treats the two differently.

{{panel:crude-valuation-explorer}}

## What a missing price does

The gross product value is the sum, over the cuts, of yield fraction times product price. A cut with no price has nothing to multiply its yield by. The engine states its rule plainly: a cut with no price contributes nothing and is named, and the valuation reports itself incomplete.

Three things happen, then. The cut adds nothing to the gross. It is listed by name in unpricedCuts. And the valuation carries complete: false.

## The Kwale case with the residue unpriced

Leave the Atmospheric residue price blank on the Kwale blend and the lab prints:

| asked | gross $/bbl | netback $/bbl | unpricedCuts | complete |
| --- | --- | --- | --- | --- |
| Kwale with the residue price left blank | 49.7012 | 40.6036 | Atmospheric residue | false |

In the complete Kwale valuation the gross was 74.2412 and the netback 64.9473. In the complete case, the residue row printed a yield of 43.0526 volume percent and a value of 24.5400 $/bbl of crude at a price of 57. With the price blank, that row contributes nothing, and the gross and netback print as 49.7012 and 40.6036.

## Why this is not a blank cost

The previous lesson took a blank cost as zero and called the result a legitimate netback. The same treatment here would be wrong, and the reason is what the missing term represents.

A netback without freight answers a real question: what is this crude worth before it is shipped. A netback without the residue price answers nothing anyone wants. The residue barrels still come out of the refinery. They still exist, they still have to be sold or stored, and they are still part of every barrel of crude. Valuing them at nothing is a statement that the refinery gives them away, which nobody typed.

So the engine does compute a figure, because a partial valuation is still informative: it shows what the priced cuts are worth. But it will not let that figure pass as a netback. complete: false is the engine saying that the number below it is a sum over some of the barrels, and unpricedCuts says which barrels are missing.

## Reading an incomplete valuation

When complete reads false, read unpricedCuts before reading the netback. Then look at the yield of each named cut. Atmospheric residue is 43.0526 volume percent of the Kwale blend on Kwale's cuts, so the unpriced cut is 43.0526 percent of every barrel, and the figure of 40.6036 carries none of its value.

A buyer who compared that figure against a marker, as module 5 does, would be comparing part of a crude against the whole of another. The flag is there to stop exactly that.

## Three names, two meanings

Keep the lists apart. assumedZero names costs the engine took as zero, because a netback without them is a question worth asking, and the valuation stays complete. unpricedCuts names cuts with no price. unyieldedCuts names cuts with no yield: on the partial Ebocha blend of module 3 it reads LPG / Light ends, Naphtha. A missing price and a missing yield each make the valuation incomplete.

## Exercise

Read the incomplete Kwale row and the complete Kwale valuation. Say which cut is named, what its yield is on Kwale's cuts, and what complete: false tells a reader about the 40.6036 figure. Then say why the engine names a blank residue price as unpriced and makes the valuation incomplete when it takes a blank freight as zero and names it in assumedZero.
