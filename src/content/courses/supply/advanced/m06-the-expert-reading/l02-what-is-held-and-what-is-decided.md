# What is held and what is decided

Every engine has limits. The useful question is whether they are written down. This lesson reads the two limits the engines repository holds for this course's two modules, and the rules the engines keep, each stated with a figure or a refusal the course prints.

{{panel:supply-price-explorer}}

## The two held items

A held item is a limit the engines repository records and does not resolve. The course teaches both as limits. Neither is graded.

**H1.** The charges levied at discharge, the jetty and storage lines, are billed on the bill-of-lading quantity. Whether a terminal bills on the bill of lading or on the outturn is a contract term the engine does not know. On BADAGRY the jetty line is 54927.30 USD and the storage line 121297.79 USD, each on 45772.752 m3, where the outturn is 45566.774 m3. The course quotes both quantities and computes neither line on the outturn.

**H2.** The volume correction coefficient tables and every published rate stay unshipped. `volumeCorrectionFactor` refuses without coefficients, and every template rate is absent: `IMPORT_TEMPLATE` ships 9 of 9 rates as none and `PUMP_TEMPLATE` 7 of 7. That is why every rate in this tier is invented and says so, and why every stock in the Associate tier is corrected with a VCF read off a terminal's own invented tables.

H2 is a limit, and it is also a decision. A library that shipped a duty, a levy or a coefficient table would be quoting authority it cannot keep current. The engine leaves the rate column empty and refuses or labels what depends on it.

## The rules the engines keep

Each of these is a rule in force at the engines' current version.

| the rule | where the course prints it |
| --- | --- |
| A day is not closed without its opening stock. | REFUSED: No opening stock, so the day cannot be closed. The opening stock is yesterday's closing dip. |
| A dip below a table that does not start at the empty tank is refused, and so is a negative dip. | the partial calibration and the AK-01 sweep |
| A water cut the table cannot convert is refused, and so is water above the product dip. | the AK-02 water sweep and the partial calibration |
| Bays are a whole number, one or more. | 2.5 bays reads "The number of bays must be a whole number, one or more." |
| Pumpable stock is counted tank by tank. | IB-T1 and IB-T2 together hold 5453.100 m3 over a combined heel of 420.000 m3, and their pumpable stock is 5078.400 m3. |
| A loss with no density has no weight and no emissions, and the carbon note says why. | the IBAFO carbon ledger |
| Insurance quoted on CIF is solved in closed form. | CIF 24331931.09 USD on the BADAGRY cargo |
| A freight-stage charge on C&F or CIF, and a charge with an unknown stage, are refused. | the BADAGRY walk's refusals |
| A blank trucking cost is missing and named, and a cost left out of the call takes its stated default. | the IBAFO lane |
| An opening stock derived from the day's own closing dip balances every day and measures nothing. | the AKODO demonstration |

## Three rows read closely

The tank-by-tank row carries the most figures. IB-T1 and IB-T2 together hold 5453.100 m3 over a combined heel of 420.000 m3, and the engine reports their pumpable stock as 5078.400 m3. Netting the pair's stock against the pair's heel is the reading the engine does not use, because no pump lends one tank's volume to another's heel.

The insurance row carries a dollar figure, CIF 24331931.09 USD, and it is a rule about solving a quote exactly. It is bounded: insurance rates on CIF that add up to 100 percent or more are refused.

The bay row quotes the engine's own sentence for 2.5 bays. A fractional bay is an input the engine cannot build a queue from, so it refuses.

## Reading the table as one idea

Read together, the rows are the course's one sentence applied to different inputs. An opening stock, a strapping entry, a water cut, a bay count, a density, a rate and a stage are each a measured or stated link, and the engine refuses or names the link nobody supplied. The last rule is the reason the first exists. A figure built so that it cannot come out wrong, like a reconciliation whose opening stock is taken from its own closing dip, proves nothing, and the engine's answer to that is to make the opening stock an input.

## Exercise

State H1 and H2 in a sentence each, and record the two quantities H1 turns on and the counts H2 gives for the two templates. Then record the three volumes the tank-by-tank rule prints for IB-T1 and IB-T2. Say what those three volumes, read together, show about why pumpable stock is counted tank by tank.
