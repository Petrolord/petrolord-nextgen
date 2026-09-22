# The capstone walkthrough

The Professional capstone gives you heating rates, read temperatures and an isothermal clock of its own, and grades six values: reflectance read on the brief's ramps, and transformation ratios on the brief's clock. This lesson works the method on the golden case, the teaching fixtures, with the shortest defensible route to each kind of value. None of the golden numbers is a capstone answer.

The kinetics explorer opens on the golden 3 degC/Ma ramp and the Type II clock at 100 degC. For the capstone, type the brief's heating rate and read temperature into "Your heating rate" and "Read Ro at", and type the clock temperature and pick the kerogen type for the clock.

{{panel:bs-kinetics-explorer}}

## Reflectance on a ramp

On the golden case: Ro at 150 degC on the 3 degC per Ma ramp is 0.9871413464062039, and on the 1 degC per Ma ramp it is 1.1129254516555198. Both are rows of ramps generated with the module 3 conventions: 0.01 Ma midpoint sub-steps from 20 degC, whole-degree reporting. The "Your ramp" tile runs exactly that integrator at the rate you type and reads it at the whole degree you type.

The order of two readings is itself understanding: at equal temperature the slow ramp wins, module 3 lesson 3, because its rock spent longer at every degree of the climb. At equal rate the hotter reading wins. A capstone answer that breaks either order has been read at the wrong setting.

## Transformation on a clock

On the golden case: Type II TR at 100 degC is 0.022481215976523083 at 10 Ma and 0.05477927380797565 at 50 Ma. Constant temperature, so whole-Ma steps suffice, module 4 lesson 2. Type the brief's clock temperature, pick each kerogen type in turn, and read the TR tiles at the ages it names.

Reflectance does not move when you change the kerogen type. If a Ro tile changes when you switch type, you are reading the wrong tile.

## The anchors are checks, not answers

Ro at zero reaction, $e^{-1.6} = 0.20189651799465538$, and at full reaction, $e^{-1.6 + 3.7 \times 0.85}$, are closed forms no history can move. They sit on the panel as quality control: if they are wrong, nothing else is right.

## The traps, collected

Normalising F to 1, which corrupts both anchors and every ramp value; module 2 lesson 1. Start-of-step temperature evaluation, 7 percent low at rate 3; module 5 lesson 4 diagnosed exactly this. Reading a ramp at a temperature that is not a whole degree. And answering the TR fields with the vitrinite state or the Ro fields with the kerogen state: the separation is the tier's first lesson.

## Worked example

Rehearse on the golden case. Your heating rate 3, read at 150: 0.9871413464062039. Rate 1: 1.1129254516555198. Clock temperature 100, type II: TR tiles 0.022481215976523083 at 10 Ma and 0.05477927380797565 at 50 Ma. Then change the type to III and confirm the Ro tiles do not move.

## Exercise

For each kind of value, name the module and lesson that derives it, and the one control on the panel that sets it.
