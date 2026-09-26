# Linear and exponential gain

{{panel:ae-scoring-explorer}}

The gain is how much a passage of a given grade is worth. The engine's default is linear: the gain is the grade, so a grade 3 passage is worth three times a grade 1. The engine also offers exponential gain, 2^g - 1, as a stated option. It changes what nDCG rewards.

## Two gain scales

| grade | linear gain | exponential gain 2^g - 1 |
| --- | --- | --- |
| 0 | 0 | 0 |
| 1 | 1 | 1 |
| 2 | 2 | 3 |
| 3 | 3 | 7 |

Grades 0 and 1 are worth the same under both scales, so the two gains part only on grades 2 and 3. Under exponential gain a grade 3 passage is worth 7 against a grade 2's 3, more than twice as much. A passage that answers the query now dominates the score, and putting it first matters more than anything else in the list.

## The stated ranking under both

On c, a, x, b, d with judgments a 3, b 2, c 0, d 1 and e 2, at k 5, each rank's exponential gain is divided by the same discount as before:

| rank | passage | grade | exponential gain | exponential gain / discount |
| --- | --- | --- | --- | --- |
| 1 | c | 0 | 0 | 0.000000 |
| 2 | a | 3 | 7 | 4.416508 |
| 3 | x | 0 | 0 | 0.000000 |
| 4 | b | 2 | 3 | 1.292030 |
| 5 | d | 1 | 1 | 0.386853 |

| gain | DCG | ideal DCG | nDCG |
| --- | --- | --- | --- |
| linear | 3.140995 | 5.692536 | 0.551774 |
| exponential | 6.095391 | 10.823466 | 0.563164 |

The ideal DCG is built the same way under both gains, from every judged grade sorted descending, so the ratio stays between 0 and 1. On this list exponential gain gives the higher nDCG.

## On the Ekene queries

The mean nDCG at k 5 over the 23 included queries:

| gain | system A | system B |
| --- | --- | --- |
| linear | 0.762753 | 0.764137 |
| exponential | 0.786456 | 0.786615 |

Per query, the two gains can move in opposite directions. System A's Q04, "bubble point pressure of the Ekene oil", scores 0.935166 under linear gain and 0.863604 under exponential. Q02 under system A moves the other way, from 0.261097 to 0.336900. A mean over queries hides both movements.

System B has the higher mean nDCG under both gains. The difference is small under both: the course derives it as 1.38e-3 linear and 1.59e-4 exponential. Whether a difference that small means anything is the question of the last module.

## Stating the gain

A gain is part of the score's definition, so an nDCG is quoted with its gain beside its cutoff and threshold: "mean nDCG at 5, linear gain, grade 1 or more". The engine accepts exactly two:

> gain must be 'linear' or 'exponential'

The choice is not neutral. Linear gain treats the four grades as evenly spaced. Exponential gain says that the difference between answering and being relevant is larger than the difference between being related and being irrelevant. Pick the scale that matches what the reader of the report needs, and say which one it was.

## Exercise

Open the view for MAP and nDCG with the stated list and judgments at k 5. Read DCG, ideal DCG and nDCG with linear gain, then switch the gain to exponential and read all three again against the tables above. Switch views and back to restore system A's runs and every judgment, and read the mean nDCG under both gains. Find Q04 and Q02 in the table and write one sentence for each saying which way its nDCG moved and by how much.
