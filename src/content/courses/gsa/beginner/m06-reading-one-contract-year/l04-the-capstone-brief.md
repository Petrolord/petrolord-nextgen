# The capstone brief

{{panel:gsa-quantity-calculator}}

The Associate capstone asks the tier's one question: the quantities and one contract year. It gives you a synthetic gas sales agreement of its own, with its own buyer, quantities and terms, and asks for six values the engine returns. Each value tests one module of this tier. This lesson says what the capstone asks, where each value comes from in the quantity calculator, and how to rehearse on the Ekene power plant first.

## What the capstone gives you

The capstone card carries one case file. It states every term a figure depends on: the metered volume with its unit, heating value, basis and reference conditions; the DCQ with its day count, MaxDCQ percentage and take-or-pay percentage; a run of days with nominations, gas made available, gas taken and any delivery tolerance, force majeure, maintenance or buyer-caused flag; and one contract year with its reductions, take, prices and make-up terms. The case file holds a block for each view, and when you paste the whole file into a view of the quantity calculator, that view reads its own block.

## The six values

| value | what it tests | where to find it |
| --- | --- | --- |
| a metered volume in MMBtu | volume to energy | the energy tile in "Volume to energy" |
| the ACQ of a stated contract year | the day count | the ACQ tile in "Contract quantities and swing" |
| the effective swing | swing against the take-or-pay level | the effective swing tile in the same view |
| the total buyer shortfall over the days | the daily balance | the total buyer shortfall tile in "The daily balance" |
| the total seller shortfall over the days | the daily balance | the total seller shortfall tile in the same view |
| one year's deficiency payment | take-or-pay in one year | the deficiency payment column in "One take-or-pay year" |

All six are reported to six decimals, as the panel prints them. Each is the same number under every reading the engine states, and none uses the domestic base price.

## Things to check before you copy a figure

Read the reference conditions and the heating value basis the engine echoes back, and make sure they are the ones the card states. Read the day count line: a period excludes its end date, and a leap year counts 366 days. In the daily balance, read the reasons for every day with a gap and decide whose gap it is before you trust a total. In the take-or-pay year, check which price the deficiency payment uses: it is the take-or-pay price, and a contract may state it apart from the contract price.

## How your answers are checked

Every graded value is a return value of the engine on the card's terms, so the same terms give the same number on any machine and there is exactly one right answer. Enter each value as the panel prints it, at six decimals. If a view refuses the case file, a term has been changed or mistyped: read the field the refusal names, restore the card's term and run it again.

## Rehearse on the power plant

The power plant's figures are printed in this course, so it is a safe place to practise every step.

| step | power plant figure |
| --- | --- |
| DCQ in energy, 20 MMscf at 1050 Btu/scf gross | 21000.000000 MMBtu |
| ACQ of 2028 | 7686000.000000 |
| effective swing, 110 over 80 | 1.375000 |
| January 2027 total buyer shortfall | 31270.000000 |
| January 2027 total seller shortfall | 6300.000000 |

For a one-year deficiency payment, rehearse on the golden case with force majeure and a seller shortfall, which pays 120.000000 on a deficiency of 40.000000.

## Exercise

Open the quantity calculator, the course's own calculator panel. Work the five power plant steps in the table, one view at a time, and check each figure against the table. Then, in "One take-or-pay year", run the starting case and read the 2027 deficiency payment. Change that year's `topPrice` so it differs from its `contractPrice`, run it again, and write down which of the two prices the deficiency payment followed.
