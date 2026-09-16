# The same duty stated three ways

There are three ways to tell this balance what you want, and on the studio streams all three land in the same place. State the hot outlet. State the cold outlet. Or state the duty itself. The balance fills in whichever two of the three you did not give it.

{{panel:fc-exchanger-explorer}}

## Three statings, one answer

| stated | duty, Btu an hour | hot outlet, degF | cold outlet, degF | basis |
| --- | --- | --- | --- | --- |
| the hot outlet | 2750000.0000 | 200.000000 | 134.375000 | hot outlet |
| the cold outlet | 2750000.0000 | 200.000000 | 134.375000 | cold outlet |
| the duty itself | 2750000.0000 | 200.000000 | 134.375000 | stated duty |

Read down the first three number columns and nothing moves. That is the point of the table. The duty, the hot outlet and the cold outlet are three views of one state, and pinning any one of them pins the other two through the two capacity rates.

## The basis column is the only thing that changes

The last column is the only column that moves, and it is the engine reporting which of your inputs it worked from. Stating the hot outlet gives a basis of `hot outlet`. Stating the cold outlet gives `cold outlet`. Stating the duty gives `stated duty`.

This is worth more than it looks on a table where the answers agree. When a balance surprises you, the basis tells you whether the engine believed the number you thought you were giving it. A figure meant as a check but read as an input is a common way a saved study drifts.

## Stating two of them is a different act

Because the three are views of one state, stating two of them is an assertion that they agree. The engine checks that assertion rather than picking a winner. Give it a duty of 3200000 Btu/hr on the studio hot stream together with a hot outlet of 200 F, and it refuses: that duty leaves that stream at 183.6364 F, but 200 F was given. State one of them.

The stating that was refused is worth working by hand. A duty of 3200000 Btu/hr divided by the hot capacity rate of 27500.0000 Btu an hour per degF is the drop that takes a 300 F inlet down to 183.6364 F. The engine did that division before it refused.

Look at what the message does. It takes your duty, works the outlet it implies, prints that outlet beside the outlet you typed, and then tells you what to do. It does not average the two, it does not prefer the duty, and it does not prefer the outlet. Choosing silently would make the answer depend on a rule nobody wrote down.

## Which number is yours

The three statings make the discipline of this course concrete. In every row of that table exactly one figure was chosen by a person, and the other two were computed. The table looks identical from the outside, so the basis key is the only way to tell them apart afterwards. Write down which stating you used, because in six months the screen will not remember and the saved study will.

## Exercise

Take the studio streams and work the other two columns for each of the three statings in turn, starting from the stated figure alone. Then write the refusal message you would expect if you gave a cold outlet of 134.375000 degF together with a duty that does not match it, and say which figure the engine would quote back at you.
