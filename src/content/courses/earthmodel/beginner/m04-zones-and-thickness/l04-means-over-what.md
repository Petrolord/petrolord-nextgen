# Means over what

This is the lesson the course exists for. Everything before it was preparation, and everything after it is application.

Zone B has a mean thickness of 10.24 m. Zone B also has a mean thickness of 16 m. Both statements are true, both describe the same rock in the same model on the same day, and the only thing that differs between them is what was averaged over.

## The same zone, two means

The zone B thickness grid holds 500 values. 320 of them are positive and 180 of them are exactly zero, because that is where the zone has pinched out.

There are two defensible populations to average over, and they give two different answers.

| mean thickness | averaged over | what it answers |
|---|---|---|
| 10.24 m | all 500 nodes of the frame | how much zone B is there per unit of map area, across the whole model |
| 16 m | the 320 nodes where the zone is present | how thick zone B is where you would actually drill it |

The 10.24 m is the graded value in this course's capstone, to a tolerance of 0.05 m, because a capstone has to fix a convention and this one fixes the frame as the population. That does not make 16 m wrong. It makes it a different question with a different answer.

## Neither of them is a mistake

It is worth being clear about this before going further, because the instinct on meeting two numbers is to look for the error.

The 180 zeros are real measurements. Zone B is absent at those nodes, the grid records that with a zero, and including them in an average is a perfectly reasonable thing to do. The result tells you how the zone's rock is spread over the map area you chose to model.

Excluding them is also perfectly reasonable. A well planner asking how thick zone B is does not want an answer diluted by ground where the zone does not exist. They want the thickness where it is present, which is 16 m.

The mistake is never the choice. The mistake is quoting either number without saying which choice you made.

## The rock does not move

Here is the proof that both numbers describe the same body of rock. Multiply each mean by the population it was taken over:

$$16 \times 320 = 5120 \qquad 10.24 \times 500 = 5120$$

Both give 5120, which is the total of all the thickness values on the grid, in metres. That is not a coincidence and it is not an approximation. The 180 nodes that one calculation includes and the other excludes each hold a value of zero, so they add nothing at all to the total while adding 180 to the count. Change the denominator, leave the numerator alone, get a different mean of the same rock.

Carry it one step further into volume, which is the number this course delivers. Bulk rock volume is the total thickness times the cell area, and every cell on this frame is 50 m by 50 m, so 2500 square metres:

$$10.24 \times 500 \times 2500 = 12{,}800{,}000 \text{ m}^3$$
$$16 \times 320 \times 2500 = 12{,}800{,}000 \text{ m}^3$$

The same 12,800,000 m3 of rock, which you can also write as 12.8 times 10^6 m3, by two routes that disagreed about the headline number by a factor you could not ignore.

This is the reassurance and the warning together. Volume is invariant, because a zero node contributes zero volume however you count it. The mean is not invariant, because the mean has a denominator and volume does not. So a calculation that stays in totals is safe, and the moment anyone converts a total into an average, the denominator has to travel with it.

## How far apart they are

Moving from 10.24 m to 16 m changes the headline number by 56 percent.

Sit with that. Nothing was remapped. No surface was reinterpreted, no new well was drilled, no parameter was tuned. One person divided by 500 and another divided by 320, and the reported thickness of the zone moved by more than half.

There is no tolerance anywhere in this workflow that absorbs a difference of that size. The capstone allows 0.05 m on this mean. A room full of experienced people reviewing a prospect will argue for an afternoon about a difference far smaller than 56 percent, and if the two sides of the argument are quoting means over different populations then the afternoon is wasted before it starts.

## The habit, in both directions

When you write a mean, name the population in the same sentence. Not in a footnote, not in the caption, not in the workflow document that goes with the model. In the sentence. Zone B has a mean thickness of 10.24 m over all 500 nodes of the model frame. Zone B has a mean thickness of 16 m over the 320 nodes where it is present. Either sentence is complete. The phrase costs you a few words and it makes the number checkable.

When you read a mean, find out. A mean thickness with no population attached is not a result you can use, and the honest response is a question rather than an assumption. Ask what was averaged over. Ask whether zeros were included. Ask whether null nodes were excluded, which is a different question from whether zeros were included. Ask what area the frame covered, since a mean over the frame changes if somebody enlarges the frame into ground where the zone is absent.

That last one is worth a moment. The 10.24 m figure depends on the model frame, and the frame was a decision. Extend the frame further into the pinch-out region and the mean over the frame falls, while the mean over the nodes where the zone is present does not move. Two means, two sensitivities, one zone.

The panel below reports both forms of the zone B mean side by side, on the same grids you have been reading.

{{panel:em-framework-explorer}}

## Exercise

Quote zone B's mean thickness in both forms, then show that the bulk rock volume is the same either way, and state in one sentence what actually changed between the two figures.

Self check: zone B has a mean thickness of 10.24 m over all 500 nodes of the frame, and 16 m over the 320 nodes where the zone is present. Multiplying each by its own population gives $10.24 \times 500 = 5120$ and $16 \times 320 = 5120$, and multiplying either by the 2500 square metre cell area gives a bulk rock volume of 12,800,000 m3. Only the denominator changed, and it moved the headline number by 56 percent while leaving the rock, and the volume, exactly where they were.
