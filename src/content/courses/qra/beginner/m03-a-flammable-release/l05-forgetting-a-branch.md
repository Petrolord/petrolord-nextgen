# Forgetting a branch, and what it costs

{{panel:qr-event-tree}}

The engine refuses a tree that does not close. It cannot refuse a tree that closes and means the wrong thing. This lesson puts EREMOR's explosion frequency through four builds, one right and three wrong, and measures how far each wrong one moves the answer. Every wrong build here is a real tree, and the engine runs each one without complaint: a tree that closes is valid arithmetic whatever it means.

## Four builds of one explosion

EREMOR's release is stated at 5e-4 per year, with immediate ignition 0.1, delayed ignition 0.3 given no immediate ignition, and the preset split of flash fire 0.6 and explosion 0.4.

| explosion frequency per year | over the right one | how it was built |
| --- | --- | --- |
| 0.000054000000 | 1.000000 | the tree as the engine builds it |
| 0.000081000000 | 1.500000 | the split swapped, 0.4 flash fire and 0.6 explosion |
| 0.000060000000 | 1.111111 | delayed ignition taken as unconditional |
| 0.000135000000 | 2.500000 | every delayed ignition counted as an explosion |

## Three ways to go wrong

The swapped split transposes two numbers in the last branch set. The set still sums to one, so nothing complains. The explosion frequency rises to 0.000081000000 per year, which is the correct flash fire frequency landing in the wrong outcome.

The unconditional build forgets that delayed ignition hangs under no immediate ignition. It applies delayed ignition to the whole release, including the part that already burned at once, and the explosion frequency rises to 0.000060000000 per year.

The third wrong build forgets the split entirely. Every delayed ignition is counted as an explosion, and the frequency becomes 0.000135000000 per year, which is 2.500000 times the right figure. This is the full delayed ignition frequency, flash fire and explosion together, all assigned to the more far reaching outcome.

## Why the cost reaches individual risk

An explosion frequency is never an answer on its own. It meets a stated probability of death at every place, and those products become each place's individual risk. At EREMOR's control room the explosion carries the largest share of the individual risk, a fraction of 0.825057, so an explosion frequency that is too large pushes the control room figure up with it. The accommodation, where only the explosion reaches, moves by the whole factor of 2.500000.

A forgotten branch also moves other outcomes. When every delayed ignition becomes an explosion, the flash fire disappears from the tree, and the process deck, where the flash fire has a stated probability of death of 1, loses its largest contribution. One wrong branch can overstate individual risk in one place and understate it in another.

## The analyst draws the tree

The engine cannot know that a branch belongs under another, or that a split was transposed. The engine offers two protections. It fixes the shape of the flammable release tree in `flammableReleaseEventTree`, so the delayed ignition branch and the split always hang in the right place. And it records in the basis whether a split was the preset or "as given", so a reviewer can check where every probability came from.

When a new tree disagrees with an old one, divide the two first. On EREMOR, a ratio of 1.500000 or 2.500000 against the right figure is the signature of one of the slips above, and it points straight at the branch set to recheck.

## Exercise

Divide the every-delayed-ignition build, 0.000135000000 per year, by the right explosion frequency, 0.000054000000 per year, and confirm you reach 2.500000. Then add the correct flash fire and explosion frequencies, 0.000081000000 and 0.000054000000 per year, and explain why your sum equals the wrong build's figure.
