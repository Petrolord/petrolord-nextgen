# The probability of waiting

{{panel:marine-base-calculator}}

M/M/c is the first of the two queue models the engine offers. The letters say what it assumes: arrivals at random (Poisson, the first M), service times spread like an exponential (the second M), and c berths serving one queue, first come first served, in a steady state. Its first figure is the probability that an arriving vessel finds every berth busy and has to wait.

## Erlang's C formula

That probability is Erlang's C formula: Adan and Resing, Queueing Systems (26 March 2015; no licence printed, cited for figures and formulas only), eq. 5.1, and Iversen, Teletraffic Engineering Handbook (draft, 20 June 2001; no licence printed), s. 12.2. Written out directly, it needs factorials and powers of the offered load, which grow past what a computer holds long before a large base is reached. The engine computes it the stable way Adan and Resing give in s. 11.3 (recursion 11.3 and remark 11.3.2): it builds Erlang's B figure one berth at a time, each step from the one before, and then turns the B figure into the delay probability. The course calls the result the probability of waiting.

## On the Ekene base

With the Ekene inputs as M/M/c, and the berths stated as below (the first row is the Ekene base, the others stated probes):

| berths (stated) | berth utilisation (engine) | probability of waiting (engine) |
| --- | --- | --- |
| 2 | 0.533333 | 0.371014 |
| 3 | 0.355556 | 0.106417 |
| 4 | 0.266667 | 0.025264 |
| 5 | 0.213333 | 0.005033 |

At two berths a little over a third of the arriving vessels find both berths taken. A third berth cuts that to about one in ten, and a fifth to about one in two hundred. The probability of waiting falls much faster than the berth utilisation, because with more berths it takes more vessels at once to fill them all.

## What the figure is, and what it is not

The probability of waiting is a long-run share of arrivals. It says nothing about a given Tuesday, and it says nothing about how long the waiting vessels wait: that is the mean wait, the next lesson. It belongs to M/M/c alone. For M/D/c the engine returns no delay probability, and the calculator's tile reads "not given for M/D/c".

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c". Read the Probability of waiting tile and the probability column of the table of the same call at more berths, and check both against the table above. Then set the Queue model (stated) control to M/D/c and read what the Probability of waiting tile shows. Restore M/M/c and write one sentence on how many berths the Ekene base needs before fewer than one arrival in fifty waits.
