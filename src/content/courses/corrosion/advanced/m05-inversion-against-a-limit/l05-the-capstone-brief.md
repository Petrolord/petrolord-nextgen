# The capstone brief

{{panel:fc-chemistry-explorer}}
{{panel:fc-rate-explorer}}
{{panel:fc-inhibitor-integrity-explorer}}

The Expert capstone is a sour gas line where the wall shear has already taken the corrosion inhibitor credit away, so the datasheet efficiency is not what the line sees. Six fields are graded. Four of them are found by bisecting an engine call until a flag or a number the engine returns turns over, one is a single call to the remaining-life door, and one is a ratio of two lives.

## What you are given and what you are not

You are given the conditions, the corrosion inhibitor programme, the allowance, the consumed depth and a design life. You are also given an uninhibited rate stated from the operator's own inspection record. That last one matters more than it looks: the rate comes from a survey rather than from the correlation, so no held constant enters any graded chain.

You are not given a category, a severity region, a material, an inspection interval or a retirement thickness. None of those is graded anywhere in this course and none of them exists in the module.

## The conditions are in the engine's units

The brief states every condition in the engine's units and says so on the page. Temperature in degrees Celsius, pressure in bar absolute, mole fractions rather than mol percent, velocity in metres a second, diameter in metres.

That is a deliberate choice rather than a convenience. The studio converts a psig pressure by dividing by 14.5038, and the engine exports 14.503773800722, which sits 1.910e-9 above what the definitions give. The shipped defaults through the studio's divisor give a rate of 0.754523654262 mm/yr and through the engine's factor 0.754524736514 mm/yr. That difference is far below anything a screening decision turns on and far above zero, which is exactly the size that fails a tolerance while mattering to nobody. Grading through the studio's rounding would measure the app rather than the corrosion.

## How to work it

The four bisected fields are inversions of the kind this module has been teaching. Bracket the input, narrow the bracket until the engine's own field or flag turns over, and read the input at the turn. Where the arithmetic tempts you into a shortcut, take the bisection anyway, because the shortcut answers a rearranged question and the engine answers its own.

The ratio of two lives stays clean because both lives share the surveyed rate and the allowance, so what is left in it is the corrosion inhibitor arithmetic alone.

## Exercise

Before you open the capstone, write down for each of the six fields which engine door you will call, and, for the four inversions, which returned field or flag you will bisect on and what bracket you will start from. Then say which of the six would change if a held constant in the correlation were wrong, and explain your answer.
