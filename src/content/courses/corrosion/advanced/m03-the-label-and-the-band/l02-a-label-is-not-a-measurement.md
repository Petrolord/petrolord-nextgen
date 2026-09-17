# A label is not a measurement

{{panel:fc-rate-explorer}}

A number on a screen and a word beside it look like one statement. They are two, and they come from different places. The rate is the output of a correlation over stream conditions. The word is the output of three comparisons against three constants. Everything this lesson is about follows from keeping them apart.

## Where the word comes from

The category door is handed a rate and returns a band label. It sees nothing else. It does not know the temperature, the CO2 fugacity, the velocity, the allowance or the corrosion inhibitor programme. It performs three comparisons against 0.100000000000, 0.500000000000 and 1.000000000000 mm/yr and it stops.

That makes the word derivative twice over. It inherits everything uncertain about the rate, since a rate built on held constants passes that inheritance straight through. Then it adds a second layer of its own, because the three edges are themselves unsourced.

## The engine says so in a field

This is not an inference a reader has to make. The screening door returns `categoryHeld` as a field beside the category, and at the shipped defaults it comes back true while the word reads high. The held list carries the bands as item nine, in the engine's own words:

> the rate category bands of 0.1, 0.5 and 1.0 mm/yr, which carry no source and may be optimistic by one or two steps against the bands commonly cited for carbon steel in production service

A field that declares its own band unsourced is a stronger piece of engineering than a footnote in a help page, because a caller can read it, print it and act on it. The studio does print it, behind a disclosure, alongside the rest of the held list.

## What moves and what does not

Run the experiment in your head. Move the first edge from 0.100000000000 to some smaller number and every stream between the two values changes word. Not one rate moves. Not one remaining life moves. Not one binding constraint moves. The arithmetic of the module is untouched and the screen reads differently everywhere.

Now run it the other way. Move a held correlation constant and every rate moves, every life moves, and the words move with them. The two layers fail independently, and a reader who treats the word as a summary of the rate has merged them.

## What to do with a label

Read it as a rendering convention and argue with the rate underneath it. When the word matters to a decision, go and get the rate, the conditions that produced it and the held items in its chain. The word is a fast way to sort a list of streams. It is not evidence about any one of them.

## Exercise

Take a rate the engine returns and record the word beside it and the value of `categoryHeld`. Then choose a boundary, decide on a value one step tighter, and write down which streams from the shipped set would change word under it. Say what else on the screen changed while you did that.
