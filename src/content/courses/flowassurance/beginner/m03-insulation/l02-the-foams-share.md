# The foam share

One layer of 2.0 in syntactic polypropylene foam carries 98.88212788 percent of one build and 52.83080440 percent of another, and its resistance is 0.4665266247 hr ft degF/Btu per foot in both.

{{panel:pd-thermal-explorer}}

## The same layer, four builds

The two published builds are the insulated pipe and the same pipe in a 4.0 ft trench. The other two rows are sweeps run on the published pipe with one film changed, not published cases.

| Build | Foam resistance | Foam share, percent |
| --- | --- | --- |
| Insulated | 0.4665266247 | 98.88212788 |
| Buried 4.0 ft, wet soil | 0.4665266247 | 52.83080440 |
| Insulated, still water outside | 0.4665266247 | 97.50919137 |
| Insulated, shut in and stagnant inside | 0.4665266247 | 78.37609570 |

That is a spread of 46.05132348 percentage points on a column where the foam never changed at all. A share is a division, and the denominator is the build.

## What moved in each case

Burial adds a ground term of 0.4112572083, which takes 46.57193819 percent of the finished stack, and the foam's share falls to make room for it.

Still water outside raises the outside film resistance from 0.0022143296 to 0.0088573186, worth 1.85127692 percent, and U drops from 1.3348791131 to 1.3163448815 Btu/(hr ft2 degF).

A shut in line is the interesting one. The bore stops flowing and the inside film is taken to the stagnant catalog value of 5.0000 Btu/(hr ft2 degF), where the flowing liquid entry beside it is 60.000000 times larger. The inside film resistance rises from 0.0025191879 to 0.1259593944, that one term then carries 21.16107640 percent, and U falls to 1.0580538200. The pipe did not change. The condition did.

## The steel, for contrast

The steel wall is 0.000540611570 on the bare, the insulated and the buried build alike, and its share reads 9.09721378 percent, 0.11458472 percent and 0.06122039 percent. Three very different numbers describing a wall that never varied by a digit.

## The mistake

Quoting a share as though it were a property of the insulation. "The foam carries nearly the whole stack" is true of the insulated build in flowing conditions and false of the same pipe buried, where it carries a little over half. An engineer who sizes a coating on the strength of a share quoted from a different build has sized it against a denominator that is not theirs.

## What a share will not tell you

Whether the build is the one you meant. The shares are recomputed on every call, they always sum to 100.00000000 percent, and they sum over the terms that were entered. A stack missing a term still returns a tidy hundred, and the share column looks exactly as convincing as it does when everything is there.

## Exercise

Build the insulated pipe and record the foam share. Add the 4.0 ft trench in wet soil and record it again.

Then set the inside film to the shut in and stagnant value and record it a third time, and say which of the three foam shares belongs to the pipe rather than to the situation.
