# Working the capstone

Six numbers, all of them the untuned model against a real study, on a read the capstone's brief states: one of the study's four separator tests, a saturation temperature and a plus-fraction sensitivity, set in the study explorer. This lesson walks each one on the teaching read, the one the panel opens on, and names the mistake most likely to produce a plausible wrong answer. The capstone does not grade the teaching values.

{{panel:fluid-study-explorer}}

## What you are given

The Good Oil Well No. 4 study as the report gives it: the eleven-component composition, the C7+ molecular weight of 218 and specific gravity of 0.8515, a reservoir temperature of 220 F, a bubble point of 2634.65 psia, and four separator tests at 50, 100, 200 and 300 psig. The teaching read is the optimum test at 100 psig and 75 F, with its measured total gas-oil ratio of 768 scf/stb, stock tank gravity of 40.7 API and formation volume factor of 1.474 rb/stb.

Everything is computed from the composition. Nothing is tuned.

## Field 1: a plus fraction's critical temperature

Characterize a plus fraction from its molecular weight and specific gravity, and report the critical temperature in degrees Rankine. The brief states the molecular weight and gravity; type them into the explorer's characterization boxes.

Two mistakes. Reporting the BOILING point instead, which is the first step of the same chain (998.28 degR for the reported C7+), so it looks like the right kind of number. And reporting in Fahrenheit (864.57 for the reported C7+), a plausible-looking value in the wrong unit.

The check: a critical temperature must exceed the boiling point, and for a heavy pseudo-component it should be several hundred degrees above it.

## Field 2: the untuned saturation pressure

Search for the pressure at which the mixture first splits into two phases at the stated temperature. The explorer's saturation temperature box sets it.

The likely mistake is reporting the LAB bubble point of 2634.65 psia, which the laboratory measured at 220 F and which is the thing the model is compared against rather than what it produced.

The check at 220 F: the answer is above the lab value, because this model saturates high on heavy oils, and by a few percent rather than a few tens of percent. At a lower temperature the model saturates lower.

## Field 3: a bias against the laboratory

A model value against the measurement, as a percentage. On the teaching read the saturation pressure is the classic one: 5.94 percent high at 220 F. The brief asks for the gas-oil ratio's bias on its own separator test, because the laboratory measured the bubble point at 220 F only.

Two mistakes. Taking the percentage of the model's value rather than the laboratory's, which moves the answer enough to matter at this tolerance. And getting the sign backwards; when the model is the LARGER of the two, the bias is positive.

## Field 4: the untuned total gas-oil ratio

Run the separator train on the stated test and sum the gas from every stage, divided by the stock tank liquid.

The likely mistake is the missing stock tank stage. Flash once to the separator pressure (114.65 psia on the teaching test) and call the liquid the stock tank oil, and the tank gas is absent from the total, the liquid volume is too large, and the answer comes out well below the truth. That is the classic error in reproducing a separator test and the whole of module 2's last lesson.

The check on the teaching test: the answer is ABOVE the measured 768. An answer below the measurement almost certainly has one stage.

## Field 5: the untuned stock tank gravity

The API gravity of the liquid leaving the last stage, at 60 F.

Two mistakes. Reporting the specific gravity rather than the API gravity, which is obviously a different kind of number once you look. And reporting the measured gravity, which is again the comparison rather than the result.

The check: the model comes out HEAVIER than the laboratory, so the answer is well below the measurement. If it is near the measurement you have read the report rather than run the model.

## Field 6: the gravity bias

Model minus measured, in API, so a negative number.

Two mistakes. Reporting it as a percentage, which this field does not ask for because API is already a difference scale. And getting the sign backwards.

The check: it is close to minus nine on every test, and the sign is negative because the model's oil is heavier.

## The pattern

Three of the six ask for a model output and three ask for a comparison against a measurement. The commonest way to get a plausible wrong answer on any of them is to report the measured value where the model value was asked for, or the reverse.

Before submitting, for each field write down two things: whether this number came out of the model or out of the report, and which direction the error runs. Both of those are stated somewhere in this tier.

## Exercise

First, for each of the six fields name the alternative computation that would produce a plausible wrong answer.

Second, one of the six is the field the missing-stock-tank-stage error attacks. Name it, say which direction the error pushes the answer, and state the check that catches it.
