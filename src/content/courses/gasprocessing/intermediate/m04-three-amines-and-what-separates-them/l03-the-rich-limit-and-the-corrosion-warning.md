# The rich limit, and the corrosion warning

The rich limit is the customary top of the loading swing for each amine, and it is the one property in the table that the engine actively watches. Load the solution past it and the answer comes back with a note attached.

## The limits

| amine | customary rich limit |
| --- | --- |
| MEA | 0.350000 |
| DEA | 0.400000 |
| MDEA | 0.500000 |

Each of those is the default rich loading for its own amine, so a caller who names an amine and nothing else is loaded to that amine's own limit and sees no warning.

That default is worth a moment of thought. It means the out of the box answer for any of the three amines sits exactly on the customary limit, which is the most solvent-efficient loading the table will offer without complaint. A design taken straight from the defaults is therefore already at the edge of customary practice, and moving in the only direction that adds margin costs circulation.

{{panel:fc-absorber-explorer}}

## Reading the warning from both sides

| rich loading on MDEA | warning |
| --- | --- |
| 0.500000000 | null |
| 0.500001000 | "rich loading above the customary 0.5 for MDEA: corrosion territory" |

The limit itself is accepted. A millionth past it is flagged. That is the right way round, and it is worth checking on any guard you meet, because a guard that refuses its own stated limit is as wrong as one that lets nonsense through. Both sides of the edge have to be read before the guard can be trusted.

Notice what the message carries. It names the limit, it names the amine the limit belongs to, and it says what kind of trouble is being risked. A reader who has never met the number 0.5 before now knows where it came from and can go and argue with it.

The limit is also amine-specific, so one loading can be clean on one row and flagged on another with nothing about the loading itself having moved. What moved is the solvent it is being asked of, and the message says which one it checked against.

## A warning is an answer

This is a warning rather than a refusal, and the difference matters. The engine still returns the circulation and the duty. On the rich end table in the acid gas module, the row at a rich loading of 0.550000 reports 452.267991 gpm and 21.708864 MMBtu an hour, and it carries the note.

That is the correct behaviour for a customary limit. Running rich is a decision an operator may take deliberately, with inhibitors, with a corrosion monitoring programme, or because the alternative is a larger pump. The engine has no standing to refuse it. What it does have is an obligation to say so, and to keep saying so on every answer rather than once at the top of a session.

Compare that with a refusal. When the swing is zero or negative the engine declines outright, because there is no answer to give. The distinction is between an answer that needs a caveat and a question that has no answer, and this module keeps the two apart.

## Exercise

Record the three rich limits and the two rows of the MDEA warning table. Then state which side of the customary limit the engine still accepts without a note, and say what the engine returns alongside the warning on a loading of 0.550000.
