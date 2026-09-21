# A lever that is a dropdown

{{panel:fc-rate-explorer}}

Almost every input on this screen is a measured quantity with a unit. The
wetting regime is a word chosen from a list, and it can take the rate to zero
on its own. At one fixed set of
conditions the rate is 1.676428 mm/yr water wet, 0.620278 mm/yr intermittent at
a water cut of 0.370000, and 0.000000 mm/yr oil wet, with nothing else
touched.

## The engine reads the word generously and then stops

The regime name is matched case insensitively and punctuation insensitively, so
a user typing the same idea five ways reaches the same branch.

| what was typed | what the engine did |
| --- | --- |
| `oilWet` | resolved to `oilWet` |
| `OILWET` | resolved to `oilWet` |
| `oil-wet` | resolved to `oilWet` |
| `Oil Wet` | resolved to `oilWet` |
| `oil_wet` | resolved to `oilWet` |

What it does not do is guess. A string it cannot resolve refuses by name:

> the wetting regime must be one of waterWet, intermittent or oilWet: "wet" is
> not recognised

The same happens for "waterwette", for the empty string and for "gasWet". Read
that against the size of the lever. An unrecognised regime that fell through to
one of the three branches would be choosing an input that can zero the rate on
the user's behalf from a typing mistake, and whichever branch it chose would be
wrong some of the time and silent all of the time.

## Generous matching and a refusal are the same design

Both halves say the engine will work hard to understand what you meant and will
never invent what you meant. Five spellings of oil wet resolve because they are
unambiguous. An empty string refuses because it is not a regime at all, and the
empty case is the one a form produces when nobody has chosen yet.

## The list is closed and short

Three regimes, and no fourth. There is no gas-wet option, no stratified option
and no annular option, and neither the engine nor this course says why the list
stops at three. What is true is that no door in this module works out a flow
pattern, so a reader coming from a multiphase flow background should read the
three entries as a coarse interpretation the engineer supplies rather than a regime map
the module has derived.

## What this costs the reader

It costs a decision that cannot be delegated. The module will not tell you
which regime a line is in, and it holds no flow-pattern model to work it out
from. The Pipeline and Line Sizing course owns line hydraulics on this
platform, and this module's own friction factor and this module's own Reynolds
number exist here only to reach a wall shear, with the line sizing course
computing its own on a different correlation and a different transition. Neither
of them classifies a wetting regime either.

So the regime arrives from an engineer. At this tier the useful discipline is to
write down where the choice came from at the moment you make it, because every
number below it inherits that choice and nothing on the screen records it.

## Exercise

Record the rate the engine returns for each of the three regimes at one set of
conditions, then try an unrecognised regime string and record the message it
returns. State the difference between the rate spread across the three regimes
and the spread you get from any single measured input you choose to move, and
say which one a reader should check first.
