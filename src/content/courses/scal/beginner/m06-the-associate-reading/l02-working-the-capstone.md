# Working the capstone

The Associate capstone asks you to displace the Ekene sand. You run the fractional flow analysis on the fixture's rock and fluids and report six numbers, each graded server-side against the engine truth within a stated tolerance.

| Field | Unit | Tolerance | Where it is owned |
|---|---|---|---|
| Mobility ratio | none | 0.005 | module 3 lesson 2 |
| Front saturation $S_{wf}$ | none | 0.0005 | module 4 lesson 3 |
| Fractional flow at the front $f_{wf}$ | none | 0.001 | module 4 lesson 3 |
| Pore volumes injected at breakthrough | PV | 0.001 | module 4 lesson 3 |
| Displacement efficiency at breakthrough | none | 0.001 | module 4 lesson 4 |
| Days to breakthrough at 8000 bwpd | days | 2 | module 5 lesson 3 |

This lesson does not hand you six answers to copy. It works two of them all the way through by hand, and points you at the lesson and the panel tile that own each of the rest. If modules 1 through 5 are behind you, nothing here is new. The capstone is the course, asked back.

Read the tolerances as a promise. Any honest route to each number lands well inside them. Two whole days of slack on a breakthrough time near nine hundred means nobody is grading your decimals. They are grading your method.

## Walkthrough one: the mobility ratio, entirely by hand

The mobility ratio needs no curve, no tangent, and no panel. It is built from the four endpoint properties alone:

$$M = \frac{k_{rw,max}/\mu_w}{k_{ro,max}/\mu_o} = \frac{0.3/0.5}{0.9/1.8} = \frac{0.6}{0.5} = 1.2$$

Do the arithmetic once on paper. The two traps that actually cost marks here are both definitional. The endpoint $k_{rw,max}$ is the water curve's value at residual oil, and $k_{ro,max}$ is the oil curve's value at connate water: each phase is measured where it flows best. Evaluate either curve anywhere else, at the front saturation for instance, and you are computing some other ratio the grader has never heard of. And the viscosities enter as a ratio of mobilities, water over oil, so inverting the fraction hands you 0.8333333333333334, which fails the 0.005 tolerance by a wide margin and tells you exactly what you did.

## Walkthrough two: days to breakthrough, the one field with a clock in it

The sixth field states its own conditions: a steady 8000 barrels of water per day into the Ekene pore volume. The chain has three links, and you own all three already.

First, breakthrough in pore volumes is the reciprocal of the tangent slope: $Q_{iBt} = 1/3.023246274678918 = 0.33077027444818546$ PV.

Second, the pore volume in barrels is fixture data: 22410845.5314109 bbl.

Third, pore volumes become days at the stated rate:

$$t_{BT} = \frac{0.33077027444818546 \times 22410845.5314109}{8000} = 926.6051908800841 \text{ days}$$

Call it two and a half years. The tolerance of 2 days absorbs any rounding you could plausibly commit, so a miss here is structural: the wrong rate, the wrong pore volume, or breakthrough read from the wrong quantity. The classic error is using the average saturation rise or a recovery-table row instead of $Q_{iBt}$; module 5 lesson 3 works the correct conversion in both directions.

## Where the other four come from

**Front saturation.** Module 4 lesson 3, and the front tile in the displacement explorer you have used since module 2. It reads 0.6372. If you are tempted to report the average behind the front instead, reread module 4 lesson 4; the two differ by 0.0436 here, which is 87 times the tolerance.

**Fractional flow at the front.** Same lesson, same panel, the tile beside it. Check it rather than copy it: the tangent identity says $f_{wf}$ divided by $(S_{wf} - S_{wc})$ must return the slope 3.023246274678918, and it does: $0.8682763300877854 / 0.2872$.

**Pore volumes at breakthrough.** Worked above as link one of the clock chain, and displayed on its own tile. The identity $\bar{S}_{wBt} = S_{wc} + Q_{iBt}$ gives you a free cross-check against the average-saturation tile.

**Displacement efficiency at breakthrough.** Module 4 lesson 4. By hand: $(\bar{S}_{wBt} - S_{wc})/(1 - S_{wc}) = 0.33077027444818546/0.65 = 0.5088773453049006$. Notice the numerator IS $Q_{iBt}$; that collapse only happens at breakthrough, which is worth understanding rather than memorizing.

## Submitting

The capstone form sits on the Learning Mode page under the course. Enter the six numbers at whatever precision you carried and submit. Grading is server-side within the tolerances above, and you will see which fields passed.

If a field fails, do not add decimal places. Every tolerance is far wider than rounding. A miss means a method error, and the fix is the lesson named in the table.

## The misconception to avoid

Students treat the capstone as a reading test: open the panel, transcribe six tiles, submit. The grader cannot tell the difference, but the next course can. Professional and Expert both assume you can rebuild each of these numbers when the panel is not in front of you, and the exam questions in this tier already probe that. The walkthroughs above are the standard to hold yourself to: every number either derived by hand or cross-checked through an identity.

## Exercise

Before you submit, predict the effect of each of these three mistakes on each of the six fields: inverting the mobility ratio; reporting the average saturation behind the front where the front saturation was wanted; and converting days with the movable oil volume instead of the full pore volume. For each mistake, write down which fields fail, which still pass, and what the wrong value would have been. Then check any one of your three predictions against the panel.
