import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 Professional m01: PFDavg and the Simplified Forms.
# Digest sections 14 (the simplified forms and the half in 1oo1), 16 (the
# simplified forms as the Annex B special case) and 32 (the vocabulary).

q(0,
 "The EKULAMA channel is stated at a dangerous undetected failure rate of 1.2e-6 per hour on a proof test interval of 8760 hours, with no detected failures and no repair time after a test. What PFDavg does the engine return for it as a single channel?",
 "0.005256000000",
 ["0.010512000000","0.000296042728","0.000362528185"],
 "The simplified one out of one form is lambdaDU T / 2, and the simplified forms table prints 0.005256000000 for this channel with a relative difference of 0 against the form. 0.010512000000 is lambdaDU T itself, which is the same row with the half dropped and is what the table prints for the two out of two. 0.000296042728 is the one out of two row and 0.000362528185 is the two out of three row, both of which need a second channel this call does not have.")

q(2,
 "Multiply the stated dangerous undetected failure rate of the EKULAMA channel by its stated proof test interval. What is that product?",
 "0.010512000000",
 ["0.000263048981","0.005256000000","0.000296042728"],
 "The simplified forms table prints lambdaDU T for this channel as 0.010512000000, derived, and every simplified form in the table is built from it. 0.005256000000 is half of it, which is the one out of one PFDavg. 0.000263048981 and 0.000296042728 are the one out of three and one out of two rows, which are PFDavg values and never the bare product.")

q(1,
 "Which architecture has a simplified form of plain lambdaDU T, with no half and no common cause piece at all?",
 "2oo2",
 ["1oo1","1oo2","2oo3"],
 "The simplified forms table gives 2oo2 the form lambdaDU T, so its PFDavg on this channel is 0.010512000000, twice the single channel figure. A 1oo1 carries lambdaDU T / 2. A 1oo2 and a 2oo3 both square the independent piece and both add a beta factor term of b lambdaDU T / 2, so neither form is the bare product.")

q(3,
 "Beside the simplified one out of one PFDavg for the EKULAMA channel the engine returns a risk reduction factor. What figure is printed there?",
 "190.258752",
 ["252.295893","557.733208","189.107413"],
 "The simplified forms table prints the risk reduction factor 190.258752 against the 1oo1 PFDavg of 0.005256000000 and bands it 2. 189.107413 belongs to the same architecture on this channel once detected failures are added, which is a different subsystem. 252.295893 is the OBAGI valve at a perfect proof test and 557.733208 is the IDU function total, neither of which is this channel.")

q(2,
 "The EKULAMA channel is run as a redundant pair at a stated beta factor of 0.05, with no detected failures and no repair time after a test. What PFDavg does the simplified one out of two form give?",
 "0.000296042728",
 ["0.000362528185","0.000263048981","0.005256000000"],
 "The simplified forms table prints 0.000296042728 for 1oo2, from ((1 - b) lambdaDU T)^2 / 3 + b lambdaDU T / 2, with a relative difference of 0 against the engine. 0.000362528185 is the 2oo3 row, whose independent piece carries no division by three. 0.000263048981 is the 1oo3 row, which cubes the independent piece. 0.005256000000 is the single channel figure.")

q(1,
 "Take the same stated channel and the same stated beta factor, voted two out of three. Which figure does the simplified form give?",
 "0.000362528185",
 ["0.000296042728","0.000263048981","0.000369505528"],
 "Voting two out of three squares its independent piece and adds the same common cause term, giving 0.000362528185 on these inputs. A redundant pair divides that square by three and lands lower at 0.000296042728. Three channels cube it and reach 0.000263048981. The value 0.000369505528 belongs to a channel carrying detected failures as well, so its inputs are a different set.")

q(3,
 "What risk reduction factor does the simplified forms table print beside the one out of two row for this channel?",
 "3377.890772",
 ["2758.406219","3801.573360","3344.625055"],
 "The table prints 3377.890772 against the 1oo2 PFDavg of 0.000296042728 and bands it 3. 2758.406219 is the 2oo3 row of the same table and 3801.573360 is the 1oo3 row. 3344.625055 is the one out of two risk reduction factor for the channel with detected failures added, which is a different subsystem.")

q(0,
 "Why does the simplified one out of one form carry a factor of one half?",
 "A dangerous undetected failure arrives at a random moment in the proof test interval and stays until the next test, so on average the channel is failed for half of the interval.",
 ["A proof test is only half as likely to reveal a dangerous undetected failure as a detected one, so half the population survives each test.",
  "Half of every dangerous failure rate is reclassified as detected by the diagnostics the low demand equations assume.",
  "The demand arrives on average halfway through the interval, so the interval is halved before the rate multiplies it."],
 "The simplified forms section states the half exactly this way: the failure arrives at a random moment, stays until the next test, and averages to half the interval, so PFDavg is lambdaDU T / 2. The three wrong answers invent mechanisms the engine does not carry. Nothing in the equations halves a failure rate, reclassifies a population at a test or fixes when a demand arrives.")

q(1,
 "A colleague hands in a one out of one calculation for the EKULAMA channel and reports 0.010512000000 as its PFDavg. What did they leave out?",
 "The factor of one half, so they reported lambdaDU T where the form is lambdaDU T / 2.",
 ["The beta factor term of b lambdaDU T / 2, which every single channel calculation carries.",
  "The division by three in the independent piece of the form.",
  "The channel equivalent down time behind the interval."],
 "The simplified forms section prints 0.005256000000 for this channel and 0.010512000000 as lambdaDU T, derived, so reporting the product itself is the half dropped. A 1oo1 carries no beta factor term at all, and a typed one is ignored with a warning. The division by three belongs to the 1oo2 form. The channel equivalent down time is the full form's bookkeeping, and it collapses onto the half here.")

q(2,
 "The engine implements one set of equations only. In which corner do the simplified forms come out of them exactly?",
 "When lambdaDD is zero and the repair time after a proof test is zero.",
 ["When the beta factor is zero and the proof test coverage is exactly one, whatever the detected failure rate happens to be.",
  "When the proof test interval is one year at the engine constant of 8760 hours.",
  "When the rate times the interval stays under 0.1."],
 "The engine's own basis says it verbatim: the Annex B reliability block diagram simplified equations reduce to the ISA-TR84.00.02 simplified forms when lambdaDD = 0 and MRT = 0. A zero beta factor and a perfect proof test leave the detected population and its restoration time in the bookkeeping. The interval and the rare event threshold are unrelated to the identity.")

q(3,
 "The EKULAMA channel is run through the full form with lambdaDD and the repair time after a test both set to zero, and each architecture is set beside its simplified form. What does the comparison column read?",
 "Identical on all five rows.",
 ["Identical on the single channel rows and close on the redundant rows.",
  "Identical on every row except the one out of three, whose evidence is thinner.",
  "Close on all five rows, within the relative difference a linearised form carries."],
 "The identity table prints identical for 1oo1, 1oo2, 2oo2, 2oo3 and 1oo3, five rows and five identical pairs, which is what lets the simplified forms be taught as a special case. The redundant rows are identical too. The thinner evidence behind the one out of three is a separate point about its validation and does not touch this identity. Nothing in the table reads close.")

q(0,
 "What takes a real subsystem out of the corner where the simplified forms and the full form agree?",
 "Detected failures, a repair time after a proof test, or a proof test coverage below one.",
 ["A beta factor above zero, a risk reduction factor above one thousand, or a band of 3.",
  "An interval longer than a year, a lifetime shorter than it, or an unknown architecture.",
  "A rate small enough for the rare event assumption, a typed betaD, or a sum near one."],
 "The identity section names exactly three departures: detected failures, an MRT after a test, or partial proof test coverage, and says the engine then keeps the equivalent down time bookkeeping the simplified forms drop. A beta factor above zero is carried by the simplified forms themselves. A long interval, an unknown architecture and a lifetime shorter than the interval are refusals or warnings and never the identity. The last listing names inputs the identity does not turn on.")

q(1,
 "This course fixes what one fraction is called before anything is computed. Which wording does it legislate?",
 "Always the beta factor, and betaD when the fraction applies to detected failures.",
 ["Always the common cause ratio, with a detected common cause ratio beside it.",
  "Always the common cause fraction, written out on every use.",
  "Always the dependent failure factor, abbreviated after first use."],
 "The vocabulary section rules that the bare word already means a vapour fraction in the fluid course and an orifice diameter ratio in the metering course, so this course writes the beta factor every time, with betaD for detected failures. The three other wordings are invented here and appear nowhere in the engine or its digest.")

q(2,
 "How does this course write the probability of failure on demand of a subsystem, and how does it write the credited figure of an individual protection layer?",
 "PFDavg for the subsystem, and IPL PFD for the credited layer.",
 ["Average unavailability for the subsystem, and layer credit for the credited figure of a layer.",
  "IPL PFD for the subsystem, since both are averages, and PFDavg for the layer.",
  "PFDavg for both, since the two are averaged the same way."],
 "The vocabulary section fixes PFDavg for a SIF or a subsystem, which is an average over the proof test interval, and IPL PFD for the single figure an analyst credits on a LOPA row. Swapping the two names reverses the rule. Average unavailability and layer credit are wordings the engine never uses. Calling a credited layer figure an average misreads what an analyst types onto a row.")

q(3,
 "One word in this course may be written in only one place. Which rule does the vocabulary carry?",
 "It appears only inside tolerable mitigated event likelihood, the TMEL, a frequency per year.",
 ["It may be used for any input probability on a LOPA row, since every one of them is a chance that something happens at all.",
  "It is reserved for the band a risk matrix returns, which this course reads across from the risk and change course of the academy.",
  "It is used for the achieved figure a verification returns, which is then compared with the figure the row requires of it."],
 "The vocabulary section allows the word only inside tolerable mitigated event likelihood, because a matrix score and a Bayesian figure elsewhere in the academy already own it. The engine takes probabilities and PFDavg values and names them as such. This course grades no matrix band at all, and a verification returns a PFDavg.")

emit(Q, '/root/hse-wip-lopa/banks/h3i_m01.json', expect_n=15)
finish()
