# Production beyond the licence

{{panel:prms-reserves-calculator}}

A company can only produce what it has the right to produce. A licence or lease runs to a stated expiry, and a forecast often runs past it. Barrels produced after the right to operate ends are not the company's Reserves unless the right is expected to continue. The engine applies that before any cash flow is run: when no renewal is expected, the years after the stated expiry are cut and their barrels reported as beyond the licence.

## The rule and its sources

The engine's basis, verbatim:

> PRMS 3.1.1.1(5), 3.1.3.1; FAQ 4.4

PRMS 3.3.3.2, which answer 4.4 of the PRMS FAQs cites, keeps quantities produced after the current agreement expires out of Reserves unless an extension is reasonably expected, and places them in Contingent Resources. The course cites those texts by section and answer number only.

A public text says the same for US filers, and the course quotes it. Regulation S-X Rule 4-10 (the eCFR current at 2026-09-01, public domain) ends proved reserves at the expiry of the right to operate:

> "prior to the time at which contracts providing the right to operate expire, unless evidence indicates that renewal is reasonably certain," (17 CFR 210.4-10(a)(22))

## On EKN-1

The Ekene petroleum mining lease (synthetic) is stated to expire in 2040 with no renewal expected. Every forecast runs to 2041, so each loses its last year to the licence:

| case | forecast | licence cut | oil beyond the licence |
| --- | --- | --- | --- |
| low | 2027 to 2041 | 2040 | 98956.000000 |
| best | 2027 to 2041 | 2040 | 308309.000000 |
| high | 2027 to 2041 | 2040 | 601257.000000 |

The engine's reason on the low case, verbatim:

> low case: forecast 2027 to 2041, cut at the licence expiry 2040 (no renewal expected); economic limit 2033 (7 trailing years cut); undiscounted net cash flow 156927914.66 at 100%: economic (PRMS 3.1.2.1: above 0); within the limit 8890704 bbl oil and 7112563 Mscf gas gross

The cut comes first. The economic limit of the low case falls in 2033, well before the expiry, so the licence and the limit remove different years: the licence takes 2041, and the limit takes the 7 years after 2033, which stop paying. For the high case the licence is what stops it: its limit is 2040, the expiry year itself.

## Reported, and classified nowhere

The engine reports the barrels beyond the licence and puts none of them in a class. The standard places them in Contingent Resources; the engine's call covers one Reserves project, and it leaves the Contingent quantity for the estimator to state as a project of its own. The oil beyond the licence is reported gross, before any basis is applied.

## The expiry year is kept

The licence year itself is inside the licence. The cut removes the years after it, and the expiry year produces as the forecast says.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". Read the licence cut and the oil beyond the licence of each case.
2. Read the high case's economic limit and trailing years cut. Say which of the two, the licence or the limit, stops the high case.
3. Set "Licence expiry year (stated)" to 2037. Read the licence cut, the economic limit and the oil beyond the licence of the best case.
4. Set "Licence expiry year (stated)" to 2041 and read the licence cut column.
