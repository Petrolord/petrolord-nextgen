# The TNT equivalent mass

{{panel:cq-harm}}

Every blast calculation in this engine starts by pretending the fuel is a lump of TNT. A cloud of butane does not detonate the way a high explosive does, so the engine asks how much TNT would release the same blast energy, and then scales a TNT blast curve to that mass. This lesson is about that first step and what the analyst decides in it.

## The model string

The engine's model string, verbatim: "Q_TNT = alpha_e Qf Emf / Em_TNT". Here alpha_e is the yield factor, Qf the fuel mass, Emf the fuel's heat of combustion and Em_TNT the TNT blast energy.

BONGA is the teaching stream for this module: a butane cloud of 3000 kg, heat of combustion 45700000 J/kg and TNT blast energy 4600000 J/kg, all stated. The yield factor swept:

| yield factor, stated | TNT equivalent mass kg |
| --- | --- |
| 0.02 | 596.086957 |
| 0.04 | 1192.173913 |
| 0.1 | 2980.434783 |
| 0.2 | 5960.869565 |

## The yield factor is the analyst's

The TNT mass is linear in the yield factor, so doubling the yield from 0.1 to 0.2 doubles the charge from 2980.434783 to 5960.869565 kg. The engine has no opinion about which yield is right. The Yellow Book reports 0.02 to 0.2 in use, and the choice across that span moves the charge from 596.086957 to 5960.869565 kg. That single stated input governs everything downstream: the scaled distance, the overpressure and the fatality probit. A consequence note that quotes an overpressure without its yield factor has hidden its largest assumption.

Two refusals guard the inputs. A yield typed as a percentage is refused:

> yieldFactor: the TNT equivalency (yield) must lie in (0, 1]: the YB reports 0.02 to 0.2 in use

And a TNT blast energy typed in kJ/kg, the units slip the band is there to catch, is refused:

> tntBlastEnergyJKg: must be the TNT blast energy in J/kg, between 4.0e6 and 5.0e6 (the YB cites 4.19e6 to 4.65e6)

## A single route quantity

The engine's validation record asks, for every quantity, whether anything independent would catch a mistake copied into both the engine and its oracle. For the TNT equivalence the answer is nothing: the transcription from the Yellow Book is the only check. No second derivation and no published worked number stand behind it. The TNT equivalence is therefore a single route quantity. It is taught here and it never carries a graded answer.

That is why every graded blast in this course STATES its TNT mass. A capstone hands you the charge in kilograms of TNT and grades what follows from it, the Kinney and Graham overpressure, which a published column does stand behind. The fuel to TNT conversion stays a teaching step.

## Exercise

Open the harm panel's blast view and enter BONGA: 3000 kg, 45700000 J/kg and 4600000 J/kg, with a yield factor of 0.04. Confirm the engine returns 1192.173913 kg. Now retype the TNT blast energy as the same figure written in kJ/kg, and record the field the refusal names. Finally, write two sentences for a consequence note stating the yield factor you would use for this cloud, where it came from, and why the TNT mass that follows carries no second check.
