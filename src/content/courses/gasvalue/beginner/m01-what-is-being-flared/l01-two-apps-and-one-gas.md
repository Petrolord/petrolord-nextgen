# Two apps and one gas

This course follows a gas from the laboratory sheet that describes it to the flare that burns it, and later to the products it could become. Two studios carry that work, and each one calls a single engine module. This first lesson names them, says what each exports and marks out the part this tier uses.

## The two studios

The Flare Gas to Value Studio calls flareToValue. The LPG & CNG Rollout Studio calls lpgCng.

Neither module works alone. lpgCng calls the loading-rack queue in terminalDepot for its carousel and forecourt, the gas Z factor in production/gasProperties and the compressor train in facilities/compression. flareToValue scales capital with the power law in modularRefinery.

The counts below are measured from the modules themselves:

| module | exported functions | exported constants and tables |
| --- | --- | --- |
| flareToValue | 7 | 8 |
| lpgCng | 10 | 9 |

## Each question has one function

The two studios answer a fixed list of questions, and each question has one function that answers it:

| question | function |
| --- | --- |
| what is in this gas, and how much liquid could it give | characteriseGas |
| which way of selling it does the gas allow | screenRoute against a route's requirement envelope |
| what does a route make, earn and cost in a year | routeEconomics |
| what does the flare emit, and what does recovering it abate | abatement |
| does the project need carbon credits to clear its hurdle | creditSensitivity |
| how do the routes compare in a bid | compareRoutes |

The rest of the list belongs to lpgCng: the LPG vessel and its reorder, the vaporizer, the carousel, the cylinders, the gas in a CNG bank, the cascade, the station compressor and forecourt, and whether a customer saves by switching fuel. Those questions wait for the Expert tier.

## The part this tier uses

The Associate tier stays inside flareToValue and calls two of its seven functions.

The first is characteriseGas. It answers the first question in the table: what is in this gas, and how much liquid could it give. Modules one to three of this tier read its answers, from the sheet sum through the heating value, the carbon and the mass to the liquids.

The second is abatement. Its question has two halves: what the flare emits, and what recovering it abates. Modules four and five read the first half, the flare's CO2, methane and CO2e. The second half is read in the Professional tier.

## The gases on the page

Three gases carry this tier.

EGBEMA is a flow station in Imo State flaring associated gas. OGUTA is a lean non-associated gas read beside it. The third is the Flare Gas to Value Studio's own opening gas, the studio's own opening example, read beside the invented cases.

Every analysis, efficiency, GWP and price in this course is invented and illustrative. Egbema and Oguta are real places, and the records attached to them are not. No figure here is a published analysis, a measured flare or a regulation. The component heating values and liquid densities are the engine's own labelled typical tables.

The flare is also a line in an emissions inventory. That inventory is taught in the Carbon & Energy Efficiency course, `carbon`.

## Exercise

Read the export table: flareToValue exports 7 functions and 8 constants and tables, and lpgCng exports 10 functions and 9 constants and tables. Name the two flareToValue functions this tier uses and the question each answers, and name the three modules lpgCng calls and what it calls each one for.

Self check: characteriseGas answers what is in this gas, and how much liquid could it give. abatement answers what the flare emits, and what recovering it abates. lpgCng calls terminalDepot's loading-rack queue for its carousel and forecourt, production/gasProperties for the gas Z factor and facilities/compression for the compressor train.
