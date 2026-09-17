# The capstone worked

The graded exercise for this tier is one shell and tube exchanger, marked on the figures produced. Six quantities are asked for: the correction factor, the equivalent single-shell P at two shells, U clean, U dirty, the fouling penalty and the controlling margin. Four habits carry it.

## Write the conditions down first

Every one of those six is conditional on something the question states. Write down first: the four terminal temperatures, the shell pass count, both film coefficients, the wall conductivity, the two fouling allowances and the two tube diameters.

Pay particular attention to the two film coefficients and the conductivity, because those arrive stated in this course and they arrive stated deliberately. The inside film is the one quantity in the module a fitted correlation produces, and the validity band of that fit is not established in this repository. So the exercise hands you the films rather than asking you to compute one, and every figure you produce then rests on conditions rather than on a fit. A reader who computes a film the question has given has answered a different question.

{{panel:fc-coefficient-explorer}}

## Keep the two P values apart

There are two numbers called P in a multi-shell question and they are different numbers. The whole unit P comes off the four temperatures. The equivalent single-shell P is what the conversion produces at the stated shell count, and it is the value the closed form is read at. Confusing them is the commonest way to lose a mark here.

The same discipline applies to the two coefficients. U clean leaves the fouling allowances out and U dirty includes them, and the surface a plant buys is sized on the dirty one.

There is a free check available on one of the six answers. The fouling penalty in percent is the same number as the two fouling terms taken as a share of the total, so it can be reached twice by two routes from one stack. If the two disagree, something upstream of both is wrong, and it is usually an inside term put into the stack without the diameter ratio on it.

## Check the units and the precision

| quantity | how it is written |
| --- | --- |
| P, R and the correction factor | dimensionless, six decimals |
| resistances | hr.ft2.F per Btu, nine decimals |
| coefficients | Btu an hour per ft2 per degF, six decimals |
| percentages | six decimals |
| temperatures and log means | degF, six decimals |
| duties and UA | Btu an hour, four decimals |
| counts | whole numbers |

Quote a figure at the precision the engine prints it rather than rounding on the way. A rounded restatement of an engine answer cannot be told apart from a number somebody invented.

## Never supply a declined number

When the engine declines, the decline is the answer. A configuration that cannot reach its duty at one shell is refused by name. A shell count past the declared bound is refused by name. A fractional shell count is refused, with both whole numbers either side named. A film in the transition band is refused, with the Reynolds number that put it there handed back. A cooled tube side is refused rather than answered with the heating exponent. Writing a plausible figure into any of those gaps turns a correct reading into a wrong answer, and the gap was the point of the question.

## Exercise

Take each of the six quantities in turn and write down the conditions it depends on, before working any of them. Then name which three of the six the fouling allowances reach, and say which quantity in the question arrives stated rather than computed and why.
