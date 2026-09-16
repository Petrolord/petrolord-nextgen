# A mole fraction becomes pounds

The saturation step gives a mole fraction. Nobody buys glycol by the mole fraction. Turning 0.001125908 into 53.450380 lb of water per MMscf is a unit conversion, and it is worth doing slowly once because the same two constants reappear everywhere in this engine.

{{panel:fc-water-explorer}}

## The pound mole is the hinge

A mole fraction is a count of molecules. A pound is a mass. The bridge between them is the pound mole, and this module fixes it at 379.483571856287 standard cubic feet a pound mole, at a standard base of 14.696000 psia and 519.670000 degR.

So a million standard cubic feet of gas is a definite number of pound moles. The mole fraction says what share of those moles are water. The molecular weight of water, 18.015280, turns that share of moles into pounds. Three steps, two constants, and the answer comes out in lb per MMscf because that is the unit the whole dehydration chain downstream is written in.

## Why both constants are worth checking

Both of these are exported under names, and both are measured back out of the engine rather than taken on trust. The standard cubic feet a pound mole is measured out of one balance and the molecular weight of water out of another, and each measurement divided by its export gives 1.000000000000. The name on the page and the number in use are the same number.

That is a small thing until you consider the alternative. A module that defines a standard cubic foot at one pressure and converts at another has two standard bases, and nothing downstream can tell which of the two it is holding. The check that catches that is not clever. It is only asking the engine what it is actually using.

## The units the rest of the course speaks

Gas rate arrives in MMscfd. Water content arrives in lb per MMscf. Multiply them and water removal is in lb a day. Circulation ratio is in gal of glycol per lb of water, so gallons a day come next, then gpm. Heat is Btu a gallon, and duty is MMBtu an hour.

Every unit in that list was chosen so that the next multiplication is obvious. That is not an accident of field practice. It is what field units are for, and reading a gas conditioning answer is largely a matter of noticing which unit you are standing in.

## Exercise

Write out the path from 0.001125908 to 53.450380 lb per MMscf, naming the two constants it passes through and the value of each. Then say what a measured over exported ratio of 1.000000000000 on both of them rules out.
