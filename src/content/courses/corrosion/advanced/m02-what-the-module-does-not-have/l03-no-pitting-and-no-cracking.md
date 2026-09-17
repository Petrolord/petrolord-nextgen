# No pitting and no cracking criterion

The single rate this module returns is a general uniform rate. The engine says so in `NOT_PROVIDED`, in the entry that names a localised-attack rate as absent. It is not a pitting rate. It is not a weld rate and it is not a top-of-line rate. A reader who takes it as a wall-loss prediction for the worst spot on the line has read it wrong, and the engine cannot warn them, because it has no localised model to compare the uniform number against.

## Why that matters more than it sounds

Uniform corrosion and localised attack fail a line in different ways and on different timescales. A remaining life computed from a uniform rate divides an allowance by an average. Pitting removes metal from one place, so an average tells you very little about the place that goes first. The arithmetic in this module cannot see the difference, because a single rate has no geometry in it.

The absence is complete. There is no pitting criterion, no localised rate and no pit-depth model anywhere in the calculation. A learner who wants a pitting answer needs a different method entirely.

## The cracking side

The same holds on the sour-service side, and here the module is unusually explicit about what it stops at. What the engine has is an H2S threshold comparison. It compares one partial pressure against one threshold and reports the comparison in two units, in bar and in psia, along with how many decades above the threshold the stream sits. That is the whole of the door.

What it does not have is a sulphide stress cracking criterion, a hydrogen induced cracking criterion, a hardness limit, a weldment qualification rule and a severity region. All of that needs the standard, and the standard is nowhere in this repository.

So the sour flag reads true or false and stops. True does not mean the line will crack and false does not mean it will not. It means the H2S partial pressure sits above or below a threshold whose own value the engine declares held in a field, `thresholdHeld`, which it sets to true.

## The shape of an honest absence

Notice how these absences are delivered. They are not silence. `NOT_PROVIDED` carries 8 entries, the whole screening door returns them in a field, and the studio prints them. The withdrawn severity region goes further still and returns `regionProvided` false and `materialGuidanceProvided` false, so a caller cannot read the gap as an unset property.

That is the pattern to take away from this module and apply elsewhere. Ask of every missing field whether its absence is declared or merely missing. A declared absence is a decision somebody made and wrote down. A missing field is a question nobody asked, and the reader supplies the answer from their own expectations without noticing that they have done it.

## Exercise

List every localised or cracking mechanism named in `NOT_PROVIDED` and in the held list. Beside each, write down the nearest thing the engine does return. Then take the sour flag on the shipped case and write one sentence saying precisely what its value commits the engine to and one saying what it does not.
