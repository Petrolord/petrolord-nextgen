# Rich, moderate and lean

characteriseGas gives every gas a richness word beside its gallon figures. This lesson reads which figure the word is read off, and where it changes.

{{panel:gasvalue-flare-explorer}}

## One word, read off one figure

The richness word is read off gpmC3Plus, the gallons of propane and heavier in a thousand standard cubic feet. It takes one of three values: lean, moderate or rich.

The engine was asked where the word changes, by bisection on the propane fraction of a methane and propane mix, and it gave these two edges:

| word changes | gpmC3Plus where it changes |
| --- | --- |
| lean to moderate | 1.0000 |
| moderate to rich | 2.5000 |

The rule at each edge is stated: a gas at or above the lower edge reads moderate; at or above the upper edge it reads rich. So a gas at gpmC3Plus 1.0000 reads moderate, and a gas at 2.5000 reads rich.

## The three gases

| gas | gpmC3Plus (propane and heavier) | richness |
| --- | --- | --- |
| EGBEMA | 3.2205 | rich |
| OGUTA | 0.4890 | lean |
| studio opening gas | 2.6894 | rich |

EGBEMA's gpmC3Plus is 3.2205, at or above the upper edge of 2.5000, and the engine reads it rich. The studio's opening gas is 2.6894, also at or above 2.5000, and reads rich. OGUTA's is 0.4890, below the lower edge of 1.0000, and reads lean. None of the three reads moderate.

## The edges are the engine's own answers

The two edges were found by asking the engine, on a methane and propane mix, where the word changes as the propane fraction moves. Each edge is therefore a value of gpmC3Plus, the same figure the word is read off, and each is printed to four decimals, the precision every gal/Mscf figure in this course carries.

To read a gas's richness, read its gpmC3Plus and set it against the two edges, 1.0000 and 2.5000, with the at-or-above rule at each.

## A word that can be missing

The richness word is derived from gpmC3Plus, and gpmC3Plus is derived from the composition and the liquid densities. When the figure is missing, so is the word. Asked about EGBEMA with propane's liquid density left blank, the engine returns gpmC3Plus null and richness null. The same probe returns gpmC2Plus null too, and reports missingLiquidDensity C3, naming the component whose density is blank. The next lesson reads that case.

## Reading the word in the explorer

The flare explorer shows the richness word against the two edges the engine was asked for. Load EGBEMA, OGUTA and the studio's opening gas in turn and read each gpm C3+ against the edges. Then edit the propane fraction and watch for the point where the word changes.

## Exercise

Read the edge table, 1.0000 for lean to moderate and 2.5000 for moderate to rich, and the three gases' gpmC3Plus: EGBEMA 3.2205, OGUTA 0.4890 and the studio's opening gas 2.6894. Say which figure the word is read off, what the rule says about a gas sitting exactly on an edge, and which word each of the three gases reads.

Self check: the word is read off gpmC3Plus. A gas at or above the lower edge reads moderate, and at or above the upper edge it reads rich, so a gas at exactly 1.0000 reads moderate and at exactly 2.5000 reads rich. EGBEMA and the studio's opening gas read rich, and OGUTA reads lean.
