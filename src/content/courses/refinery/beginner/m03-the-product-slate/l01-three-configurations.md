# Three configurations

A refinery's configuration is the list of units it has, and the list decides what a barrel of crude can become. The screen offers three, each one the previous plant with more units added.

{{panel:refinery-screen-explorer}}

## The units

| configuration | units |
| --- | --- |
| Topping | Crude distillation |
| Hydroskimming | Crude distillation, Naphtha reformer, Diesel hydrotreater |
| Conversion | Crude distillation, Naphtha reformer, Diesel hydrotreater, Fluid catalytic cracker |

A topping plant has one unit. It separates crude by boiling range and sells what comes off. A hydroskimming plant adds a naphtha reformer, which upgrades naphtha into a gasoline blending stock, and a diesel hydrotreater, which treats the diesel cut. A conversion plant adds a fluid catalytic cracker, which cracks heavy material into lighter products.

## The yields

Each configuration carries one fixed row of yields, as fractions of a barrel of crude:

| configuration | lpg | naphtha | gasoline | kerosene | diesel | fuelOil | loss |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Topping | 0.0200 | 0.1800 | - | 0.1400 | 0.3000 | 0.3400 | 0.0200 |
| Hydroskimming | 0.0300 | - | 0.2000 | 0.1300 | 0.3200 | 0.3000 | 0.0200 |
| Conversion | 0.0500 | - | 0.3400 | 0.1200 | 0.3300 | 0.1400 | 0.0200 |

A dash means the configuration makes none of that product, so the slate for that configuration carries no row for it. Topping sells naphtha and no gasoline. Hydroskimming and conversion sell gasoline and no naphtha, because the reformer takes the naphtha.

## Reading down the columns

The yield table is where the three configurations differ, and reading a column top to bottom shows what each added unit does. The gasoline column reads -, 0.2000 and 0.3400. The fuelOil column reads 0.3400, 0.3000 and 0.1400. The loss column reads 0.0200 in every row.

Those columns carry the economic argument for adding units. OKORDIA prices fuel oil at 55.0000 a barrel and gasoline at 104.0000, so the same barrel of crude is worth a different amount depending on which column its barrels land in. The next lesson values each row against the price table and prints the result.

## What the yields are

They are fixed vectors. The screen does not model the units, their conditions or the crude's quality. It assigns each configuration one yield row and applies it to every barrel. A different crude, run through a real plant, would give a different row; on the screen it gives the same one. That makes the configuration comparison clean, and it is the reason the screen can value a plant with three inputs and a price table.

## Choosing on the panel

The configuration picker on the panel swaps the yield row and the unit list together. The price table stays where it is. So any change in value you see when you switch configuration comes from the yields alone. That is the point of holding the prices still: it isolates what the units buy. Try it before reading on. Switch from topping to hydroskimming to conversion, watch the yield row change, and watch which product rows appear and disappear from the slate as the naphtha and gasoline columns trade places.

## The mistake

Reading the three rows as three crudes. They are three plants, and the screen runs one crude through each. OKORDIA's crude costs 76.0000 a barrel whichever configuration you pick. The yields describe what the units make of that crude.

## Exercise

Read the gasoline, naphtha and fuelOil columns for all three configurations. For each change from topping to hydroskimming and from hydroskimming to conversion, name the unit that was added and say which of those columns its addition changes.
