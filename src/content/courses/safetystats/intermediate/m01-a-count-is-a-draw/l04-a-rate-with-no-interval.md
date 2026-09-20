# A rate with no interval beside it

{{panel:ss-intervals-explorer}}

Two published figures, printed the way a monthly report usually prints them:

| figure as printed | what sits underneath | 95 percent interval |
| --- | --- | --- |
| 2.000000 per 200,000 hours | 1 event in 100000 hours | 0.050636 to 11.143287 |
| 2.000000 per 200,000 hours | 100 events in 10000000 hours | 1.627280 to 2.432536 |
| observed FAR 0.769438 | 32 fatalities in 4158877000 hours | 0.526295 to 1.086218 |

The first two lines of any report would read identically. Only the last column tells the reader which one to believe.

## What the bare figure hides

A rate printed alone hides which row of the IMO ladder it came from. At 1 event the true rate could sit anywhere from 0.050636 to 11.143287 per 200,000 hours. At 100 events it sits between 1.627280 and 2.432536. A reader handed only 2.000000 will treat both the same way, and one of those treatments will be badly wrong.

## Why reports leave it out

The interval is usually left out for reasons of habit. A league table of rates is easy to sort. A rate that carries two more numbers beside it looks less decisive. Those are reasons of presentation. None of them changes what the count can support, and a report that drops the interval passes its uncertainty to the reader without telling them.

## An example from the Associate tier

The day crew in the Associate headcount lesson logged 1 recordable in 80000 hours and read 2.500000 per 200,000 hours. That is a one event rate. Its interval sits in the same family as the first row of the ladder, and it will be very wide. The engine can compute it in a moment. What it cannot do is add it to a report whose author did not ask.

## The IOGP figure shows the other end

IOGP's 2024 observed FAR of 0.769438 rests on 32 fatalities. Its interval runs from 0.526295 to 1.086218, a range a reader can work with, because 32 is a respectable count. A reader who sees the interval knows this at once. A reader who sees only 0.769438 has to take it on trust.

## What to ask for when it is missing

When a report hands you a bare rate, ask for the count and the hours behind it. With those two numbers and the base you can run the interval yourself in the explorer, and the interval will tell you which row of the ladder the figure really came from. A rate on 1 event and a rate on 100 events deserve very different responses, and only the count underneath can tell you which one you are holding. The rest of this tier builds the tools for that question.

## Exercise

Open the intervals explorer and enter the day crew's 1 recordable in 80000 hours on the 200,000 base at confidence 0.95. Record both limits beside its observed 2.500000. Then write one line for a monthly report that carries the rate, the count, the hours and the interval, and compare its width with the first ladder row's 0.050636 to 11.143287.
