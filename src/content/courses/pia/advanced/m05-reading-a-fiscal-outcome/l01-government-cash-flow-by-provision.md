# Government cash flow by provision

{{panel:pia-ledger-calculator}}

A ledger ends in a handful of totals, and a reader who knows the Act can say which provision put each one there. This module reads a fiscal outcome that way. It starts with the one summary figure every comparison ends in, the government take, and takes it apart line by line.

## The take, in the shared wording

The course uses the wording the fiscal course uses, from the shared conventions file, so the two courses cannot drift apart. "Government take" is "Government cash flow divided by the project's pre-take net cash flow, which is revenue less opex less capex, over the project life." Government cash flow is "Royalty plus the government share of profit oil plus tax." A lease ledger in this engine has no profit oil line, so government cash flow is royalty plus every tax, levy and contribution on the government side.

The engine's take for a PIA ledger is revenue less capex less opex, less the ledger's net cash flow, over revenue less capex less opex, undiscounted and nominal. Every royalty, HCDT, the NDDC levy and every tax sits on the government side of that difference. The take is a share of a project's pre-take value. It is a ratio of totals over a life and it answers a different question from any single tax rate.

## Ekene Alpha, provision by provision

Ekene Alpha (synthetic; shallow water, converted, 2026 to 2032, every year under the Nigeria Tax Act 2025), at 100 and at 50 percent working interest:

| line | provision behind it | Alpha, 100 percent | Alpha, 50 percent |
| --- | --- | --- | --- |
| total royalties | NTA Seventh Schedule para 6(2) and (3) | 79273732.707567 | 39636866.353784 |
| hydrocarbon tax | NTA s.72(a) | 204770583.587056 | 102385291.793528 |
| companies income tax | NTA s.56(b) | 222856630.287730 | 111428315.143865 |
| tertiary education tax | Finance Act 2023 s.26 | 0.000000 | 0.000000 |
| development levy | NTA s.59(1) | 35714217.371697 | 17857108.685849 |
| HCDT | PIA s.240(2) | 4320000.000000 | 2160000.000000 |
| NDDC | NDDC Act 2000 s.14(2)(b), secondary | 9540000.000000 | 4770000.000000 |
| government cash flow (the sum) | | 556475163.954050 | 278237581.977025 |
| pre-take value | | 835989167.000000 | 417994583.500000 |
| government take percent | | 66.564877 | 66.564877 |

## Reading the table

Companies income tax is the largest line, a little ahead of the hydrocarbon tax, although both charge 30 percent here. Companies income tax reads oil and gas together and takes no production allowance; the hydrocarbon tax reads crude and condensate only, after the cost price ratio and the production allowance; and neither deducts the other. The tertiary education tax line is empty because no year of Alpha is a year under the Act alone, and the development levy stands in its place. HCDT is smaller than NDDC because it reads only the preceding year's opex, and Alpha's first year has none stated, while NDDC reads capex as well.

The 50 percent column halves every money line and leaves the take exactly where it was. The engine runs the tranches, the caps and the rates at field level, then scales every money line to the share, as PIA s.273(4) and NTA s.77(4) require. The scaling itself belongs to the cash flow course; here the point is that a working interest never changes which provision applies.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_alpha_shallow_converted_nta. Read the take tile. Switch to "Which provision moved", load the same case and enter {} as the change, so that base and changed agree; read the seven provision totals and add them. Divide the sum by the pre-take value above and check the take. Then load ekene_alpha_wi_50 and repeat, and name the provision that makes the two takes equal.
