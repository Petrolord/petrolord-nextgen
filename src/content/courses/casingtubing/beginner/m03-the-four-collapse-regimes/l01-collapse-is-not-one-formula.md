# Collapse is not one formula

Four mechanisms, four fits, and a rule for choosing between them.

{{panel:ct-rating-explorer}}

## The idea

Burst has one formula because there is one mechanism: the hoop stress reaches yield.

Collapse has four, because a pipe squeezed from the outside can fail in genuinely different ways depending on how thick its wall is relative to its diameter.

## The two ends

**A very thick pipe** does not buckle. The wall simply yields under the compression, and the collapse pressure is a yield calculation. It is proportional to the yield strength.

**A very thin pipe** buckles elastically long before anything yields. It goes oval and then flattens, and the pressure at which it does so is a stability calculation on the geometry. The yield strength does not enter at all, because nothing has yielded.

## The two in the middle

Between those two ends, real pipe does something in between and neither calculation predicts it. API Bulletin 5C3 fills the gap with two empirical formulas fitted to a large collapse test programme: a PLASTIC regime next to the yield one, and a TRANSITION regime next to the elastic one.

Those two are fits. They are not derived from anything, and they carry the scatter of the test population.

## The four in order of decreasing wall

1. **Yield.** Thickest. Proportional to the yield strength.
2. **Plastic.** Empirical, still strongly dependent on the yield strength.
3. **Transition.** Empirical, weakly dependent on the yield strength.
4. **Elastic.** Thinnest. Independent of the yield strength entirely.

## What decides which

One number: the ratio of outside diameter to wall thickness. The next lesson is about that ratio, and the one after is about the three values of it that separate the four regimes.

## Where the catalog sits

Across all 28 rows at all 10 grades, 280 combinations, the census is 42 yield, 143 plastic, 52 transition and 43 elastic. The plastic regime holds half the catalog, which is why it is the one worth knowing by feel.

## Exercise

Open the panel on the census view and read the four counts.

Then, without changing anything else, set the axial fraction to 0.4 and read them again. Three of the four numbers move. Note which way, and hold the question until module 4.
