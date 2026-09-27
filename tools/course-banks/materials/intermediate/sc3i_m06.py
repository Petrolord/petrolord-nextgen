import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Professional m06, Poisson Demand for Slow Movers.
# Every figure and every engine message is quoted from digest.txt, where the
# engine returned it on the Ekene fixture, a golden input or a stated probe,
# and every key was re-run through the vendored engine (materials_engine.mjs)
# by the bank writer's witness. The lecture 13 slide 12 slip is keyed as a
# slip, with the recursion's figure beside the print. No capstone name, input
# or value appears.

q(1, "Why does the engine read the demand of a slow mover as Poisson?",
 "Its demand over the lead time is a small whole number, and a normal curve puts weight below zero",
 ["Its demand has no spread, so a normal curve would give a sigma of 0",
  "The Poisson level is always lower than the normal reorder point for the same item",
  "A slow mover's lead time is too long for the normal safety stock to accept"],
 "A slow mover is used a unit or two at a time, a few times a year; demand over the lead time is a small whole number, and a normal curve puts weight below zero. The engine reads such demand as Poisson with the mean over the protection period. A Poisson demand does have a spread, and the engine sets no cap on a normal lead time.")

q(3, "The PSV kits on the Ekene register are used at 0.5 kits a month with a lead time of 4 months under continuous review. What Poisson mean does the engine use?",
 "2.000000 kits",
 ["0.500000 kits",
  "6 kits",
  "5 kits"],
 "The mean is the demand rate a period times the lead time plus the review period: 0.5 times 4 is 2.000000. 0.5 is the rate for one month, 6 kits is the usage a year the fixture's note gives, and 5 is the level the engine chooses at a cycle service level of 0.95.")

q(0, "Which reason does the engine print when choosing the PSV kit level at 0.95?",
 "level 5: P(X <= 5) = 0.983436 is at or above 0.95; at 4 it is 0.947347 (Poisson mean 2)",
 ["level 4: P(X <= 4) = 0.947347 is at or above 0.95, within the tolerance the engine allows",
  "level 3: expected units short 0.218018 is at or below 6 x (1 - 0.95) = 0.3",
  "level 2: the mean demand over the lead time, with no stock held above it"],
 "The engine walks up the whole levels and takes the smallest whose cumulative probability is at or above the target: 0.947347 at level 4 falls short of 0.95, and 0.983436 at level 5 meets it. The level 3 reason is the fill-rate answer with an order quantity of 6, a different measure.")

q(2, "At level 5 on the PSV kits, what safety stock and achieved cycle service does the engine report?",
 "Safety stock 3.000000, achieved cycle service 0.983436",
 ["Safety stock 5 kits, achieved cycle service 0.95",
  "Safety stock 3.000000, achieved cycle service 0.95",
  "Safety stock 2.000000, achieved cycle service 0.947347"],
 "The safety stock is the level less the mean, 5 less 2.000000, which is 3.000000, and the service achieved at level 5 is its cumulative probability, 0.983436, above the stated 0.95. The whole level is no safety stock, and 0.947347 belongs to level 4.")

q(1, "The PSV kits are stated at a fill rate of 0.95 with an order quantity of 6 kits. What level does the engine return, and what fill rate does it achieve?",
 "Level 3, achieving a fill rate of 0.963664",
 ["Level 5, the same as at a cycle service level of 0.95",
  "Level 3, achieving a fill rate of exactly 0.95",
  "Level 2, achieving a fill rate of 0.963664"],
 "The reason reads: level 3: expected units short 0.218018 is at or below 6 x (1 - 0.95) = 0.3; at 2 it is 0.541341 (Poisson mean 2). The achieved fill rate is 0.963664. Level 5 answers the cycle service level of 0.95; the two measures give different levels, and level 2 fails with 0.541341 short.")

q(3, "The engine builds the expected units short column by the loss recursion. On the PSV kits, L(0) is 2.000000 and F(0) is 0.135335. What is L(1)?",
 "1.135335",
 ["0.406006",
  "0.270671",
  "0.541341"],
 "The rule is L(0) = m, L(x + 1) = L(x) - (1 - F(x)): L(1) is 2.000000 less one less 0.135335, which is 1.135335. 0.270671 is the probability of exactly one kit, and 0.541341 is L(2). 0.406006 is the cumulative probability F(1).")

q(0, "Caplice, lecture 13 slide 12, prints the expected units short beyond level 4 as 0.009 on a Poisson mean of 0.8. How does the course treat that figure?",
 "As a slip: the recursion the slide itself states gives 0.001619 at level 4",
 ["As the rule's figure, which the engine prints as 0.001619 only because it rounds to six decimals",
  "As a correct figure, since 0.009 is 0.010699 at the precision the slide uses",
  "As a figure the engine cannot check, since level 4 lies beyond the slide's fill-rate level of 2"],
 "The loss at level 3 is 0.010699 and the cumulative probability there is 0.990920, so 0.010699 less one less 0.990920 is 0.001619, the engine's figure at six decimals. The printed 0.009 is not the recursion's figure at any precision the slide uses, and the course keeps the print beside the rule's figure.")

q(2, "The lecture 13 slow mover: 0.8 a week, weekly reviews, zero lead time, fill rate 0.9 on an order of 0.8. Which level satisfies it?",
 "Level 2, with 0.058121 units short against an allowance of 0.08",
 ["Level 1, with 0.249329 units short against an allowance of 0.08",
  "Level 3, with 0.010699 units short, the first level under 0.08 by a clear margin",
  "Level 4, the first level whose cumulative probability passes 0.99"],
 "The reason reads: level 2: expected units short 0.058121 is at or below 0.8 x (1 - 0.9) = 0.08; at 1 it is 0.249329 (Poisson mean 0.8). Lecture 13 slides 11 and 12 print the same level of 2. The engine takes the smallest level that meets the target, and level 1 misses it.")

q(1, "A stated case sets a cycle service target on a Poisson mean of 1 equal, to its last digit, to the cumulative probability at level 1 itself. What does the engine return?",
 "Level 1, the target met at or above it, the engine's stated reading",
 ["Level 2, as a target equal to the cumulative probability is met only strictly above",
  "Level 0, whose cumulative probability 0.367879 is the nearest",
  "A refusal, since a target equal to a table figure is ambiguous"],
 "The reason reads: \"level 1: P(X <= 1) = 0.735759 is at or above 0.7357588823428847; at 0 it is 0.367879 (Poisson mean 1)\". The engine compares at 12 significant digits and meets the target at or above it. A target met only strictly above is the alternative reading the engine names; under it the answer would be level 2.")

q(3, "Raise that target to 0.7358 on the same mean. Which level answers?",
 "Level 2, with a cumulative probability of 0.919699",
 ["Level 1, as 0.735759 rounds to 0.7358 at four decimals",
  "Level 1, with a cumulative probability of 0.735759",
  "Level 3"],
 "The reason reads: level 2: P(X <= 2) = 0.919699 is at or above 0.7358; at 1 it is 0.735759 (Poisson mean 1). Level 1 falls short of 0.7358, and the engine compares at 12 significant digits, so no rounding to four decimals helps it. Level 3 is more than the target needs.")

q(0, "How much stock does the engine hold for an item whose Poisson mean is only 0.05, when the stated cycle service target is 0.9?",
 "Level 0, since P(X <= 0) = 0.951229 already meets 0.9",
 ["Level 1, since a stock level must hold at least one unit",
  "A refusal, since a mean below 1 is too small to model",
  "Level 0, since the mean rounds down to no demand"],
 "The reason reads: level 0: P(X <= 0) = 0.951229 is at or above 0.9 (Poisson mean 0.05). The chance of no demand at all over the protection period already meets the target, so no stock is needed. The engine refuses no small mean, and it rounds no mean.")

q(2, "Periodic review on a Poisson item: 1.5 a period, lead time 2, review period 1, fill rate 0.95 with an order of 1.5. What level and mean come back?",
 "Level 8 on a Poisson mean of 4.5",
 ["Level 7 on a Poisson mean of 3, from the lead time alone",
  "Level 8 on a Poisson mean of 3, since a review period adds nothing to a Poisson mean",
  "Level 7 on a Poisson mean of 4.5"],
 "The reason reads: level 8: expected units short 0.067581 is at or below 1.5 x (1 - 0.95) = 0.075; at 7 it is 0.154167 (Poisson mean 4.5). The mean is the demand rate times the lead time plus the review period, 1.5 times 3. Level 7 leaves 0.154167 short, above the allowance.")

q(3, "At 5 a period the Poisson view is given a lead time of 100.5. How does the engine answer?",
 "A refusal: leadTime must be at most 100 so that the mean demand demandRate x leadTime is at most 500",
 ["A level computed as usual, with a note that the normal would fit better",
  "A level from the normal safety stock, to which the engine hands the call on by itself",
  "A refusal naming demandRate, which must be at most 1 for a slow mover"],
 "The engine's words: leadTime must be at most 100 so that the mean demand demandRate x leadTime is at most 500; above that the normal safetyStock serves; got 100.5. MAX_POISSON_MEAN is 500. The engine points to the normal safety stock and hands nothing on itself, and it caps the mean, with no cap of its own on the rate.")

q(1, "MIL-HDBK-338B (1 October 1998), example 5.3.8.1, asks the chance of two lamp failures or fewer in 500 hours at 0.001 failures an hour. What does the engine return?",
 "A Poisson mean of 0.500000 and a cumulative probability of 0.985612",
 ["A Poisson mean of 0.500000 and a cumulative probability of 0.986 exactly, the handbook's figure",
  "A Poisson mean of 2.000000, and 0.676676",
  "A Poisson mean of 0.5 and a cumulative probability of 0.952577"],
 "A failure rate of 0.001 an hour over 500 hours is a Poisson mean of 0.500000, and the chance of two failures or fewer is 0.985612 (engine); the handbook prints 0.986. The engine prints its own figure at six decimals beside the print. 0.676676 is the level 2 cumulative of the PSV kits at a mean of 2.000000, and 0.952577 the level 2 cumulative of the lecture 13 table at a mean of 0.8.")

q(2, "A Poisson call on the pressure safety valve repair kits carries a key lambda_ for the demand rate. What comes back?",
 "A refusal naming lambda_ and listing the accepted keys at the top level",
 ["A level on a mean of 2.000000, with lambda_ read as the demand rate",
  "A level computed from the other inputs, with lambda_ dropped silently",
  "demandRate must be a finite number above 0; got undefined"],
 "The engine's words: lambda_ is not an accepted key; the accepted keys at the top level are demandRate, leadTime, reviewPeriod, serviceMeasure, serviceLevel, orderQuantity. Every function checks its accepted keys before it reads an input, so the unknown key is refused first, ahead of the missing demand rate, and nothing is dropped silently.")

emit(Q, '/root/cat-wip-materials/banks/sc3i_m06.json', expect_n=15)
finish()
