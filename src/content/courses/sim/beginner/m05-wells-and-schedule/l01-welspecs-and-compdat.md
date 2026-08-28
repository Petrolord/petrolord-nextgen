# WELSPECS and COMPDAT

A well enters a deck in two steps. First you declare it exists and where its head is. Then you say which cells it is open to. Those are two keywords and they answer two different questions.

## WELSPECS: the well exists

One record per well, giving the name, the group it belongs to, the I and J of its head cell, and a reference depth for its bottom-hole pressure.

The reference depth matters more than it looks. A simulator reports and controls bottom-hole pressure AT that depth, so two wells with the same downhole conditions and different reference depths report different pressures. Ekene's wells use the mid-depth of their own column.

## COMPDAT: the well is open here

One record per CONNECTION, which is one cell the well is completed in. The record carries the cell indices, whether the connection is open or shut, the wellbore radius, and the direction the well passes through the cell.

Ekene's six vertical wells are each completed through all five layers:

$$k_1 = 1, \qquad k_2 = 5 \qquad \Rightarrow \qquad 5 \text{ connections per well}$$

with a wellbore radius of 0.35 ft. Six wells at five connections each is thirty records, plus the side-track's eleven.

{{panel:sim-deck-explorer}}

Open SCHEDULE and find WELSPECS and COMPDAT. Count the records in each and confirm the first has one line per well and the second has one line per completed cell.

## Why two keywords

Because a well and its completions change on different timescales. A well is drilled once; it is perforated, re-perforated, squeezed and re-completed many times. Splitting the declaration from the completions lets a deck open and shut intervals through the run without redeclaring the well.

It also means a well can exist with no open connections, which is what a shut-in well is.

## The connection is where the physics happens

A simulator does not model a wellbore. It models cells, and a connection is a term coupling one cell to a well's pressure. The strength of that coupling is the well index, computed from the cell's permeability, its size, the wellbore radius and the direction the well crosses it.

That is why the direction flag exists and why the wellbore radius appears here rather than in WELSPECS: both are properties of how this well meets THIS cell.

## What five connections means

Ekene's producers are open to the whole column, so all five layers can flow to them. That is a completion decision, and it is the one that makes the waterflood course's layered sweep relevant: the fast layer and the slow layers all report to the same well, so the well produces their mixture.

A well completed only in layers 1 and 2 would be a different well in the same deck, and the sweep it sees would be different. Completions are a design lever, not a description.

## Ordering

COMPDAT records are read in order and the first connection listed is conventionally the top one. For a vertical well the order is obvious. For the deviated side-track it is the order the trajectory crossed the cells, which is the order the intersection engine returned, and the Expert tier takes that up.

## The misconception to avoid

"COMPDAT describes the perforations." It describes the cells the well is coupled to, which is a model construct. A 30 ft perforated interval inside a 7 ft layer is one connection, and a well perforated over two feet at the top of a layer is also one connection with the same well index. The model cannot see the difference, and if that difference matters you need a finer grid, not a cleverer COMPDAT.

## Exercise

First, count the total COMPDAT records this deck needs for its six vertical wells, and state what the count would become if the producers were completed only in layers 1 to 3.

Second, explain in two sentences why the wellbore radius sits in COMPDAT rather than in WELSPECS.
