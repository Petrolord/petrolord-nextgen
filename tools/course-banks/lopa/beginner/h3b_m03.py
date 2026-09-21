import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, ASSOCIATE m03 "Independent Protection Layers".
# Digest section drawn on: 6 (IPL credit, independence, the auditable flag,
# one credit per IPL, the credited product and the mitigated frequency, what
# crediting everything would have done, and the specification statement).

q(2,
  "Which sentence is the engine's credit rule, quoted in its own words?",
  "An IPL is credited once, and only when flagged independent === true and not flagged auditable === false.",
  ["An IPL is credited for every entry carrying a name and an admissible figure.",
   "An IPL is credited when any affirmative value sits in the independence field.",
   "An IPL is credited when its figure is below the row's required target."],
  "That sentence is the engine's own credit rule, quoted verbatim. Independence has to be the value true itself, auditability only has to be not denied, and each layer takes one credit. A name and an admissible figure are necessary and never sufficient, no other affirmative value is read as independence, and the required target plays no part in the credit decision at all.")

q(0,
  "Four layers are listed on the ORONI row. Which two does the engine credit?",
  "The high level alarm with operator response and the relief valve sized for the blocked outlet case.",
  ["The relief valve sized for the blocked outlet case and the BPCS level trip on the initiating controller, which are the two devices on the list.",
   "The high level alarm and the operator round, the two layers needing a person.",
   "All four, since each carries a figure inside the range."],
  "The course's credit table shows the high level alarm with operator response and the relief valve sized for the blocked outlet case as credited. The BPCS level trip is set aside as not flagged independent, and the operator round is set aside as flagged not auditable, so neither joins the product and the row does not credit all four.")

q(1,
  "The BPCS level trip on the initiating controller is not credited. What reason does the engine give?",
  "not flagged independent (independent must be true to take credit)",
  ["flagged not auditable, because no audit record exists for the trip and the engine will not take credit for a layer nobody checks",
   "not flagged independent, because the trip sits on the same controller as the initiating event and the engine detected the shared hardware",
   "one credit per IPL has already been taken"],
  "The engine's reason column reads: not flagged independent (independent must be true to take credit), in the engine's own words. The auditable reason belongs to the operator round on the same row. The engine cannot see shared hardware: it reads the flag the analyst set and nothing else. One credit per IPL is the duplicate rule and applies to a repeated name.")

q(3,
  "The operator round on a procedure never audited is stated as independent true and auditable false. What does the engine do with it?",
  "It sets the layer aside, with the reason flagged not auditable.",
  ["It credits the layer, because independence is the positive claim the rule tests and the audit column carries no weight in the credit decision.",
   "It refuses the whole call and names the field, because a layer flagged not auditable cannot be carried on a worksheet the engine will compute.",
   "It credits the layer at half of its stated figure."],
  "The credit table lists the operator round under the layers not credited, with the reason flagged not auditable. The rule credits a layer only when auditable is not false, so an explicit false removes the credit even though independence was asserted. A flag never refuses the call, and the engine never adjusts a figure it was given.")

q(2,
  "An analyst writes the string yes into an IPL's `independent` field. What happens to that layer?",
  "It is not credited, and it is listed under `notCredited` with the reason that independent must be true to take credit.",
  ["It is credited, because the engine reads any affirmative value as a claim.",
   "The call is refused and the engine names the offending field.",
   "It is credited and a warning is returned beside the result."],
  "The course is explicit that the test is on the value true itself: an IPL whose independent is the string yes is not credited, and the engine lists it under notCredited with the reason that independent must be true to take credit. A missing flag is treated the same way. Credit is given only when independence has been asserted in the one form the engine accepts, and nothing about it is refused or warned.")

q(0,
  "What does the engine report as `iplProduct` for the ORONI row, and from which layers?",
  "0.001000000000, from the two credited layers at 0.1 and 0.01.",
  ["0.001000000000, from all four listed layers, since every entry on the list enters the product once the engine has checked its figure.",
   "0.000013500000, from the two credited layers, which is the figure the engine prints under this key for the row as it stands.",
   "0.01, from the relief valve alone."],
  "The engine key `iplProduct` reads 0.001000000000 and it is the product of the credited layers only, the high level alarm at 0.1 and the relief valve at 0.01. 0.000013500000 per year is `mitigatedFrequencyWithoutSifPerYr`, one step further on. The two uncredited layers contribute nothing to the product at all.")

q(1,
  "Which key carries 0.000013500000 per year, and what has been applied to reach it?",
  "`mitigatedFrequencyWithoutSifPerYr`, the unmitigated frequency carried by the credited product.",
  ["`unmitigatedFrequencyPerYr`, the initiating frequency carried by both products.",
   "`mitigatedFrequencyWithoutSifPerYr`, the unmitigated frequency carried by the credited product and then by the tolerable frequency the row is held to.",
   "`iplProduct`, the four listed layers multiplied together."],
  "The engine returns `mitigatedFrequencyWithoutSifPerYr` as 0.000013500000 per year, which is 0.013500000000 per year carried by the credited product of 0.001000000000. The tolerable frequency is never multiplied into a frequency; it divides one. `unmitigatedFrequencyPerYr` is the figure before any layer is credited, and `iplProduct` holds the credited layers only.")

q(3,
  "Suppose all four of ORONI's listed layers had been credited. What would the mitigated frequency have read?",
  "0.000000135000 per year.",
  ["0.000013500000 per year, because the two uncredited layers carry the same figure as each other and so leave the product where it already was.",
   "0.013500000000 per year, because crediting every listed layer returns the row to the frequency it carried before any layer was applied to it.",
   "0.000001000000 per year."],
  "The course states what crediting everything would have done: the mitigated frequency reads 0.000000135000 per year against 0.000013500000. 0.013500000000 per year is the unmitigated frequency and 0.000001000000 per year is this row's TMEL, neither of which is what crediting two further layers produces.")

q(2,
  "Crediting all four layers moves the mitigated frequency by what derived factor?",
  "100.000000 times lower.",
  ["10.000000 times lower, which is the factor a single further credited layer at its stated figure would have carried the frequency by on this row.",
   "1000.000000 times lower, because the two layers left out of the product carry figures that multiply to a whole three decades between them.",
   "3.333333 times lower."],
  "The course gives the comparison as derived, 100.000000 times lower, from 0.000013500000 per year to 0.000000135000 per year. The two layers set aside carry 0.1 and 0.1, whose product is two decades. 3.333333 is the derived factor for a forgotten enabling condition, which is a different table entirely.")

q(0,
  "Crediting all four layers changes the required risk reduction factor how?",
  "It falls from 13.500000 to 0.135000.",
  ["It falls from 13.500000 to 1.350000, one decade lower, which is what a single extra credited layer at its stated figure is worth here.",
   "It rises from 13.500000 to 135.000000, because the row now claims more reduction than the plant can evidence for it.",
   "It stays at 13.500000, since credit changes the frequency alone."],
  "The course says the required RRF drops from 13.500000 to 0.135000 when all four layers are credited. 1.350000 and 135.000000 are the figures this row reports at other tolerable frequencies on the TMEL ladder and neither belongs here. The required RRF is the mitigated frequency over the TMEL, so a change in the credited product moves it directly.")

q(1,
  "What outcome state does the ORONI row report when all four layers are credited, and what was it before?",
  "NO_SIF_REQUIRED, where it had been SIL1.",
  ["RISK_REDUCTION_BELOW_SIL1, where it had been SIL1, because some reduction is still missing once the two extra layers have taken their credit.",
   "SIL1, where it had been SIL2, because two further credited layers move the row down exactly one band on the low demand table.",
   "BEYOND_SIL3_REDESIGN, where it had been SIL1."],
  "The course says crediting everything moves the outcome from SIL1 to NO_SIF_REQUIRED, because the required RRF falls to 0.135000, which is below one. A demand at or below one needs no function. The row was SIL1 before, so SIL2 is not where it started, and nothing here moves a row beyond the table.")

q(2,
  "Why does the engine refuse two IPLs with the same name, case ignored?",
  "Because a layer counted twice would halve the frequency twice for one piece of hardware, and one credit is given per IPL.",
  ["Because two entries sharing a name cannot be told apart in the output.",
   "Because the engine compares names to decide which layer is independent.",
   "Because the credited product would then exceed one."],
  "The course's reason is arithmetic: a layer counted twice would halve the frequency twice for one piece of hardware, which is why one credit is given per IPL and a repeated name is refused with case ignored. The engine does not use names to judge independence, the output is not the reason for the rule, and a product of probabilities cannot exceed one.")

q(3,
  "What does the course say about the evidence behind the independence and auditable credit rules?",
  "They are specification: the validation record says no independent route validates them.",
  ["They are validated by the oracle in exact rational arithmetic.",
   "They are validated against a published worked example, whose credited layers the engine reproduces to the three significant figures the source prints.",
   "They are derived from a normative table the engine restates."],
  "The course says plainly that these rules are specification and that the engine's own validation record reports no independent route validating them. They are the engine's contract, pinned by behaviour tests. The oracle decides arithmetic boundaries and has no say in credit policy, no published example is claimed for them, and the engine restates no licensed table.")

q(0,
  "What happened when the shared negative control removed the auditable exclusion from both the engine and the oracle?",
  "The suite stayed green, so no test in it could tell the two behaviours apart.",
  ["The suite failed on the ORONI row, which is the evidence that the auditable exclusion is doing real work in the engine as it stands today.",
   "The suite failed on every golden LOPA case, because each of them carries at least one layer whose auditable flag has been set to false.",
   "The control could not be run against this engine."],
  "The course reports the shared negative control: the auditable exclusion was removed from both the engine and the oracle and the suite stayed green. That is why the credit rules are described as specification and the judgement of whether a layer really is independent and auditable stays with the analyst.")

q(1,
  "Who decides whether a layer really is independent and auditable?",
  "The analyst, whose judgement the flags record and the engine then applies as typed.",
  ["The engine, which compares each layer against the initiating cause itself.",
   "The oracle, which checks each claimed layer against the golden and writes the flags the engine will read when it comes to apply its credit rule.",
   "The band table, which admits a layer only inside its own decade."],
  "The course ends this material by saying the judgement of whether a layer really is independent and auditable stays with the analyst, and that the rules are flags applied as given. The engine cannot see what a layer shares with the initiating cause, the oracle settles arithmetic, and the band table decides bands and nothing about credit.")

emit(Q, '/root/hse-wip-lopa/banks/h3b_m03.json', expect_n=15)
finish()
