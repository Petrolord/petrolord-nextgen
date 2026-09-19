# The load that will not fit

The last link in the chain is the station's tank. A tanker arrives with a full load, and the load has to go somewhere. If the tank has too little room, the driver waits, discharges part and takes the rest away, or the order was placed too late. The engine's `stationSizing` checks the fit at the moment the order is placed.

{{panel:supply-depot-explorer}}

## The tank's figures

The IBAFO forecourt's tank:

| input | value |
| --- | --- |
| capacity litres | 40000.00 |
| dead stock litres | 2500.00 |
| reorder at fraction of usable | 0.25 |
| delivery litres | 33000.00 |

Dead stock is the station's heel: the volume below the pump's suction that the station cannot sell. The engine computes:

usable = capacity less dead stock
reorder level = dead stock + usable x the reorder fraction
ullage at reorder = capacity less the reorder level

| item | value |
| --- | --- |
| usable tank litres | 37500.00 |
| cover days | 1.04 |
| reorder level litres | 11875.00 |
| ullage at reorder litres | 28125.00 |
| payload fits the ullage | false |

Litres print to two decimals. The engine also prints the station's cover days, 1.04.

## The warning

The reorder level is the stock at which the station orders. The ullage at that moment is the room the delivery must fit into, unless the station sells enough while the truck is on the road. The engine checks the delivery against it and warns in its own words:

> A 33000 litre load cannot discharge into 28125 litres of ullage at the reorder level. Order earlier or order a part load.

The warning is a plain statement of arithmetic the station controls. A reorder level that looks prudent, with 0.25 of the usable stock still in hand, leaves too little room for a full truck.

## The reorder fraction swept

| reorder at fraction of usable | reorder level litres | ullage at reorder litres | payload fits |
| --- | --- | --- | --- |
| 0.1 | 6250.00 | 33750.00 | true |
| 0.15 | 8125.00 | 31875.00 | false |
| 0.2 | 10000.00 | 30000.00 | false |
| 0.25 | 11875.00 | 28125.00 | false |

Of the four fractions swept, only 0.1 leaves room for a 33000.00 litre delivery. Every other row carries the warning with its own ullage figure. The engine prints no row between 0.1 and 0.15, so this course gives no fraction at which the delivery first fits.

## The tension the station has to manage

A lower reorder level makes room for the delivery. It also leaves less stock in hand while the truck is on the road, and the time a truck takes to arrive is a lane figure the station must know. The engine reports both sides and decides neither. The two remedies in the warning are the station's choices: order at a lower level and accept the risk of running dry, or order a part load and accept a higher cost per litre, because the lane's trip costs are then spread over fewer litres.

## The same problem at the depot

This is the ullage lesson from module three, one scale down. The depot needs ullage in the right tank when a cargo is due; the station needs ullage in its tank when a truck is due. In both places the room is counted in the tank the product goes into, and in both a full delivery into too little room is a planning failure made visible before the truck leaves.

## Exercise

Read the station tank's capacity, dead stock, reorder fraction and delivery, then its usable volume, reorder level and ullage at reorder. Quote the engine's warning. Then read the reorder fraction sweep, say which fraction lets the delivery fit, and describe what the station gives up by choosing it.
