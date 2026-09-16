# The temperature the gas arrives at

The march returns an arrival temperature, a cooling, and three coefficients. Only one of the three belongs next to the arrival temperature, and putting the wrong one there is the most common way to misreport this answer.

{{panel:fc-coldend-explorer}}

## Three coefficients, three meanings

On AGBADA from 1180.000000 psia to 640.000000 psia the gas arrives at 59.683516566 degF, having cooled 36.316483434 degF over twenty steps. The march reports the coefficient at the inlet as 0.061607962, the coefficient at the last half step as 0.071833233, and the mean the cooling actually delivered as 0.067252747.

The mean is the cooling divided by the pressure drop. It is the only one of the three that reproduces the arrival temperature when a reader multiplies it out, and it is therefore the one that belongs beside that temperature.

The inlet coefficient is 0.916066108 times the mean. Print it next to a marched arrival and a reader who multiplies will get a different answer from the one the engine gave, and will have no way of telling which figure moved.

## Deeper does not mean proportionally colder

Letting the same gas down further does not go on cooling it in proportion, because the coefficient falls with the pressure the march is walking down.

| outlet psia | arrival, degF | cooling, degF |
| --- | --- | --- |
| 640.000000 | 59.683516566 | 36.316483434 |
| 60.000000 | 16.389556103 | 79.610443897 |
| 25.000000 | 13.728699767 | 82.271300233 |
| 8.000000 | 12.436046977 | 83.563953023 |

Read the three deeper rows as three separate answers. Each is the same routine on the same gas with only the outlet pressure changed, and each arrival has to be read on its own rather than scaled from the row above it.

## A march can die part way down

The thing that kills a march is a cold inlet rather than a deep outlet. The gas cools past the reduced temperature its own compressibility correlation is valid at, and the coefficient the next step needs cannot be formed.

The same gas entering at 10.000000 degF and let down to 200.000000 psia comes back as { error: "the march died at step 11 of 20: Tpr 0.950 against 1.0 is below the DAK validity range of 1.0 to 3.0, at 690 psia and -105.5172487617218 degF: the z-factor would be an extrapolation below the critical temperature, so it is refused" }.

It also hands back where it died: step 11 of 20, at 690.000000 psia and -105.517249 degF. Three fields beside a message, and between them they say the march was two thirds of the way down and the gas was already cold when the method ran out.

A bare refusal would have said none of that. The step says how far the march got. The pressure and the temperature name the state it could not carry, which is what a reader needs in order to choose a warmer inlet or a shallower drop.

## Exercise

Record the arrival temperature, the cooling and the three coefficients for the let-down to 640.000000 psia, and the figure the digest prints for the inlet coefficient against the mean. Record the arrival and the cooling at the three deeper outlets. Then record the step, the pressure and the temperature the failed march hands back, and say what each of those three tells a reader.
