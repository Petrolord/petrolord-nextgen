# Duration from the activity programme

{{panel:pr-contract-calculator}}

A contract comparison is only as good as its duration. The engine accepts a duration stated directly in days, as a number or as a triangle, and it also accepts an activity programme. The Ekene job uses the programme: the tender engine asks the well time engine of the drilling courses, `engines/drilling/wellCost.js`, how long it runs, so every assumption behind the day count is written down.

## The programme

The fixture lists eleven activities for the two wells, each either a flat duration in hours or a trip at a stated depth and speed:

| activity | kind | what it is | hours or depth and speed |
| --- | --- | --- | --- |
| e3-rigup | flat | Mobilise and rig up on Ekene-3 | 48 hr |
| e3-trip | trip | Coiled tubing in and out, Ekene-3 | 1600 m at 1200 m/hr, in and out |
| e3-clean | flat | Clean out fill, Ekene-3 | 30 hr |
| e3-acid | flat | Pump the acid treatment, Ekene-3 | 16 hr |
| e3-flow | flat | Nitrogen lift and flow back, Ekene-3 | 36 hr |
| move | flat | Rig down and move to Ekene-5 | 24 hr |
| e5-trip | trip | Coiled tubing in and out, Ekene-5 | 1620 m at 1200 m/hr, in and out |
| e5-clean | flat | Clean out fill, Ekene-5 | 30 hr |
| e5-acid | flat | Pump the acid treatment, Ekene-5 | 16 hr |
| e5-flow | flat | Nitrogen lift and flow back, Ekene-5 | 36 hr |
| demob | flat | Rig down and demobilise | 48 hr |

`evaluateProgram` in wellCost sums them. At an NPT fraction of 0, the programme runs 12.056944 productive days.

## Non-productive time stretches the programme

No job runs at its productive time. Waiting on weather, equipment trouble and the rest arrive as non-productive time, which wellCost states as a fraction of the productive time. The days of one outcome are therefore:

days = productive days x (1 + NPT fraction)

That is wellCost's own stretch rule, and the tender engine uses it unchanged. The fixture makes the NPT fraction triangular, with a minimum of 0.05, a most likely value of 0.15 and a maximum of 0.6. The plan takes the most likely value, and 12.056944 productive days stretched by 0.15 give the planned 13.865486 days.

The triangle is lopsided. Its most likely value sits near the bottom and its tail runs out to 0.6, so a long job is possible in a way a short one is not. That shape drives most of what the next four lessons find.

## An imported engine's refusal keeps its name

When wellCost refuses an activity, the tender engine passes the refusal through with the name of the engine that made it, under the field `duration.program`. A rig-up typed with a negative duration returns:

> duration.program is refused by engines/drilling/wellCost.js: flat "Mobilise and rig up on Ekene-3": durationHr must be >= 0

The part after the colon is wellCost's message; the tender engine leaves another engine's rule in that engine's words. Its own checks are separate. A duration stated directly as a days triangle whose minimum sits above its most likely value is refused under the field `duration`:

> duration must have min <= mode <= max; got min 16, mode 14, max 20

The same wording, with the figures it was given, refuses an NPT fraction or a daily cost triangle out of order.

## Exercise

Open the contract calculator on the view "Contract types on one job". Find `duration.nptFrac` in the box and set its `min`, `mode` and `max` all to 0. Read the tile "Plan days" and check it against the productive days above. Put the triangle back, then change the `durationHr` of `e3-rigup` to -48 and read the refusal, with the field it names and the engine it quotes. Restore 48, then replace the whole `duration` object with a days triangle `{ "min": 16, "mode": 14, "max": 20 }` and read the tender engine's own refusal.
