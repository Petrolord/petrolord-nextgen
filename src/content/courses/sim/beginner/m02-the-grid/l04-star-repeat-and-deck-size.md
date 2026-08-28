# Star repeat and deck size

A grid of 4500 cells needs 4500 porosity values, 4500 permeabilities in each of three directions, and 4500 cell sizes in each of three directions. Written out one per number that is tens of thousands of lines. The Ekene deck's whole GRID section is 137 lines, and the reason is a piece of notation worth knowing precisely.

## The notation

    4500*328.0839895013123

means four thousand five hundred consecutive copies of that value. The star is a repeat count, not a multiplication sign. The DX block for this grid is that single token plus a slash.

Where a property is constant within a layer but changes between layers, the compression is per layer. This grid has 900 cells in each layer, so DZ reads as five tokens:

    900*7.411104817049187  900*9.058016998615672  900*6.587648726265944 ...

Five numbers instead of 4500.

{{panel:sim-deck-explorer}}

Look at the GRID section and count how few lines carry how much data. PORO, PERMX, PERMY and PERMZ are all layer-constant here and all compress the same way.

## What does not compress

TOPS. Every column has its own depth, so all 900 values are written out, wrapped across lines at 70 characters. That single block is most of the GRID section's length, and it is the only part of this grid that carries genuinely per-cell information.

That is a useful diagnostic in itself. In any deck, the blocks that do NOT compress are the blocks carrying real spatial variation, and they are where the modelling effort went.

## Line wrapping

Long blocks are wrapped at a fixed width so no line runs off. Wrapping has no meaning: a block is read as a stream of tokens until its slash, and where the line breaks fall is irrelevant to the simulator. It matters only to the person reading it.

This is why counting LINES tells you less about a deck than counting values. A deck can be reformatted to half the lines and be byte-different, semantically identical, and equally correct.

## Why deck size matters at all

Two reasons, and neither is disk space.

**Review.** A deck a person can read is a deck a person can check. Compression that turns 4500 numbers into one token makes the constant-ness visible at a glance, which is information: you can SEE that every cell has the same porosity.

**Diffs.** When a deck is under version control, a change to one layer's permeability is a one-token change in a compressed block and a 900-line change in an expanded one. Compressed decks have reviewable diffs.

## The trap

Repeat counts are exactly as trustworthy as the count. Write `4499*` by mistake and the block is one value short, the parser reads the next keyword as the missing value, and the error appears somewhere entirely different. The symptom is the same as a missing slash: an error reported after the real mistake.

If a deck fails to parse in the GRID section, count the values a block should have before looking at anything else. It should be nx times ny times nz for a cell property, or nx times ny for TOPS.

## The misconception to avoid

"A shorter deck is a simpler model." Deck length measures how much of the model is CONSTANT, not how much of it is simple. A 4500 cell deck with every property constant is short; the same grid with a kriged porosity field is long. The second is not more complex to a simulator, it just carries more information.

## Exercise

First, state how many values each of DX, DZ, PORO and TOPS must contain for this grid, and which of the four cannot be compressed to fewer tokens than values.

Second, a colleague reformats a deck to remove all line wrapping and the file doubles in line count. State whether the model has changed and why.
