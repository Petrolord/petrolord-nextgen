# Downdip hurts

Everything so far assumed the water climbs. Flip the geometry, inject updip and push the water down the structure, and the same density contrast that was holding the front together now works for the water. In the formula this is nothing but a sign: the dip enters through $\sin\alpha$ with displacement updip positive, so the mirrored case of the designed 10 degrees is $\alpha = -10$ degrees, and the capstone grades it. This lesson prices the mirror image on lesson 2's worked example, 5 degrees at 500 rb/d.

## The mirrored case

Run the worked example (k 250 md, A 20000 ft2, qt 500 rb/d, gammaW 1.03, gammaO 0.8654434250764526) with dip -5 degrees:

| quantity | downdip (-5) | flat | updip (+5) |
| --- | --- | --- | --- |
| G | -0.038882175395244155 | 0 | 0.038882175395244155 |
| Swf | 0.6364000000000001 | 0.6372 | 0.6379999999999999 |
| EDbt | 0.5074535247239459 | 0.5088773453049006 | 0.5102855131161252 |

The gravity number is exactly the negative of the updip value; the sine carries the whole reversal. With $G$ negative the numerator of $f_w$ becomes $1 + |G| k_{ro}$, water fractional flow is enhanced everywhere the oil still flows, the front weakens two grid steps to 0.6364, and the efficiency at breakthrough drops to 0.5074535247239459. The same mirror on the designed case, 10 degrees at 2000 rb/d, is the second graded field of this module.

Notice the symmetry, and notice that it is almost but not exactly clean. The flat EDbt sits between the two dipped values, about 0.0014 from each. The updip gain (0.5102855131161252 minus 0.5088773453049006) and the downdip loss (0.5088773453049006 minus 0.5074535247239459) agree to the first significant figure but not beyond, because $f_w$ responds to the correction through a nonlinear construction: the tangent point itself moves as the curve deforms. Gravity in and gravity out are mirror twins in the coefficient and only near-twins in the outcome.

{{panel:sc-design-explorer}}

In dip mode at 500 rb/d, run the dip slider from +5 through 0 to -5 and watch the EDbt tile traverse all three values in the table. Leave the panel at -5 and compare the fw curve against the flat case at low saturation: the dipped curve now sits above, the exact opposite of lesson 2's picture.

## Three values, one tolerance

The capstone grades both dipped efficiencies of the designed case at a tolerance of 0.0005, and on that case the three candidate values are each separated by more than the tolerance. The design is the same trap-proofing you met in lesson 2, now with three doors: the flat value fails both graded fields, and each dipped value fails the other's field. A learner who computes the correct magnitude but loses the sign produces the updip value where the downdip one belongs, and fails by roughly twice the gap between flat and dipped. The grading is not pedantic; misreading which way a flood runs against structure is a real and expensive field mistake, and the capstone treats it as one.

## Sign discipline in practice

The convention "displacement updip positive" is the engine's, inherited from the standard Buckley-Leverett literature, and it refers to the direction the water front travels, not to where the injector sits on a map. On the Ekene section the two wet wells, Ekene-2 and Ekene-4, were completed as injectors below the oil-water contact on the flanks; water driven from them toward the crestal producers is displacement updip, the favorable sign. If a later redevelopment placed injection at the crest, the same field, the same fluids and the same rates would flip the sign of every number in this module. Before quoting any dipped result, write one sentence stating which way the front moves relative to structure. If you cannot write that sentence, you are not ready to pick the sign.

## The misconception: gravity as always your friend

Because gravity segregation is usually introduced through its favorable case, engineers carry a quiet prior that density contrast helps waterflooding. It helps exactly when structure and injection geometry are arranged so that it does, and it hurts symmetrically when they are not. The formula is indifferent; it multiplies the same numbers either way and only the sine changes sign. The judgment about geometry is yours, made before the arithmetic starts.

## Exercise

First, compute the downdip loss and the updip gain in EDbt from the worked table as two differences, quote each to two significant figures, and state which is larger.

Second, a colleague models the Ekene flood with dip +5 at 500 rb/d but has accidentally set the injectors at the crest in their well schedule, so the physical displacement runs downdip. State which EDbt their model reports, which EDbt the field will deliver, the size of the gap, and the one-line check that would have caught the error before the meeting.
