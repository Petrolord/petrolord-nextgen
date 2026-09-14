# The multiplier scales oil only

The chart is labelled with an oil price, and that is exactly what it sweeps: gas and NGL stay where the deck left them.

{{panel:ec-comparison-explorer}}

## How a price becomes a multiplier

The sweep does not write a new deck. It takes the price it wants, divides by the first deck point's oil price, and applies that multiplier to the oil price in every year of the deck. Gas and NGL are untouched. The default project carries three streams, oil at 10000 bbl/d, gas at 50 Mscf/d and NGL at 1500 bbl/d, on a deck that reads oil 70, gas 3.5 and NGL 30 in year 1, oil 75, gas 4 and NGL 35 from year 5, and oil 80, gas 4.5 and NGL 40 from year 10. At every point of the sweep those gas and NGL prices read exactly as written.

## The evidence in one published case

The published `price_below_every_threshold` case takes that same deck at a price multiplier of 0.5, which puts oil at 35 USD per bbl and below every tier of the sliding royalty. Total gross revenue over the life comes back at 1419.0195 million USD against the deck's own 2686.9277. Halving the oil price did not halve the revenue, because two of the three streams did not move. The rest of the ledger follows: contractor net cash flow of 80.8085 million USD, government cash flow of 396.7675, an NPV of -111.7254 at 10 percent, payback pushed out to year 12 and 72.2941 million USD still unrecovered at the end.

## Two consequences worth holding

A gas-weighted project moves less across the sweep than the axis suggests, so comparing the steepness of two projects' curves compares their stream mix as much as their terms. And the label is the year 1 oil price only: the later deck points, 75 from year 5 and 80 from year 10, are scaled by the same multiplier, so a point labelled 40 does not mean the field sold oil at 40 USD per bbl in year 10.

## The mistake

The error to avoid is reading a flat curve as fiscal stability. A project whose revenue is heavily gas will show a government take that barely moves across the nine points, and the correct conclusion is that the sweep did not move most of its revenue, not that the terms are neutral to price. The mirror image is the oil-only project: the Suite test project produces 30000 bbl/d of oil with gas at 0 Mscf/d and NGL at 0 bbl/d, so there the multiplier is the whole revenue multiplier.

## What it refuses

There is no gas price sweep, no liquids sweep and no way to move the three prices independently or in a ratio. The multiplier cannot change the step years, so a deck that lifts at year 5 lifts at year 5 at every swept price. And because a sliding royalty is keyed on the oil price, moving oil alone can change a royalty tier that a real gas price movement would never have touched.

## Exercise

State the two inputs the multiplier is built from and name the streams it leaves alone. Then give the total revenue at a price multiplier of 0.5 against the deck's own total.
