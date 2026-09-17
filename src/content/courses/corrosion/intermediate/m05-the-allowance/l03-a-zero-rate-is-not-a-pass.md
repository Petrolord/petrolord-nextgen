# A zero rate is not a pass

{{panel:fc-inhibitor-integrity-explorer}}

Divide a remaining allowance by a rate of zero and the arithmetic offers you an
unbounded life. That would be the most reassuring output this module can
produce and it would arrive from the weakest input on the form, so the engine
does not produce it. Where the rate is zero it returns no life and no verdict,
and it says what the reader should do instead.

## The oil-wet case is the one to study

Set the wetting regime to oil wet and the wetting factor is 0.000000, so the
rate is 0.000000 mm/yr. The category is WITHHELD, the life is WITHHELD, and the
effective corrosion inhibition is reported as an absence rather than as zero
percent. The engine's own words:

> the wetting regime is oil wet, so the rate is zero because that was assumed
> and not because it was calculated. An unbounded life off a dropdown is the
> strongest reassurance on the screen arriving from the weakest input.

Take the studio's shipped case and change only the regime. The rate goes from
0.754524 mm/yr to 0.000000 mm/yr, the remaining life goes from 4.207953 yr to
WITHHELD, and the binding constraint the screen reports becomes the statement
that the model does not apply. One dropdown replaced a limit you can act on with
a statement that there is no verdict on offer.

## Why withholding beats an infinity

An unbounded life is a number in the sense that a program can print it. As a screening result it
carries nothing, because it is true of every case where the rate is zero
whatever put it there, and those reasons are not equivalent. A withheld field
cannot be copied into a summary as a result, and that is the point.

## More than one route reaches a zero

The oil-wet regime is one route. An intermittent regime at a water cut of
0.000000 is another, with a wetting factor of 0.000000 and a rate of 0.000000
mm/yr. A stream the module takes to have no CO2 in it is a third, and a
corrosion inhibitor at full efficiency and full availability is a fourth. None
of them means the line is not corroding, which is why the engine asks the reader
to find out WHY the rate is zero before reading it as anything.

## What a reader should do

Treat every zero on this screen as a pointer back to an input. Read the wetting
regime first, because it is chosen from a list and nothing constrains it. Then
read the CO2 fraction and the corrosion inhibitor percentages.

## The same reasoning one field along

The withheld category deserves the same reading as the withheld life. A band
label on a rate of zero would read as the most reassuring word on the scale, and
it would be describing an assumption. Withholding both together keeps the
summary consistent with the arithmetic that produced it.

## Exercise

Record the rate, the category, the remaining life and the effective corrosion
inhibition on the shipped case and on the same case set to oil wet. State which
fields are withheld on the second screen and copy out the engine's reason. Then
list the routes by which a rate of 0.000000 mm/yr can be reached.
