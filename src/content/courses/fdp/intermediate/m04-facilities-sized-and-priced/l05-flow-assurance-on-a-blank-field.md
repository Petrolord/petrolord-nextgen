# Flow assurance on a blank field

The flow assurance screen reads the plan's own fluid and the facility's configuration and returns a score, a level and a list of named hazards. On the plan as it stands the Egina FPSO scores 0 at level Low with no hazards, and the Deep tie-back scores 3 at level Medium with two.

{{panel:ec-schedule-explorer}}

## Three facilities, one fluid

| facility | score | level | hazards |
| --- | --- | --- | --- |
| Egina FPSO | 0 | Low | none |
| Egina FPSO, debottlenecked | 0 | Low | none |
| Deep tie-back | 3 | Medium | Hydrates High, Wax Medium |

The fluid did not change between those rows. What changed is where the fluid has to travel and how cold it gets on the way, which is why a subsea tie-back picks up Hydrates High and Wax Medium while a vessel sitting over the reservoir picks up neither. The score of 3 is the tie-back's configuration talking, not a different crude.

## The hazard that could not fire

Run the same tie-back on a fluid carrying 12 ppm of H2S and the list becomes Hydrates High, Wax Medium and Corrosion High. Nothing else about the facility changed. The corrosion hazard appeared because a field that had been empty now holds a number, and the screen finally had something to test.

## A blank is not a zero

That is the part worth stopping on. With no H2S figure the corrosion screen cannot fire at all, so the plan reads as carrying no corrosion risk when what it actually carries is an unmeasured fluid. The output is identical in both cases: no Corrosion entry in the hazard list. A reader cannot tell from the screen whether the sour gas question was asked and answered or never asked.

## Zero is a score, not a verdict

The Egina FPSO's score of 0 at level Low is the same shape of statement. It means that no screened hazard fired on the inputs that were present. The list names what fired and nothing else, so the screen cannot distinguish a facility whose fluid was fully described and came back clean from one whose fluid description was thin enough that most of the tests had nothing to run against. The risk register at least has a word for this case, Unscored, and reports a risk with no probability as unscored rather than as low. The flow assurance screen has no such word, which is why a 0 has to be read together with what was typed in.

## The mistake

The mistake is carrying a level of Low into a plan summary as a finding. It is a screening result on the fields that were filled, and the honest reading of the FPSO rows is that the screen found nothing in what it was given. Before quoting a score of 0, check the fluid description for the blanks, and treat H2S in particular as a question to answer rather than a field to leave alone.

## Exercise

Give the score, level and hazards for all three facilities. Then state what the tie-back's hazard list becomes at 12 ppm of H2S, name the hazard that is added, and say what the screen reports for corrosion when the H2S field is blank.
