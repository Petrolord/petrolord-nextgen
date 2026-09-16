# What fouling costs, and the identity in it

Two of the five resistances are fouling allowances, and they are the only two a designer chooses outright. The engine reports what they cost as one percentage, and that percentage turns out to be something a reader can get from the share column without going near either coefficient.

## The cost, on the studio case

U clean on this case is 134.459410 and U dirty is 92.110348. The fouling penalty the engine reports is 31.495796 percent. Clean means the two fouling allowances have been left out, so the clean figure is one over the three remaining terms, and it is the coefficient of a surface on the day it is commissioned.

The surface a plant buys is sized on the dirty figure, because the exchanger has to do its duty when it is dirty. The clean figure is what it will do on its first afternoon, and what it will stop doing within weeks.

{{panel:fc-coefficient-explorer}}

## The identity inside the penalty

| term | share of the total, percent |
| --- | --- |
| outsideFouling | 9.211035 |
| insideFouling | 22.284762 |
| the two together | 31.495796 |

The two fouling terms as a share of the total come to 31.495796 percent, which is the fouling penalty exactly. That is an identity rather than a coincidence: one minus clean over total is the fouling terms over the total, written differently.

It is worth seeing why that is useful. A penalty computed from two coefficients and a penalty read off a share column are two routes to one figure, so each checks the other. It also means the penalty is never separate physics. Anybody who can read the share column already knows what fouling costs this exchanger.

## Repair history, and one refusal message

A negative fouling allowance is refused. The engine's message for it also states the behaviour that the FC6-0 repair replaced, and that part is history rather than what the engine does now. It is quoted whole because shortening it would change what the engine says.

Asked for an outside fouling allowance of -0.010000000, the engine refuses: the outside fouling factor must be zero or positive hr.ft2.F/Btu; it was -0.01. A negative fouling allowance is surface that cleans itself: it used to raise the dirty U above the clean one and report a fouling penalty of -298 percent.

Read what that old figure implies. A dirty coefficient above its own clean value is a physical impossibility, and the percentage reporting it was a large negative number that no reader could mistake for sense. The lesson is that an input nobody bounded produced an output nobody believed, and the fix belongs at the input.

The general shape is worth taking out of this example. An output that is obviously absurd is the lucky case, because somebody notices it. The dangerous version of the same defect is an unbounded input that produces a plausible number, and the only defence against that one is to bound the input rather than to watch the output. Both fouling allowances on this door are bounded at zero for that reason, and the bound is stated in the refusal rather than left in the code.

## Exercise

Record U clean, U dirty and the fouling penalty on the studio case. Then record the two fouling shares and add them, and say what it means that the sum equals the penalty. Finish by stating what the engine does with a negative fouling allowance.
