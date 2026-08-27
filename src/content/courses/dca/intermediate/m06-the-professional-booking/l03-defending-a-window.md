# Defending a window

A window is the only input to a decline analysis that leaves no trace in the output. The model family is printed. The parameters are printed. R2 and RMSE are printed. The rows you chose to fit are gone by the time anyone reads your booking, and yet they determined every printed number. That asymmetry is why window justification has to be written down, and why writing it down is a skill separate from choosing well.

The test to hold yourself to is simple. A reviewer who disagrees with your window should be able to reconstruct exactly what you did, run the alternative, and see the difference. If your note only tells them that you chose a window, it has failed even if the window was right.

## The five parts of a defensible window note

**1. The claim.** One sentence naming the well, the stream, the physical regime, and the boundary dates. "Ekene-6 oil, primary depletion, 2020-09-01 to the last monthly row before 2023-01-01."

**2. The physical evidence.** Why those boundaries and not others, in terms of things that happened in the reservoir or at surface. Not in terms of fit quality. The start is first oil. The end is the day injection began, because Arps assumes the drive and the operating conditions do not change, and injection changes both.

**3. The boundary convention.** Say how you resolved the boundary to the resolution of your data. Monthly rows mean the last usable row is the one before the event month, not a partial month spanning it. State it, because the next engineer's choice of the same convention is what makes your number reproducible.

**4. The counterfactual.** What the rejected alternative gives. This is the part most notes omit and the part reviewers actually want.

**5. The residual risk and the trigger.** What would change your mind, and when you will look again.

## Worked example: the Ekene-6 note

> **Window.** Ekene-6, oil stream, primary depletion, 2020-09-01 through the last monthly row before 2023-01-01 (821 days).
>
> **Basis.** First oil 2020-09-01. Field waterflood injection began 2023-01-01, changing the pressure regime for all producers, so the primary-decline assumption of unchanging conditions holds only to that date. Boundary resolved to the last complete monthly row before the event month.
>
> **Fit on this window.** Auto-select returns Hyperbolic, $q_i$ 89.9999999999999 stb/d, $D_i$ 0.00100000000000000 per day, $b$ 0.35, R2 1.00000000000000, RMSE 4.31997628804008e-14. $q_i$ agrees with the first recorded rate; $b$ is far from the search boundary.
>
> **Counterfactual, full history.** Fitting all rows from 2020-09-01 to the end of record returns Hyperbolic with $q_i$ 87.9980156583808 stb/d, $D_i$ 0.000960001821405101 per day, $b$ 1.35000000000000 and R2 0.780507944377468. The b of 1.35 is not a reservoir property, it is the single Arps curve that best splits the difference between primary decline and the flood response, and a b above 1 implies a tail this well has no evidence for. Rejected.
>
> **Counterfactual, post-response.** A separate window from 2024-01-01 onward returns Exponential, $q_i$ 62.3602025480838 stb/d, $D_i$ 0.00114387174233099 per day, R2 0.920390851618676. This is a valid window for a different question, namely the current producing regime, and it is not part of the primary booking. Note that the oil stream declines faster than the flood's own decline constant because water cut is climbing, so the window statement names the stream deliberately: you fit the stream you book, and you say what drives it.
>
> **Residual risk and trigger.** The primary window contains no observed flood response and therefore says nothing about incremental recovery. Revisit if the injection start date in the operations record is revised, or if any pre-2023 rows are restated.

Everything in that note is auditable. A reviewer can run both counterfactuals in minutes and either agree or produce a better argument, and the disagreement will be about physics rather than about what was done.

## Two misconceptions worth naming

**"The window with the best R2 is the defensible one."** On this teaching data the primary window happens to give R2 of 1, so the two criteria agree and prove nothing. On real data they diverge constantly, and they diverge in a predictable direction: shorter windows fit better, because fewer points are easier to pass a curve through. If fit quality is your selection rule, you will drift toward windows so short that b is unidentifiable, and you will book the resulting b anyway. The evidence for a boundary is an event, not a residual.

**"I will pick the window after I see the fits."** This is not always wrong: sometimes a fit genuinely reveals a regime change nobody logged, and following that up is real engineering. The problem is that after the fact, nobody, including you, can tell a discovery from a preference. The fix is procedural: log the intended window before fitting, log every alternative you tried with its result, and log a change of window as a new entry rather than editing the old one. That trail is what makes "I revised my window when the residuals showed a break in 2023" a defensible sentence instead of an unverifiable one.

## Worked example: writing a rejection

Rejections deserve the same structure, and Ekene-1's naive fit is the cleanest case in the field. The full-history auto-select returns Hyperbolic with $q_i$ 97.2058663778433 stb/d, $D_i$ 0.00196150586036441 per day, $b$ 1.95000000000000 and R2 0.818388421218434.

Three lines of evidence, none of which is the R2:

- $q_i$ of 97.2 stb/d on a well whose first recorded rate is 120 stb/d. The fitted curve cannot reach the start of the data it was fitted to.
- $b$ at 1.95, sitting exactly on the ceiling of the engine's search range. The optimizer was still moving when it ran out of room.
- The window spans two physical regimes, so no single Arps curve is the right object regardless of which parameters come back.

The R2 of 0.818388421218434 is a symptom, and it is worth reporting because it is the number a reviewer will ask for, but a fit does not become admissible by having a higher one. That is the sentence to keep: goodness of fit measures agreement with the rows you selected, and it can say nothing whatever about whether you should have selected them.

## Exercise

1. Write the full five-part note for Ekene-3's primary booking, including a counterfactual. Ekene-3 came on 2020-03-01, so its primary window is 1005 days, and its naive full-history fit returns Hyperbolic $q_i$ 134.237029542021 stb/d, $D_i$ 0.00374899598601156 per day, $b$ 1.95000000000000 and R2 0.899873903499416. Note that this naive R2 is higher than Ekene-1's and the fit is no more admissible, and say why in your note.

2. Take a booking from your own work, or the Associate capstone booking, and write only part 4 of the note for it: the counterfactual. Run the alternative window, record what it gives, and state the difference in EUR. If you cannot run the alternative, that inability is itself the finding.

3. Draft the two-line entry you would add to a project log every time you change a fit window: timestamp, old and new boundaries, reason, effect on the booked volume.
