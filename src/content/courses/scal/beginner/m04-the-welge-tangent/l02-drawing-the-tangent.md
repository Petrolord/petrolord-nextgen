# Drawing the tangent

The last lesson promised that the fractional flow curve selects the front saturation exactly. The selection rule is a piece of geometry you can perform with a ruler: draw the straight line from the point $(S_{wc}, 0)$ that just touches the fractional flow curve. The saturation at the touch point is the front saturation $S_{wf}$. This is the Welge tangent construction, published by Henry Welge in 1952, and it turned a day of numerical integration into one straight line.

## The construction

Put the fractional flow curve for the Ekene sand on its axes: $f_w$ against $S_w$, anchored at $f_w = 0$ at $S_{wc} = 0.35$ and $f_w = 1$ at $1 - S_{or} = 0.75$. Now anchor a ruler at the point $(0.35, 0)$ and rotate it upward from the horizontal. For a while the ruler cuts the curve in two places. Keep rotating and the two intersections slide toward each other. At one particular angle they merge into a single touch point: the ruler is tangent to the curve. Stop there. Reading down from the touch point gives $S_{wf}$, and reading across gives the fractional flow at the front, $f_{wf}$.

Rotate past that angle and the ruler leaves the curve entirely. The tangent line is therefore the steepest straight line from $(S_{wc}, 0)$ that still touches the curve, and that steepness is the whole point.

## The secant that becomes a tangent

The engine does not hold a ruler. It does something equivalent that is worth understanding exactly, because it explains every digit the panel reports.

For each candidate saturation $S_w$ on a grid, the engine computes the slope of the secant line from $(S_{wc}, 0)$ to the curve:

$$\text{slope}(S_w) = \frac{f_w(S_w)}{S_w - S_{wc}}$$

and keeps the saturation where this slope is largest. Here is that search on the Ekene curve, using the exact fractional flow values from the truth data:

| $S_w$ | $f_w$ | secant slope $f_w/(S_w - 0.35)$ |
|---|---|---|
| 0.55 | 0.459029062228061 | 2.2951453111403044 |
| 0.60 | 0.7249143467053674 | 2.8996573868214695 |
| 0.6372 | 0.8682763300877854 | 3.023246274678918 |
| 0.65 | 0.9034103334774292 | 3.0113677782580965 |
| 0.70 | 0.9821436108054278 | 2.8061246023012223 |

The slope climbs, peaks at $S_w = 0.6372$, and falls away. The maximum secant slope is $f'_{wF} = 3.023246274678918$, and the saturation that produces it is the front.

Why is the maximum secant the same thing as the tangent? Picture the two intersections again. Whenever the ruler cuts the curve twice, some steeper line from the same anchor still reaches the curve between the cuts, so a twice-cutting secant is never the steepest. The steepest line through the anchor that meets the curve can only meet it by touching, and touching means the line's slope equals the curve's slope there. At the front, the secant slope and the derivative $df_w/dS_w$ are the same number. One search, two meanings.

## See it in the panel

{{panel:sc-displacement-explorer}}

Keep the Ekene defaults. The fractional flow plot draws the tangent line from $(0.35, 0)$ to the touch point for you. First confirm visually that the line touches the curve once and cuts it nowhere. Then read the Swf tile and check it against the table above. Now drag the oil viscosity slider upward and watch the construction respond: the curve shifts, the touch point slides, and the tangent follows. The construction is not a stored answer, it is re-derived from the curve every time an input moves.

## The misconception to avoid

The tangent is drawn from $(S_{wc}, 0)$, not from the origin. On the Ekene sand those are far apart: connate water is 0.35, a third of the saturation axis. Anchoring the ruler at $(0, 0)$ produces a confidently wrong front saturation with no warning, because the construction still looks plausible on paper. The anchor encodes real physics: ahead of the front the rock carries $S_{wc}$ of immobile water and no flowing water, so the line must begin where the displacement begins.

## Exercise

First, compute the secant slope at $S_w = 0.5$ using the truth value $f_w = 0.20920166128387394$, and state in one sentence why the search rejects this saturation as the front.

Second, the secant slope at 0.65 is 3.0113677782580965, within half a percent of the maximum 3.023246274678918. In two or three sentences, explain what feature of the curve near the touch point makes the slope so flat there, and why the front saturation is still a definite number rather than a range.
