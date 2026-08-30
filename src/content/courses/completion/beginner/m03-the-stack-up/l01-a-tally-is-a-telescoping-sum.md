# A tally is a telescoping sum

The arithmetic of a completion tally, in one sentence, and everything that follows from it.

{{panel:cd-string-explorer}}

## The sentence

Each component starts where the one above it stopped.

That is the whole calculation. The top of the first component is the hanger depth. The bottom of each component is its top plus its length. The top of the next one is that bottom.

## Why it is called telescoping

Write out the sum of all the lengths and then write out the bottom depth of the last component. They are the same number, because every intermediate depth appears once as a bottom and once as a top and cancels.

The bottom of the string is the hanger depth plus the sum of the lengths, and nothing else in the tally can change it. That is a useful check to have: if the last bottom depth does not equal the sum of the lengths plus the hanger, the tally has been built wrong.

## The published string

The published completion in this course is thirteen components hung from surface, and it comes to two thousand six hundred and six point two five metres. Add the thirteen lengths and you get the same number, which is what the check is for.

Four of the thirteen are plain tubing and they account for almost all of it. The nine pieces of equipment come to a little over thirteen metres between them, which is half a percent of the string.

## What the depths are for

Every later calculation reads them. The clearance check needs each component's bottom depth so it knows which casing bores sit above it. The through bore needs the order rather than the depths. The volume calculation needs both the depths and the lengths.

So the tally is not a bookkeeping exercise that precedes the real work. It is the input to all of the real work, and an error in it propagates into every output without ever being visible as an error.

## The one place it can be wrong quietly

If a length is wrong, the sum is wrong, every depth below it is wrong by the same amount, and the tally still looks perfectly consistent. Nothing in the arithmetic can detect it.

That is why a completion tally is measured twice on the rig floor by two people, and why the measured lengths rather than the catalog lengths are what get recorded.

## Exercise

Take the published string from the panel and check the telescoping identity by hand: sum the lengths and compare against the bottom depth.

Then suppose the fifth component were recorded one metre short. Say what happens to the bottom depth, to the packer depth, and to the clearance of the packer.

Say which of those three a reader of the finished tally could detect.
