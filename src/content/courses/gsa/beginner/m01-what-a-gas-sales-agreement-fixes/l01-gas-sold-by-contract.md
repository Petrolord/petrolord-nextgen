# Gas sold by contract

{{panel:gsa-quantity-calculator}}

Crude oil can be loaded onto a tanker and sold to whoever pays on the day. Gas mostly cannot. It moves through a pipeline to a buyer whose plant was built to burn it, and both sides commit money for many years before the first molecule flows. So gas is sold by contract: a gas sales agreement that fixes how much gas the seller must make available, how much the buyer must take or pay for, what each unit costs, and what happens when either side falls short. This course treats that contract as a set of rules that can be written down and computed.

## What the agreement fixes

Every gas sales agreement answers three questions. The first is quantity: a daily contract quantity (the DCQ), the annual contract quantity (the ACQ) that the days add up to, and a ceiling on any one day's nomination. The second is price: a fixed figure, an escalating one, or a formula tied to an index. The third is remedy: what the buyer owes for gas it was obliged to take and did not, and what the seller owes for gas it was obliged to make available and did not.

The Commonwealth model gas sales agreement (2025) states the buyer's side of the bargain in one sentence:

> "In each Contract Year Buyer shall be obligated to take and pay for, or to pay for if not taken, a quantity of Gas at least equal to the Take or Pay Quantity." (Commonwealth model GSA (2025), Article 12.6)

That sentence is take-or-pay, and most of this tier builds toward reading one contract year of it.

## What this tier covers

The Associate tier owns one question: the quantities and one contract year. You will convert a volume of gas to energy, turn a DCQ into an ACQ with the right day count, measure swing, walk a month of daily nominations and takes, and reconcile one contract year into a deficiency and its payment. The Professional tier takes up the years in sequence, the price formulas and the Nigerian domestic rules.

## The engine behind every figure

Every number in this course is a return value of one engine, the gas contract engine. It has nine functions, and this tier uses four of them:

| function | what it computes |
| --- | --- |
| `toEnergy` | a gas volume as MMBtu and GJ |
| `contractQuantities` | the day count, ACQ, MaxDCQ, swing and effective swing |
| `dailyBalance` | each day's seller shortfall, buyer shortfall and over-take, and the totals |
| `takeOrPay` | a contract year's Adjusted ACQ, take-or-pay quantity, deficiency and payment |

The engine decides nothing a contract does not state. The take-or-pay percentage, the make-up terms and every price are inputs with no default, and a call without one is refused by name.

## What this course leaves to others

Turning flared gas into value, and gas sold as LPG or CNG, belong to the gas value course. Discounting and NPV as a subject belong to the cash flow course. This course stays with the contract.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose the view "Volume to energy". The box holds the Ekene power plant's daily gas: 20 MMscf at 1050 Btu/scf gross. Run it and read the energy tile in MMBtu, then read the rule line the engine prints beneath it. Change the quantity to 60, run it again, and write down the MMBtu the panel returns beside the first figure. You have just computed two daily contract quantities.
