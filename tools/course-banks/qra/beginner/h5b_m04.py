import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 qra, ASSOCIATE m04 "Location-Specific Individual Risk".
# Digest sections drawn on: 10 (LSIR as the sum of f times Pd at one place,
# the EREMOR process deck, control room and accommodation) and 11 (the Purple
# Book Appendix 6.B contribution, from its probability of death onward), and
# from the refusal table (section 3) the locationIndividualRisk rows.

q(0,
  "What does location-specific individual risk (LSIR) describe, in the engine's own model string?",
  "LSIR = sum f_i x Pd_i, a person present at the location all the time, outdoors and unprotected",
  ["LSIR = sum f_i x Pd_i x occupancy_i, a named person at the location for the hours on their own roster, indoors when off shift",
   "LSIR = sum Pd_i, the chance of death at the location summed over the scenarios, a person present all the time and unprotected",
   "LSIR = max f_i x Pd_i, the worst scenario at the location, a person present all the time, outdoors and unprotected"],
  "The engine's model string, verbatim, is \"LSIR = sum f_i x Pd_i, a person present at the location all the time, outdoors and unprotected\". Occupancy enters only at the next step, the individual risk per annum of a named person. Summing probabilities of death alone gives a number with no unit, and taking the worst scenario alone drops every other contribution.")

q(2,
  "EREMOR's four outcomes are run against the process deck, with a probability of death stated for each. What LSIR does the engine return there?",
  "0.000148150000",
  ["0.000081000000 per year, the flash fire contribution taken alone because it is the largest one at the process deck",
   "0.000154803000 per year, the three LSIRs of the process deck, the control room and the accommodation summed",
   "0.000037800000 per year, the explosion contribution, taken as the process deck's figure because an explosion reaches furthest"],
  "The engine sums f times Pd over the four outcomes and returns 0.000148150000 per year at the process deck. Taking only the largest contribution, the flash fire, gives 0.000081000000 and drops three scenarios. 0.000154803000 adds in two other places, which describes no single location, and 0.000037800000 is the explosion's share alone.")

q(1,
  "What is the LSIR at the EREMOR control room, and which scenario carries most of it?",
  "0.000006545000 per year, with the explosion carrying 0.825057 of it.",
  ["0.000006545000 per year, with the flash fire carrying 0.546743 of it, just as the flash fire leads at the process deck.",
   "0.000000108000 per year, with the explosion carrying 1.000000 of it.",
   "0.000148150000 per year, the same as the process deck."],
  "The engine returns 0.000006545000 per year at the control room, with the explosion as the largest contribution at 0.825057. The flash fire carries 0.546743 at the process deck, and at the control room its probability of death is zero. 0.000000108000 with the explosion at 1.000000 is the accommodation. An LSIR belongs to one place, so the process deck figure says nothing about the control room.")

q(3,
  "The EREMOR flash fire has a frequency of 0.000081000000 per year. What does it add to the LSIR at the control room, and why?",
  "0.000000000000 per year, because its stated probability of death there is zero: the control room lies outside the flammable cloud.",
  ["0.000081000000 per year, since every scenario adds its whole frequency to the LSIR at a place however far the place lies from it.",
   "0.000006545000 per year, the whole control room LSIR, since the flash fire is the outcome that sets the LSIR at every place.",
   "0.000081000000 per year times the occupancy of the control room, which is where a place's distance enters the sum."],
  "A scenario whose probability of death is zero at a place contributes zero there, and the course says the flash fire at the control room, which lies outside the flammable cloud, adds 0.000000000000. A frequency adds only through its probability of death, which is a stated input. 0.000006545000 is the whole control room LSIR, which comes from the other three outcomes, and occupancy belongs to the individual risk per annum of a person.")

q(3,
  "What share of the EREMOR process deck LSIR does the flash fire carry, and what is its contribution?",
  "0.546743 of it, a contribution of 0.000081000000 per year.",
  ["0.255147, a contribution of 0.000037800000 per year.",
   "0.168748, a contribution of 0.000025000000 per year.",
   "1.000000 of it, since a probability of death of 1 at the process deck means the flash fire is all there is to the LSIR."],
  "The flash fire has a stated probability of death of 1 at the process deck, so its contribution is 0.000081000000 per year, 0.546743 of the LSIR and the largest share. 0.255147 and 0.000037800000 are the explosion's share and contribution, and 0.168748 and 0.000025000000 the jet or pool fire's, whatever order the outcomes are listed in. A probability of death of 1 makes the contribution equal the frequency; the other three outcomes still add theirs.")

q(1,
  "At the process deck the explosion has a frequency of 0.000054000000 per year and a stated probability of death of 0.7. What contribution does the engine give it?",
  "0.000037800000 per year, 0.255147 of the LSIR.",
  ["0.000054000000 per year, since a stated probability of death above one half counts the whole frequency at that place.",
   "0.000025000000 per year, 0.168748 of the LSIR, the jet or pool fire's contribution at the process deck.",
   "0.000004350000 per year, 0.029362 of the LSIR, which is the pool fire's contribution at the process deck."],
  "The contribution is f times Pd, 0.000054000000 times 0.7, which the engine returns as 0.000037800000 per year, 0.255147 of the process deck LSIR. No threshold turns a probability of death into a whole count. 0.000025000000 and 0.168748 belong to the jet or pool fire, and 0.000004350000 and 0.029362 to the pool fire.")

q(0,
  "Which EREMOR scenario gives the smallest contribution to the process deck LSIR?",
  "The pool fire, at 0.000004350000 per year, 0.029362 of the LSIR.",
  ["The jet or pool fire, at 0.000025000000 per year.",
   "The explosion, at 0.000037800000 per year, since its stated probability of death is lower than the flash fire's at the deck.",
   "The flash fire, since its probability of death is taken as zero at the process deck once the cloud has burnt."],
  "The pooled pool fire outcome, 0.000014500000 per year with a stated probability of death of 0.3, gives 0.000004350000 per year, 0.029362 of the LSIR, the smallest of the four. The jet or pool fire gives 0.000025000000 and the explosion 0.000037800000. The flash fire's probability of death at the process deck is stated as 1, so it gives the largest contribution.")

q(2,
  "What LSIR does the engine return at the EREMOR accommodation, and why does one scenario carry all of it?",
  "0.000000108000 per year; the explosion is the only outcome with a probability of death above zero there, so it carries 1.000000.",
  ["0.000006545000 per year; the accommodation shares the control room's LSIR, since both sit away from the process deck on the platform.",
   "0.000000000000 per year; an accommodation block is indoors, so every probability of death there is taken as zero by the engine.",
   "0.000000108000 per year; the flash fire carries all of it, since a vapour cloud drifts further than a blast."],
  "At the accommodation only the explosion has a stated probability of death above zero, 0.002, so the LSIR is 0.000000108000 per year and the explosion carries 1.000000 of it. Each place has its own LSIR, so the control room's 0.000006545000 is no guide. The engine sets no probability of death to zero for being indoors; every one is stated, and the flash fire's is zero there.")

q(1,
  "An analyst adds up the four stated probabilities of death at the process deck without their frequencies. What has been produced?",
  "A number with no unit at all, which is no LSIR; the LSIR is the SUM of f times Pd.",
  ["The LSIR per year, since each probability of death already carries its scenario frequency folded inside it as a stated input.",
   "The probability of death of a person at the process deck over a whole year, which the engine reports beside the LSIR.",
   "A worst case LSIR, larger than the engine's figure."],
  "The course says summing the probabilities of death without their frequencies gives a number with no unit at all, and that the LSIR is the SUM of f times Pd. A probability of death is a conditional probability given the scenario, so it carries no frequency. The engine reports no yearly probability of death beside the LSIR, and a sum with no unit is no bound on an LSIR, however large it looks.")

q(0,
  "Why does an LSIR describe a PLACE rather than a person?",
  "It assumes someone present at the location all the time, outdoors and unprotected, so it holds no occupancy of any real person.",
  ["It is computed only for places that are occupied all the time, such as a control room, and is refused for places visited now and then.",
   "It adds the hours of everyone on the roster at the location together, so that no single person's hours are carried in the sum.",
   "It is the LSIR of the most exposed person on site, standing at the place where the probabilities of death are highest."],
  "The model string says a person present at the location all the time, outdoors and unprotected, so the LSIR is a property of the place and carries no occupancy. The engine computes it for any place given its scenarios, occupied or not. Hours enter only when one person's individual risk per annum is built over the places they occupy.")

q(3,
  "Purple Book Appendix 6.B works one individual risk contribution at one grid point. Where does this course start its steps, and why?",
  "At the centreline probability of death, taken as given, because the concentration, the probit and the probability integral before it are consequence modelling and belong to the consequence course.",
  ["At the release frequency, running every step of the chain in this course so that each learner reproduces the source from the start.",
   "At the contribution per year, taking every earlier value from the source and reproducing none of the chain from the printed numbers.",
   "At the wind sector count, since that is the first step the source prints."],
  "The course says the early steps, the concentration, the probit and the probability integral, are consequence modelling and belong to the consequence course; from the effective cloud width onward the steps are QRA arithmetic, and this course starts there. The earlier steps are never run here, and the course does reproduce the later ones, from the probability of death through to the contribution.")

q(2,
  "The whole Appendix 6.B chain, as the golden records it, gives a probability of death of 0.380294556093, and the source prints 0.381. What explains the gap?",
  "The printed 0.381 follows only from the rounded effective cloud width of 86.2 m; the source is internally rounded, and both routes reproduce its contribution of 7e-9 per year.",
  ["The engine has a defect in its coverage probability, which the printed 0.381 exposes at the third decimal of the chain.",
   "The source uses 8766 hours a year where the engine uses 8760, which moves every probability of death at the third decimal.",
   "The engine rounds each step to three decimals and so loses the last digit."],
  "The course says the whole chain gives 0.380294556093, which rounds to 0.380, and that the printed 0.381 follows only from the rounded effective cloud width of 86.2 m. The source is internally rounded, which is a fact about the SOURCE, and both routes reproduce its printed contribution of 7e-9 per year to two significant figures. No hours enter this chain, and the engine rounds no step.")

q(0,
  "Step 6 of Appendix 6.B is run through `locationIndividualRisk` with f PM Pphi of 1.84e-8 per year and the printed probability of death of 0.381. What does the engine return?",
  "0.000000007010 per year, which the source prints as 7e-9.",
  ["0.000000006997 per year, since the engine replaces the printed 0.381 with its own whole chain value before it multiplies.",
   "0.000000000000 per year, since a contribution that small falls below the 1e-8 contour and is dropped as negligible by the engine.",
   "1.84e-8 per year, since the probability of death has already been folded into the frequency given for the step."],
  "Through `locationIndividualRisk` the product 1.84e-8 times 0.381 is 0.000000007010 per year, and the source prints 7e-9. 0.000000006997 is the whole chain's contribution, which uses the engine's own probability of death; this call uses the printed one as stated. The engine drops no contribution for being small, and the probability of death still multiplies the frequency.")

q(2,
  "What inputs does the course give for the Appendix 6.B chain, and how is the coverage probability formed?",
  "A frequency f of 5e-7 per year, 12 wind sectors and R = 361 m; the coverage probability is Pci = nws ECW / (2 pi R).",
  ["A frequency f of 5e-7 per year, 12 wind sectors and R = 361 m; the coverage probability is ECW / R, with the sector count used later.",
   "A frequency f of 1.84e-8 per year, 12 wind sectors and R = 86.2 m; the coverage probability is nws ECW / (2 pi R).",
   "A frequency of 7e-9 per year and a probability of death of 0.835, with no coverage step at all."],
  "The golden inputs are a loss of containment frequency f of 5e-7 per year, 12 wind sectors and R = 361 m, and the coverage probability is Pci = nws ECW / (2 pi R). 1.84e-8 per year is f PM Pphi, a later product, and 86.2 m is the printed effective cloud width. 7e-9 is the printed contribution and 0.835 the centreline probability of death, and the coverage step sits between them.")

q(3,
  "An LSIR call names a scenario 'fire' with a frequency below zero. What does the engine return?",
  "scenarios[0].frequencyPerYr: 'fire' must have a frequency of 0 or more per year",
  ["scenarios[0].frequencyPerYr: 'fire' must be a frequency above 0 per year, since a scenario that never happens has no place in the LSIR",
   "An LSIR with that scenario's contribution set to zero, since a frequency below zero is read as a scenario that cannot happen",
   "scenarios: must be a non-empty list of scenarios"],
  "Those are the engine's own words from the refusal table. A scenario may carry a frequency of 0 or more, so zero is allowed and only a negative value is refused; the words about a frequency above 0 belong to an event tree root. The engine alters no input to zero, and the empty list message is real engine text for a call with no scenarios.")

emit(Q, '/root/hse-wip-qra/banks/h5b_m04.json', expect_n=15)
finish()
