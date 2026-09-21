# Harm it does not model

{{panel:cq-harm}}

The probit section is where the engine meets people, so it is where an overreaching claim does most damage. The engine turns a heat flux, an overpressure or a toxic load into a fatality probability for a person exposed, and it stops there. This lesson names the kinds of harm it does not model and the questions about harm that belong to other courses.

## Injuries the engine has no probit for

| not in the engine | why, from the engine header and its validation record | what the analyst does instead |
| --- | --- | --- |
| lung, eardrum and structural probits | their source was not read, so they are not included | uses the fatality probit here and states what it covers |

A blast harms people in several ways: the overpressure can damage the lungs or rupture the eardrums, and it can bring a building down on the people inside. The literature carries separate probits for these. The engine carries one blast preset, the hsc overpressure probit from OSD/30 Equation 4a, and it is a fatality probit. Its authors did not read a source for the others, so they left them out.

The practical consequence is a sentence in the note. A blast result from this engine says: the fatality probability by the hsc preset, for a person in the open exposed to the peak side-on overpressure, with no allowance for injury short of death or for building collapse. A reader can then see what the figure covers.

## Effects, never frequencies

The engine computes effects and never frequencies. A consequence model answers what happens if the release occurs. How often it occurs, and the risk a person or a population carries as a result, is a different calculation that needs frequencies this engine never sees.

That calculation belongs to the later quantitative risk course. Individual risk, the potential loss of life (PLL) and the F-N curve are taught and graded there, and this course never computes or grades one. The academy's risk matrices belong to the risk and change course. A fatality probability from this engine is an input to those calculations. On its own it describes one outcome of one event, and a note should present it that way.

## Why the probability is conditional

Every probability the harm panel prints is conditional on the exposure you typed. It says what fraction of the people exposed to that heat flux for that time, that overpressure, or that toxic load would die. It does not say how many people are there, how likely they are to be there, or how often the event happens. Those are the inputs the risk course adds.

## Exercise

On the harm panel's probit view, enter 20 psig and read the probability for the hsc preset. Write the sentence a consequence note would carry beside it, stating the preset and its source, what kind of harm it covers, and the two kinds of harm it leaves out. Then add one sentence naming the course where this probability would be combined with a frequency, and the quantity it would help produce there.
