# The margin that decided a verdict

A one word verdict decided by a two percent gap is a coin toss wearing the clothes of a result. So this module refuses to let the word stand on its own. It reports the margin between the leading term and the runner up, it compares that margin against a threshold it declares, and where the margin falls short it attaches a note instead of leaving the word to be acted on.

## The threshold is declared at ten percent

The threshold is 10 percent and it is declared by this module. It is not published anywhere, and it is a reporting threshold rather than a physical one. Above it the engine lets the word stand. Below it the answer still carries the same word, and it carries a note telling the reader to treat the two leading terms as jointly controlling.

That is the right shape for a decision of this kind. The module does not hide the verdict, and it does not pretend the verdict is sharper than the numbers behind it.

It is worth asking why a threshold is needed at all rather than leaving a reader to compare the margin themselves. Most readers will not. A word on a screen is read and acted on, and a percentage beside it is noticed by whoever was already going to check. A declared threshold turns that check into something the tool does every time, which is the only version of a check that survives a busy afternoon.

{{panel:fc-coefficient-explorer}}

## A case built deliberately near

| term | resistance, hr.ft2.F per Btu |
| --- | --- |
| outside film | 0.005000000 |
| inside film | 0.005100000 |

Those two were chosen to be close. The margin comes out at 1.960784 percent, the engine reports the margin as clear of the threshold with a no, and the note reads: insideFilm leads outsideFilm by only 2.0 percent of itself, under the 10 percent this module calls clear. Treat the two as jointly controlling rather than acting on the word.

Compare that with the studio case, where the margin is 51.612903 percent and the verdict is reported as clear. Same two keys, same kind of word on top, and two completely different levels of confidence underneath. A reader given only the word would treat the two cases identically.

## The note rounds and the key does not

Read the two figures for the same margin. The note says 2.0 percent because a note is prose and prose reads better rounded. The margin key carries 1.960784, which is the figure to quote and the figure to compute with.

That separation is worth copying. A message written for a human and a value written for a caller have different jobs, and a tool returning only the message forces every caller to parse a sentence to recover a number. This engine returns both.

## Exercise

Record the declared threshold and say what it decides. Then record the two film resistances in the near case, the margin between them, and whether the engine reports that margin as clear. Compare it against the studio margin, and note the two different renderings the same margin has in the note and on the key.
