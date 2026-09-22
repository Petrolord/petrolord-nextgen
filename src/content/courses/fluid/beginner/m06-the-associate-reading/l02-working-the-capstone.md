# Working the capstone

Six numbers, all of them correlations run on a fluid the capstone's brief states: a second oil, typed into the correlation explorer. This lesson walks each one on the Ekene fluid, the one the panel opens on, and names the mistake most likely to produce a plausible wrong answer. The capstone does not grade the Ekene values.

{{panel:fluid-correlation-explorer}}

## What you are given

A fluid's API gravity, gas gravity, reservoir temperature, designed bubble point, initial pressure and designed solution gas. The teaching fluid is Ekene's as the series has always defined it: 32 API, gas gravity 0.75, reservoir temperature 180 F, bubble point 2000 psia, initial pressure 3200 psia, and a designed solution gas of 400 scf/stb.

Every field is a correlation evaluated at the stated conditions. The panel runs all of them once you type them in.

## Field 1: the Standing bubble point

Feed Standing the DESIGNED solution gas and ask for the pressure.

The likely mistake is running it the other way, fixing the bubble point and reading the solution gas. For Ekene that returns 421.94 scf/stb, which is not what this field asks for.

The check for Ekene: the answer is a pressure, it is below 2000, and it is within a few percent. For any fluid it lands near the designed bubble point, because the design and the correlation describe the same oil.

## Field 2: the Standing formation volume factor

At the DESIGNED solution gas rather than the correlated one.

Two mistakes. Using the correlated solution gas gives a larger number (1.2516120850485737 for Ekene), because more gas swells the oil more. And applying the undersaturated correction gives a smaller number still, which would be right at initial pressure and is wrong here, because this field asks for the saturated value at the bubble point.

The check for Ekene: it is above the designed 1.2 by a few percent, and it is the saturated value.

## Field 3: the Beal dead oil viscosity

At the stated API gravity and temperature, with no gas in it.

The likely mistake is reporting the LIVE oil viscosity, which is what most people mean by an oil viscosity. That is roughly a third of the answer, so the error is large and obvious once you know to look for it.

The second mistake is Beggs and Robinson's own dead oil correlation, which is a different published method and gives a different number for the same inputs. This field asks for Beal.

The check for Ekene: it is well above the designed 1.8 cp, because dead oil is thicker than live oil.

## Field 4: the Hall-Yarborough z factor

At the stated initial pressure, on Sutton pseudo-criticals.

Two mistakes. Using a pressure the brief does not state (for Ekene, 2600 psia is not one of its pressures at all). And using Dranchuk-Abou-Kassem, which is the other correlation and gives a number a third of a percent away, well outside this field's tolerance.

The check for Ekene: it is between 0.8 and 0.9, and the reduced pressure that produced it is near 4.87.

## Field 5: the gas formation volume factor

At the initial pressure on the Hall-Yarborough z.

Two mistakes. Using the other z, which propagates its third of a percent straight through. And using the compositional module's Bg function, which carries a different constant and takes its arguments in a different order, so the answer is either 0.0356 percent off or nonsense depending on how the arguments landed.

The check: it is of order 1e-3 rb/scf. A number near one is in rb/Mscf.

## Field 6: the z correlation gap

Hall-Yarborough against Dranchuk-Abou-Kassem, as a percentage, at the same state.

Two mistakes. Getting the sign backwards, which the field's tolerance will not forgive: for Ekene, Hall-Yarborough is the SMALLER of the two, so the gap is negative. And taking the percentage of the wrong one; the field asks for it relative to Dranchuk-Abou-Kassem.

The check for Ekene: it is a fraction of a percent and it is negative.

## The general advice

Every one of these six is a correlation evaluated at stated conditions, and every likely mistake is a different correlation, a different input, or the same correlation run in the other direction.

Before submitting, for each answer write down three things: which correlation, which inputs, and which pressure. Most of the wrong answers available here come from getting one of those three silently different from what the field asked.

## Exercise

First, for each of the six fields name the alternative computation that would produce a plausible wrong answer.

Second, for Ekene, two of the six fields could be answered with 2600 psia instead of 3200 and would return a plausible-looking number. Say which two, and say where in this course the correct pressure is stated.
