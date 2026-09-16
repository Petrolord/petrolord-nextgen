# A duty that crosses the streams

Ask a balance for more heat than two streams can exchange and it does not shrink the answer to fit. It refuses, in the only terms that settle the argument, which are the two outlet temperatures your duty would require. On the studio streams a large enough duty puts the hot outlet below the cold inlet and the cold outlet above the hot inlet at once. The streams would have to pass through each other.

{{panel:fc-exchanger-explorer}}

## What crossing means

The hot stream enters at 300 F and the cold stream at 100 F. Between those two numbers is the only range either stream can end up in while heat flows one way. A hot outlet below 100 F means the hot stream was cooled past the coldest thing available to cool it. A cold outlet above 300 F means the cold stream was heated past the hottest thing available.

The refusal quotes both of those at once: the hot outlet would be -45.45 F against a cold inlet of 100 F, and the cold outlet 218.75 F against a hot inlet of 300 F. Then it says plainly that no exchanger of any size does that.

## Two temperatures that do not exist

Beside the message the answer carries two more keys, and they are the reason this refusal is worth a lesson of its own. They are named `thOutIfReached` and `tcOutIfReached`, and on this case they hold -45.454545 and 218.750000 degF.

Read the names. They are conditional on purpose. Those are not temperatures anywhere in any exchanger. They are what the duty you asked for would imply, handed back so a caller can show why the state is impossible rather than only assert it. Three keys come back in all.

## Where the rounding is

Compare the figures in the message with the figures on the keys. The message says -45.45 F and the keys say -45.454545 degF. The message says 218.75 F and the keys say 218.750000 degF.

The message is rounded because it is written to be read in a sentence. The keys carry the figure. Never scrape a number out of a refusal message and use it in arithmetic: you will carry the sentence's rounding into an area. If you need the figure, read the key. The same rule holds on the answers and not only on the refusals.

## Size is not the problem

This refusal is about the two streams and nothing else. It names no area, coefficient, arrangement or tube, because none of those would help. A bigger exchanger drives the outlets further apart in the same direction and makes the crossing worse.

That marks this refusal out from the one in the next lesson, which refuses a duty a particular arrangement cannot deliver and ends by naming the arrangement that can. This one has nothing to offer, because the duty asked for more than the two inlet temperatures allow.

## Exercise

Take the two evidence temperatures above and, using the studio capacity rates, work back to the duty that was asked for. Then write down the two comparisons the message makes, and say for each one which inlet temperature it is testing against. Finish by saying whether you would expect the same refusal in parallel flow, and why.
