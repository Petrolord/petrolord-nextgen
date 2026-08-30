# The erosional velocity limit

The one flow limit this engine keeps, and it is a screening number.

{{panel:ct-tubing-explorer}}

## The formula

API RP 14E, in its original field-unit form:

    Ve [ft/s] = C / sqrt( density [lb/ft3] )

with C a constant, conventionally 100 for continuous service and 125 for intermittent.

The engine converts: density in kg/m3 divided by 16.018463 to get lb/ft3, and the answer times 0.3048 to get metres per second.

## The shape

Inverse square root of density. Light fluids can go fast, heavy fluids cannot.

| mixture density (kg/m3) | Ve at C of 100 (m/s) |
|---|---|
| 200 | 8.62601851617396 |
| 400 | 6.099516187427327 |
| 700 | 4.610800842784442 |
| 1000 | 3.8576727554673687 |
| 1200 | 3.5215573127376483 |

The golden case is 700 kg/m3 at a C of 100, giving 4.610800842784442 m/s.

## What it is for

Sizing a tubing for rate. Given a production rate and a fluid density you get a velocity, and if the velocity exceeds Ve the tubing is too small.

That is a real and common calculation and it decides tubing size on a great many wells.

## What is wrong with it

A great deal, and RP 14E itself says so in later editions.

**C is not a constant.** It depends on the material, the corrosivity, the presence of sand and whether the flow is continuous. A single number cannot carry all four.

**There is no sand term.** A trace of produced sand changes the erosion rate by orders of magnitude, and the formula does not know sand exists.

**There is no material term.** Corrosion-resistant alloys and carbon steel get the same answer.

**It is not a physical model.** It is a correlation from the 1980s that has outlived the data it was fitted to, and modern practice uses erosion-rate models with a sand rate as an input.

## So why keep it

Because it is the industry's common screening number, everybody has it, and a tubing size that fails it will be questioned.

The engine's own comment calls it the one honest flow fragment kept, which is the right framing: it is kept because it is the standard, not because it is good.

## What it is not allowed to do

Certify a tubing size. Not in this course and not anywhere.

## Exercise

Compute Ve for a gas-condensate mixture at 200 kg/m3 with a C of 125.

Then say what tubing inside diameter would be needed to keep 500 thousand standard cubic metres a day of that mixture below the limit, and list two things about your answer that RP 14E has not accounted for.
