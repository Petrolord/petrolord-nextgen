# Radiative fraction and soot

{{panel:cq-fire}}

The second and third ways to make a surface emissive power start from the fire's own heat release. They read the burning flux, the heat of combustion and the flame length, then ask what share of that heat leaves as thermal radiation and how much of the surface is hidden by soot. For one fire they give answers far apart from Mudan's and from each other, and this lesson shows by how much.

## The clear flame

The engine's form is "SEPmax = Fs m" dHc / (1 + 4 L/D)". The numerator is the heat released per square metre of pool, the burning flux times the heat of combustion, scaled by the radiative fraction Fs, the share of the heat that leaves as thermal radiation. The denominator spreads that heat over the flame's surface: the top disc plus the side of a cylinder of length L. The radiative fraction is the caller's; the Yellow Book gives 0.1 to 0.4. The call names the method as `radiative-fraction`.

A fraction must lie between zero and one. Type a percentage by mistake and the engine refuses, naming `radiativeFraction`:

> radiativeFraction: must lie in (0, 1]: the YB gives 0.1 to 0.4

## Adding the soot

The sooty form is "SEPact = SEPmax (1 - soot) + SEPsoot soot, SEPmax = Fs m" dHc / (1 + 4 L/D)". The soot fraction is the share of the surface covered by smoke; the Yellow Book quotes 0.8 for oil products. The soot emissive power is 20e3 W/m2 by default. The call names the method as `radiative-fraction-soot`.

## One fire, three answers

ERHA at a 4 m/s wind has a flame length of 32.511563 m. With a stated heat of combustion of 44600000 J/kg, a radiative fraction of 0.3 and a soot fraction of 0.8:

| method | surface emissive power W/m2 |
| --- | --- |
| mudan-diameter | 30886.154395 |
| radiative-fraction (the clear flame, SEPmax) | 180128.456236 |
| radiative-fraction-soot (SEPact) | 52025.691247 |

The clear flame is several times the Mudan value; the sooty flame sits between them. None of the three is the true answer. Each is a model, and they disagree for this fire. The disagreement is information, and a note that shows it helps its reader.

## Why every call names its method

Because the methods disagree, a surface emissive power without its method is meaningless, and so is a heat flux made from it. The engine names the method in every basis block, and a consequence note quotes it beside the number. When two methods are both defensible, the note states which one it used and shows the other beside it.

## The published check

The Yellow Book's worked benzene pool fire prints a clear flame power of 252400 W/m2 and a sooty power of 66000 W/m2. The engine returns 252421.582860 and 66484.316572, relative differences of 8.55e-5 and 7.34e-3. Both methods therefore stand behind a published number and can be graded.

## Exercise

In the fire panel, load ERHA at 4 m/s with the stated heat of combustion, radiative fraction and soot fraction, and read all three powers. Then raise the soot fraction step by step toward one and watch the sooty power. Say what value it approaches, find that value in the formula, and compare it with the Mudan power for an 80 m pool in the lesson before this one.
