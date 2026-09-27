import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Professional m05, Periodic Review.
# Every figure and every engine message is quoted from digest.txt, where the
# engine returned it on the Ekene fixture, a golden input or a stated probe,
# and every key was re-run through the vendored engine (materials_engine.mjs)
# by the bank writer's witness. No capstone name, input or value appears.

q(0, "Counting the choke bean bin once a month adds a review period of 1 to the lead time of 2.5. Which protection period and policy name come back?",
 "3.500000 months, policy periodic (R, S)",
 ["2.5 months, policy continuous (s, Q), as the review period adds nothing",
  "1 month, the review period alone",
  "3.500000 months, policy continuous (s, Q)"],
 "Under periodic review the protection period becomes the review period plus the lead time, 3.500000 months, and the engine names the policy periodic (R, S). Stock raised at one count must last until the next count and then until that order lands. A review period of 0 is continuous review.")

q(0, "Monthly counts lengthen the choke bean protection period. What standard deviation of demand over it is computed?",
 "3.426036",
 ["3.029476",
  "2.529822",
  "5.635328"],
 "Over 3.500000 months the demand term of the rule grows with P while the lead-time term stays, so sigma rises from 3.029476 to 3.426036. 2.529822 is the demand part of sigma over 2.5 months alone, and 5.635328 is the safety stock at the review period of 1.")

q(1, "Reviewed monthly, the choke bean set gets an order-up-to level S. What is S, and what is it held as?",
 "17.301878, held as 18.000000 by the rule up",
 ["13.316294, held as 14.000000, the reorder point",
  "11.666550, the demand over 3.500000 months",
  "17.301878, held as it stands with no rounding"],
 "The reason reads: safety stock 5.635328 over a demand of 11.66655 with sigma 3.426036 gives the order-up-to level S 17.301878, held as 18 (up to a multiple of 1). The stated rule rounds up. 13.316294 is the continuous-review reorder point, and 11.666550 is the mean demand the level covers before its safety stock.")

q(3, "CHK-BEAN moves from continuous review to a review period of 1 month at the same cycle service level of 0.95. What happens to the safety factor k?",
 "It stays at 1.644854, since the stated level is the same",
 ["It rises to 1.959964 to cover the longer protection period",
  "It falls to 1.026327, since each count tops the stock up",
  "It is read as 1.64, the table figure periodic review uses"],
 "The safety factor comes from the stated cycle service level alone, so it stays at 1.644854 under both policies. What grows is sigma, from 3.029476 to 3.426036, and with it the safety stock, from 4.983044 to 5.635328. 1.959964 is the factor at 0.975 and 1.026327 the factor at a fill rate of 0.98.")

q(2, "Monthly counting on the choke bean set: how much stock does k times sigma come to over its protection period of 3.500000?",
 "5.635328 sets",
 ["4.983044 sets",
  "17.301878 sets",
  "11.666550 sets"],
 "The safety stock is k times sigma over the protection period: 1.644854 times 3.426036 is 5.635328. 4.983044 is the continuous-review safety stock, 17.301878 is the order-up-to level and 11.666550 the mean demand over 3.500000 months.")

q(0, "Caplice, lecture 12 slides 5 and 6, work a periodic review on the weekly lecture 11 data with a review period of 8 weeks, a fill rate of 0.95 and an order quantity of 2000. What sigma does the engine return, against the slide's printed 577?",
 "577.104177 over a protection period of 10 weeks",
 ["258.088834 over the lead time of 2 weeks, since a review period adds no spread",
  "577.104177 over the review period of 8 weeks alone",
  "2500.000000 over 10 weeks"],
 "The protection period is the review period plus the lead time, 10 weeks, and sigma over it is 577.104177, which the slide prints as 577. 258.088834 is sigma over the two-week lead time of the lecture 11 check, and 2500.000000 is the mean demand over the 10 weeks.")

q(3, "Slides 5 and 6 of lecture 12 print a safety factor of 0.58. What does the engine hold as k, exact and as read?",
 "0.583373 exact, read as 0.58",
 ["0.58 exact, as printed on the slide, with no reading needed",
  "1.314197 exact, the lecture 11 fill-rate factor",
  "0.173279 exact, the loss target"],
 "The reason reads: so k = 0.583373, read as 0.58. The slide prints 0.58, which the stated table reading reproduces. 0.173279 is the target on G that k must meet, and 1.314197 is the exact factor of the lecture 11 case at a fill rate of 0.95.")

q(1, "What order-up-to level does the engine return on the case of Caplice, lecture 12 slides 5 and 6, and what does the slide print?",
 "2834.720422, held as 2835.000000 against the printed 2835",
 ["2835.000000 exact, which the slide prints unrounded",
  "2500.000000, the mean demand over the protection period",
  "2834.720422, held as it stands"],
 "The reason reads: gives the order-up-to level S 2834.720422, held as 2835 (the nearest multiple of 1 (halves upward)). The stated rule is the nearest whole unit, so the held level 2835.000000 matches the print. 2500.000000 is the mean demand the level covers.")

q(0, "Why does the lecture 12 case state an order quantity of 2000 for its fill rate?",
 "It is the demand over one review period, stated as an input",
 ["The engine computes it from the review period and the demand",
  "It is the order-up-to level less the safety stock",
  "It is the demand over the protection period of 10 weeks"],
 "The golden input states an order quantity of 2000, the demand over one review period of 8 weeks at 250 a week. The engine does not work it out; it is a stated input, and the fill rate measures units short against it. The demand over the 10-week protection period is 2500.000000.")

q(2, "Weekly lecture 11 data, a requested cycle service level of 0.4, and a stated floor of 0 on k: what does the engine produce?",
 "k held at the floor 0, so the reorder point equals the mean 500",
 ["k of -0.253347, a safety stock of -65.386058 and a reorder point of 434.613942",
  "A refusal: a level below one half is no policy",
  "k of 1.644854, as at a level of 0.95"],
 "The reason reads: a cycle service level of 0.4 gives k = Phi^-1(0.4) = -0.253347; below the stated minimum 0, so k = 0; safety stock 0 over a demand of 500 with sigma 258.088834 gives the reorder point s 500. The negative safety stock is what the same call returns with no floor. A level of 0.4 is a valid probability and is not refused.")

q(3, "Same 0.4 request, but the floor is typed as null and the rounding rule is none. What comes back now?",
 "A safety stock of -65.386058 and a reorder point of 434.613942",
 ["A safety stock of 0.000000 and a reorder point of 500.000000",
  "A refusal: minimumSafetyFactor must be a stated number or null for no floor; got null",
  "A safety stock of 65.386058, the magnitude of the negative figure"],
 "With no floor the engine uses the negative k as it is: safety stock -65.386058 over a demand of 500 with sigma 258.088834 gives the reorder point s 434.613942, held as 434.613942 (no rounding). Null is an accepted statement of no floor; the refusal is for a floor left out, and it prints got undefined.")

q(1, "A call on CHK-BEAN leaves minimumSafetyFactor out altogether. What does the engine return?",
 "minimumSafetyFactor must be a stated number or null for no floor; got undefined",
 ["A reorder point as usual, since the stated level of 0.95 gives a positive k anyway",
  "A reorder point computed with a floor of 0, the usual practice for safety stock",
  "safetyFactorRounding must be { rule: 'none' } or { rule: 'nearest', decimals } (a table read to that many decimals)"],
 "The floor is a stated input with no default: a number, or null for no floor. Leaving it out is refused by name even where the floor would not act, as at 0.95, where k is 1.644854. The safetyFactorRounding message answers a missing table reading.")

q(0, "Demand of 10 each period with zero spread meets a lead time of 3 periods with zero spread. At a cycle service target of 0.95 and the rounding rule none, which figures result?",
 "Sigma 0.000000, safety stock 0.000000, reorder point 30.000000",
 ["A refusal, since certain demand leaves nothing to protect",
  "Sigma 0.000000, safety stock 1.644854, the factor itself",
  "Sigma 0.000000 and a reorder point of 10, one period of demand"],
 "The reason reads: a cycle service level of 0.95 gives k = Phi^-1(0.95) = 1.644854; safety stock 0 over a demand of 30 with sigma 0 gives the reorder point s 30. The safety stock is k times sigma, so it is 0.000000 whatever k is. A cycle service target is accepted on certain demand; only a fill rate is refused there.")

q(3, "On the certain-demand case, the engine still prints a safety factor of 1.644854. Why does the reorder point stay at 30.000000?",
 "Because the safety stock is k times sigma, and sigma is 0",
 ["Because the engine sets k to 0 whenever demand is certain",
  "Because a floor of 0 on the safety factor holds it there",
  "Because the reorder point is rounded down to the demand"],
 "With no demand spread and no lead-time spread sigma is 0.000000, so the safety stock k times sigma is 0.000000 for any k, and the reorder point is the demand over the lead time, 30.000000. The engine keeps k at 1.644854 in its reason, and the case states the rounding rule none.")

q(2, "The engine's basis cites its sources for safety stock under periodic review. What does it say changes under (R, S)?",
 "L becomes R + L, and the rest of the rule is unchanged",
 ["k is recomputed from the review period",
  "Q becomes the order-up-to level S, and sigma is unchanged",
  "The lead-time spread applies to R + L as one period"],
 "The basis reads: Caplice, MIT ESD.260J (2006) lecture 11 (s = xL + k sigmaL; P1 = Phi(k); P2 = 1 - sigmaL G(k) / Q) and lecture 12 ((R, S): L becomes R + L). The protection period grows and every other part of the rule stays. The lead-time spread enters on the lead time only; the review period is fixed.")

emit(Q, '/root/cat-wip-materials/banks/sc3i_m05.json', expect_n=15)
finish()
