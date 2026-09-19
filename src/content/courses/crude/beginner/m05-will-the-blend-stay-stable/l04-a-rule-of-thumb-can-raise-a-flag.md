# A rule of thumb can raise a flag

SARA is not always available. With no SARA on some crude in the blend, the screen falls back to a gravity-contrast rule of thumb, and the rule is built so that it can raise a flag and cannot clear one.

{{panel:crude-assay-explorer}}

## The rule

A wide spread of API with a light paraffinic crude in the blend is the combination that classically drops asphaltenes. So the rule asks two things: is the contrast in API between the lighter and the heavier crude above one threshold, and is the lighter crude above another. A flag needs both at once, and the probes below show each condition failing while the other holds. When the rule flags, the engine returns stable false. When it does not flag, the engine returns stable null, never true.

## Probing the thresholds

The two thresholds are not exported, so the engine is asked about them directly, with two crudes of no SARA.

| probe | lighter crude API | heavier crude API | API contrast (the engine) | stable |
| --- | --- | --- | --- | --- |
| contrast at its threshold | 40 | 25 | 15.0000 | no verdict |
| contrast just past it | 40 | 24.99 | 15.0100 | false |
| contrast well past it | 40 | 24 | 16.0000 | false |
| lighter crude at its threshold | 35 | 19 | 16.0000 | no verdict |
| lighter crude just past it | 35.01 | 19 | 16.0100 | false |
| lighter crude well past it | 36 | 19 | 17.0000 | false |

The first three probes hold the lighter crude at 40 API and move the heavier one. At a contrast of 15.0000 there is no verdict, and at 15.0100 the rule flags. The last three hold the heavier crude at 19 API and move the lighter one. With the lighter crude at 35 there is no verdict even at a contrast of 16.0000, and at 35.01 the rule flags.

## Two pairs from the library

| pair, no SARA supplied | basis | API contrast | stable |
| --- | --- | --- | --- |
| Asarama Heavy and Ubie Condensate, 50 and 50 | api-contrast | 37.4000 | false |
| Obigbo export blend, 65 and 35 | api-contrast | 10.9000 | no verdict |

Asarama Heavy with Ubie Condensate flags. The engine's message reads: "No SARA analysis supplied. On gravity contrast alone (37.4 degrees API, with a light paraffinic component) this is the combination that classically drops asphaltenes. Supply SARA for a colloidal instability index, and spot test before commingling."

The export blend does not flag, and the engine's message is careful about what that means: "No SARA analysis supplied, so this is an API-contrast screen only. The gravity spread is not the classic heavy-plus-light-paraffinic combination, which is not evidence that the blend is stable. Supply SARA for a real index."

## Why the rule cannot clear a blend

A rule of thumb captures one known danger. A blend can drop asphaltenes for reasons the gravity spread does not show: an unusually asphaltenic heavy crude, or a medium crude with a saturate-rich composition. So an absent flag proves nothing, and the engine will not turn it into a stable verdict.

The Obigbo export blend shows why this matters. With every SARA supplied, the export blend screens unstable on the CII, at 0.9163. With the SARA taken away, the gravity screen gives no verdict. Had the engine returned true on the absent flag, it would have called a blend stable that its own index calls unstable.

## Reading the result

In the assay explorer, remove the SARA from one crude of a blend. The basis changes to api-contrast, and a blend that does not flag shows no verdict as its own state.

## Exercise

Read the probes at a contrast of 15.0000 and 15.0100, and the probes with the lighter crude at 35 and 35.01. Quote the stable answer for each. Say what these four probes show about the two conditions a flag needs. Then read the export blend's CII of 0.9163 beside its gravity-screen answer, and say what the two answers together show about treating an absent flag as a clearance.
