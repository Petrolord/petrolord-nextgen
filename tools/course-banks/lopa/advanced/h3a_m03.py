import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, Expert tier, module 03 "How Conservative Annex B Is".
# Digest sections drawn on: 28 (the time dependent route and where the forms
# depart), the Expert half of section 20 (the route B comparison for 2oo2),
# and the Expert half of section 24 (the warning threshold and the refusal).

q(0,
 "The oracle behind this engine's golden computes every case a second way. What is that second route?",
 "The time dependent unavailability of the subsystem, averaged over the interval by numerical quadrature, with nothing linearised and no equivalent down time in it.",
 ["The same Annex B equations evaluated a second time in exact rational arithmetic.",
  "The simplified forms evaluated with the detected rate and the MRT both set to zero.",
  "A Markov model of the subsystem solved for its steady state availability."],
 "The golden records a time dependent route: the unavailability as a function of time, averaged by quadrature, with nothing linearised. Recomputing the same equations would check the typing and nothing else. Zeroing the detected rate and the MRT gives the simplified forms, which are a special case of the same algebra, and no Markov solution is carried in the golden."),

q(1,
 "Across the golden cases read both ways, how does the engine sit against the time dependent route, and why?",
 "At or above it in all 28 cases, because the forms are first order in the failure rate times the interval and use equivalent down times, and both choices err high.",
 ["Above it on the redundant architectures and below it on the single channels, because the equivalent down time convention cuts both ways depending on how many channels share a failure.",
  "Below it in all 28 cases, because the linearisation drops a positive term of second order.",
  "Above it in most cases and below it in a few, with no stated direction to the error."],
 "The digest states that across 28 golden cases the engine sits at or above route B every time, and names the two reasons. There is no case in the set where the engine falls below, so a mixed direction or a direction that depends on the architecture is wrong. Being below everywhere would be the unconservative direction and is the opposite of what is measured."),

q(2,
 "Which golden case departs furthest from the time dependent route, and by how much?",
 "1oo1-long-interval, at 15.12 percent, on a case whose failure rate times interval is 0.438000.",
 ["dolan-valve-1oo2-ptc85, at 2.862e-2, which is the largest departure among the cases carrying imperfect coverage.",
  "tr84-2oo2, at 1.171e-2, which is the case whose published form carries no common cause term at all.",
  "2oo3-beta0, at 2.209e-2, the largest of the cases with no common cause."],
 "The largest departure printed is 1oo1-long-interval at 15.12 percent, and its failure rate times interval is 0.438000, well past the 0.1 at which the engine warns. The coverage valve at 2.862e-2, the 2oo2 at 1.171e-2 and the 2oo3 with no common cause at 2.209e-2 are all real departures from the same table and all smaller."),

q(3,
 "The published valve subsystem returns 0.001048767640 from the engine and 0.001043789195 on the time dependent route. What departure is printed against it?",
 "4.770e-3",
 ["8.000e-4, which is the departure printed against the pressure transmitter 2oo3",
  "2.862e-2, which is the departure printed against the same valve at reduced coverage",
  "1.171e-2, which is the departure printed against the 2oo2 case of the golden"],
 "The printed departure for that pair is 4.770e-3. 8.000e-4 belongs to the pressure transmitter 2oo3 with a perfect test, 2.862e-2 to the same valve at reduced coverage and 1.171e-2 to the 2oo2 case, so each wrong figure is a real row read against the wrong case."),

q(1,
 "The pressure transmitter 2oo3 departs by 8.000e-4 with a perfect test and by 9.482e-3 once its coverage falls. Which departure explains the growth?",
 "The coverage cross term, which Annex B charges more generously than the exact average does whenever the lifetime is at least the interval.",
 ["The linearisation of the single channel form, which drops a term of second order in the failure rate times the interval and therefore leaves the answer high.",
  "The missing common cause term for a 2oo2, which counts a failure of both channels twice.",
  "The bisection tolerance, which is one part in a trillion and grows with the lifetime."],
 "The coverage cross term is charged at two thirds of the interval times the lifetime where the exact average charges half the interval times the lifetime plus a sixth of the interval squared, so the coverage cases are conservative by construction. The linearised single channel term and the 2oo2 omission are the other two departures and neither is at work in a 2oo3 with coverage. Bisection is not involved in a PFDavg at all."),

q(0,
 "How does Annex B charge the coverage cross term, and what does the exact average charge?",
 "Annex B charges two thirds of the interval times the lifetime, where the exact average charges half the interval times the lifetime plus a sixth of the interval squared.",
 ["Annex B charges half the lifetime and the exact average charges half the interval.",
  "Annex B charges the whole lifetime and the exact average charges two thirds of it.",
  "Both charge the same term, and the coverage cases depart for a different reason."],
 "The digest derives the departure exactly this way, and notes that the exact charge is lower whenever the lifetime is at least the interval, which the engine requires it to be. Halving or taking the whole lifetime misstates both sides, and the coverage cases do depart, by 2.862e-2 on the valve at reduced coverage against 4.770e-3 with a perfect test."),

q(2,
 "Which of these is one of the four places the published forms depart from the exact average?",
 "The equivalent down time convention charges detected failures and the MRT more than the exact average does.",
 ["The band table rounds an exact decade upward, which pushes a subsystem sitting on a decade into the higher band and raises the reported figure.",
  "The series sum ignores the overlap between subsystems, which makes the summed function lower than the exact one and hides part of the conservatism.",
  "The bisection converges to one part in a trillion, which leaves a residue in every interval the engine returns."],
 "The four departures are the linearised single channel term, the equivalent down time convention, the coverage cross term and the missing 2oo2 common cause term. The decade rule is a band convention and moves no PFDavg. The sum does ignore a small overlap, which is second order at these values and is not one of the four. Bisection belongs to the interval search."),

q(1,
 "Why does Annex B overstate a 2oo2, on the counting the digest gives?",
 "A 2oo2 fails on the first dangerous failure of either channel, so a failure that takes out both at once is counted twice where it should be counted once.",
 ["A 2oo2 needs both channels to fail before it fails, so every common cause failure is counted only once where two independent failures would have been counted twice over.",
  "A 2oo2 carries a beta factor term that is applied to both channels, so the common cause share of the answer enters the sum a second time.",
  "A 2oo2 uses the group equivalent down time, which is longer than the channel equivalent down time."],
 "The 2oo2 trips only when both channels work, so it fails on the first dangerous failure of either and its PFDavg is twice one channel's. A common cause failure of both is no worse than one channel failing, so counting every failure as independent charges it twice, which errs high. Annex B carries no beta factor term for a 2oo2 at all, and a 2oo2 uses the channel equivalent down time."),

q(3,
 "At a beta factor of 0.1 the golden's time dependent route gives an exact 2oo2 average of 0.016460844922 against the Annex B figure. What is that Annex B figure, and how far above the exact average does it sit?",
 "0.017520000000, which is 6.43 percent above it",
 ["0.010576000000, which is 6.43 percent above it",
  "0.017317146501, which is 1.171e-2 above it",
  "0.017520000000, which is 15.12 percent above it"],
 "The printed pair is 0.017520000000 against 0.016460844922, derived 6.43 percent above it. 0.010576000000 is the full channel 2oo2 PFDavg from a different set of inputs. 0.017317146501 is the time dependent value of a different 2oo2 case in the departure table. 15.12 percent is the largest departure in the whole set and belongs to the long interval single channel."),

q(0,
 "What may a learner claim about the SIZE of the 2oo2 overstatement?",
 "Only the measured 6.43 percent, because the counting fixes the direction of the error while no closed form for its size is taught or graded in this course at all.",
 ["The beta factor times the Annex B figure, which is the share counted twice.",
  "Half the common cause term, since each of the two channels carries half of it.",
  "The difference between the group and the channel equivalent down times."],
 "The digest prints the counting mechanism and the measured 6.43 percent, and that is all. A closed form would have to be derived rather than read, and none is published here, so none of the three expressions above has a printed line behind it. The measured figure also carries the linearisation, so it is the total conservatism of that case."),

q(2,
 "On a subsystem with a perfect proof test, where does the engine's rare event warning fire?",
 "When the undetected failure rate times the interval goes above 0.1, where the overstatement becomes large enough to mention.",
 ["When the computed PFDavg goes above 0.1, which is the top of the SIL 1 band and the point at which no band can be claimed for the subsystem any more.",
  "When the interval goes above the lifetime, because the uncovered failures then have no end date to be averaged against at all.",
  "When the computed PFDavg reaches one, at which point the answer has stopped being a probability."],
 "The warning threshold is the undetected failure rate times the interval above 0.1, and with a coverage below one the engine forms that product with the lifetime in place of the interval. A PFDavg of one or more meets the REFUSAL boundary, which sits beyond the warning, and an interval above the lifetime is refused on its own field. The band ceiling is a separate matter and does not raise a warning."),

q(0,
 "Past the warning is the refusal. Where does the engine stop answering, and what does it say?",
 "At a computed PFDavg of one or more, with its own words: proofTestIntervalHours: the simplified equations give 4.38 here, which is not a probability: lambda x T is far outside the rare-event range they assume; use an exact (Markov) model",
 ["At a computed PFDavg above 0.1, where the warning already said the answer was generous.",
  "At the interval where the departure from the time dependent route reaches 15.12 percent.",
  "At any interval longer than the lifetime that was typed for the subsystem."],
 "The refusal boundary is a computed PFDavg of one or more, and the message quoted above is the engine's own. Between the warning and the refusal the engine keeps answering and keeps saying the answer overstates. The departure from the time dependent route is provenance and steers no refusal, and a lifetime shorter than the interval is refused on a different field."),

q(1,
 "How does a warning differ from a refusal in the verification half?",
 "A warning is returned WITH a result and says the answer overstates, while a refusal replaces the result entirely and carries no number.",
 ["A warning is returned with a result and no field name, while a refusal is returned with a result and a field name, so both carry a figure a note can quote.",
  "A warning names a field and a refusal names a function, and both of them come back alongside a computed PFDavg for the subsystem.",
  "A warning is raised by the oracle and a refusal by the engine."],
 "A warning arrives with a result, and a refusal replaces it with an object carrying an error and the field that was wrong. A refusal carries no number, so it cannot be quoted as a figure. The oracle raises nothing at run time: it wrote the golden."),

q(3,
 "Four golden cases and their printed departures: 1oo2-beta0 at 1.321e-2, 1oo2-ccf-dominated at 2.184e-4, 1oo3-beta0 at 2.121e-2 and 2oo3-beta0. Which of the four departs furthest from the time dependent route?",
 "2oo3-beta0, at 2.209e-2",
 ["1oo2-beta0, at 1.321e-2, the largest of the four on the printed table",
  "1oo3-beta0, at 2.121e-2, the largest of the four on the printed table",
  "1oo2-ccf-dominated, at 2.184e-4, the largest of the four on the printed table"],
 "The printed departures are 1.321e-2, 2.184e-4, 2.121e-2 and 2.209e-2, so the 2oo3 with no common cause departs furthest of the four. The common cause dominated 1oo2 departs least of them by a wide margin, because its answer is carried by a single channel term that the linearisation barely touches."),

q(2,
 "Why is a second ROUTE worth building, and what may its values be used for?",
 "It starts from a different description of the same situation, so a disagreement means something; its values are provenance and are never graded.",
 ["It repeats the published equations in higher precision, so a disagreement shows where the engine lost digits, and its values may be quoted as the achieved figure of a subsystem in a note.",
  "It replaces the published forms wherever the two disagree, so a site is assessed against whichever of the two routes gives the lower figure for the function.",
  "It proves the published forms correct wherever the two agree, so any agreeing row may be graded on either route."],
 "A second route arrives at the same quantity by different arithmetic, so it can disagree in a way that means something, and here it disagrees by a small consistent amount with an explanation. The time dependent values are recorded beside the golden as evidence about the published forms and no capstone grades one. A site is assessed against the published forms, so a note that reports a time dependent value has left the standard behind."),

emit(Q, '/root/hse-wip-lopa/banks/h3a_m03.json', expect_n=15)
finish()
