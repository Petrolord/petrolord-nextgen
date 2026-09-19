# No gravity, no screen

The stability screen has two routes. With SARA on every crude it forms the colloidal instability index. Without SARA it falls back to the gravity contrast. When a blend has no SARA and a crude with no gravity, neither route is open, and the engine says so plainly.

{{panel:crude-assay-explorer}}

## The case with nothing to work from

| pair, no SARA supplied | basis | API contrast | stable |
| --- | --- | --- | --- |
| a crude with no API and no SG beside one of 30 API | none | not formed | no verdict |

The basis is none. The API contrast is not formed, because one of the two gravities does not exist. The stable answer is no verdict. The engine's message reads: "No SARA analysis and not every crude has a gravity, so no stability screen was made. Supply SARA for a colloidal instability index."

## Why the engine does not fill the gap

A missing gravity could be guessed from a neighbouring field, or read as zero, or the crude could be left out of the contrast. Each of those would produce an answer, and each answer would rest on a number nobody measured. Leaving the crude out would turn a two-crude blend into a one-crude screen with no contrast at all. The engine takes the only honest route: no screen, and a message that says why.

This is the blank rule of module two once more. A blank is absent. It is not a zero, and it is not a default.

## The three stable answers, together

Across this module the screen has returned three kinds of answer.

Stable true comes only from the CII route, when a blend's index sits below 0.7.

Stable false comes from either route: a CII at or above 0.9, or a gravity-contrast flag.

No verdict comes from three places: a CII in the uncertain band, a gravity screen that did not flag, and a screen that could not be made at all. The three share a stable answer and differ in their basis and their message. The basis cell tells them apart: cii, api-contrast or none.

## The blend engine and a missing gravity

blendCrudes, asked to blend a crude with no API and no specific gravity, refuses outright: "No API or specific gravity for Egbema Medium. Every property here is weighted by density." The screen, asked about such a pair, answers with basis none and no verdict. The two answers fit together. Neither returns a number that was not computed from data.

## What to do next

A no-screen result is a list of missing data. The first remedy is SARA on every crude, which opens the index route. The second is a gravity on every crude, which opens the fallback. Until one of them arrives, the blend is unscreened, and the message says so.

## Exercise

Read the no-gravity row and its message. Quote its basis, its API contrast and its stable answer. Then read the export blend's gravity-screen row from the last lesson, with basis api-contrast and API contrast 10.9000. Say what the two basis cells show about why both rows return no verdict for different reasons.
