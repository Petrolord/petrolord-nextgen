# The eight-character limit

A small constraint with a large blast radius. This lesson is about naming, which is the least interesting part of a deck and the one that causes the most avoidable rework.

## The constraint

A well name is at most eight characters. Ekene's field wells are Ekene-1 through Ekene-6, which is seven, and they fit.

The deviated side-track wanted EKENE-6ST, which is nine, and became

$$\textbf{EK6-ST}$$

## Why this is not cosmetic

Three reasons, in increasing order of pain.

**Truncation collides.** Two wells whose names truncate to the same eight characters become one well. A simulator seeing a second declaration for an existing name treats it as a redefinition, so the second well's completions replace the first's and one well silently disappears.

That is worse than a parse error, because a parse error stops the run.

**Names are the join key.** Every per-well output vector is keyed by name, so the name in the deck is the name in the results, which is the name in every plot and every comparison against the production database. A rename after the first run breaks the join with every previous run.

**Names outlive studies.** A field's model is picked up years later by somebody who was not there. The well names are the only thing connecting the model to the field's own records, and a naming scheme that made sense to the original author is not self-explanatory.

## What a good scheme looks like

Short enough to fit, close enough to the field's own naming to be recognised, and systematic enough that a side-track or a re-entry is obviously related to its parent.

EK6-ST does that: the parent is recognisable, the suffix says what it is, and it fits. EKENE6S would also fit and reads worse. E6S fits easily and tells a newcomer nothing.

## Decide before the first run

The cost of a rename rises steeply with the age of the study. Before the first run it is a text edit. After a history match it invalidates every stored comparison. After a report it invalidates the report.

So naming is a five-minute decision at the start of a study that nobody wants to make and everybody should.

## The other limits worth knowing

Group names are also eight characters. Well names are quoted, and case is preserved, and whether a simulator compares them case-sensitively varies, so two wells differing only in case is a bad idea everywhere.

Connection counts are unlimited in practice. Well counts are unlimited in practice. The eight characters is the constraint that actually bites.

## The check

Before building a deck, list every well the study will ever include, including side-tracks, re-entries and planned wells, and confirm every name is unique in its first eight characters.

That list takes ten minutes and it is the only way to catch a collision that would otherwise appear as a well quietly missing from the results.

## The misconception to avoid

"We can tidy the names up later." The names are a data key, so tidying them is a migration across every artifact the study has produced. The eight-character limit means the tidying is best done before the first run, and studies that defer it usually end up living with whatever the first author typed.

## Exercise

First, propose two eight-character names for a second side-track off Ekene-6 and one for a re-entry into Ekene-4, and say what rule your scheme follows.

Second, explain in two sentences why a truncation collision is worse than a parse error.
