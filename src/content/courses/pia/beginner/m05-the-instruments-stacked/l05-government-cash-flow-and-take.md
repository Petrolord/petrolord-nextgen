# Government cash flow and take

{{panel:pia-royalty-calculator}}

With every line on the stack read, one question remains: how much of the project's value goes to the government in all? The answer is the government take. This course uses the take wording of the shared fiscal conventions, word for word, so that it means the same here as in the fiscal course.

## The words

The shared wording defines government take as

> Government cash flow divided by the project's pre-take net cash flow, which is revenue less opex less capex, over the project life.

and government cash flow as

> Royalty plus the government share of profit oil plus tax.

A ledger under the Act in this engine has no profit oil line, so its government cash flow is its royalties, taxes, levies and contributions. The engine's take for such a ledger is revenue less capex less opex, less the ledger's net cash flow, over revenue less capex less opex, undiscounted and nominal. Every royalty, HCDT, the NDDC levy and every tax sits on the government side of that difference. Government take is a share of value, and it is never a tax rate.

## Ekene Alpha by provision

Every figure below reads the royalty by price on the Regulations base, the engine default.

| line | Alpha, 100 percent | Alpha, 50 percent |
| --- | --- | --- |
| total royalties | 79273732.707567 | 39636866.353784 |
| hydrocarbon tax | 204770583.587056 | 102385291.793528 |
| companies income tax | 222856630.287730 | 111428315.143865 |
| tertiary education tax | 0.000000 | 0.000000 |
| development levy | 35714217.371697 | 17857108.685849 |
| HCDT | 4320000.000000 | 2160000.000000 |
| NDDC | 9540000.000000 | 4770000.000000 |
| government cash flow | 556475163.954050 | 278237581.977025 |
| pre-take value | 835989167.000000 | 417994583.500000 |
| government take percent | 66.564877 | 66.564877 |

Government cash flow is the sum of the seven lines above it, and it over the pre-take value reproduces the engine's take on both columns.

## The share scales the money and leaves the take

At a 50 percent working interest every money line is exactly half, and the take does not move. The reason is the order of work: the engine reads the tranches, the caps and every rate at field level, then scales each money line to the share. This course quotes every money figure at the share, and the cash flow course owns the arithmetic of the scaling.

## What the take does not say

The take is undiscounted: a dollar of tax in 2032 counts the same as a dollar in 2026. It sums the whole life, so a year of heavy capex and a year of heavy tax sit in one figure. And it reads one lease as a single figure; the Expert tier reads a whole outcome provision by provision.

## Exercise

Open the royalty calculator and choose "The instruments stacked on a ledger". Run ekene_alpha_shallow_converted_nta and read the government take tile, then run ekene_alpha_wi_50 and read it again. In the case box of the second, change pia_working_interest_pct to a share of your own and run it; check that the total royalties and total companies income tax tiles scale with the share while the take holds. Finally add up the seven government lines of the table above for the 100 percent column and confirm the government cash flow.
