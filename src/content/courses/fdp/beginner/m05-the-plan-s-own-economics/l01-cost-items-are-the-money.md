# Cost items are the money

A concept carries an estimate of what it will cost, and the plan carries a list of the things that will actually be bought, and the second of those is the one the plan can be held to.

{{panel:ec-plan-explorer}}

## The list

| cost item | type | phase | amount |
| --- | --- | --- | --- |
| Development drilling | CAPEX | Execution | 520.0000 |
| FPSO hull and topsides | CAPEX | Construction | 1180.0000 |
| Mooring and installation | CAPEX | Installation | 170.0000 |
| Subsea system | CAPEX | Installation | 380.0000 |
| Operations and logistics | OPEX | Operate | 72.0000 |
| Maintenance and integrity | OPEX | Operate | 23.0000 |
| Decommissioning provision | ABEX | Operate | 260.0000 |

Seven lines, each one a thing somebody intends to pay for, in million USD. The engine adds them into a CAPEX total of 2250.0000 and an OPEX total of 95.0000 a year, and those two totals are what the plan's own economics run on.

## By phase

| phase | million USD |
| --- | --- |
| Execution | 520.0000 |
| Construction | 1180.0000 |
| Installation | 550.0000 |
| Operate | 355.0000 |

Installation is 550.0000 because two lines sit in it, the mooring at 170.0000 and the subsea system at 380.0000. Operate is 355.0000 because three lines sit there, and one of those three is the decommissioning provision of 260.0000, which is money spent at the end of the field's life rather than each year of it.The phase columns show when the money leaves and which part of the work it belongs to. The economics run on the CAPEX and OPEX totals instead.

## The plan's own case

Run at 70.0000 USD a barrel on the FPSO concept's 20 year shape, with capex of 2250.0000 taken from the cost items, an operating cost of 95.0000 a year and the end-of-life cost in the last of those years, the plan returns an NPV of 2015.4123 million USD, no rate of return at all at the status multiple-roots, and a payback of 3.8273 years. The concept's own capex is also 2250.0000. The two agree here because this plan was costed against the concept it is running, and that agreement is a result, not a rule. The same studio will happily run a plan whose items total something else entirely, and it reports both figures without complaint.

## The mistake

Treating the concept's estimate and the cost items as one number and only ever looking at one of them. They are two separate answers to the same question, one from a concept type and a size, the other from a list of purchases, and the reason the studio shows both is so the difference can be read. A plan where they differ has a question in it that somebody has to answer. The second mistake is feeding a phase roll-up into the economics: Operate at 355.0000 is not the annual operating cost and never was.

## What it refuses

The engine does not price the items. Every one of those seven amounts is somebody's estimate, and a screening tool that adds them cannot make them right. It will not spread a capex line across years, and it will not turn the decommissioning provision into a schedule of payments. It refuses a concept that carries no capex at all with FdpInputError: "the concept carries no capex: enter a drilling, facilities or subsea capex", and a negative line with FdpInputError: "the drilling capex may not be negative: -500".

## Exercise

Give the CAPEX and OPEX totals the engine reads from the cost items, and name the two lines that make the Installation phase 550.0000. Then state the NPV, rate of return and payback of the plan's own case, and say why the plan's capex and the concept's capex are equal here.
