# Working the capstone

Six numbers, all of them the untuned model against a real study. This lesson walks each one and names the mistake most likely to produce a plausible wrong answer.

{{panel:fluid-study-explorer}}

## What you are given

The Good Oil Well No. 4 study as the report gives it: the eleven-component composition, the C7+ molecular weight of 218 and specific gravity of 0.8515, a reservoir temperature of 220 F, a bubble point of 2634.65 psia, and the optimum separator test at 100 psig and 75 F with its measured total gas-oil ratio of 768 scf/stb, stock tank gravity of 40.7 API and formation volume factor of 1.474 rb/stb.

Everything is computed from the composition. Nothing is tuned.

## Field 1: the C7+ critical temperature

Characterize the plus fraction from its molecular weight and specific gravity, and report the critical temperature in degrees Rankine.

Two mistakes. Reporting the BOILING point instead, which is 998.28 degR and is the first step of the same chain, so it looks like the right kind of number. And reporting in Fahrenheit, which is 864.57, a plausible-looking value in the wrong unit.

The check: a critical temperature must exceed the boiling point, and for a heavy pseudo-component it should be several hundred degrees above it.

## Field 2: the untuned saturation pressure

Search for the pressure at which the mixture first splits into two phases at 220 F.

The likely mistake is reporting the LAB bubble point of 2634.65 psia, which is the thing the model is being compared against rather than what it produced.

The check: the answer is above the lab value, because this model saturates high on heavy oils, and by a few percent rather than a few tens of percent.

## Field 3: the saturation pressure bias

The same comparison as a percentage, model against measurement.

Two mistakes. Taking the percentage of the model's value rather than the laboratory's, which moves the answer enough to matter at this tolerance. And getting the sign backwards; the model is the LARGER of the two, so the bias is positive.

The check: it is between five and seven percent and it is positive.

## Field 4: the untuned total gas-oil ratio

Run the separator train and sum the gas from every stage, divided by the stock tank liquid.

The likely mistake is the missing stock tank stage. Flash once to 114.65 psia and call the liquid the stock tank oil, and the tank gas is absent from the total, the liquid volume is too large, and the answer comes out well below the truth. That is the classic error in reproducing a separator test and the whole of module 2's last lesson.

The check: the answer is ABOVE the measured 768, not below it. An answer below 768 almost certainly has one stage.

## Field 5: the untuned stock tank gravity

The API gravity of the liquid leaving the last stage, at 60 F.

Two mistakes. Reporting the specific gravity rather than the API gravity, which is 0.866 and is obviously a different kind of number once you look. And reporting the measured 40.7, which is again the comparison rather than the result.

The check: the model comes out HEAVIER than the laboratory, so the answer is well below 40.7. If it is near 40.7 you have read the report rather than run the model.

## Field 6: the gravity bias

Model minus measured, in API, so a negative number.

Two mistakes. Reporting it as a percentage, which this field does not ask for because API is already a difference scale. And getting the sign backwards.

The check: it is close to minus nine, and the sign is negative because the model's oil is heavier.

## The pattern

Three of the six ask for a model output and three ask for a comparison against a measurement. The commonest way to get a plausible wrong answer on any of them is to report the measured value where the model value was asked for, or the reverse.

Before submitting, for each field write down two things: whether this number came out of the model or out of the report, and which direction the error runs. Both of those are stated somewhere in this tier.

## Exercise

First, for each of the six fields name the alternative computation that would produce a plausible wrong answer.

Second, one of the six is the field the missing-stock-tank-stage error attacks. Name it, say which direction the error pushes the answer, and state the check that catches it.
