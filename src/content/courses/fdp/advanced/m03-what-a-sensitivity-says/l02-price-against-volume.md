# Price against volume

Price and production both scale revenue, so a 30 percent move in either should move the value by the same amount. It does not. On the EGINA plan the price swing is 3092.0051 and the production swing is 2839.5965.

{{panel:ec-value-explorer}}

## The two rows side by side

| driver | minus 30 percent | plus 30 percent | base | swing | swing as a share of base |
| --- | --- | --- | --- | --- | --- |
| Oil Price | 501.5628 | 3593.5679 | 2047.5653 | 3092.0051 | 1.510089 |
| Production | 627.7671 | 3467.3636 | 2047.5653 | 2839.5965 | 1.386816 |

Price is wider at both ends. Its downside of 501.5628 sits below the production downside of 627.7671, and its upside of 3593.5679 sits above the production upside of 3467.3636. As a share of base that is 1.510089 against 1.386816.

## A barrel costs money and a dollar does not

The reason is in the operating cost. The screening terms charge a variable operating cost of 5.0000 USD a barrel, so every barrel produced brings its revenue and takes its own cost away again. A dollar added to the price arrives with no cost attached at all.

Raise production by 30 percent and the extra barrels raise both revenue and the variable operating cost that the barrels carry. Raise the price by 30 percent and only the revenue moves. The same relative move therefore hands more net cash flow to price than to volume, at both ends of the sweep. On the Base case the operating cost over the life is 3049.6464 million USD against revenue of 16095.0492, and it is that block of cost moving with the barrels that separates the two rows. Royalty and tax take their share of both drivers alike, at 2011.8812 and 3310.0565 on the Base case, so they are not what splits price from volume.

## The same effect on other cases

| published case | base | price ends | production ends |
| --- | --- | --- | --- |
| 800 capex, 60 opex, 50 kbpd flat ten years at 70 | 3201.1321 | 1825.8772 to 4576.3870 | 1938.1429 to 4464.1213 |
| the example FPSO concept profile at 70 | 10032.1182 | 6167.1119 to 13897.1246 | 6482.6226 to 13581.6139 |
| no royalty and no tax | 2738.0331 | 1651.9056 to 3824.1606 | 1735.4539 to 3740.6123 |

Price is wider than production on every one of them, including the case that pays no royalty and no tax, which shows the gap is not a fiscal artefact. Removing the government take changes the base from 2047.5653 to 2738.0331 and leaves price the wider driver. The second row is worth reading twice: it runs the example FPSO concept profile, a much larger case with a base of 10032.1182, and the ordering survives the change of scale intact.

## Where it bites hardest

On a marginal case the ordering decides whether a project survives at all. The published case with 900 capex at 45 has a base of 212.7034, price ends of -225.0477 to 650.4545 and production ends of -169.4603 to 594.8670. Both downsides go negative. The price downside goes further negative, because the barrels that are still being produced still cost 5.0000 USD each to lift while earning less for each one.

## The mistake

The mistake is treating the two as interchangeable and hedging only one of them. A volume shortfall and a price fall of the same relative size are different amounts of money, and on a marginal case they are different answers. The related mistake is assuming the gap between them is fixed: it comes from the operating cost the barrels carry, so a case with a higher variable cost per barrel separates them further and a case with none would not separate them at all.

## Exercise

Write the two ends and the swing for Oil Price and for Production on the EGINA plan, and state the swing as a share of base for each. Then explain, using the variable operating cost of 5.0000 USD a barrel, why the price row is the wider of the two.
