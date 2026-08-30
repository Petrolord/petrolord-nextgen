# The connection is the weak point

A string is not made of pipe. It is made of pipe and threads.

{{panel:ct-rating-explorer}}

## The idea

Casing arrives in joints of around 12 m and is screwed together as it is run. Every joint has two connections, and the string is only as strong as the weakest of them.

A threaded connection removes metal from the pipe wall to cut the thread, and it transfers load through a helical surface rather than straight down the axis. Both of those cost strength.

## How this engine treats it

As a single efficiency, a fraction of the pipe body yield:

    joint strength = efficiency x pipe body yield

with the efficiency read from a small table.

| connection | efficiency |
|---|---|
| BTC, buttress thread and coupling | 1.0 |
| LTC, long thread and coupling | 0.85 |
| STC, short thread and coupling | 0.75 |
| Premium, metal to metal seal | 1.0 |
| EUE, external upset tubing | 1.0 |
| NUE, non-upset tubing | 0.75 |

## What those numbers mean

Buttress and premium connections are designed so that the pipe body yields before the connection does, so the efficiency is 1 by design. Short thread connections give up a quarter of the pipe body strength, and long thread ones about fifteen percent.

## Worked

The 9-5/8 inch 53.5 lb/ft joint at L-80 has a pipe body yield of 5532336.7585479375 N.

On a buttress connection the joint strength is the same number. On a long thread connection it is 4702486.244765741 N, and 830 kN of the pipe you bought has become unavailable because of the thread on the end of it.

## The health warning the catalog itself carries

These are nominal planning-level efficiencies, and the catalog says so in its own comment. They are for screening. A real design verifies against the connection manufacturer's data sheet, which will also give a separate compression rating, a bending rating and a sealing pressure that no efficiency captures.

## The other thing a connection does

It seals. A connection can have plenty of tensile strength and still leak, and leak resistance is a different rating that this engine does not carry at all.

## Exercise

Take the 9-5/8 inch 47 lb/ft joint at P-110, pipe body yield 6641014.317138594 N.

Compute its joint strength on a long thread connection and on a short thread one. Then say which of the two connections would still be stronger than a 53.5 lb/ft L-80 joint on buttress.
