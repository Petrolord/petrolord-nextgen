# The Burgess form

{{panel:cq-fire}}

The engine offers a second way to set the burning flux. Where Babrauskas reads two constants from a table, Burgess builds the burning flux from the liquid's own thermal properties. It is a useful cross check and a useful way to handle a fuel the table lacks, and it is also a quantity this course teaches without ever grading.

## The formula as the engine prints it

The engine's model string reads "Burgess: m" = 0.001 dHc / (dHv + Cp (Tb - Ta))". The numerator is the heat of combustion in J/kg, scaled by a constant. The denominator is the heat needed to turn one kilogram of liquid at ambient temperature into vapour: the heat of vaporisation, plus the liquid heat capacity times the rise from ambient to the boiling point. The form applies to a single-component liquid below its boiling point, and the call names the method as `burgess`.

## A worked case in n-hexane

This lesson states n-hexane with these inputs:

| input, stated | value |
| --- | --- |
| heat of combustion J/kg | 44700000 |
| heat of vaporisation J/kg | 335000 |
| liquid heat capacity J/(kg K) | 2270 |
| boiling point K | 341.9 |
| ambient K | 293.15 |

The engine returns a burning flux of 0.100300 kg/(m2 s). The Babrauskas asymptote for hexane, from Table 6.5, is 0.074. The two methods disagree for the same liquid, which is why every call names its method and every note quotes the method beside the number.

## A boiling point below ambient is refused

If the boiling point sits below ambient, the term Tb minus Ta turns negative, the denominator shrinks, and the printed form would return a burning flux that grows without any physical reason. The engine refuses instead, naming `boilingPointK`:

> boilingPointK: is below ambient: the liquid boils, and the printed Burgess form assumes a liquid heated from ambient to its boiling point

A liquefied gas spilled warm is exactly this case. For such a fuel, use the Babrauskas row where the table carries one.

## A method the function does not know

The method is a closed choice of two. Anything else is refused with the field `method`:

> method: must be 'babrauskas' or 'burgess'

## Single route, taught and never graded

Burgess is a single route quantity. The engine's validation record plants a mistake in both the engine and its independent oracle and asks what still catches it; for Burgess the answer is nothing but the transcription itself, because no published worked number or second route stands behind it. That is why this course teaches Burgess and never grades it, and why no capstone asks you for a Burgess burning flux.

## Exercise

The fire panel offers the Babrauskas route only, so work Burgess on your calculator. Put the five stated n-hexane inputs into the formula and confirm 0.100300. Then choose hexane in the fire panel, set a 50 m pool and read its Babrauskas burning flux, and set it beside your Burgess figure. Finally, redo the denominator with a boiling point below the stated ambient of 293.15 K, say which field the engine's refusal would name, and explain in two sentences what would have happened to the burning flux had the engine calculated anyway.
