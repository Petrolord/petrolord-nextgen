# What did not change

{{panel:pia-ledger-calculator}}

After two modules of changes it is worth saying plainly what the Nigeria Tax Act 2025 carried across untouched. Most of the fiscal machinery of the Petroleum Industry Act 2021 was deleted and written back in the same words. Knowing the unchanged core is what lets a reader find the changes quickly on any ledger.

## The unchanged core

The royalty by terrain and its tranches. NTA Seventh Schedule para 6(2)(d) keeps the small-field tranches: "(i) for the first 5,000 bopd - 5%, and (ii) for the next 5,000 bopd, for the share of production over 5,000 bop - 7.5%:". Para 6(2)(c) keeps the deep offshore tier at 50,000 bopd, and para 6(2)(f) the gas royalty of 5 percent and 2.5 percent in-country.

The royalty by price, including the Act's own worked example. NTA Seventh Schedule para 6(3)(a) repeats it: "on linear interpolation, as an example, if in 2020 the price is US $75 per barrel, the royalty by price shall be 2.5%,". It also repeats the 2020 start year, so the open question of the base year against the Regulations survives the move intact.

The hydrocarbon tax rates onshore and in shallow water, 30 and 15 percent, in NTA s.72.

The cost price ratio. NTA Sixth Schedule para 2(1) keeps the limit "of 65% of gross revenues determined at the measurement points."

The converted-lease production allowance in NTA Sixth Schedule para 1(1), at the lower of US $2.50 a barrel and 20 percent of the fiscal oil price.

## How the engine shows it

The engine's royalty and royalty by price functions take no framework input, and its cost price ratio reads none. So a ledger forced to one Act or the other returns the same royalty. On Ekene Alpha (synthetic, shallow water, converted, 2026 to 2032), forcing every year to the Act alone moves the provision totals by:

| provision total | forced to the Act alone, less as run |
| --- | --- |
| royalties | 0.000000 |
| hydrocarbon tax | 436533.662718 |
| companies income tax | 450000.000000 |
| tertiary education tax | 26785663.028773 |
| development levy | -35714217.371697 |

The royalty line is flat. Every figure that does move is traced to a change the earlier lessons read: the fifth year of the capital allowance and the levy in place of the education tax.

## A small check worth making

Unchanged in the text does not always mean identical on the page. The NTA's version of the tranche sentence prints "bop" where the Act prints "bopd". The course reads it as the same unit, because the sentence around it matches the Act's, and names the slip as it quotes it.

## Exercise

Open the ledger calculator on "Which provision moved" with ekene_alpha_shallow_converted_nta loaded and enter {"pia_under_nta_2025_override": "force_pia"}. Confirm the table. Then load ekene_onshore_across_2026 and enter {"pia_under_nta_2025_override": "force_nta"}. Before you run it, predict which provision totals will move and which will read 0.000000. Run it and explain any surprise from the provisions of this module.
