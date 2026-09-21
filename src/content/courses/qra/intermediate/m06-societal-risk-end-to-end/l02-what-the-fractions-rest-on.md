# What the fractions rest on

{{panel:qr-societal}}

The previous lesson ran the Purple Book's indoor and outdoor rules through the engine and printed an Fd for each case. Those figures are arithmetic done correctly on factors that have been read once. This lesson says what that means, why this course teaches the fractions and never grades them, and why they are never used for one person's individual risk.

## Single transcriptions

The factors the rules depend on are 0.1 for a toxic effect indoors, 0.14 for a fire outdoors, 0.025 for an explosion indoors, and the Table 5.3 fractions of 0.93 by day and 0.99 by night. Each is a single transcription of the Purple Book, and the Purple Book prints no numeric example for them. So there is nothing to reproduce. A worked example in the source would let the engine show that it reads the factors the way the author meant; without one, the engine can only show that it does its own arithmetic consistently.

## A planted error the suite did not catch

The engine's own validation planted a wrong clothing factor in both the engine and its independent oracle, and the test suite stayed green. That is the point of the lesson. When a factor is typed into two places from one reading of one page, the two places agree with each other whether the reading is right or wrong. An oracle catches arithmetic slips; it cannot catch a shared misreading. So this course teaches the rules and never grades a number that passes through them.

| what rests on it | what it is checked by | graded in this course |
| --- | --- | --- |
| Fd for a toxic, fire or explosion case | one transcription, no published example | never |
| F(N) of a stated scenario set | self-consistency, three ways | yes, under the declared "N or more" reading |
| the criterion's points | the Bevi points and the R2P2 point, published | the ratio to them, yes |

## For societal risk only

The fractions describe a population: the expected number of deaths in a population cell is Fd times the people in it. They are not a vulnerability factor for individual risk. The Associate tier met a vulnerability factor in the IRPA, which the analyst supplies and which defaults to 1, because no source the engine read gives one for individual risk. Using an indoor fraction as a person's vulnerability would take a rule written for crowds and apply it to someone whose whereabouts are already on the roster.

## How an N arrives here

In a full assessment, an N for a scenario is built cell by cell: a probability of death at each place, from consequence modelling in the consequence course, turned into Fd with these rules and multiplied by the people there. This course receives the finished N as a stated input. A capstone states every N it uses, so its answer rests on the stated numbers alone and never on the fractions.

## Exercise

Take the explosion row at 20000 Pa gauge by day, where FE,in is 0.025000 and fpop,in is 0.930000. Multiply them and confirm the engine's Fd of 0.023250000000. Then write one sentence explaining why, although your multiplication is exact, the figure is still one that no capstone in this course will grade.
