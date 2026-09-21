import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Expert m01, What This Module Holds Back. Digest sections 1, 3, 20 and 21.

q(2, "`HELD_FOR_LITERATURE` carries 11 items and `NOT_PROVIDED` carries 8. An inspection interval appears on one of them. Which list, and what does the difference commit the engine to?",
 "`NOT_PROVIDED`, which is the stronger statement of the two: an interval is outside the scope of the module altogether rather than a number waiting for a source to turn up.",
 ["`HELD_FOR_LITERATURE`, because the interval is already computed from the remaining life and only the risk basis underneath it is unsourced in this repository.",
  "`NOT_PROVIDED`, which is the weaker of the two: the entry is a placeholder the module intends to fill in as soon as an inspection standard is vendored beside it.",
  "Both lists at once, because an item that has no source and no implementation is entered twice so that a caller reading either one of them still finds it."],
 "Held means the number is in the code and its source is nowhere in the repository. Not provided means the quantity is absent from the scope, and an inspection interval, a minimum or retirement thickness and a fitness-for-service assessment are all on that second list.")

q(0, "The withdrawn sour-service severity region is not on `HELD_FOR_LITERATURE`, and `NOT_PROVIDED` names it marked withdrawn. Why is it not on the held list?",
 "It is not waiting for a source. The claim was withdrawn outright, and the engine also reports that absence through `regionProvided` and `materialGuidanceProvided`.",
 ["It sits on a third exported list of withdrawn features, which the whole screening door returns alongside the other two so that a caller can render all three of them together.",
  "It is held rather than listed, because the region expression still runs on every screening and only the two standard names were stripped out of the strings it returns.",
  "It came off both lists when the threshold value was kept, since a module that still prints a screening threshold is still classifying severity at that threshold."],
 "Both fields are false today and will stay false, so the absence arrives as a field and a caller cannot read it as an unset property. The region function is not exported and neither standard name appears anywhere in the 783 lines of the engine source.")

q(3, "The engine's own eleven-item held list names three of these four numbers. Which one does it not name?",
 "The bar to psia factor of 14.503773800722, which follows from the definition of the bar and of the pound-force.",
 ["The fugacity pressure cap of 250.000000000000 bar, above which this engine carries the coefficient flat and says in a note that it is doing so.",
  "The Blasius coefficient of 0.046000000000, which sets this module's friction factor on its turbulent branch.",
  "The moderate band of 50.000000000000 Pa, the lower of the two wall shear thresholds."],
 "The eleven items are the de Waard-Milliams constants, the scale placement question, the scale constants, the pH slope and reference, the 250 bar cap, the H2S threshold, the two transition ratios, the two shear thresholds, the category bands, the Blasius pair with the Reynolds 4000 switch, and three absent criteria. The engine exports the conversion factor as `BAR_TO_PSIA` and the course measures it as the psia reported for exactly 1 bar. The Pipeline and Line Sizing course computes its own friction factor and its own Reynolds number on a different correlation with a different transition, so the two will not agree on the same pipe.")

q(1, "One entry on the eleven-item held list is a question rather than a constant. Which entry, and what does this module do about it?",
 "Whether the protective scale factor multiplies the reaction term or the combined rate. This module multiplies the combined rate, after the series combination has been formed.",
 ["Whether the pH correction is applied before or after the wetting regime. This module applies the pH correction first, and the order moves the answer whenever the regime is intermittent.",
  "Whether the fugacity coefficient reaches H2S as well as CO2. This module applies it to both of them and reports `ph2sFugacityApplied` true on every screening that it runs.",
  "Whether the corrosion inhibitor credit is taken before or after the wall shear verdict. This module takes the credit first, which is why a stripped film leaves the rate exactly where it was."],
 "The two readings give materially different answers whenever mass transfer controls, which it does at the app's own defaults, and which of them the published correlation intends is not established here. Nothing downstream of that factor is graded in this course.")

q(0, "A paired battery moved fifteen of seventeen constants in the engine and in the oracle together and left the suite green. What does that establish about a suite comparing only those two files?",
 "A constant living in both cannot be validated by comparing them, because the gap between the two answers is genuinely zero whatever the constant is set to.",
 ["The tolerances were too loose for paired moves of that size, so the same battery run against a comparison near machine precision would have caught most of the seventeen.",
  "The oracle was reading its constants out of the engine at run time, and handing it a private copy of each one is what makes the comparison independent again.",
  "Seventeen constants is too small a battery, and a sweep that walked every constant in the module would have separated the two files on at least one of them."],
 "No tolerance saves a shared constant, because a tighter comparison makes it more invisible rather than less. Thirty constants are pinned instead, each measured out of the engine's behaviour and compared against a literal typed in a third file, with the golden's own block as a fourth.")

q(2, "A pinned constant agrees with the literal the course typed in a third file. What has that proved, and what does it leave open?",
 "That nobody moved the number quietly. Where the number came from is still held, because a pin compares a measurement against a third copy rather than against a source.",
 ["That the constant is the published value, since the course's literals were transcribed out of the correlation's own papers.",
  "That the engine and the golden agree with each other, which is what a pin is for and what the course records.",
  "Nothing whatever, because a literal typed by whoever read the engine is the same file twice over and the pin table decorates a comparison nobody made."],
 "A pin is a weaker instrument than a validation. Thirty constants are pinned that way, with the golden's own block as a fourth copy, and the course says plainly that no source for any of them exists in this repository.")

q(3, "How does the course reach the pH reference of 4.000000000000 and the friction branch switch at Reynolds 4000.000000?",
 "By bisecting what the engine returns: the pH at which it stops giving a factor, and the branch name it reports.",
 ["By reading `PH_REFERENCE` and `SHEAR_SWITCH_RE` off the engine's own export block, which is why both of them come back at a relative difference of exactly 0.",
  "By solving the pH correction and the Blasius form algebraically at two points each, in the way the reaction constants and the mass-transfer exponents are both reached.",
  "By lifting both of them out of the golden's `heldConstants` block, which is the copy the vendored jest suite cross-pins against its own typed literals."],
 "Measuring rather than reading an export is deliberate. An export tells you what the module declares and a measurement tells you what it actually uses, and both columns are printed so that a disagreement between them would be visible.")

q(1, "The scale constant A measures 2399.999999999998 out of the engine against a literal of 2400.000000000000. Why does the course print that rather than round it into agreement?",
 "The gap is floating point arithmetic on a slope taken between two temperatures, and a measurement tidied into agreement with its own expectation has stopped being a measurement.",
 ["The engine genuinely holds 2399.999999999998, and the literal in the third file is the typing error that the pin table exists to find and to report on every rebuild of the course.",
  "The relative difference of 9.474e-16 sits outside the tolerance the pin table applies, so the row prints as a failure and is left where it is for the next repair to resolve.",
  "The slope is taken where the factor is clamped at one, so the measurement is reading a clamped expression and the last few digits are the clamp arriving in the answer."],
 "The slope is taken at 150 C and 200 C, where the factor is unclamped, because below the onset the engine returns exactly 1 and the slope would be zero. The relative difference is 9.474e-16, which is the arithmetic rather than a disagreement.")

q(0, "The engine exports fifteen constants by name and the course prints a declared column and a measured column for all fifteen. What is the second column for?",
 "So a disagreement between what the module declares and what it actually uses would be visible in the table rather than inferred later from a surprising screen.",
 ["So the export can be checked against the golden's fourth copy, which is the comparison the vendored jest suite runs and which the course reproduces here for the reader.",
  "So the sixteen pinned constants that carry no export at all have somewhere to sit, which is why the mass-transfer coefficient and the Blasius pair both appear in that table.",
  "So the measured value can replace the declared one wherever the two differ, which keeps the course reporting behaviour in preference to declarations throughout."],
 "Nothing in this module currently separates, and that is a result with a size attached. An export agreeing with a measurement checks the export, a measurement standing alone checks the behaviour, and neither one says where the number came from.")

q(2, "The mass-transfer fugacity exponent measures 1.000000000000 with a relative difference of exactly 0. What is being measured there?",
 "A property of the form rather than a typed constant. The term is exactly linear in fugacity, so doubling the fugacity doubles the term.",
 ["One of the few constants the golden can genuinely discriminate, because a relative difference of exactly 0 means the oracle reached it by a route the engine does not share.",
  "A clamp, since an exponent coming back at exactly one is the value this engine substitutes whenever the fugacity argument it was handed arrives outside its own range.",
  "The engine's declared export, which reads 1.000000000000 and is compared against a behaviour."],
 "It is reached by the base two logarithm of the doubling ratio in fugacity, and it confirms the shape of the expression rather than the value of a literal. The velocity exponent of 0.800000000000 and the diameter exponent of 0.200000000000 are ordinary fitted constants reached the same way.")

q(3, "The golden's `provenance.published` is false. What follows from that for this course?",
 "Its rows can show the claim was implemented consistently and cannot show the correlation describes steel, so no graded field here is a rate the correlation produced.",
 ["Its rows are unusable as evidence of anything at all, so this course leans on the engine's exports and on the pin table and treats the golden file as documentation.",
  "Its rows need a published case added beside them before the course can ship, and the eleven held items are the list of the cases still waiting to be sourced and vendored.",
  "Its rows are published in the sense that matters here, since seventeen derivations agreeing to the last bits of a double is what publication would have established anyway."],
 "No published de Waard-Milliams case, no clause of either sour-service standard and no corrosion rate-band table exists anywhere in this repository. Route independence and the gate's pins carry the load instead, and a number recalled from memory is not a published datum.")

q(1, "Case 7 of the seventeen vendored cases differs from the golden rate at 8.901e-5 against a tolerance of 1e-3, while the other rate differences sit in the last bits of a double. How is that figure read?",
 "As a size, which is what makes the agreement a result. The course prints the difference on every case rather than printing a pass.",
 ["As a defect on case 7, since sixteen cases reaching machine precision beside one reaching 8.901e-5 is the signature of a route that has drifted out of step with the engine.",
  "As a tolerance far too loose at 1e-3, because a comparison admitting a gap four orders of magnitude above the others will admit whatever the route happens to produce.",
  "As the fugacity cap arriving, since case 7 is the case whose total pressure sits above 250.000000000000 bar and the coefficient is carried flat from there upward."],
 "Agreement between two separate derivations is a result with a size and the course prints the size. The combined rate on the same case agrees at 5.458e-16 against a tolerance of 1e-9, so the two columns are checked at two different tolerances on purpose.")

q(0, "The route table gives each of the eight oracle routes a cannot-check column. What does the wall shear route fail to check?",
 "The Blasius pair, the laminar constant and the branch switch, because a momentum balance over a stated length reaches the shear without touching any of them.",
 ["The film-stripping threshold of 100.000000000000 Pa and the moderate band of 50.000000000000 Pa.",
  "This module's Reynolds number, since a momentum balance taken over a stated length arrives at the shear without ever forming a Reynolds number of its own along the way.",
  "Nothing whatever, because the pipe force balance is checked as an identity and an identity that holds covers every constant sitting in the branch beneath it."],
 "A route checks what it derives independently. The film onset route cannot check the three scale constants, the mole-fraction ratio route cannot check the two boundary ratios, and the sour comparison cannot check the threshold value. The Pipeline and Line Sizing course computes its own friction factor and its own Reynolds number with a different correlation and a different transition.")

q(2, "Four of the eight routes carry nothing in the cannot-check column: the series combination, the corrosion inhibitor time average, the remaining life and the allowance shortfall. What do those four share?",
 "Each is arithmetic with no fitted constant inside it, where each of the other four reaches a correlation that carries one.",
 ["Each is checked against the golden at the tighter of the two tolerances, so a shared constant would surface as a difference that the looser column would have absorbed.",
  "Each is reached by bisection rather than by a closed form, and a bisection converges on the engine's own answer without ever evaluating the engine's own constants.",
  "Each appears in the golden's `heldConstants` block as well as in the route table."],
 "That is the same property that decides which of the eighteen graded fields this course can carry. The four routes that do carry an entry in that column each reach a correlation with held constants inside it.")

q(1, "The oracle forms the H2S to CO2 ratio from mole fractions rather than from partial pressures. What does that route catch which writing the engine's own ratio out again could not?",
 "An H2S partial pressure built from the total pressure with the mole fraction dropped, and an H2S partial pressure fed a CO2 fugacity where the partial pressure belongs.",
 ["The two boundary ratios of 0.002000000000 and 0.050000000000, which is why this is the one place in the file where the regime words are validated rather than merely pinned.",
  "The fugacity pressure cap reaching the ratio above 250.000000000000 bar, which is the single pressure at which the two routes to the ratio would visibly separate.",
  "A ratio formed with its two arguments the wrong way round, since the mole-fraction form is the only one of the two that is not symmetric in the inputs it is handed."],
 "Both arguments are the total pressure times a mole fraction, so the pressure divides out and the ratio equals the ratio of the mole fractions at any pressure whatsoever. The difference column against the partial-pressure route is zero at every pressure in the table.")

emit(Q, '/root/wt-fc9-nextgen/tools/course-banks/corrosion/advanced/fc9a_m01.json', expect_n=15)
finish()
