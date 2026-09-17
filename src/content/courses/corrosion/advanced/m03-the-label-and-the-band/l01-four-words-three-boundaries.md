# Four words and three boundaries

{{panel:fc-rate-explorer}}

The category door takes a rate in millimetres a year and returns one word. That is its entire contract. It carries no conditions, no stream, no allowance and no life, and it returns a band label and nothing else.

## The shape of it

There are four words and three edges between them. Below the first edge the label is negligible. Between the first and the second it is low. Between the second and the third it is moderate, then high, then severe above the last. The boundaries measured by bisecting the word are 0.100000000000, 0.500000000000 and 1.000000000000 mm/yr.

Each boundary is at-or-above. A rate of 0.099900 mm/yr comes back low and 0.100000 mm/yr comes back moderate. A rate of 0.499900 mm/yr is moderate and 0.500000 mm/yr is high. A rate of 0.999900 mm/yr is high and 1.000000 mm/yr is severe. The golden carries rows on both sides of all three edges and the engine agrees with every one of them.

## Three edge behaviours worth knowing

A blank rate returns null. A rate that is not a number returns null. Both of those are the door declining to label something it has not been given.

A negative rate returns negligible, and that one is different in kind. It is an answer rather than a refusal, and it is the most reassuring word in the vocabulary, produced from an input that cannot be a corrosion rate. Nothing upstream in the whole screening door will hand it a negative rate, so the shape does not reach the studio. It is still the shape to look for: a function that answers where it could decline, with the least alarming answer available.

## Why the word is not a measurement

All three boundaries are held. The engine says so in its own held list and returns `categoryHeld` true beside the word on every screening. No source anywhere in this repository fixes those three numbers, and the engine adds that the bands may be optimistic by one or two steps against the bands commonly cited for carbon steel in production service.

So the label is a rendering convention applied to a rate. Move the three edges and every word on every screen moves with them, while not one rate changes. That is why no graded field in this course is a category, and why the panel beside this lesson shows the word without presenting it as a measurement.

## Exercise

Run the category door at rates on both sides of all three edges and record the word each time. Then record what it returns for a blank rate, for a rate that is not a number and for a negative rate. Write one sentence on which of those three behaves differently from the other two, and say what the difference is.
