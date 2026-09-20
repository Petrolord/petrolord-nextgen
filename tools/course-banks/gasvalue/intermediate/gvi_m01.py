import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Professional m01, Four Routes and Their Envelopes.
# Draws on m01's four lessons only: digest SECTION 16 (ROUTE_TEMPLATES and its
# notes) and SECTION 17 (screenRoute on EGBEMA, the verdicts, the studio's
# opening screen and the refusal). Every figure, basis word and engine sentence
# is a string the digest prints. Every limit is the EGBEMA study's own input,
# invented and illustrative, and no question keys a limit as the right one.

q(2, "How does ROUTE_TEMPLATES ship the limit on each of its route requirements?",
 "Unset (null): the envelope is the study's to fill.",
 ["Set to each licensor's published figure.",
  "Set to the EGBEMA study's limits, which the studio opens with.",
  "Set on physical law for volume, and left null on composition."],
 "The digest prints ROUTE_TEMPLATES with a limit column that reads null on every requirement: \"Every limit ships unset (null): the envelope is the study's to fill.\" The studio opens with every limit unset, and every route then reads not fully screened.")

q(0, "One requirement appears in the envelope of all four routes in ROUTE_TEMPLATES. Which is it?",
 "Minimum volume, in MMscfd.",
 ["Maximum inerts, as a mole fraction.",
  "Minimum heating value, in Btu/scf.",
  "Maximum CO2 before treatment, as a mole fraction."],
 "The template table carries a Minimum volume row in MMscfd for cng, mini_lng, lpg_extraction and gas_to_power. The LPG route carries no Maximum inerts row, mini LNG and LPG carry no Minimum heating value, and Maximum CO2 before treatment belongs to mini LNG alone.")

q(3, "A template note reads: \"CO2 freezes in a liquefaction train and must be removed first. The limit is the licensor's.\" Which route and requirement carry it?",
 "Mini LNG, on Maximum CO2 before treatment.",
 ["CNG, on Minimum heating value.",
  "Gas to power, on Maximum inerts.",
  "LPG and condensate extraction, on Minimum liquids content."],
 "The digest lists the notes the templates carry on two requirements, and this one sits on Mini LNG, Maximum CO2 before treatment. The LPG route's Minimum liquids content carries the other note, about the liquids paying for the plant. Neither note gives a number.")

q(1, "Which requirement carries the template note \"Below this the liquids do not pay for the plant, whatever the gas is worth.\"?",
 "Minimum liquids content, in gal/Mscf of C3+, on the LPG route.",
 ["Minimum volume, in MMscfd, on the LPG and condensate route.",
  "Maximum CO2 before treatment, a mole fraction, on mini LNG.",
  "Minimum heating value, in Btu/scf, on gas to power or gas to wire."],
 "The digest prints the note on LPG and condensate extraction, Minimum liquids content, whose unit in the template is gal/Mscf of C3+. The mini LNG CO2 requirement carries the other note, and the Minimum volume and heating value rows carry none.")

q(1, "screenRoute forms a margin on every checked requirement. How is it formed on a MAXIMUM requirement?",
 "The limit minus the actual; a negative margin is a failure.",
 ["The actual minus the limit; a negative margin is a failure.",
  "The limit minus the actual; a positive margin is a failure.",
  "The actual over the limit; a ratio above one is a failure."],
 "The digest: \"The margin column is the actual minus the limit on a minimum requirement and the limit minus the actual on a maximum; a negative margin is a failure, and the shortfall is its size.\" The CNG inerts, 0.0460 against a limit of 0.06, print a margin of 0.0140 and a pass.")

q(3, "EGBEMA's mini LNG route checks its CO2 mole fraction of 0.0280 against the study's Maximum CO2 before treatment of 0.02. Which status and margin does the check table print?",
 "fail, with a margin of -0.0080",
 ["pass, with a margin of 0.0140",
  "fail, with a margin of -2.5000",
  "unchecked, with a margin of none"],
 "The mini LNG CO2 row prints actual 0.0280, limit 0.02, status fail, margin -0.0080. The 0.0140 is the pass margin on the inerts rows, -2.5000 is mini LNG's volume margin against its limit of 10, and unchecked with none is the gas to power inerts row.")

q(0, "EGBEMA flares 7.5 MMscfd. Against the study's limits, which route's Minimum volume check reads fail?",
 "Mini LNG, against a limit of 10, margin -2.5000.",
 ["Gas to power, against a limit of 3, margin 4.5000.",
  "LPG extraction, against 5, margin 2.5000.",
  "Compressed natural gas, against 5, margin 2.5000."],
 "Every route reads the same actual, 7.5000. Against mini LNG's limit of 10 the margin is -2.5000 and the status fail. Against 5 on CNG and LPG it is 2.5000 and a pass, and against 3 on gas to power it is 4.5000 and a pass.")

q(2, "On gas to power, the study typed minVolumeMMscfd 3 and minGhvBtuScf 950 and nothing else. What does the check table print on that route's Maximum inerts row?",
 "Actual 0.0460, limit unset, status unchecked, margin none.",
 ["Actual 0.0460, limit 0.06, status pass, margin 0.0140.",
  "Actual 0.0280, limit unset, status fail, margin -0.0080.",
  "Actual 0.0460, limit unset, status pass, margin none."],
 "The digest prints the gas to power Maximum inerts row as 0.0460, unset, unchecked, none: \"A requirement with no limit is reported unchecked; an unset limit is not a satisfied one.\" The 0.06 limit with a 0.0140 margin is the CNG and mini LNG inerts row, where a limit was typed.")

q(3, "Both of gas to power's checked requirements pass on EGBEMA, with margins of 4.5000 and 298.4110. Which verdict does screenRoute give the route?",
 "not fully screened, with Maximum inerts in uncheckedRequirements",
 ["passes, with Maximum inerts in uncheckedRequirements",
  "passes, with none in failures and none unchecked",
  "fails, with Maximum inerts named in failures"],
 "The verdict table prints Gas to power or gas to wire: not fully screened, failures none, uncheckedRequirements Maximum inerts. Three verdicts appear: passes, fails and not fully screened, and a requirement with no limit is reported unchecked.")

q(0, "Which requirements does the failures field name on EGBEMA's mini LNG route?",
 "Minimum volume and Maximum CO2 before treatment.",
 ["Maximum CO2 before treatment and Maximum inerts.",
  "Maximum CO2 before treatment, with none other.",
  "All three: volume, CO2 before treatment, inerts."],
 "The failures field reads: Minimum volume: 7.5000 against 10, short by 2.5000 MMscfd; Maximum CO2 before treatment: 0.0280 against 0.02, short by 0.0080 mole fraction. Mini LNG's Maximum inerts reads pass at 0.0460 against 0.06, margin 0.0140, so it is not among the failures.")

q(2, "How does mini LNG's failures field print the volume requirement it breaks?",
 "7.5000 against 10, short by 2.5000 MMscfd",
 ["7.5000 against a limit of 5, short by 2.5000 MMscfd",
  "10 against 7.5000, a shortfall of 4.5000 MMscfd",
  "7.5000 against 10, short by 0.0080 mole fraction"],
 "The digest's failures entry: \"Minimum volume: 7.5000 against 10, short by 2.5000 MMscfd\". The limit of 5 is the CNG and LPG volume limit, where 7.5000 passes, 4.5000 is the gas to power volume margin, and 0.0080 mole fraction is the shortfall on the CO2 requirement.")

q(1, "The CNG and gas to power routes both check EGBEMA's heating value of 1248.4110 Btu/scf. Which margins does the check table print?",
 "248.4110 on CNG and 298.4110 on gas to power",
 ["298.4110 on CNG, 248.4110 on gas to power",
  "248.4110 on CNG, with gas to power's row unchecked",
  "248.4110 on both, against 1000"],
 "The study typed minGhvBtuScf 1000 on CNG and 950 on gas to power. The table prints margins of 248.4110 and 298.4110, both pass. Gas to power's unchecked row is Maximum inerts, the requirement it left unset.")

q(0, "The Flare Gas to Value Studio opens with every requirement limit unset. Which verdicts does screenRoute give the four EGBEMA routes?",
 "not fully screened, on every one of the four",
 ["passes, on all four, as nothing is breached",
  "fails, on all four, as no requirement is met",
  "passes on three, with mini LNG left failing"],
 "The digest prints the same four routes with every limit unset, as the studio opens: Compressed natural gas, Mini LNG, LPG and condensate extraction, and Gas to power or gas to wire all read not fully screened. An unset limit is not a satisfied one.")

q(3, "screenRoute is asked to screen a gas the analysis refused. What does it answer?",
 "It refuses: a characterised gas is required.",
 ["Every requirement reads unchecked, and each route reads not fully screened.",
  "Every requirement reads fail, and mini LNG is listed in screenedOut.",
  "The routes are screened on the gas as typed, with each status printed."],
 "The digest's probe table for screenRoute: a gas the analysis refused gives \"REFUSED: A characterised gas is required.\" No check table and no verdict are printed for it.")

q(2, "Beside the notes two of its requirements carry, the engine prints one note on ROUTE_TEMPLATES as a whole. Which sentence opens that note?",
 "\"Requirement limits are yours to set.\"",
 ["\"The limit is the licensor's.\" on every row of the table.",
  "\"Below this the liquids do not pay for the plant.\"",
  "\"An unset limit is a pass.\""],
 "The engine's note on the templates opens \"Requirement limits are yours to set.\" The licensor sentence is the note on mini LNG's CO2 requirement alone, the liquids sentence is the note on the LPG route's liquids content, and the digest reports a requirement with no limit unchecked.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/intermediate/gvi_m01.json', label='gvi_m01', expect_n=15)
finish()
