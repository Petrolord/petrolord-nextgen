# The index blends on mass

An index has to be averaged on some fraction, and there are two candidates. This engine blends the Refutas index on mass fraction, the classic Refutas form, and names its basis in the result: "Refutas index on mass fraction". ASTM D7152 blends the same family of index on volume. The two disagree, and which basis to use is a held decision in this course.

{{panel:crude-assay-explorer}}

## A held convention

This lesson teaches a convention the engine states. The course does not tell you it is the right one. The choice between mass and volume for the Refutas index is open, and it is recorded as held until the course owner decides it. What you are asked to know is what the engine does, what the other basis gives, and that the two differ.

## Both bases, side by side

The table prints the engine's viscosity with the index on mass, and beside it the viscosity with the index averaged on volume fractions instead.

| blend (by volume) | blend viscosity cSt, index on mass (the engine) | index on volume fractions instead | mass basis minus volume basis |
| --- | --- | --- | --- |
| Obigbo export blend, 65 and 35 | 7.4743 | 7.3107 | 0.1636 |
| Asarama Heavy and Ubie Condensate, 50 and 50 | 9.2496 | 6.8074 | 2.4422 |
| Egbema Medium and Asarama Heavy, 50 and 50 | 91.4520 | 87.3072 | 4.1448 |

Read the last column. For the export blend the mass basis minus the volume basis is 0.1636 cSt. For Asarama Heavy with Ubie Condensate it is 2.4422 cSt. For Egbema Medium with Asarama Heavy it is 4.1448 cSt. On all three rows the difference is positive.

## Why the two bases differ

The mass fraction and the volume fraction of a crude differ whenever the crudes differ in density, as module two showed. In each of these pairs the thicker crude is also the denser one, so on mass it carries more weight than on volume, and its high index pulls the average up further.

## What each basis has behind it

The mass form is the classic Refutas form, and it is the one this engine uses. ASTM D7152 is a standard practice for calculating the viscosity of a blend, and it blends on volume.

The engine does not pick silently, and it does not hide the choice. It names its basis on every viscosity it returns, so a figure from this engine can always be told apart from a figure formed the other way.

## How to work with a held convention

Treat the engine's viscosity as the engine's answer, under a basis it states. When you compare it with a figure from another tool or a laboratory report, first find out which basis that figure used. If the other figure blended on volume, a gap like those in the table above comes from the basis. It is a difference of convention, and it is not an arithmetic error on either side.

When a decision turns on viscosity, such as whether a blend will pump at the terminal, read both bases. If both clear the limit, the choice of basis does not change the decision. If one clears and the other does not, the decision needs a laboratory measurement of the actual blend.

## Exercise

Read the Asarama Heavy and Ubie Condensate row. Quote the viscosity with the index on mass, the viscosity with the index on volume and the difference column. Then read the export blend row the same way. Say what the two difference figures show about when the choice of basis matters most, and say which basis the engine names and which basis ASTM D7152 uses, without saying which is right.
