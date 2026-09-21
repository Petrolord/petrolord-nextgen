# Individual risk at a place

{{panel:qr-event-tree}}

An event tree says how often each outcome happens. It does not yet say anything about a place. Location-specific individual risk, LSIR, joins the two: it is the individual risk of a person present at one place all the time, outdoors and unprotected, and it is the sum over scenarios of the scenario frequency times the probability of death at that place. The engine's model string, verbatim: "LSIR = sum f_i x Pd_i, a person present at the location all the time, outdoors and unprotected".

## EREMOR's outcomes and places

EREMOR runs the flammable release tree and the pool fire from the overfill tree against three places. Each outcome has a stated probability of death at each place, supplied as an input from the consequence course.

| frequency per year | outcome | Pd, process deck | Pd, control room | Pd, accommodation |
| --- | --- | --- | --- | --- |
| 0.000050000000 | jet or pool fire | 0.5 | 0.02 | 0 |
| 0.000081000000 | flash fire | 1 | 0 | 0 |
| 0.000054000000 | explosion | 0.7 | 0.1 | 0.002 |
| 0.000014500000 | pool fire | 0.3 | 0.01 | 0 |

The frequencies are the same in every column. Only the stated probability of death changes from place to place, because each place stands at its own distance and direction from each outcome.

## Three places, three answers

| LSIR per year | place | largest contribution | its fraction |
| --- | --- | --- | --- |
| 0.000148150000 | process deck | flash fire | 0.546743 |
| 0.000006545000 | control room | explosion | 0.825057 |
| 0.000000108000 | accommodation | explosion | 1.000000 |

The process deck carries the highest LSIR, and more than half of it comes from the flash fire, because the deck sits inside the flammable cloud where the stated Pd is 1. The control room is dominated by the explosion, which carries a stated Pd of 0.1 there while the flash fire carries none. Its LSIR is far below the deck's because every stated Pd there is small. At the accommodation only the explosion reaches at all, with a stated Pd of 0.002, so the explosion is the whole of its LSIR.

## An LSIR belongs to the place

Notice what an LSIR does not need: a name, a roster or a working pattern. It is a property of the place, computed as if someone stood there every hour of the year in the open. That is deliberate. It lets a plot plan be marked with individual risk at every point before anyone decides who will work where, and it gives one number per place that every person who visits it shares.

The next module turns place into person. For now, read an LSIR as the individual risk a place imposes on anyone who stays there.

## Zero contributes zero

A scenario whose probability of death is zero at a place contributes zero there. The flash fire at the control room, which lies outside the flammable cloud, adds 0.000000000000. The engine still lists it, so a reviewer can see that the scenario was considered and found not to reach.

## Exercise

At the accommodation only the explosion has a nonzero stated probability of death. Multiply the explosion frequency, 0.000054000000 per year, by the stated Pd of 0.002 and write the result to twelve decimals. Check it against the accommodation LSIR in the table, and say why its fraction is 1.000000.
