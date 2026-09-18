# The duty a stated outlet sets

The studio case arrives with four things about its streams and one temperature it wants. Two capacity rates, two inlet temperatures, and a hot outlet. The hot stream enters at 300 F and is to leave at 200.000000 degF. The cold stream enters at 100 F. From that, and nothing else, the balance produces the duty and the cold outlet.

{{panel:fc-exchanger-explorer}}

## One stated outlet is enough

The duty is the hot capacity rate multiplied by the hot temperature drop. On the studio streams that is 27500.0000 Btu an hour per degF over a drop from 300 F to 200.000000 degF, which is 2750000.0000 Btu an hour. That heat has to go somewhere, and the only place it can go is the cold stream, so the cold rise is the same duty divided by the cold capacity rate of 80000.0000 Btu an hour per degF. The cold stream leaves at 134.375000 degF.

Notice the order. You stated one outlet. The engine computed the duty from it, then computed the other outlet from the duty. Three numbers came out of one, and the two that came out are not independent of each other.

## The engine tells you which stating it used

The answer carries five keys: the duty, the hot outlet, the cold outlet, the basis and the arrangement. The basis is the one to read first. On the studio case it reads `hot outlet`, which is the engine saying in words which of your inputs it worked from.

Two people with the same screen open can disagree about a duty entirely because one typed a cold outlet and the other typed a hot one. The basis key ends that argument, and it is why this course keeps asking which number the engine computed and which one you chose. Here the hot outlet was chosen. The duty and the cold outlet were computed.

## The same shape on a second exchanger

ORON is the four-pass exchanger this course carries beside the studio case. On the same basis, stating its hot outlet, the duty is 5046800.0000 Btu an hour and the cold stream leaves at 167.515873 degF.

Its capacity rates are larger, its duty is larger, and its cold outlet is higher. Those figures came from ORON's own inputs and they belong to ORON. Do not carry a figure from one case into the other, and do not divide a figure in one case by a figure in the other. The two exchangers have nothing in common but the method.

## What the balance has not said

The duty is now known and nothing has been said about how big the exchanger is. No area, no coefficient, no tube. A balance answers what these two streams exchange at those terminals. Whether any exchanger reaches those terminals is the next question, and whether parallel flow can is the one after that.

## Exercise

Work the studio duty and the studio cold outlet from the four inputs named above, in that order, and check both against the figures here. Then do the same on ORON from its two capacity rates, and write down which figure in each case you chose and which two the engine computed.
