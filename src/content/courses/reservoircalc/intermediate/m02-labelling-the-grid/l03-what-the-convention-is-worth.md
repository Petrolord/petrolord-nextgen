# What the convention is worth

The previous lesson established that a column of oil bearing cells sits exactly on the fault, and that a comparison operator decides who owns it. This lesson puts a number on that decision, because a convention nobody has priced is a convention nobody is thinking about.

## The two answers

Book the field both ways at a contact of 1560 m.

With the boundary column east, which is what strictly less than gives, the west block holds 117 cells and 9.855617 MMstb, and the east block holds 52 cells and 2.283591 MMstb.

With the boundary column west, which is what less than or equal gives, the west block holds 130 cells and 10.757040 MMstb, and the east block holds 39 cells and 1.382168 MMstb.

The difference in the west block is

$$10.757040 - 9.855617 = 0.901423 \ \mathrm{MMstb}$$

and the east block loses the same amount, to the last digit, because the field total is untouched.

## Putting that in proportion

Nine hundred thousand barrels is 7.4 percent of the field booking. It is 39 percent of everything the east block holds under the first convention.

Compare that against the things the tier below taught you to worry about. The Associate tier showed that moving the contact by 10 m moves the field booking by several million barrels, which is much larger. It also showed that the entire difference between a constant porosity and a fitted one is around 0.66 MMstb, which is smaller than this.

So a tie break rule in a labelling routine is worth more than the whole property model that the Expert tier is built around. That comparison is worth carrying, because one of those two things gets a chapter in every report and the other gets no mention at all.

## Which convention is right

Neither, and that is the honest answer.

The rock in that column straddles a fault plane that the model has drawn as a line of zero width. Half of it is genuinely west of the fault and half genuinely east, so the physically defensible answer is to split it, which the model cannot express because the cell is its atom.

Given that, there are three reasonable responses and one unreasonable one.

The reasonable ones are: state the convention explicitly so the reader knows which one produced the number; report both and treat the gap as part of the uncertainty on the split; or refine the grid near the fault so the misassigned area shrinks. Halving the cell size to 50 m halves the width of the column in question and roughly halves the volume at stake.

The unreasonable response is the common one, which is to not know. A model whose author cannot say which side the boundary cells went to has a 0.9 MMstb question mark in it that nobody will ever find, because the number looks like a computed result rather than a choice.

## Reading it off the panel

Set both contacts to 1560 m and step the fault between 1800 m and 1900 m.

{{panel:rc-block-explorer}}

Those two settings are exactly the two conventions. A fault at 1800 m with a strictly less than rule gives the boundary column to the east; the same rule with the fault at 1900 m gives that same column to the west, because it is now strictly west of the line. The engine only ever implements one rule; you are choosing which side of the cells the line falls on.

Watch the share of barrels tile as you step. It reads 81.2 percent west at 1800 m and 88.6 percent west at 1900 m. Seven percentage points of the field change owner and no rock moved.

## Worked example

Estimate the cost of the convention before computing it, as a sanity check you could apply to any grid.

The boundary column carries 13 oil bearing cells with a mean column of $165.363525 / 13 = 12.72$ m. Each cell covers 10,000 square metres, so the column holds about $13 \times 10{,}000 \times 12.72 = 1.65$ million cubic metres of rock.

Carry that through the chain: multiply by net to gross 0.8, by porosity 0.20, by oil saturation 0.65, divide by the formation volume factor 1.2 and convert at 6.2898 stb per cubic metre.

$$1.65 \times 10^6 \times 0.8 \times 0.20 \times 0.65 \times \frac{6.2898}{1.2} \approx 0.90 \times 10^6 \ \mathrm{stb}$$

which is the 0.901423 MMstb the engine reports. A convention's price can be estimated in one line from the boundary column and the chain, which means you never have an excuse for not knowing it.

## Exercise

Your grid has 200 m cells and a fault that lands on a node column carrying 8 oil bearing cells with a mean column of 15 m. Estimate what the tie break convention is worth in gross rock volume, and state one change to the model that would halve it.

Self check: each cell covers 40,000 square metres, so the column holds $8 \times 40{,}000 \times 15 = 4.8$ million cubic metres of gross rock. Halving the cell size to 100 m near the fault roughly halves the misassigned area and therefore the volume at stake, at the cost of a finer grid to build and check.
