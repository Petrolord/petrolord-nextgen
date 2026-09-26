# Conventions that are choices

{{panel:joa-agreement-calculator}}

Between the stated inputs and the three readings lies a third kind of rule: a convention. Where no text fixes a detail, the engine picks one way of doing it, states it in its basis, and applies it every time. A different choice would move a figure, so each convention is named in any report that quotes a figure resting on it.

## The conventions

| convention | the engine's choice | where it comes from |
| --- | --- | --- |
| beneficial and paying interest | beneficial interest is the participating interest; paying interest moves only under a carry | engine convention on Norway JOA Art. 8.1 |
| carriers pro rata | in proportion to the participating interests of the parties no carry names as carried | engine convention |
| the reconciliation | the difference of a called month adjusts the call reconciliationLagMonths later; an uncalled month is billed in arrears | Norway Accounting Agreement Art. 1.2.1, with the lag stated |
| overhead | a marginal scale on the base after the stated exclusions; overhead never in its own base | Norway Accounting Agreement Art. 2.2.2 |
| the budget tolerance | the lower of the percentage and the amount; an overrun of exactly the tolerance is inside | Norway JOA Art. 12.5 |
| default interest | from and including the due date to the cure date, which is excluded; simple or compounded monthly as stated | Norway Accounting Agreement Art. 1.2.2; Kenya Model PSC 2015 Art. 6.7 |
| the carry uplift | on the opening balance; a year's new carried cost earns none in its own year | engine convention |
| a back-in | the others keep (100 - target) / (100 - current) of their interests | engine convention |
| non-consent | the premium on the proportionate share; reversion inside the payout period | engine convention; Norway JOA Art. 18.12 for the entry base |
| the NPV | year-end flows discounted to the stated base year | the canonical npv of cashflow.ts |
| money in a reason | rounded to the cent, half away from zero; every numeric field keeps full precision | engine convention |

Three more rows belong to the readings: the cover, the grace and the PSC tax, each read in the third module of this tier. They sit in the same table in a report, marked as readings.

## Why a convention is named

A convention is invisible in a single figure. The Ekene carry recovered in 2033 looks like a plain fact, yet it rests on the uplift accruing on the opening balance and on recovery at the year end from that year's entitlement. A contract that accrued the uplift on another balance would give a different ledger. A partner who reads the convention beside the figure can see at once whether the contract in front of them agrees.

## How a convention differs from a reading

A reading answers a text that can be read two ways. A convention fills a gap where the texts are silent. Both are stated, and neither is the law. The difference matters to a report only in the words used: a reading is quoted with the text it reads, and a convention is named as the engine's.

## Conventions this tier has met

The premium on the proportionate share and reversion inside the period are the conventions of the first module. The carry uplift sits in the carry view of the agreement calculator: the uplift accrues on the opening balance, and recovery comes at the year end from the same year's entitlement. On the Ekene carry with its 8 percent compound uplift, the first year's carried cost of 16400000.000000 earns no uplift in 2027 and 1312000.000000 in 2028 (engine).

## The NPV is imported

Every NPV the engine prints comes from the canonical npv of engines/economics/cashflow.ts, with year-end flows discounted to the stated base year at the stated rate. The engine carries no discounting of its own, and the cash flow course owns the subject. On the Ekene carry with its compound uplift, at a discount rate of 0.100000 to 2027, EKO's NPV is 95024921.509253 (engine); a report quotes it with that rate and base year.

## Exercise

Open the agreement calculator on the view "A carry, its recovery and the NPV", which starts on the Ekene carry with its compound uplift. Read the four notes under the tables and match each to a row of the convention table above. Read the 2027 and 2028 uplift cells and say which convention sets each. Read the NPV table and write down the discount rate and base year from the box beside EKO's NPV. Then visit "Sole risk: the premium recovered from production" and "A default and forfeiture" and do the same for their notes.
