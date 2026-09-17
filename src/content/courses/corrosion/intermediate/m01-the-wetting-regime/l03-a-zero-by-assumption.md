# A zero by assumption

{{panel:fc-rate-explorer}}

A rate of 0.000000 mm/yr is the most reassuring number this screen can print,
and in the oil-wet regime it arrives from a dropdown. Nothing was measured to
produce it. The wetting factor for the oil-wet regime is 0.000000, that factor
multiplies the rate, and the answer follows by arithmetic from a selection
somebody made in a list.

The engine takes that seriously enough to change what it reports. In the
oil-wet regime the rate is 0.000000 mm/yr, the category is WITHHELD and the
life is WITHHELD, and the module says why in its own words:

> the wetting regime is oil wet, so the rate is zero because that was assumed
> and not because it was calculated. An unbounded life off a dropdown is the
> strongest reassurance on the screen arriving from the weakest input.

## Withholding is a different act from refusing

A refusal says an input is missing or out of range and no answer is available.
Withholding says the arithmetic ran and its outputs would be misleading if
presented as verdicts. The oil-wet case is the second. The rate of 0.000000
mm/yr is reported. The band label and the remaining life, which are the two
fields a reader will summarise the screen by, are held back.

Take the shipped studio case and change only the regime to oil wet. The rate
goes to 0.000000 mm/yr, the category is WITHHELD, the remaining life is
WITHHELD, and the binding constraint the screen reports becomes the statement
that the model does not apply. The shipped case itself, water wet, reports a
rate of 0.754524 mm/yr, a remaining life of 4.207953 yr and a binding
constraint naming the corrosion allowance against the design life. One dropdown
moves the summary from a limit you can act on to a statement that there is no
verdict on offer.

## The corrosion inhibition figure goes to null

On the oil-wet case the effective corrosion inhibition is `null` rather than
0.000000 percent. That choice is worth a paragraph. A line with a corrosion
inhibitor programme on it that reports zero percent effective inhibition is
being told its programme delivers nothing, which is a claim about the chemical.
What is true instead is that there is no metal loss for the corrosion inhibitor
to remove, so the percentage has no subject.

## What to do with an oil-wet screen

Ask where the regime came from before reading anything else on the page. If the
regime is an assumption, every zero downstream of it is an assumption too, and
the withheld category and life are the engine saying exactly that.

## The rest of the screen keeps working

Notice what is not withheld. The wall shear and the chemistry figures are still
computed on an oil-wet case, because none of them depends on the regime.

## Exercise

Run the shipped studio case and record the rate, the category, the remaining
life and the effective corrosion inhibition. Change only the wetting regime to
oil wet and record the same four fields again. State which of the four is
reported as an absence rather than as a number, and give the engine's reason
for holding back the other two.
