# Which one is holding it back

{{panel:fc-rate-explorer}}

Every screening names the step that is limiting the rate, and it does so in one word. On the shipped case that word is mass transfer, because the transport term of 11.701938 mm/yr sits below the reaction term of 44.225132 mm/yr. On one of the engine's worked streams it reports reaction kinetics instead, with a reaction term of 44.114126 mm/yr against a transport term of 70.689594 mm/yr.

The word is useful because it tells you which input is worth moving. Where transport limits the rate, velocity and line size change the answer and the chemistry does not. Where the reaction limits it, temperature and carbon dioxide change the answer and the flow does not. A summary that named the same mechanism on every stream would be a heading rather than an answer.

## The word carries a margin

A bare comparison of two nearly equal numbers flips on floating point noise, so the engine does not make one. When the two terms sit within 10.000000 percent of each other it answers comparable instead of naming either, and it reports the margin alongside the word so you can see how far from that boundary the case is.

The shipped case reports a controlling margin of 2.779300. That same worked stream reports a margin of 0.602425 with reaction kinetics controlling, which is a case much nearer the boundary. Another stream reports a margin of 107.879479, which is a case where the answer is in no doubt at all.

Read the margin as a reporting threshold. It says when the engine will commit to a word. It is not a claim about where transport stops mattering physically, and the engine is explicit that it is a reporting decision. The margin itself is measured out of the engine's behaviour and pinned like every other constant here.

## Using the word without over reading it

The controlling word is safe to act on in the narrow sense: it tells you which lever this model responds to. It is not a verdict on the line. Two screenings can name transport and still differ by a factor of many in the rate, and a screening that names reaction kinetics on a stream sitting near the comparable boundary would name something else after a small change in velocity.

The safest habit is to record the word, the margin and the two terms together. Three numbers and a word take one line of a notebook and they make the answer reproducible by anyone who reads it later.

## Exercise

On the shipped case record the controlling word, the margin of 2.779300 and both terms. Raise the velocity until the transport term climbs above the reaction term and record the word and the margin again at that point. Then find a setting where the engine answers comparable, write down how close the two terms are there, and say what you would report to a colleague who asked which mechanism controls that line.
