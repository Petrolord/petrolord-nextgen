# Nameplate, days and utilisation

A gross margin per barrel says what one barrel earns. To turn that into a year, the screen needs to know how many barrels the plant actually runs, and that is three inputs multiplied together.

{{panel:refinery-screen-explorer}}

## The rule

The engine states it directly:

annual throughput = capacity x on-stream days x utilisation

For OKORDIA:

| input | OKORDIA |
| --- | --- |
| capacity | 5000 bpd |
| on-stream days | 330 |
| utilisation (firm supply) | 0.9200 |
| annual throughput | 1518000.00 bbl |

## Three separate reasons a plant runs less

Each input answers a different question, and keeping them apart is what makes the screen useful when someone asks why the plant runs fewer barrels than its nameplate suggests.

Capacity is nameplate: the barrels a day the plant was built to run. It is also the figure the capital was scaled to in the second module, which is why capital and throughput both start from it.

On-stream days are the days in a year the plant is running at all. The rest of the year it is shut: for planned maintenance, for inspections, for repairs. OKORDIA assumes 330. The engine accepts a figure between 1 and 366 and refuses anything outside that range, as the first module showed.

Utilisation is how hard the plant runs on the days it is running, as a fraction of nameplate. It is where the crude supply enters the screen. A plant with a reliable crude supply can run close to nameplate; a plant waiting on cargoes cannot. OKORDIA's firm supply sets it to 0.9200.

A plant can lose barrels to any one of the three, and the cure is different for each. A design shortfall needs capital. Downtime needs maintenance planning. Low utilisation, on this screen, needs crude.

## Nameplate every on-stream day

Set utilisation to 1 and the plant runs at nameplate on every on-stream day. The engine prints an annual throughput of 1650000.00 bbl for OKORDIA at utilisation 1. Quote it beside the firm supply case of 1518000.00 bbl whenever you want to show what the supply assumption does to the plant's year, because the two cases share capacity and on-stream days and differ in utilisation alone. The fifth module shows the utilisation the other two supply scenarios set.

## A blank term takes the engine's default

A schedule term left blank or left out reads as the engine's stated default for that term. With every schedule term left out, the OKORDIA plant prints an annual throughput of 1530000.00 bbl, and so does each case with on-stream days blank or utilisation blank alone. That figure belongs to the defaults. OKORDIA's own inputs give 1518000.00 bbl, so check that each term is typed before reading the throughput.

## Throughput is barrels of crude

The throughput is barrels of crude run through the plant in a year. The same unit carries through the rest of the screen: the slate is valued per barrel of crude, the crude cost is paid per barrel of crude, and the gross margin is per barrel of crude. So the per barrel figures and the annual throughput share one unit, and no conversion sits between them.

## The mistake

Reading capacity as throughput. A 5000 bpd plant does not run 5000 bpd for a year. OKORDIA's annual throughput of 1518000.00 bbl already carries its 330 on-stream days and its utilisation of 0.9200. Any calculation that multiplies nameplate by a full year has assumed both are perfect.

## Exercise

Read OKORDIA's annual throughput under firm supply and at utilisation 1. Quote both figures with the inputs that produced them. Then say which one input differs between the two cases, and what that input represents about the plant's year.
