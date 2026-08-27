# Tables versus models

Everything so far ran on the Corey model, because the Ekene fixture plants one and planted parameters make every number checkable. Real laboratories do not deliver models; they deliver tables of measured points. This lesson shows how the engine treats a table as a first class relative permeability description, and when a table serves you better than any fitted curve.

## A table is a curve set

A relative permeability table is a list of rows, each carrying a saturation and the two permeability values:

| $S_w$ | $k_{rw}$ | $k_{ro}$ |
|---|---|---|
| 0.35 | 0 | 0.9 |
| 0.55 | 0.05303300858899109 | 0.2249999999999999 |
| 0.75 | 0.3 | 0 |

Three rows is the engine's minimum, and this particular three row table is the Ekene model sampled at its endpoints and midpoint. Between rows, the engine interpolates linearly: ask it for $k_{rw}$ at $S_w = 0.45$ against this table and it returns the straight line value halfway between 0 and 0.05303300858899109, which is 0.026516504294495546, noticeably above the true Corey value of 0.009375000000000003 from lesson 3's table. Linear segments cut corners on a bowed curve, and a sparse table cuts them badly. Density is accuracy: the same machinery on a table with rows every 0.02 saturation units tracks the model closely.

## The table's own endpoints

A table does not declare $S_{wc}$ and $S_{or}$; it implies them. The engine reads connate water off the first row's saturation and residual oil off the last row's: $S_{wc}$ is the lowest tabulated $S_w$, and $S_{or}$ is one minus the highest. The endpoint permeabilities come from the same rows, the last row's $k_{rw}$ and the first row's $k_{ro}$.

This implies a discipline for anyone building tables: the first and last rows are not data like the others, they are declarations. A table that stops at $S_w = 0.7$ because the experiment ended there will be read as claiming $S_{or} = 0.3$, whether or not the rock agrees.

## Sorting and validation

The engine sorts rows by saturation before using them, so row order in your file is forgiven. Nothing else is. The full rulebook from lesson 4 applies: at least three numeric rows, every value inside $[0, 1]$, no duplicate saturations, $k_{rw}$ never decreasing, $k_{ro}$ never increasing, water immobile in the first row, oil immobile in the last. A table that fails any rule is rejected with the specific message naming the rule, and the correct response is to fix the data, not to trim rows until the checker goes quiet, because each rule is a physical statement about what a drainage experiment can produce.

## When a table beats the model

The model wins on convenience: six parameters, smooth everywhere, exact derivatives. The table wins on fidelity. Some rocks produce curves with a plateau, a kink near an endpoint, or a shoulder that no power law will follow. Forcing a Corey form onto such data smooths away exactly the feature the laboratory paid to measure. The engine therefore accepts either description everywhere a curve set is needed, and the professional habit is simple: carry the laboratory table as the reference, use a model when its convenience matters, and say which one a given number came from.

There is a middle path, fitting model parameters to a measured table, and it is genuinely useful, but it belongs to the Expert tier of this course, where the fitting machinery and its confidence intervals get a full module of their own.

## The misconception to avoid

A denser table always looks more authoritative, but interpolation fidelity and measurement quality are different things. Twenty rows interpolate beautifully between whatever values they hold; if three of those values were measured on a damaged plug, the table reproduces the damage with the same beautiful fidelity. The validation rules catch impossible tables, not wrong ones. No checker replaces knowing how the measurement was made, and the Professional tier's laboratory module takes up exactly that question for capillary data.

## Exercise

Using the three row table at the top of this lesson, compute the linearly interpolated $k_{ro}$ at $S_w = 0.65$, and compare it with the true Corey value 0.05624999999999995 from lesson 3. State the sign of the interpolation error and, in one sentence, why linear segments on a curve that bows downward must err in that direction between the sampled points.

Then write down the implied endpoint set of this table, all four frame numbers, and confirm it matches the Ekene design exactly. One sentence: why does sampling a model at its endpoints and midpoint preserve the frame perfectly while distorting the interior?
