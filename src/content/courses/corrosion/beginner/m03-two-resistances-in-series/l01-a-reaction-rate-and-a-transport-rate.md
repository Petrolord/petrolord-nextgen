# A reaction rate and a transport rate

{{panel:fc-rate-explorer}}

The rate this engine reports is neither of the two rates it computes on the way. It calculates a reaction term, which is how fast the surface chemistry can consume iron at the given temperature and carbon dioxide fugacity, and a transport term, which is how fast the flow can bring reactant to the wall and carry product away. Then it combines them.

On the shipped case the reaction term is 44.225132 mm/yr and the transport term is 11.701938 mm/yr. The combined figure is 9.253475 mm/yr, and the engine names transport as the controlling step. The rate the screen finally prints, 0.754524 mm/yr, is that combined figure after the protective film factor, the pH correction, the wetting regime and the corrosion inhibitor credit are applied. Its film factor is 1.000000000000, so it moves nothing and is one of the four.

## Two different physical questions

The reaction term rises with temperature and with fugacity and knows nothing about the pipe. The transport term rises with velocity and falls with diameter and knows nothing about the chemistry beyond the fugacity it carries. Because they answer different questions, the same stream can be limited by either one, and which one it is has consequences for what you would change.

The engine's own worked streams show the spread. One runs a reaction term of 30.302325 mm/yr against a transport term of 5.597610 mm/yr. Another runs 149.987114 mm/yr against 8.264482 mm/yr. A third runs 44.114126 mm/yr against 70.689594 mm/yr, which is the case where the chemistry is the slower of the two. A fourth is slow in both, at 10.013808 mm/yr against 0.091971 mm/yr.

A reader who knows which term controls knows which lever to reach for. Where transport controls, velocity and line size move the answer and the chemistry does not. Where the reaction controls, temperature and carbon dioxide move it and the flow does not. The engine says which of the two it is on every screening rather than leaving you to compare the numbers yourself.

## What is held here, and it is nearly all of it

Every constant in both terms is held for literature. The three constants of the reaction term carry no source in this repository, and neither do the coefficient and the two exponents of the transport term. So does the published validity band of each. Both terms are measured out of the engine's behaviour and pinned against a literal in a third file, which proves the module uses the constants it declares and proves nothing at all about whether those constants are right.

That is why this course grades no correlation rate. What it can teach from these two terms is their structure, which holds whatever the constants turn out to be: two steps in series, a combination that sits below both, and a controlling word that tells you which input moves the answer.

## Exercise

Open the rate panel on the shipped case and write down the reaction term of 44.225132 mm/yr, the transport term of 11.701938 mm/yr and the combined figure of 9.253475 mm/yr. Rank the three by size and say which of the two terms the combined figure sits nearer to. Then raise the velocity and record all three again, and state which of the terms moved and which stayed where it was.
