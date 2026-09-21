# One cause, several channels

{{panel:lp-sif-builder}}

Redundancy answers one question well and another question badly. It handles channels that fail on their own, at their own times, for their own reasons. It does nothing at all about a cause that reaches every channel at once. A wrong calibration procedure applied to three transmitters, a common impulse line that plugs, a shared power supply, a batch of valves with the same seat material: each of these is one event that takes the whole group. That is common cause failure, and it is the reason redundant subsystems do not reach the PFDavg their squared terms promise.

## The beta factor

The engine models common cause with the beta factor, the fraction of dangerous undetected failures that strike every channel at once. The fraction for detected failures is betaD. The treatment is simple and deliberate. Common cause failures are taken out of the rate that fails channels independently, leaving one minus betaD multiplied by the detected rate plus one minus the beta factor multiplied by the undetected rate. They are then added back as a single channel term, because when they happen they fail the group in one stroke.

## What redundancy alone would give

The EKULAMA channel as a redundant subsystem with a beta factor of zero and a betaD of zero, which is a claim that no single cause reaches every channel.

| architecture | beta factor | independent term | common cause | PFDavg |
| --- | --- | --- | --- | --- |
| 1oo2 | 0 | 0.000037396736 | 0.000000000000 | 0.000037396736 |
| 2oo3 | 0 | 0.000112190208 | 0.000000000000 | 0.000112190208 |

These are the numbers a design gets if common cause truly does not exist. Everything this module does from here is the story of what happens to them as the beta factor is raised.

## Zero has to be typed

For any redundant architecture the engine requires a beta factor and will refuse the call without one. There is no default and no silent zero. The reason is in the engine's own refusal message, which the last module of this tier quotes in full: a beta factor of zero is a claim of no common cause at all, and a claim that strong belongs to the analyst who signs the calculation. The same holds for betaD whenever the dangerous detected rate is above zero.

## Where the number comes from

The engine takes the beta factor as an input and offers no method for estimating one. In practice it comes from a scored checklist in the standards, covering separation, diversity, procedures, environment and testing, and the score maps to a percentage. Diverse technology on separate racks with separate cabling earns a low beta factor. Three identical devices on one manifold, tested together by one technician on one procedure, earns a high one. That judgement stays with the analyst and is recorded in the verification note.

## Exercise

The one out of two independent term here is 0.000037396736 and the two out of three independent term is 0.000112190208. Compute the ratio of the second to the first, state which coefficient in the printed formulas explains it, and say what you expect that ratio to do once a beta factor above zero is added to both.
