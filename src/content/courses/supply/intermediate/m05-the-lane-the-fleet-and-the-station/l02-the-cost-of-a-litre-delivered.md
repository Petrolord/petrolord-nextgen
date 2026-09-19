# The cost of a litre delivered

The cycle says how often a truck goes. The cost side says what each trip costs and how many litres arrive to carry that cost. The engine's answer is a cost per litre delivered, and its denominator is the part most often got wrong.

{{panel:supply-depot-explorer}}

## The costs of a trip

Money on the lane is in naira, and every cost here is invented for this course. None is a market rate for haulage, fuel or labour. The IBAFO lane's cost of a trip, line by line:

| line | naira a trip |
| --- | --- |
| Diesel | 278553.60 |
| Driver | 58000.00 |
| Maintenance and tyres | 40560.00 |
| Tolls and levies | 21000.00 |
| Overhead | 37500.00 |
| Truck depreciation | 60217.39 |
| cost a trip | 495830.99 |

The first five lines are costs a trip incurs by running: fuel burned, a driver paid, tyres worn, tolls paid, a share of the office. The last one is different. Truck depreciation is the truck's capital spread over the trips a year the cycle allows, 199.2780 for this lane, so a lane that allows fewer trips a year loads more capital onto each one.

## The litres that arrive

The engine divides the cost of a trip by the litres delivered after the transit loss. The IBAFO lane's payload is 33000.00 litres and its transit loss is 0.3 percent:

| item | value |
| --- | --- |
| litres delivered a trip | 32901.00 |
| cost per litre delivered, naira | 15.0704 |

Local currency per litre prints to four decimals. The denominator is the delivered volume. In the engine's own formula, cost per litre delivered = cost per trip / the litres delivered after the transit loss. A cost per litre computed on the loaded payload would spread the same cost over litres the station never receives. The engine prints no such figure, and this course gives none.

## Distance and cost

| distance km | cost a trip, naira | cost per litre delivered, naira |
| --- | --- | --- |
| 156.00 | 313665.50 | 9.5336 |
| 312.00 | 495830.99 | 15.0704 |
| 468.00 | 677996.49 | 20.6072 |

The engine prints every cost line at each distance, naira a trip:

| distance km | Diesel | Driver | Maintenance and tyres | Tolls and levies | Overhead | Truck depreciation |
| --- | --- | --- | --- | --- | --- | --- |
| 156.00 | 139276.80 | 58000.00 | 20280.00 | 21000.00 | 37500.00 | 37608.70 |
| 312.00 | 278553.60 | 58000.00 | 40560.00 | 21000.00 | 37500.00 | 60217.39 |
| 468.00 | 417830.40 | 58000.00 | 60840.00 | 21000.00 | 37500.00 | 82826.09 |

Read across the columns. Driver, Tolls and levies and Overhead print the same at all three distances. Diesel, Maintenance and tyres and Truck depreciation print a different figure at each. Quote each distance with its own lines and its own cost. The engine prints no cost for any distance between these three, and a reader should not draw a line through them and read off a fourth.

## The carbon line

The lane also reports its diesel:

| item | value |
| --- | --- |
| diesel litres a trip | 224.64 |
| kg CO2e a trip | none |

with the engine's note:

> No diesel emission factor supplied, so the carbon figure is absent rather than zero.

This is the rule module four taught for the depot's losses, applied to the truck's fuel. The engine ships no factor. The diesel volume is computed; its emissions wait for a factor with a source.

## What the figure is for

A cost per litre delivered is the transport element of a pump price, the cost of moving a litre from the depot gate to a station. The Expert tier builds a pump price from elements of this kind. Here it is a lane's cost, and it depends on every input above: a longer cycle, a heavier transit loss or a more expensive truck each moves it.

The figure also shows the lane's sensitivity to the queue. The queue hours sit inside the cycle, the cycle sets the trips a year, and the trips a year set the depreciation a trip. A depot that makes trucks wait passes part of that wait into every litre it sells.

## Exercise

Read the six cost lines and the cost a trip for the IBAFO lane, then the litres delivered and the cost per litre delivered. Say which line depends on the trips a year, why the denominator is the litres delivered after the transit loss, and what the engine prints for the lane's carbon and why.
