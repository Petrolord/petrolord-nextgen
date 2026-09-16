# Every design choice is visible

The module states its own doctrine in its header. Everything that is a design choice or a chart value is an input, with its customary range named. Everything computable from first principles is computed. That one rule decides which numbers you can see and which numbers you have to accept.

{{panel:fc-water-explorer}}

## What that makes an input

The circulation ratio is an input. So is the BTEX absorbed fraction, so are the glycol properties, so is the water overhead, and so is the contactor liquid. Each of them arrives with a default and each of them sits on the page where a reader can find it. None of them has to be dug out of the source.

That matters because the alternative is an engine that quietly holds a design choice and presents the consequence as a calculation. A number you can see is a number you can argue with. A number buried three files deep is a number that gets inherited for a decade without anyone asking where it came from.

## What that makes a constant

Some of the inputs have defaults that are themselves customary values. The glycol density is 9.300000 lb a gallon. The heat a pound of absorbed water takes in the still overhead is 1100.000000 Btu a lb. The customary circulation band runs from 2.000000 to 5.000000 gal per lb. The molecular weight the BTEX balance uses is 92.000000, which is one compound standing in for a four compound cut.

Every one of those is exported by name, so a reader can point at it rather than infer it from an answer. The module's own comment is honest about what that buys: a value with no publication behind it can be pinned so that changing it becomes a reviewed act, and pinning is not the same thing as proving it right.

## What that makes computed

The water content is computed. The load, the gallons, the gallons a minute, the two heat terms and the duty are computed. So is the vessel diameter and so is the cooling from a let-down. None of those takes a chart reading as an input, because every one of them follows from the conditions and the choices already on the page.

## The discipline this course is about

Three kinds of number sit in front of you on every answer. One the engine computed. One you chose. One it simply kept to itself, because the method has no way to reach it. Telling them apart is the whole skill. A circulation of 6.399830 gpm looks exactly like a computed result, and it is, but it is a computed result that hangs entirely off a 3.200000 that somebody typed.

## Exercise

List the five inputs this lesson names as design choices or chart values, then list four figures in an OBIAFU dehydration answer that are computed. For each computed figure, say which of the five inputs it would move with.
