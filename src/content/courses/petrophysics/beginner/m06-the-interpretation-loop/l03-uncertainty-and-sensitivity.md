# Uncertainty and sensitivity

Every parameter in the workflow carries uncertainty, and the honest question is never whether the inputs are perfect. The question is which imperfections matter. Sensitivity analysis answers it: change one input at a time, rerun the loop, and watch how far the answers move. This lesson ranks the beginner workflow's inputs by how hard they shake the results, using the typewell as the laboratory.

## Rw: the saturation lever

With $n = 2$, the Archie equation puts $R_w$ under a square root:

$$S_w = \sqrt{\frac{a\,R_w}{\phi^m\,R_t}} \quad\Rightarrow\quad S_w \propto \sqrt{R_w}$$

So a factor of 2 error in $R_w$ moves every saturation in the well by a factor of $\sqrt{2} \approx 1.41$. That is a large lever. The square root softens the error but cannot make it benign.

**Worked example.** At 2020 m the correct inputs give $S_w = 0.350$. Suppose you had used $R_w = 0.10$ ohm.m, double the true value:

$$S_w = \sqrt{\frac{1 \times 0.10}{0.2100^2 \times 9.2554}} = \sqrt{0.2450} = 0.495$$

The sample still passes the 0.6 cutoff, but samples that were sitting near the cutoff flip from pay to non-pay across the well, and every volumetric estimate that uses $(1 - S_w)$ shrinks by about 22 percent at this depth. This is why the water-leg check from the previous lesson earns its place: it pins $R_w$ against data.

## Matrix density: the porosity offset

Density porosity is linear in $\rho_{ma}$, and the practical consequence is a near-constant offset. Using a limestone matrix of 2.71 g/cc on this quartz sand instead of 2.65 g/cc gives, at 2020 m:

$$\phi_D = \frac{2.71 - 2.3035}{2.71 - 1.00} = \frac{0.4065}{1.71} = 0.2377$$

against the correct 0.2100, a shift of about $+0.028$ porosity units. Every sample in the well moves by roughly the same amount, zone averages inherit the offset, and because $\phi$ enters Archie squared, saturations shift too (a higher $\phi$ lowers the computed $S_w$). The lesson: matrix density errors are systematic. They do not average out.

## Cutoffs: the net pay dial

Cutoffs do not change any computed curve; they change which samples count. Their sensitivity therefore depends entirely on how much rock sits near the cutoff values. The typewell makes the contrast vivid:

- **SAND_A is robust.** Its pay has average porosity 0.208 against a cutoff of 0.08, shale volume near zero against 0.5, and saturation 0.361 against 0.6. Nudging any cutoff by a sensible amount barely moves the 18.0 m of net.
- **SAND_B is sensitive.** Only 5.5 m of its 30.5 m gross clears the tests, and much of the remainder fails narrowly, with porosities just under 0.08 and saturations crowding the 0.6 line. Loosen the saturation cutoff to 0.65 and SAND_B's net grows materially; tighten it to 0.55 and the zone thins further. Any figure quoted for SAND_B should carry that caveat.

A useful habit is to report net pay at the agreed cutoffs and alongside it the net at one step looser and one step tighter, so the reader sees the dial's slope.

## The one-at-a-time discipline

Change a single input, rerun, record the deltas, restore the input, and only then test the next one. Changing two inputs at once produces a result you cannot attribute, and compensating errors can hide both. The Learning Mode app makes this cheap: every parameter on the typewell is editable, the engine reruns instantly, and the zone summaries update in front of you. Ten minutes of deliberate one-at-a-time passes will teach you more about a well than an afternoon of reading.

Rank what you find. On this well the ranking comes out: $R_w$ and $\rho_{ma}$ first because they shift every sample systematically, cutoffs next because SAND_B crowds them, and the gamma ray lines last because both sands are so clean that even generous errors in $GR_{clean}$ or $GR_{clay}$ leave $V_{sh}$ far below the 0.5 cutoff.

## Quote ranges, then a best estimate

The deliverable of a sensitivity pass is a range: net pay 16 to 19 m with a best estimate of 18.0 m reads very differently from a bare 18.0 m, and decision-makers deserve the former. A best estimate without a range hides exactly the information this lesson exists to surface.

## Exercise

Using the 2020 m sample, compute $S_w$ with $R_w = 0.025$ ohm.m, half the true value, keeping everything else fixed. Verify the square-root rule: your answer should be close to $0.350 / 1.41$. Then state, in one sentence each, the expected direction of change in SAND_B net pay if the porosity cutoff moved from 0.08 to 0.10, and in SAND_A net pay for the same change. Check yourself: $S_w \approx 0.247$; SAND_B net drops noticeably; SAND_A net barely moves.
