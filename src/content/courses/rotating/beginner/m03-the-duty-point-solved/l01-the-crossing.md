# The crossing

Two curves, one falling and one rising, cross at exactly one flow. That flow is the duty point, and it is the number the rest of this tier hangs off.

{{panel:fc-pump-explorer}}

## Seeing it before solving it

Read both OKONO curves at the same flows and subtract:

| flow gpm | pump head ft | system head ft | pump less system ft |
| --- | --- | --- | --- |
| 0.000000 | 540.203016 | 210.000000 | 330.203016 |
| 300.000000 | 533.062177 | 222.272727 | 310.789450 |
| 600.000000 | 511.406569 | 259.090909 | 252.315660 |
| 900.000000 | 475.236191 | 320.454545 | 154.781645 |
| 1200.000000 | 424.551043 | 406.363636 | 18.187407 |
| 1500.000000 | 359.351126 | 516.818182 | -157.467056 |
| 1800.000000 | 279.636439 | 651.818182 | -372.181743 |

The last column starts positive and ends negative. At low flow the pump makes far more head than the station demands, and the surplus drives the flow up. At high flow the station demands more than the pump can make, and the flow falls back. Somewhere between 1200.000000 gpm and 1500.000000 gpm that column passes through zero, and that is the only flow at which the machine and the piping agree.

## The solved answer

The engine solves it at 1234.452969 gpm and 417.801018 ft.

Check the agreement at that flow. The pump makes 417.801018 ft and the system demands 417.801018 ft, and the difference between them is 0 ft. That is what solved means here. It is not a flow somebody chose and it is not a reading off either curve. It is the one flow where both descriptions hold at once.

## One crossing, and only one

There is exactly one such flow, and the two shapes guarantee it. The pump head falls from its shutoff value as the flow rises, and the system head climbs from its static value as the flow rises, so the gap between them shrinks steadily and changes sign once. A falling curve and a rising curve that start apart can meet only once, which is why the engine can go looking for a single answer rather than for a set of them.

That also explains one of the refusals further into this module. If the station demands more head at zero flow than the pump makes at shutoff, the gap never starts positive and there is nothing to find.

## Why it has to be solved

Neither curve can be rearranged to give the answer directly in a form worth relying on, so the engine searches for it. The next two lessons are about that search and about what it reports when it finishes.

What matters first is the shape of the situation. A duty point is a property of a pump and a station together. Change the piping, the static head or the friction and it moves, which is why a catalogue can never print it.

## The mistake

Calling the crossing the pump's rated flow. The OKONO machine will sit at 1234.452969 gpm in this station and somewhere else entirely in another one. The rating belongs to the curve. The duty belongs to the installation.

## Exercise

Using the table above, name the two flows the crossing lies between and say how you know. Then give the solved duty flow and head, and say what the pump head less the system head comes to at that flow.
