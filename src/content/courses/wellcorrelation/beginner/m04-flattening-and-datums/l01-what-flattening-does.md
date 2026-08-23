# What flattening does

The previous module left you with a structural section: every well hung at true measured depth, the surfaces dipping and rolling across the panel exactly as they sit in the ground. That view answers a structural question. It is poor at answering a stratigraphic one, because a thick interval in a deep well and a thin interval in a shallow well look much the same when the whole column has been pushed down the page by structure.

Flattening is the fix. It pins a chosen top to a chosen datum depth in every well by sliding each well's whole column up or down as one rigid block.

Read that sentence again, because two words in it carry the whole module. *Chosen*: you pick the top and you pick the datum depth, and both are interpretation decisions. *Rigid*: nothing inside a well is stretched, squeezed or re-ordered. The column moves as a single piece, like lifting a stack of cards by the bottom card rather than shuffling it.

## The golden rule

Flattening changes the display, never the data.

The tops table on disk is untouched. Ekene-1's TOP_SAND is at 1548 m before you flatten and at 1548 m afterwards. What changes is where the engine draws it on the panel. The engine keeps this honest by construction: the flattening step produces one number per well, a shift, and every drawing routine adds that shift to a measured depth at the moment of drawing. There is no step anywhere that writes a shifted depth back into a well.

You will meet this rule again in lesson four with a sharper edge on it, because the price of a display-only transform is that the numbers you read off the panel are display numbers.

## What flattening removes

Flattening removes the structural component: the depth differences caused by the datum surface's own relief.

On the Ekene section, TOP_SAND is picked at 1548, 1565, 1541 and 1590 m in wells 1 through 4. Those four numbers differ by up to 49 m, and that difference is structure. It tells you the sand surface is deepest at Ekene-4 and shallowest at Ekene-3. In the structural view, that 49 m of relief is the first thing your eye sees, and it drags every deeper surface along with it. TOP_B is deeper in Ekene-2 than in Ekene-3 partly because the whole Ekene-2 column is deeper, not because anything special happened between the sand and TOP_B.

Flatten on TOP_SAND and that structural signal is gone by design. All four sand tops land on one horizontal line. Whatever separation remains between the wells above or below that line cannot be structure on TOP_SAND, because you just removed it. It has to be something else, and that something else is what you were trying to see.

## What flattening preserves exactly

Every interval thickness within a well survives untouched, because the whole column moves together. Both ends of any interval receive the same shift, so the distance between them is unchanged. In arithmetic terms, if a top moves from $a$ to $a + s$ and a base moves from $b$ to $b + s$, the thickness $b - a$ becomes $(b + s) - (a + s) = b - a$.

The Ekene sand demonstrates it. Gross sand thickness is 32 m in Ekene-1, 36 m in Ekene-2, 29 m in Ekene-3 and 25 m in Ekene-4. Those four numbers are the same in the structural view, the same flattened on TOP_SAND, and the same flattened on TOP_A. They are properties of the wells, not of the view. If a thickness ever changes when you switch the datum, you have found a bug or you have misread a number.

Ordering is preserved too. Nothing can cross over, because a rigid slide cannot reverse the sequence of surfaces inside a well.

## What flattening answers

The question flattening answers is this: how do the intervals compare once structure is taken out.

With the sand tops levelled, the Ekene-2 sand visibly hangs lower than the others, and now you know that is thickness rather than depth. The interval between TOP_A and TOP_SAND opens up toward Ekene-4. The spacing of TOP_B below the sand becomes comparable well to well. None of that is legible when structure dominates the panel.

That is the whole payoff. Structure and stratigraphy are two signals mixed together in a raw section, and flattening is the subtraction that separates them. You do not choose one view over the other. You look at both, and you say which one you are looking at.

## Exercise

Without doing any arithmetic yet, answer three questions about flattening the Ekene section on TOP_SAND at a 1500 m datum. First, what will Ekene-3's TOP_SAND display at? Second, what will Ekene-2's gross sand thickness be on the flattened panel? Third, what happens to Ekene-1's true TOP_SAND depth of 1548 m in the stored tops table?

Self-check: 1500 m exactly, because every well's datum top lands on the datum line by construction. 36 m, unchanged, because both ends of the interval take the same shift. And 1548 m, unchanged, because flattening changes the display and never the data.
