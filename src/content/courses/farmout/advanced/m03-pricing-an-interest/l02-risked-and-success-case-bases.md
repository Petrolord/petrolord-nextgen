# Risked and success-case bases

{{panel:farmout-valuation-calculator}}

The engine computes two values per percent for every working interest, and the call states which one values the working interest. The two answer different questions, and on an exploration prospect they are far apart.

## The two bases

The risked basis is the EMV of the 100 percent position divided by 100. It weighs the success and the dry hole by the stated chance of success. The success-case basis is the success-case value less the success well cost, divided by 100. It assumes the well succeeds.

On the Ekene Deep prospect (synthetic), for 30.000000 percent (engine):

| golden case | basis (stated) | risked per percent | success case per percent | value of the interest |
| --- | --- | --- | --- | --- |
| interest-ekene-risked | risked | 263125.842605 | 2252503.370418 | 7893775.278136 |
| interest-ekene-success-case | success-case | 263125.842605 | 2252503.370418 | 67575101.112542 |

Both per-percent figures are the same in both rows: the engine computes both every time. Only the value of the working interest follows the stated basis. On the success-case basis 30.000000 percent is worth 67575101.112542; on the risked basis, 7893775.278136.

## When each basis fits

The risked basis prices a working interest before the well is drilled, when the dry hole is still possible. The success-case basis describes what the working interest would be worth once a discovery is made and before development spending. HMRC's manual makes the same point about valuing a right to future benefits:

> "The value of the right will need to reflect the degree of probability that future benefits will accrue as well as their extent" (HMRC Oil Taxation Manual OT30131)

The risked basis reflects the probability; the success-case basis reflects the extent alone. A report that quotes a value per percent names its basis every time.

## When the two coincide

On a producing interest there is no dry hole. The golden case interest-production-metric states a chance of success of 100 and a well cost of 0 on a success, so both per-percent figures print 800000.000000 and the 20.000000 percent interest is worth 16000000.000000 (engine). The reason says so:

> 100% position: success 80000000 (success-case value 80000000 less the success well cost 0), dry hole 0; risked EMV at 100% 80000000

## The basis is a stated input

The engine holds no basis of its own. A call with a basis it does not accept is refused:

> valueBasis must be one of "risked", "success-case"; got "unrisked"

A call with no basis at all is refused as well:

> valueBasis must be one of "risked", "success-case"; got nothing

## Choosing the basis for a report

The two bases differ on Ekene Deep by a factor that comes entirely from the chance of success and the dry-hole cost. A success-case figure quoted for an undrilled prospect assumes the risk away. The engine prints both, and the basis stated in the call decides which one values the working interest.

## Exercise

Open the valuation calculator on the view "A price for a working interest" and start from "The Ekene Deep price, risked". Read the two per-percent tiles and the value of the working interest. Set "Value basis (stated)" to the success case and read the three tiles again; say which moved. Raise "Chance of success, percent (stated)" to 100 and read how far apart the two per-percent tiles are then. Start from "A producing interest priced per flowing unit" and explain from its box why the two bases agree. Finally clear the value basis control and read the refusal.
