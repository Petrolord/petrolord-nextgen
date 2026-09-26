# Corporate income tax

The simplest instrument in the stack. A rate, applied to the contractor's profit share, in any year that share is positive, with nothing carried in and nothing carried out.

{{panel:ec-instrument-explorer}}

## The rate on the base

"USA - Gulf of Mexico" on the Designer's default project is the cleanest example. Its royalty is flat at 18.75 percent, its recovery limit is 100 percent, the contractor keeps 100 percent of profit oil, and corporate income tax at 21 percent is the only tax the regime carries, so the tax column is that tax alone.

| year | profitOil | tax |
| --- | --- | --- |
| 3 | 11.3804 | 2.3899 |
| 4 | 135.2891 | 28.4107 |
| 5 | 131.6841 | 27.6537 |
| 25 | 8.1761 | 1.7170 |

Over the 25 years the profit oil totals 1241.6852 million USD and the tax totals 260.7539. Years 1 and 2 carry profit oil of 0.0000 and tax of 0.0000, so the whole charge falls in the years that have a positive base.

Raise the rate and the column scales with it. Running the "Brazil - Concession" instruments with the resource rent tax and the minimum tax switched off leaves corporate income tax at 34 percent on its own: 25.7707 million USD on a base of 75.7962 in year 3, 51.8740 on 152.5706 in year 4, 3.5035 on 10.3043 in year 25, and 502.1091 over the life.

## The rate does not rank the burden

Four of the six templates carry a corporate income tax and nothing else, and their total tax on the default project does not follow their rate.

| regime | corporate income tax rate percent | total tax | total government cash flow |
| --- | --- | --- | --- |
| USA - Gulf of Mexico | 21 | 260.7539 | 764.5528 |
| Nigeria - PIA (2021) | 30 | 453.4354 | 687.4682 |
| Generic Royalty/Tax | 30 | 422.8854 | 758.7514 |
| Ghana - Deepwater | 35 | 230.9340 | 1316.6067 |

Ghana charges the highest rate of the four and collects 230.9340 million USD, while Generic Royalty/Tax charges 30 percent and collects 422.8854. Nigeria charges the same 30 percent as Generic and collects 453.4354, the most of the four. The reason is the base. Generic hands the contractor 100 percent of profit oil, so all of it is taxable. Ghana splits profit oil on the R factor, and the government's own share never passes through the tax line. Nigeria leaves the contractor 95 percent of a larger profit oil, 1591.0013 million USD, because its royalty is smaller. Government cash flow runs the other way for Ghana, 1316.6067 million USD against 758.7514 for Generic.

## The mistake

The mistake is ranking regimes by their headline tax rate, or reading a total tax as the weight of a regime. Nigeria's 453.4354 million USD of tax is the largest of the four and sits inside the smallest government cash flow of the four, 687.4682. Ghana shows it from the other side, the smallest tax, 230.9340, inside the largest take, 1316.6067. The tax line measures one instrument. The take measures the regime, and the two can point in opposite directions on one comparison.

## What it refuses

There is no depreciation and no capital allowance, so capex never enters the corporate income tax computation; it is compensated through cost recovery instead. There is no loss carryforward, so a base that is not positive is worth nothing to the following year. There is no ring fence and no consolidation, so a group that shelters one licence with another cannot be expressed. And the rate is one number for all 25 years, with no holiday, no step and no expiry.

## Exercise

Write the four templates with their rate and their total tax, order them by each, and say why the two orders differ. Then name the instrument that makes Ghana's base smaller than Generic's at a higher rate.
