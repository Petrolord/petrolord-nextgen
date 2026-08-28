# Units and keyword grammar

Two things trip up every reader of a first deck: the unit system, which is declared once and then never mentioned again, and the grammar of a keyword block, which is terse to the point of looking like noise. Both are simple once stated.

## The unit system

A deck declares its units in RUNSPEC. This one is in FIELD units, which means:

| quantity | unit |
|---|---|
| length, depth | feet |
| permeability | millidarcy |
| pressure | psia |
| liquid volume | stock tank barrels |
| gas volume | thousand standard cubic feet |
| liquid rate | stb/day |
| time | days |

Nothing in the deck restates the units. A number is in the deck's units, and if you read a depth of 5055.774278215223 you are reading feet, not metres.

That is a real trap on a field mapped in metres. Ekene's contact was mapped at 1560 m, and the deck carries it as 5118.110236220472 ft. Both are the same contact. A reader who assumes the deck is metric will conclude the field is four times deeper than it is.

## Keyword grammar

A block is a keyword on its own line, then data, then a slash to close it. Some keywords take one record per line and each record ends with its own slash, with a final bare slash closing the whole block.

The grid dimensions look like this in spirit:

    DX
      4500*328.0839895013123 /

The `4500*` is a repeat count: it means four thousand five hundred copies of the value that follows. It is not multiplication. A deck that assigns a different value to every cell would need 4500 numbers; this one needs eleven characters, because every cell in Ekene has the same size.

## Records and slashes

Well controls are the clearest example of a record-per-line block:

    WCONHIST
      'Ekene-1' 'OPEN' 'ORAT' 32.211 0.000 12.884 /
      'Ekene-3' 'OPEN' 'ORAT' 36.186 0.000 14.474 /
    /

Each well gets a line ending in a slash. The final bare slash closes the block. Forget the closing slash and the simulator keeps reading the next keyword as though it were another record, which produces an error message pointing at a line that is not the line with the mistake in it.

That is the single most common deck syntax error and it is worth recognising by its symptom: the reported error is somewhere AFTER the real one.

## Defaults

A field left as `1*` takes its default. Records can also simply stop early, and everything after the last value supplied is defaulted. This is compact and it is dangerous, because a defaulted field is invisible: you cannot tell by looking whether a value was considered and left at its default or never considered at all.

The habit that helps is to write the values you care about explicitly even when they equal the default, so a reader can see you meant them.

## Comments

Anything after two dashes on a line is a comment. Decks that are read by humans carry a lot of them, and a deck with none is a deck somebody generated and nobody reviewed.

## The misconception to avoid

"The star means multiply." It means repeat. `4500*328.08` is four and a half thousand cells each 328.08 feet across, not a single enormous number. Reading it as multiplication gives a cell size of about 1.5 million feet, which is absurd enough to catch, but the same mistake on a smaller repeat count is not absurd at all and will pass unnoticed.

## Exercise

First, Ekene's contact is at 1560 m. Convert it to feet and confirm you get the deck's 5118.110236220472. State which conversion factor you used and to how many figures.

Second, write out in words what `5*0.2` would mean in a PORO block on a five-cell grid, and what it would mean if somebody read the star as multiplication.
