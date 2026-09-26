# Gross and net heating value

{{panel:gsa-quantity-calculator}}

Burning natural gas makes water. If the water leaves as vapour, the heat it carries is lost; if it condenses, that heat is recovered. So one gas has two heating values. The gross, or higher, heating value counts the heat of condensing the water. The net, or lower, heating value leaves it out. In the golden cases below the net figure sits a tenth below the gross one, and a contract has to say which one it prices.

## The engine carries the basis through

The engine does the same arithmetic on either value. What changes is the label it carries beside the result. The golden cases state one volume at two heating values:

| case | volume | heating value | basis | MMBtu (engine) | GJ (engine) |
| --- | --- | --- | --- | --- | --- |
| metric, gross | 1 MMSm3 | 39 MJ/Sm3 | gross | 36964.867692 | 39000.000000 |
| metric, net | 1 MMSm3 | 35.100000 MJ/Sm3 | net | 33268.380923 | 35100.000000 |

The engine's heating value wording for each, verbatim:

> gross (higher) heating value, as the contract states

> net (lower) heating value, as the contract states

## The label changes and the arithmetic does not

Here is the point that catches people out. The net case's numbers stated as gross return 33268.380923 MMBtu, labelled gross. The engine cannot tell that a heating value of 35.100000 MJ/Sm3 is a net figure; it trusts the basis you state. The result is the same number with the wrong label on it, and a contract priced on gross energy would then be invoiced short.

So the discipline is on the person entering the term. Read the contract's quality clause, find which heating value it names, and state that basis. When you quote an energy figure from this course, quote its basis beside it: the power plant's DCQ is 21000.000000 MMBtu on a gross basis.

## Which basis contracts use

Both Ekene fixtures state the gross basis. Another contract may state net. Neither is more correct; they are different quantities of the same gas, and the contract fixes which one is sold. The engine accepts exactly two words for the basis, and anything else is refused:

> heatingValueBasis must be one of "gross", "net"; got "higher"

The engine's word "gross" and the everyday phrase "higher heating value" mean the same thing, but the input takes the contract word only.

## Where the difference shows up in money

Every quantity downstream of the DCQ inherits the basis. If a DCQ is stated gross and a take is metered and converted net, the two cannot be compared until one is restated. The engine never mixes them, because each call carries one basis and echoes it back.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Volume to energy". Enter one MMSm3 at 39 MJ/Sm3 gross, with `quantityUnit` "MMSm3", `heatingValueUnit` "MJ/Sm3" and reference conditions "15 C and 101.325 kPa". Run it and read the MMBtu and the basis tile. Change the heating value to 35.100000 and the basis to "net", and run it. Then change only the basis back to "gross" and run it once more. Compare the three MMBtu tiles and the three basis tiles, and write down which one changed each time.
