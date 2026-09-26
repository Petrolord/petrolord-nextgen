# Where the money lands

{{panel:pia-royalty-calculator}}

Assessment and collection are two steps. The third is the account the money reaches. The Act routes most of it to one place, carves out one royalty for a named fund, and the Nigeria Tax Act 2025 shares its development levy out by fixed percentages. None of this is computed by the engine, and none of it is graded on a number, but it explains why the ledger keeps the royalty by price on a line of its own.

## The Federation Account

Section 258(2) of the Act sets the default:

> "(2) All money collected from the petroleum industry that are due to the Government shall be transferred to the Federation Account in a timely manner, subject to this Act and these payments shall include taxes, royalties, production shares, profit shares, signature bonuses, production bonuses,"

The Seventh Schedule repeats it for royalty. Para 6 says that royalties "shall be paid into the Federation Account and verified by the Commission", in the same sentence that treats condensates as crude oil for royalty.

## The royalty by price goes elsewhere

One royalty has its own destination. Seventh Schedule para 11(3):

> "(3) Royalty derived from “royalty by price” shall be for the credit of Nigerian Sovereign Investment Authority."

That is one reason the engine reports the royalty by price as its own line. On Ekene Alpha in 2026 the royalty by price is 4037323.188406 USD out of a total royalty of 18012822.226867 USD. Both figures read the royalty by price on the Regulations base, the engine default; the base year is an open question this tier takes up in the royalty by price module.

| Ekene Alpha, 2026 | USD |
| --- | --- |
| production royalty on liquids | 13625099.038462 |
| gas royalty | 350400.000000 |
| royalty by price (Regulations base) | 4037323.188406 |
| total royalty | 18012822.226867 |

## The development levy is shared out

The Nigeria Tax Act 2025 charges a development levy of 4% on assessable profits (NTA s.59(1)) and names every recipient of it in s.59(3):

| recipient | share |
| --- | --- |
| Tertiary Education Trust Fund | 50% |
| Nigerian Education Loan | 15% |
| National Information Technology Development Fund | 8% |
| National Agency for Science and Engineering Infrastructure | 8% |
| National Board for Technological Incubation | 4% |
| Defence and Security Infrastructure Fund | 10% |
| National Cybersecurity Fund | 5% |

The same section keeps the levy away from the hydrocarbon tax. NTA s.59(4):

> "(4) The tax imposed under this Part shall not be levied on assessable profits computed for the purposes of hydrocarbon tax."

## Reading the destinations together

Money due to Government goes to the Federation Account unless a text sends it elsewhere. The royalty by price is credited to the Nigerian Sovereign Investment Authority. The development levy goes to a special account and is shared out by the seven percentages above. A learner who reads a ledger can now say, for each line, where the money ends up as well as who collects it.

## Exercise

Open the royalty calculator and choose the view "Royalty by price and its benchmarks". Set the year to 2026, the price to 75, the terrain to shallow_water and the base year to the Regulations base. Read the royalty by price rate; the course prints Ekene Alpha's 2026 rate as 0.017935. Change the year to 2032 and read the rate again. Then switch to "The instruments stacked on a ledger", run ekene_alpha_shallow_converted_nta, and mark which part of each year's total royalty is credited to the Nigerian Sovereign Investment Authority and which part goes to the Federation Account.
