# The correlator's job

You have now seen why correlation matters, what a section is made of, and which four wells you will be working. This lesson closes the module by stating the job itself, as four questions, and showing where in the course each one is answered. Treat it as the map of everything ahead.

## Which surfaces exist, and where

Before anything can be correlated there have to be tops. A top is a name attached to a depth in one well, and it represents a decision: this is where the surface is, in this well, and here is why. The evidence is log character, the marked change in curve shape that says the rock has changed.

The work here is picking and it is naming. Picking is the harder skill, since it means reading a curve for the pattern that recurs across the field rather than the one that looks striking in a single well. Naming is the easier skill and the more commonly botched one. A surface called TOP_SAND in three wells and Top Sand in the fourth is, as far as any software is concerned, two different surfaces, and the correlation line will refuse to reach the odd well out.

Part of this question is knowing when the answer is nothing. Ekene-4 has no TOP_B because the well reached total depth above it. A missing top is a legitimate result, and the correct response is to leave it missing rather than to invent a plausible depth.

**Module 2, Formation Tops**, covers all of this: what a top is, how to pick one on a log, the naming discipline, and how to handle a top that is not there.

## How deep the surfaces sit in truth

Once the tops exist, the first view to build is the honest one: every well hung on its own measured depth, nothing shifted. This is the structural section, and it answers where the surfaces actually are.

What you read from it is relief, the difference between the deepest and shallowest pick of one surface across the wells. In the Ekene section TOP_SAND has 49 m of relief, running from 1541 m in Ekene-3 down to 1590 m in Ekene-4, and the whole displayed section spans 167 m from 1495 to 1662. Those figures tell you which end of the section is structurally high, which is where hydrocarbons would collect.

What the structural view hides is thickness. A sand whose thickness varies by 11 m across the field is drawn on a panel dominated by a 49 m depth variation, so the eye reads structure and misses the rest.

**Module 3, The Structural Section**, covers true measured depth, relief, reading structure across wells, and what the structural view conceals.

## How the section looks once a surface is pinned flat

Flattening is the answer to what the structural view hides. You choose one surface, declare a datum depth, and shift each well vertically by exactly the amount needed to put that surface on the datum. The Associate capstone flattens on TOP_SAND at a 1500 m datum, which is a deliberate choice: it puts the top of the reservoir on a horizontal line so that everything about the reservoir below it can be compared well to well.

The arithmetic is simple, one additive shift per well. A well whose TOP_SAND is deeper than the datum moves up the display; a well whose TOP_SAND is shallower moves down. A well that lacks the datum surface cannot be shifted at all, and the correct behaviour is to draw it unflattened and flag it rather than to guess a shift.

**Module 4, Flattening and Datums**, covers what flattening does, the shift arithmetic, how to choose a datum, the distinction between displayed and true depth, and the cases where flattening misleads.

## What the intervals do across the field

The last question is about the rock between the surfaces. Any two correlated tops enclose a zone, and the zone has a thickness in each well that can be compared across the section. In the Ekene wells the SAND gross thickness runs 32, 36, 29 and 25 m from Ekene-1 to Ekene-4, and the TOP_A to TOP_SAND interval above it runs 48, 53, 46 and 60 m. Those two trends together are the field's depositional story.

The correlation lines themselves also carry information, particularly where they stop. The TOP_B line reaches only three of the four wells, and a line that stops short is a statement about the data rather than a defect in the drawing.

**Module 5, Zones and Correlation Lines**, covers zones between tops, gross thickness across the section, correlation lines and lines that stop short. **Module 6** then puts the whole sequence together as a workflow, adds the quality control checks, and walks the capstone.

## The honesty rule

One rule recurs in every module of this course, so learn it now.

Flattening changes the display, never the data. A shift moves where a top is drawn on the panel. It does not move the rock, it does not change the pick, and it does not change any difference measured within a single well. TOP_SAND in Ekene-4 is at 1590 m before flattening and at 1590 m after, no matter where it appears on the screen. The SAND is 25 m thick in that well in every view, because both picks shift by the same amount and the difference between them survives untouched.

What does change is the number you would read off the depth axis. On a section flattened on TOP_SAND to a 1500 m datum, Ekene-4 is drawn 90 m higher than its true position, so every displayed depth in that well is 90 m shallower than the measured depth it corresponds to. Quote one when you mean the other and you have introduced an error that no downstream user can detect.

Hence the working discipline that the rest of the course will hold you to: a correlator must always know which depth they are quoting. Say measured depth or say displayed depth, and never leave it to the reader to work out which one you meant.

## Exercise

Take the four questions from this lesson and, for each, write one sentence naming the module that answers it and one number from the Ekene section that belongs to that question. Then state the honesty rule from memory and test it: Ekene-4 has TOP_SAND at 1590 m and BASE_SAND at 1615 m, and the section is flattened on TOP_SAND to a datum of 1500 m. What is the SAND gross thickness in that well after flattening, and what is the true measured depth of BASE_SAND? As a self-check, the thickness is still 25 m because both picks shift by the same amount, and the true measured depth of BASE_SAND is still 1615 m; only its displayed position changed, to 1525 m on the panel.
