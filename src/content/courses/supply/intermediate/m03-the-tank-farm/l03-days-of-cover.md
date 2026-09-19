# Days of cover

A depot manager's first question each morning is how long the stock will last. The engine answers it as days of cover, and the answer is only as good as the two figures it divides: the pumpable stock and the daily throughput.

{{panel:supply-depot-explorer}}

## The definition

`tankFarmCover` computes:

days of cover = pumpable stock / daily throughput

For IBAFO:

| the farm | value |
| --- | --- |
| pumpable stock m3 | 10123.000 |
| daily throughput (liftings) m3 | 2640.000 |
| days of cover | 3.8345 |

Days of cover prints to four decimals. The daily throughput here is the depot's liftings, the volume loaded out to trucks in a day. It is an input the caller supplies, and with none the engine gives days of cover none and turns a year none. The engine does not infer it from the rack, and the rack's 216 trucks a day is a count of trucks, whose loads the rack model does not carry.

## What the figure means

A cover of 3.8345 days says that if liftings continue at 2640.000 m3 a day and nothing arrives, the pumpable stock runs out after that many days. It is a clock that starts now and assumes the rate holds.

Three assumptions sit inside it and each deserves a sentence in any report that quotes it.

The first is that the numerator is pumpable stock. The engine uses the tank-by-tank figure. A cover built on the farm's stock less its heel, or on the raw stock, would describe product that cannot all be lifted. The engine does not print a cover for either of those figures, and this course gives none.

The second is that the whole farm is one pool. IBAFO holds petrol, gas oil and kerosene. The farm's days of cover divides all three together by all liftings together. A depot that runs short of petrol while it still holds plenty of gas oil has run out of cover for petrol, and the farm figure will not show it. The engine's farm figure is a farm figure. A product's cover needs that product's tanks and that product's liftings.

The third is that the rate holds. A depot's liftings vary by day of the week and by season, and a cover quoted against an average day will be wrong on a busy one.

## Why the numerator is where errors hide

Of the two inputs, the stock is the one this course has traced to the tanks. The pumpable figure built on it holds only when the heels have been taken off tank by tank. On a morning like this one, with IB-T2 below its heel, the difference between methods moves the numerator, and every day of cover inherits it.

## Cover and the queue

Days of cover and the rack's queue are two faces of one depot. The rack decides how fast product can leave. The farm decides how long there is product to send. A depot can have ample cover and a long queue, or a short queue and little cover. Each is its own figure, from its own engine call, and neither should be read into the other.

## Exercise

Read IBAFO's pumpable stock, daily throughput and days of cover. Say what the cover figure assumes about liftings and receipts. Then say why the engine divides the pumpable stock and not the farm's stock, and why the farm's days of cover cannot tell you how long the petrol alone will last.
