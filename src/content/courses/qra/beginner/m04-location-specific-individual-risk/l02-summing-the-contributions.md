# Summing the contributions

{{panel:qr-event-tree}}

An LSIR is a SUM. Each scenario contributes its frequency times the stated probability of death at the place, and the place's LSIR is the total of those contributions. The engine returns the total and every contribution with its fraction of the total, so you can see at once which scenario drives the individual risk at a place. This lesson takes EREMOR's process deck apart contribution by contribution.

## The process deck, term by term

| f x Pd per year | contribution | fraction of the LSIR |
| --- | --- | --- |
| 0.000025000000 | jet or pool fire | 0.168748 |
| 0.000081000000 | flash fire | 0.546743 |
| 0.000037800000 | explosion | 0.255147 |
| 0.000004350000 | pool fire | 0.029362 |

The four contributions add to the process deck LSIR of 0.000148150000 per year, and the four fractions add to one. Each contribution is one row of the frequency table multiplied by one stated Pd. The jet or pool fire, for example, happens at 0.000050000000 per year and has a stated Pd of 0.5 on the deck, which gives 0.000025000000 per year.

## Reading the fractions

The fractions are the most useful column for a reviewer. The flash fire alone is 0.546743 of the deck's LSIR. The explosion adds 0.255147, and the jet or pool fire 0.168748. The pool fire from the overfill is small, at 0.029362.

This ordering tells an analyst where effort would count. A change to the flash fire frequency or its stated Pd moves the deck's LSIR most. A change to the pool fire barely moves it. Whether any such change is worth making is a question for the Expert tier; this tier only reads where the individual risk comes from.

## Two ways to get it wrong

| what was done | result |
| --- | --- |
| taking only the largest contribution | 0.000081000000 per year |
| summing the probabilities of death alone | a number with no unit at all |

Taking only the largest contribution gives 0.000081000000 per year, the flash fire term, and drops almost half the individual risk at the deck. It looks like an answer, since it is a real contribution with the right unit, and that is what makes it dangerous.

Summing the stated probabilities of death without their frequencies is worse. The result has no unit and no meaning, because a probability of death says what happens IF a scenario occurs and nothing about how often it occurs. The LSIR is the sum of f times Pd, and the two must travel together. When you check an LSIR by hand, write each product in its own row before adding, exactly as the engine lists its contributions.

## A golden check

The golden case three-scenarios runs three scenarios at one place through `locationIndividualRisk` and gives an LSIR of 0.000303200000 per year, matching the oracle. The golden case with-zero-frequency includes a scenario of frequency zero and gives 0.000000007010 per year: a zero frequency contributes zero, exactly as a zero Pd does.

## Exercise

Add the four process deck contributions in the first table and confirm that they reach 0.000148150000 per year. Then multiply the explosion frequency, 0.000054000000 per year, by the stated Pd of 0.7 on the deck, and check that you reproduce the explosion contribution of 0.000037800000.
