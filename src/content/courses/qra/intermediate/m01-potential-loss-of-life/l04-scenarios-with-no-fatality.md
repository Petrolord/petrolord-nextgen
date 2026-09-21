# Scenarios with no fatality

{{panel:qr-societal}}

The JISIKE crew table has a fourth row that looks like it does nothing: a spill with no one near, 6e-3 per year, N of 0. It is the most frequent scenario the crew has and it kills nobody. This lesson is about what the engine does with such a row, in the PLL and in the F-N curve, and why keeping it visible is a declared choice.

## In the PLL

A scenario with N of 0 contributes 0.000000000000 fatalities per year to the PLL. The multiplication takes care of it, and the engine keeps the row in its contribution list so a reviewer can see that the scenario was considered.

| scenario | frequency per year, stated | N, stated | f x N per year |
| --- | --- | --- | --- |
| spill with no one near | 6e-3 | 0 | 0.000000000000 |

It only matters when N is ignored. Summing the frequencies alone gives 0.009540000000 per year, and most of that is the spill. A sum that counts a scenario which kills nobody is counting events, and events are a different question.

## In the F-N curve

The F-N curve plots the frequency of N or more deaths. A scenario with no deaths has no place on it, because the curve starts at the smallest N above zero. The engine keeps such scenarios out of the curve and reports their frequency beside it, so nothing silently disappears. On the JISIKE off-site set, a release that reaches no one at 5e-5 per year is kept out and reported as 0.000050000000 per year. The next module builds that curve in full.

## Why report what is left out

A frequency that sits outside the curve is still a frequency the assessment computed. Reporting it lets a reviewer add everything back up: the scenarios on the curve and the scenarios kept out together make the whole set. It also shows that an N of 0 was a finding. A release that reaches no one today may reach a new building tomorrow, and the reported frequency is where that question starts.

## A scenario still needs a name

The curve function checks every scenario before it builds anything, and a scenario with no name is refused:

> scenarios[0].name: every scenario needs a name

A curve built from unnamed rows could not say which scenario sits at which corner, so the engine asks for the name first. Naming every row, including the ones that kill nobody, is also what lets a reviewer match the curve back to the scenario list line by line.

## Exercise

Add the crew's four stated frequencies and confirm the 0.009540000000 per year that the N-ignored sum prints. Then subtract the spill's frequency and say what the remaining frequency tells you, and why it is still a different quantity from the crew PLL.
