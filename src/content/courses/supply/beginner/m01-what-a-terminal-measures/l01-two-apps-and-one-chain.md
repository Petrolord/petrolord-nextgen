# Two apps and one chain

## What this course is about

A fuel terminal is a place where product arrives, sits in tanks and leaves again, and every step is settled in volumes. This course teaches how each of those figures is formed, and it holds one idea above the others. A terminal's stock, a cargo's cost and a litre's pump price are each a chain of measured inputs walked in a stated order. Where nobody measured a link, the engine refuses the call or names the gap instead of assuming a value, because a figure that cannot come out wrong proves nothing.

## Two modules behind the apps

Two engine modules sit behind the course. The counts below are measured from the modules themselves.

| module | exported functions | exported constants |
| --- | --- | --- |
| terminalDepot | 8 | 0 |
| fuelPricing | 9 | 8 |

Each module exports its rules as functions and its fixed data as constants. Each module lists the names behind each count on a line of their own, the functions apart from the constants, so every count above can be checked name by name. terminalDepot owns the tank and the depot. Five of its functions carry this whole tier: volumeAtDip, dipToStandardVolume, volumeCorrectionFactor, reconcileStock and trendUnaccounted. It exports no constants, so no strapping table, no correction coefficient and no opening stock lives inside it. Each of those arrives from the terminal that owns the tank.

fuelPricing owns the cargo and the price. Among its constants are two conversions, LITRES_PER_M3 at 1000 and M3_PER_BBL at 0.158987294928, and two templates of line items whose rates are all absent. The Expert tier walks those templates.

## Three invented places

The course runs on three invented records. AKODO is a coastal import terminal with three tanks, their strapping tables, a morning of dips and one day. IBAFO is an inland depot with a loading rack, a tank farm, a truck lane, a fleet and a forecourt. BADAGRY is one petrol cargo landed and priced to the nozzle. None of them is a real site, and every rate and coefficient attached to them is invented for this course. This tier stays at AKODO.

## The chain at AKODO

The Associate chain has six links, taken in order by the modules of this tier.

- A dip is a tape reading of the liquid height in a tank, in whole millimetres.
- A strapping table turns that height into a volume.
- Free water under the product is read through the same table and taken off, which leaves the gross observed volume.
- A volume correction factor turns the gross observed volume into a volume at standard conditions.
- The day closes: opening stock plus receipts, less deliveries and known losses, gives an expected closing stock, and the dip is judged against it.
- Many days of gaps are summed and read for a direction.

Each link has an input the engine never guesses.

## Where this course stops

A cargo's quality, meaning its assay and its blend, belongs to the sibling course `crude`. Plans, schedules and a refinery's margin belong to `refinery`. No lesson here values a project.

## Exercise

Read the two rows of the module table above. Say what the 0 in terminalDepot's constants column tells you about where a strapping table and an opening stock must come from.

Self check: terminalDepot exports its rules and no fixed data, so every table, coefficient and opening stock is an input supplied by the terminal.
