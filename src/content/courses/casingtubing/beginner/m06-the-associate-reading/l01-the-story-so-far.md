# The story so far

Five modules, four ratings, and one of them behaves nothing like the others.

## The claim

A tubular is described by four numbers, and it is rated by four formulas. Three of the four ratings scale exactly with the steel and the fourth does not scale with it at all in some cases.

## What each module established

**Module 1.** A well is a nest of pipes, and every joint has to survive burst, collapse, tension and all three at once. The catalog carries 28 rows at 10 grades. Only the outside diameter and the wall are independent; the inside diameter follows, and the nominal weight is a label rather than a computed quantity. A rating is the answer to a stated question, and the statement is the important half.

**Module 2.** Barlow is one line of algebra with a thin-wall assumption that every row in this catalog satisfies. The published burst rating is 0.875 times it, because the mill is allowed to be 12.5 percent under the nominal wall. That factor is a manufacturing tolerance and not a safety factor, and it does not appear in collapse at all. Pipe body yield is the exact one: yield times steel area. Joint strength is that times a connection efficiency, and short thread connections give away a quarter of it.

**Module 3.** Collapse is four formulas, not one, chosen by the ratio of diameter to wall. Yield and plastic and transition and elastic, in decreasing order of wall thickness. The three boundaries between them are functions of the yield strength alone, so they belong to the grade and not to the pipe, and every one of them falls as the grade rises. Across the whole catalog the plastic regime holds 143 of 280 combinations.

**Module 4.** Tension reaches collapse through an axial-adjusted yield, which is the von Mises ellipse solved for the hoop stress. It lowers the value AND raises the boundaries, so tension moves a pipe toward the yield regime. The derating passes through exactly in the yield regime, partly in the middle two, and not at all in the elastic one. At the very end of the curve the engine returns zero with a named regime rather than a plausible wrong number.

**Module 5.** The 20 inch 94 lb/ft row gives the same collapse at all ten grades, because it is elastic at all ten and the elastic formula has no yield strength in it. Burst on that row spans a factor of 3.125 over the same span. What a higher grade buys on such a pipe is immunity to tension: H-40 leaves the elastic regime at about 27 percent of yield and Q-125 at about 84.

## The numbers to carry

- The burst tolerance factor is 0.875, and it applies to burst only.
- The ratio of diameter to wall decides the collapse regime, and nothing else does.
- Every regime boundary is a function of the yield strength alone.
- The adjusted yield is Yp times the bracket sqrt(1 minus 0.75 r squared) minus 0.5 r.
- In the elastic regime, grade and tension both do nothing to collapse.

## The one sentence

Three of the four ratings are the steel times a geometry factor, and the fourth is whichever of four formulas your slenderness has landed you in.
