# Royalty off the top

Royalty is a flat percentage of gross revenue, taken before any cost is recognised. It is paid in every year that produces, whether that year makes money or not.

{{panel:ec-screening-explorer}}

## A rate on the first line

The engine computes royalty as grossRevenue times royaltyRate divided by 100. ISIALA's royalty rate is 15, meaning 15 percent.

| year | grossRevenue | royalty | ncf | govTake |
| --- | --- | --- | --- | --- |
| 2027 | 112.4200 | 16.8630 | -17.8210 | 16.8630 |
| 2028 | 98.9296 | 14.8394 | -26.7825 | 14.8394 |
| 2029 | 87.0580 | 13.0587 | 35.9654 | 32.4247 |
| 2046 | 9.9086 | 1.4863 | 2.6534 | 2.9151 |

Over twenty years totalRoyalty is 129.6255 million USD on totalRevenue of 864.1699. The published hand case, at a royalty rate of 20, takes 20.0000 from each year's 100.0000.

## Paid in loss years

In 2027 and 2028 ISIALA's net cash flow is negative and no tax is due, yet royalty takes 16.8630 and 14.8394. In those two years govTake equals the royalty alone. From 2029 tax starts and govTake becomes royalty plus tax, 32.4247 in that year.

OKPOMA shows the same in a sharper form. Its royalty rate is 10 percent, and in 2028, a year with a net cash flow of -11.4786, it still pays royalty of 15.8749. In 2046, when opex of 4.5718 exceeds gross revenue of 4.4603, royalty is still taken off the top of that 4.4603.

## Royalty follows revenue exactly

Because it is a fixed fraction of the first line, royalty scales one for one with revenue. The Low scenario, with price and production times 0.8, reads totalRevenue 553.0688 and totalRoyalty 82.9603. The High scenario reads 1244.4047 and 186.6607. Tax does not behave that way, because tax depends on costs as well, and the Low scenario's totalTax of 62.9637 is less than half the Base 136.0307.

## The mistake

The careful mistake is to take royalty after costs, as if it were a tax on profit. On ISIALA in 2027 that reader would see a loss year and charge nothing, where the engine charges 16.8630. The tell is govTake in a year with no tax: if it reads zero, royalty was taken from the wrong line.

The second mistake is to judge the royalty by its rate beside the tax rate. ISIALA's royalty is 15 percent and its tax 35 percent, yet over the life totalRoyalty of 129.6255 is close to totalTax of 136.0307. Royalty is charged on a larger base in all twenty years, and tax is charged on a smaller base in 18 of them.

## What royalty refuses

It refuses a sliding scale by price or by production, a terrain distinction, a payment in kind and any relief in a loss year. One flat rate applies to every year of the life, from the first barrel to the last.

## Exercise

Compute ISIALA's 2027 royalty from grossRevenue and the rate, and say what govTake is in 2027 and why. Then explain why OKPOMA pays royalty of 15.8749 in 2028 with a net cash flow of -11.4786, and why ISIALA's lifetime royalty sits so close to its lifetime tax.
