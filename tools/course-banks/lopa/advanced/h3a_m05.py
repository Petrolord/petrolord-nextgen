import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, Expert tier, module 05 "What the Engine Does Not Do".
# Digest sections drawn on: 30 (what the engine does not do), 1 (what it
# computes and what it declines), and the SPECIFICATION point of section 6
# only, which is the Expert half of that section.

q(0,
 "Why does this engine carry no hardware fault tolerance check?",
 "The requirement is a normative table of IEC 61511-1 and IEC 61508-2, and the engine does not restate a licensed table it could not check against a public source.",
 ["The check is a special case of the PFDavg calculation and adds nothing.",
  "The check belongs to high demand functions and has no low demand form.",
  "The check was left out of the engine's scope and is planned for a later release."],
 "The engine's header gives the two reasons together: the requirement lives in a normative table of a licensed standard and there was no public source to check a restatement against. It is a separate requirement and no part of the PFDavg arithmetic, it applies in low demand as well, and this engine has no repair history and nothing is pending on it."),

q(1,
 "What does the analyst do about the architectural constraint, and what does a passing PFDavg settle?",
 "The analyst checks the architecture against the standard separately, because a PFDavg that meets its target does not by itself satisfy the architectural constraint.",
 ["The analyst reads the constraint off the engine's band, since a subsystem whose achieved figure sits inside the required band has already demonstrated the redundancy the constraint asks for on that band.",
  "The analyst takes the constraint as satisfied whenever the architecture is redundant.",
  "The analyst raises it only when the engine returns a warning about the architecture."],
 "The course states the action plainly: check the architecture against the standard separately, because a PFDavg that meets the target does not by itself satisfy the architectural constraint. The engine returns no band, no warning and no output of any kind about the constraint, so nothing in its answer can settle it, and redundancy alone is not the test the standard applies."),

q(2,
 "What does the engine do about high demand or continuous mode?",
 "Nothing at all: every band it reports is low demand, and it exports no per hour band and no function that would return one.",
 ["It computes a per hour figure alongside the PFDavg and reports whichever of the two the demand rate makes appropriate for the function in hand.",
  "It converts the PFDavg to a per hour figure by dividing by the proof test interval, which is the conversion the standard sets out for the purpose.",
  "It refuses any call whose demand rate is high, and names the demand rate field."],
 "The engine's header says every band here is low demand, and its exported names carry one band table and nothing else. There is no second table, no conversion and no demand rate input at all, so the engine cannot refuse on one either. That is what makes the wrong mode a quiet error rather than a loud one."),

q(3,
 "The demand rate on a function turns out to be high. What does the analyst do, on the engine's own account of the limit?",
 "Uses a PFH method, because a low demand PFDavg is the wrong quantity there.",
 ["Shortens the proof test interval until the low demand treatment applies again, which is what brings the demand rate back below the test rate on the function.",
  "Keeps the PFDavg and records the demand rate beside it as a caveat in the note.",
  "Raises the target PFDavg by the ratio of the demand rate to the test rate."],
 "The course's row says the analyst uses a PFH method when the demand rate is high, and that a low demand PFDavg is the wrong quantity there. A wrong quantity is not repaired by shortening an interval, by a caveat beside it or by scaling the target, because the average probability is no longer what characterises the function."),

q(1,
 "What failure rate data does the engine carry?",
 "None: users supply every lambda, and the golden rates are labelled illustrative or cited to where they came from.",
 ["A small default library for valves, transmitters and logic solvers, used whenever the analyst leaves a rate blank on the subsystem.",
  "The rates of the published worked example, which it reuses for any subsystem of the same architecture.",
  "The rates of IEC 61508 and the ISA technical reports, reproduced under citation."],
 "The engine carries no failure rate data at all. Every lambda arrives as an input and the golden rates are labelled illustrative or cited. There is no default that fills a blank, the published rates belong to that source's own example, and licensed tables are cited here and never reproduced."),

q(2,
 "The engine does not choose the TMEL, the initiating event frequency or an IPL PFD. What is the analyst's duty on each?",
 "Every one is an input, and the analyst justifies each against the organisation's criteria.",
 ["Every one is an input, and the analyst may leave any of them blank, in which case the engine works from the remaining terms of the row and reports which ones it used.",
  "Every one is an input, and the engine checks each against the ranges the standard publishes before it uses the row.",
  "Every one is derived by the engine from the scenario description supplied with the row."],
 "The course's row reads that every one is an input and the analyst justifies each against the organisation's criteria. The engine invents no number and derives none of these, it checks only the ranges its own refusals police, and a missing term is refused rather than worked around."),

q(0,
 "The engine forms no judgement about whether a layer is truly independent. What does it do, and what is left to the analyst?",
 "It applies the credit flags exactly as they are typed, and the analyst audits each IPL against the initiating cause and against the other layers on the row.",
 ["It compares the layers on the row and withholds credit from any that share a named device.",
  "It credits every layer and leaves the analyst to remove the ones that are not independent.",
  "It refuses a row whose layers have not been audited, and names the offending layer."],
 "The credit rules are flags applied as given, and the analyst does the auditing against the initiating cause and the other layers. The engine cannot see that an alarm shares a transmitter with the initiating loop unless the analyst says so, so it neither compares devices nor refuses an unaudited row, and it withholds credit only where the flags say to."),

q(1,
 "Which sentence does the engine give, verbatim, as the rule for crediting an IPL?",
 "An IPL is credited once, and only when flagged independent === true and not flagged auditable === false.",
 ["An IPL is credited once, and only when flagged independent === true and also flagged auditable === true, so that a layer with no auditable flag at all goes uncredited.",
  "An IPL is credited once for each separate hazard scenario it protects against, provided that it is flagged independent on the row.",
  "An IPL is credited whenever its typed figure lies above zero and no higher than one, since a valid figure is what credit turns on."],
 "The rule quoted above is the engine's own. A missing auditable flag is not a false one, so a layer with no such flag can still be credited, which is what makes the rule exactly as narrow as it is. Credit is one per IPL whatever it protects, and a valid figure is a range check with no bearing on credit."),

q(2,
 "What evidence stands behind the IPL credit rules?",
 "No independent route validates them: they are the engine's contract, pinned by behaviour tests, and the judgement stays with the analyst.",
 ["The independent oracle decides them in exact rational arithmetic, in the same way it decides every frequency product and every band boundary on a row.",
  "Two published sources state the same rules, which is the evidence behind the Annex B forms.",
  "The published worked example reproduces only when the rules are applied as typed."],
 "The engine's validation record says no independent route validates the credit rules. The oracle decides the LOPA arithmetic and the boundaries in exact rationals, the two published statements stand behind the Annex B equations, and the published reproduction is about the verification half, so none of the three reaches the credit rules."),

q(0,
 "What did the shared negative control on the credit rules show?",
 "It removed the auditable exclusion from both the engine and the oracle at once and the whole suite stayed green, so the control cannot see that rule at all.",
 ["It removed the auditable exclusion from the engine alone and the suite went red.",
  "It removed the auditable exclusion and the golden had to be rewritten to match.",
  "It changed the independence flag to a string and the engine refused the row."],
 "The control removed the exclusion from both sides at once and the suite stayed green, because the oracle had no separate opinion to disagree with. A control that stays green when a rule is deleted is a control that cannot see the rule. Nothing went red, no golden was rewritten and the string flag is a separate behaviour the engine handles by withholding credit."),

q(1,
 "The engine has two halves. What are they, and what does each answer?",
 "A determination half that finds the risk reduction still missing against a tolerable frequency, and a verification half that computes the PFDavg a function achieves.",
 ["A determination half that chooses the tolerable frequency for the consequence, and a verification half that checks the chosen figure against the band table the standard publishes for low demand functions.",
  "A determination half that bands an achieved PFDavg, and a verification half that sums subsystems.",
  "A determination half for low demand functions and a verification half for high demand ones."],
 "The determination half is a layer of protection analysis: a scenario frequency, the reduction still missing against a tolerable frequency and the band that reduction falls in. The verification half computes the PFDavg by the Annex B low demand equations. The engine chooses no tolerable frequency, banding and summing both live in the verification half, and there is no high demand half at all."),

q(3,
 "What do the engine's functions return?",
 "Either a result object carrying a basis block, or an object with an error and a field naming the offending input.",
 ["Either a result object carrying a basis block, or a null, with the offending input left for the caller to find by inspecting the arguments it passed.",
  "Always a result object, with any problem at all reported as a warning inside the basis block of the result it hands back.",
  "Either a result object or a thrown exception carrying both the message and the name of the input field that offended the engine."],
 "Every function returns a result object with a basis block or an object with an error and a field, where the field names the offending input. A null would leave the caller to guess, a warning is returned only alongside a real result, and nothing is thrown, which is why a refusal can be quoted as a message and a field."),

q(3,
 "Which pair of exported constants does the engine carry?",
 "DECADE_SNAP at 1e-9 and HOURS_PER_YEAR at 8760.",
 ["DECADE_SNAP at 1e-9 and a default proof test interval of 8760 hours for a subsystem whose interval is left blank by the analyst who typed it.",
  "DECADE_SNAP at 1e-9 and a table of low demand failure rates for the five architectures.",
  "A default tolerable frequency and HOURS_PER_YEAR at 8760 hours in a year."],
 "The exported constants include DECADE_SNAP at 1e-9 and HOURS_PER_YEAR at 8760, alongside the architecture list, the outcome states and the band table. There is no default interval, no rate table and no default tolerable frequency, because the engine invents no number."),

q(2,
 "What does `decadeOf` refuse?",
 "Nothing at all: it returns null for zero, for a negative number, for a string and for anything off a decade.",
 ["A negative number and a string, which it refuses by naming the field, while anything off a decade comes back as the nearest decade within the snap.",
  "Anything that sits off a decade entirely, which it names as the offending input in the error object that it returns.",
  "A value inside the snap of a decade, which it treats as ambiguous."],
 "The engine's `decadeOf` refuses nothing and returns null in all four of those cases. A value inside the snap is exactly the case it DOES answer, by returning the power of ten. Nothing is named as an offending input, because there is no error object here at all."),

q(0,
 "The engine invents no number. Which inputs does that statement cover?",
 "The initiating event frequency, every enabling condition and conditional modifier probability, every IPL PFD, every failure rate and the tolerable frequency, all of them typed.",
 ["Every input except the tolerable frequency, which the engine derives from the band.",
  "Every input except the failure rates, which come from the vendored golden.",
  "Every input except the proof test interval, which defaults to one year."],
 "The engine's header lists them all as inputs: the initiating event frequency, every enabling condition and conditional modifier, every IPL PFD, every failure rate and the tolerable frequency. There is no exception in that list, so no band supplies a tolerance, the golden supplies no rate to a user's call, and no interval defaults."),

emit(Q, '/root/hse-wip-lopa/banks/h3a_m05.json', expect_n=15)
finish()
