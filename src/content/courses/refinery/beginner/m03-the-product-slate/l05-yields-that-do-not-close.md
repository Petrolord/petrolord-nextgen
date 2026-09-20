# Yields that do not close

A yield row is supposed to account for the whole barrel of crude. When a row is typed wrong, the engine could fix it quietly or report it. productSlate reports it and leaves the row as typed.

{{panel:refinery-screen-explorer}}

## The case

Take hydroskimming and type its yields by hand as follows:

| product | OKORDIA's row | typed row |
| --- | --- | --- |
| lpg | 0.0300 | 0.0300 |
| gasoline | 0.2000 | 0.1900 |
| kerosene | 0.1300 | 0.1300 |
| diesel | 0.3200 | 0.3100 |
| fuelOil | 0.3000 | 0.2900 |
| loss | 0.0200 | 0.0200 |

The engine returns:

| reading | OKORDIA's row | typed row |
| --- | --- | --- |
| yields total | 1.0000 | 0.9700 |
| yields close | true | false |
| gross value per barrel of crude | 83.7900 | 81.1900 |

The engine reports the gap and does not normalise the yields.

## What normalising would have done

A normalising engine would scale every typed yield up so the row summed to 1.0000, and then value the stretched row. That produces a clean-looking slate, but it spreads the missing fraction across every product in proportion to what was typed, and the person who typed the row never said that is where it belongs. The missing barrels might belong to gasoline alone, or to the loss. Normalising guesses. Reporting leaves the guess to someone who knows the plant.

So the engine does the arithmetic on what it was given. It values the typed row as typed, prints a total of 0.9700, and sets yields close to false.

## Reading the two flags together

The total and the flag are the two readings to check whenever you type a yield row. Yields total says how much of the barrel the row accounts for. Yields close is the engine's verdict on that total. On OKORDIA's own rows the flag reads true on every configuration. On the typed row it reads false, and the gross value of 81.1900 is a value of the barrels the row describes, with the rest of the barrel of crude unaccounted for.

These are two of the slate's three check lines, and the unpriced list is the third. Between them, the three say whether the gross value describes a complete, fully priced barrel.

## What to do with a row that does not close

Find where the missing fraction belongs and put it there. If it is product, it goes in that product's yield. If it is fuel burned or material lost, it goes in the loss, where it carries no value. Then check that yields close reads true before reading the gross value.

A row that does not close is usually a typing slip, but it can also be a yield set that came from somewhere else and is not meant to sum to a whole barrel, such as a table of product yields that leaves out the refinery's own fuel. The flag catches both.

## The mistake

Reading the gross value of 81.1900 as the hydroskimming slate. It is the value of a row that describes less than the whole barrel, and set against a crude cost paid on every barrel of crude it gives a margin the screen cannot vouch for. Fix the row first, and read the margin from a row that closes.

## Exercise

Read OKORDIA's hydroskimming row and the typed row. Quote the yields total, the yields close flag and the gross value for each. Then name the products whose typed yields differ from OKORDIA's, and say what the engine would need you to change for yields close to read true.
