# Three bands and three answers

The engine reads the colloidal instability index against two thresholds, which gives three bands and three answers. The thresholds live in the exported table CII_BANDS.

{{panel:crude-assay-explorer}}

## The bands

Below 0.7 the blend is stable, and the engine returns stable true. From 0.7 to below 0.9 the blend is uncertain, and the engine returns stable null and says spot test. At or above 0.9 the blend is unstable, and the engine returns stable false.

The bands are screening bands and are not a phase boundary.

## Three pairs, three bands

screenBlendStability blends each SARA fraction and forms the blend's CII. These three pairs land in the three bands.

| pair (by volume) | CII | band | stable |
| --- | --- | --- | --- |
| Asarama Heavy with Ubie Condensate, 50 and 50 | 1.7614 | unstable | false |
| Asarama Heavy with Egbema Medium, 70 and 30 | 0.7161 | uncertain | no verdict |
| Egbema Medium with Obigbo Light, 85 and 15 | 0.6634 | stable | true |

## The three messages

Each band comes with a message the engine writes, and each message says what to do next.

For Asarama Heavy with Ubie Condensate the engine says: "Screens unstable. The saturate and asphaltene load is high against the aromatics and resins holding it. Do not commingle without a lab test."

For Asarama Heavy with Egbema Medium: "Uncertain. The index sits in the band where blends go either way; spot test to ASTM D7112 or D7157 before commingling."

For Egbema Medium with Obigbo Light: "Screens stable on the colloidal instability index. Asphaltenes are held by the aromatics and resins present."

## Reading the first pair

Asarama Heavy carries 11.9 wt% asphaltenes, and Ubie Condensate 89.1 wt% saturates. The engine's gravity-contrast message calls a wide API spread with a light paraffinic crude "the combination that classically drops asphaltenes". The engine screens it unstable at 1.7614.

## Reading the middle answer

The middle band is the one to understand best. Stable null is its own answer. It is not a weak yes and it is not a weak no. It says the index sits where blends go either way, and the screen cannot decide. The engine's message names the tests: "spot test to ASTM D7112 or D7157 before commingling."

The engine returns stable null for this band, and the table above prints it as no verdict, beside true for the stable pair and false for the unstable one. Three values come back, and a reader who quotes the screen quotes the one that came back. In the assay explorer, no verdict is drawn as its own state.

## Reading the third pair

Blended at 85 with 15 of Obigbo Light, the blend's CII is 0.6634, in the stable band, and the engine says why: the asphaltenes are held by the aromatics and resins present.

## What the screen is for

This course says what kind of answer the screen gives: "The bands are screening bands and are not a phase boundary." What each band asks for is in the engine's own messages. The unstable pair's ends "Do not commingle without a lab test." The uncertain pair's asks for a spot test "before commingling". The stable pair's says the asphaltenes "are held by the aromatics and resins present". Two of the three messages name a laboratory test.

## Exercise

Read the three rows of the pair table. Quote each pair's CII, band and stable answer. Say what the three answers show about how the engine's verdict changes as the CII crosses 0.7 and 0.9. Then explain why the middle pair returns no verdict rather than a false, and what the engine's message asks the terminal to do next.
