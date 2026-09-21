import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Expert m06, What This Engine Used To Do. Digest sections 25 and 2.
# Every prompt frames its material as behaviour before the repair, except where
# it asks what the engine ships today.

q(1, "Before the repair this engine computed a sour-service severity region from an expression of its own and labelled it with two standards. What is the general lesson the repair drew from it?",
 "A calculation can be wrong in a way no measurement repairs, because the number was never the claim. The claim was that this is what the standard says.",
 ["A calculation fitted without a source should be retuned against the nearest published curve, and the standard names kept so that a reader knows which family it belongs to.",
  "A calculation labelled with a standard's name should keep the label and widen its tolerances, so the answer it gives covers whatever the standard would have given.",
  "A calculation of this kind is a tolerance problem like any other."],
 "Retuning the curve does not make the attribution true. It makes a different unsourced curve carry the same false attribution with a fresh coat of confidence on it, and the only honest repair available is to withdraw the claim.")

q(3, "What did the pre-repair engine serve off that severity region?",
 "Three named material recommendations: what steel to buy, when to control hardness and when to qualify weldments.",
 ["An inspection interval and a retirement thickness, both taken from the region the stream landed in, which is why neither appears in this module today.",
  "A rate category band for sour streams, which sat beside the CO2 band and is the reason the category bands are held rather than merely unsourced.",
  "A wall shear threshold for sour service, set below the 100.000000000000 Pa used elsewhere, which was withdrawn with the region it was derived from."],
 "A curve that carries a standard's name and tells an engineer what steel to buy is not a tolerance question. The three strings are gone and none of them appears anywhere in the engine source.")

q(0, "Three measurements show what that pre-repair expression was worth. What did they find?",
 "Moving its pH pivot by a whole unit left the suite green, widening a region boundary by a factor of two left the suite green, and a missing pH fell through to the hardest recommendation.",
 ["Moving its pH pivot by a whole unit failed one case, widening a region boundary by a factor of two failed two more, and a missing pH refused with a message naming the box.",
  "Moving its pH pivot by a whole unit left the suite green, widening a region boundary by a factor of two failed the suite, and a missing pH returned the mildest recommendation.",
  "Moving its pH pivot by a whole unit left the suite green, widening a region boundary by a factor of two left it green, and a missing pH refused rather than answering."],
 "The missing pH made the expression not-a-number, so both of its comparisons failed and it fell through to the hardest material recommendation in the file from an input nobody had supplied.")

q(2, "The severity region is gone from this engine today. How permanent is that, and how does a caller find out?",
 "It is current, permanent and declared. `regionProvided` is false and `materialGuidanceProvided` is false today and will keep coming back false.",
 ["It is provisional. Both fields come back false while a source is being sought, and the engine will serve the region again once a standard has been vendored beside it.",
  "It is permanent and silent. The two fields were removed with the function, so a caller discovers the absence by finding no such key on the returned object.",
  "It is permanent for the region and provisional for the material guidance."],
 "The absence arrives as a field, so a caller cannot read the gap as an unset property. The digest section that states it says in its own second line that it is not repair history.")

q(0, "The absence of the severity region is proved three ways. What are they?",
 "The region function is not exported so its type is undefined, neither standard name appears anywhere in the source, and no returned string in three whole screenings names either standard.",
 ["The region function throws when it is called, the two standard names appear only inside comments, and the studio renders the absence behind the same disclosure as the held list.",
  "The engine exports two false flags, the golden carries no region row among its 110, and the vendored jest suite asserts that a region request refuses with a message naming the standard.",
  "The held list omits the region, the not-provided list names it twice, and the pin table has no row for the boundary constants of the region expression."],
 "Each is a separate check. The two flags are how the engine states the absence, and the three proofs are how the digest established that the function and its strings have actually gone rather than been hidden.")

q(3, "The screening threshold the sour door still uses stayed exactly where it was at 0.003500000000 bar. Why was it left alone?",
 "Changing a live number without a source would have been the same mistake with the sign flipped.",
 ["It is validated by the golden's sour rows, which are worked in psia while the engine works in bar, so it was the one constant the repair had grounds to keep.",
  "It was the only number in the region expression with a published source behind it, which is why the comparison survived the withdrawal of everything built on it.",
  "It sits below any value a real stream reaches, so its exact position cannot change a verdict and there was nothing for the repair to gain by moving it."],
 "The engine keeps the number, declares it held in `thresholdHeld`, and prints it in both units so nobody has to convert. Its value is measured by bisecting the sour flag.")

q(1, "Before the repair the pH correction returned one for any pH at or below its reference. What did a sweep across pH show?",
 "pH 2.0, 3.0, 3.5 and 4.0 all produced the identical rate to sixteen figures, while a second calculation on the same screen moved its answer four times across the same span.",
 ["The rate fell by a factor of 316.227766 across that span, which is the behaviour the repair kept in place and then extended below the reference rather than refusing there at all.",
  "The rate moved only at the reference itself, where the factor stepped from one to its fitted value, so the box mattered at exactly one point in its own range.",
  "The rate rose as the water became more acid, by a decade for every two pH units, which is the direction the correction takes above the reference as well."],
 "Two decades of hydrogen-ion activity moved the headline number by exactly nothing. A spread of zero is the whole finding, and no amount of reading the code is needed to reach it.")

q(2, "What is the test that finds a box on a screen which has stopped reaching the answer?",
 "Walk the input across its range and print the spread of the answer.",
 ["Read the call graph from the box down to the field the reader acts on, and look for a branch where the value is replaced by a default before it arrives.",
  "Set the box to a value outside its range and check that the engine refuses, because a decorative box is one whose guard has been disconnected along with it.",
  "Compare the answer against the oracle at two settings of the box, since a route that ignores an input agrees with an independent derivation at both of them."],
 "It is arithmetic and it takes one sweep. When one input reaches the answer by two routes and the route that decides the headline ignores it, the box on the screen is decoration.")

q(3, "How does the pH correction behave in this engine today?",
 "The rate is strictly monotonic above the reference, from 4.724817 mm/yr at pH 4.000000 to 0.014941 mm/yr at pH 9.000000, and below the reference the engine refuses.",
 ["The rate is strictly monotonic across the whole band from pH 0 to pH 14, and the reference is now only the point at which the factor is exactly one by definition rather than by a clamp.",
  "The rate is monotonic above the reference and the engine returns a factor of one below it, which is the least limiting answer and is flagged in the clamps field beside the other inputs it moved.",
  "The rate is monotonic above the reference and the engine refuses above pH 9.000000 as well, which is where the swept band the correction was fitted on runs out."],
 "The span is a factor of 316.227766 and every step down the column is smaller than the one above it, which the digest generator asserts on every rebuild. The refusal names the reference so that a caller can print the boundary.")

q(0, "Before the repair a blank velocity or a blank line diameter made the mass-transfer term infinite. How far did the consequence travel?",
 "An infinite transport capacity makes the series combination equal the reaction term, so the engine named reaction kinetics as controlling from an input nobody had supplied.",
 ["An infinite transport capacity makes the series combination infinite as well, so the rate came back as not-a-number and the screening reported itself incomplete.",
  "An infinite transport capacity is clamped at the reaction term by the series form, so the rate was correct and only the wall shear went missing from the screen.",
  "An infinite transport capacity sent the engine down its no-CO2 branch, so the screen showed a rate of zero and an unbounded life under a CO2 box that still read three percent."],
 "The rate came out several times the correct one, and a missing box in one part of the form changed the word the screen printed about the mechanism. The no-CO2 branch was reached by a different pre-repair route.")

q(2, "Before the repair a blank temperature produced an unusual chain. What happened?",
 "The fugacity became not-a-number, which failed a greater-than test, which sent the engine down its no-CO2 branch: a rate of zero, a green label, an unbounded life and a passing verdict.",
 ["The fugacity became not-a-number, which propagated through the whole of the chain beneath it, so the rate and the life both came back as not-a-number and every row on the screen printed empty.",
  "The fugacity became infinite, which made the reaction term infinite, so the series combination sat at the transport term and the screen reported transport as controlling.",
  "The fugacity fell back to the value at the shipped default temperature, so the screen showed a plausible rate computed at a temperature nobody had entered."],
 "Every step in that chain is individually reasonable and the end of it is a clean bill of health from nothing, printed under a CO2 box that still read three percent.")

q(1, "The transport term returns not-a-number today rather than infinity, and the vendored gate asserts something specific about it. What?",
 "That it is not infinity, rather than merely that it is wrong.",
 ["That it is not-a-number at every velocity below the one at which the film-stripping threshold of 100.000000000000 Pa is first reached on that stream.",
  "That it refuses with a message naming the box, which is the same guard the whole screening door applies when any of its six required boxes is blank.",
  "That it agrees with the golden's own value for a blank velocity, which the oracle reaches by marching the wall loss forward rather than by dividing."],
 "An infinite transport capacity is a perfectly ordinary number downstream, and it is the value that makes the answer look best. Asserting the specific shape is what stops the defect returning in a form that is still wrong.")

q(3, "Before the repair the corrosion inhibitor warning fired only when the efficiency was strictly greater than ninety percent. Why did that matter so much?",
 "The studio shipped with an efficiency of exactly ninety, so the one lesson this module exists to teach was silent on the first screen every user saw.",
 ["The strict comparison meant the warning fired on every case above ninety, so a user who typed anything at all above the default was warned twice over.",
  "The guard was applied to the availability rather than to the efficiency.",
  "The shipped efficiency of ninety was the value the correlation was fitted at."],
 "A guard written with a strict comparison against a round number is switched off at exactly that number, and a shipped default sitting on the boundary is the likeliest value in the whole input space. The same guard was equally silent at ninety percent efficiency and fifty percent availability.")

q(0, "Today's corrosion inhibitor warning fires on the effective shortfall at any efficiency. What kind of change is that?",
 "A design move. The old guard tested an input and the new one tests the output the warning is actually about.",
 ["A threshold adjustment. The comparison was loosened from strictly greater to at or above, which is what lets the shipped default of exactly ninety percent through it.",
  "A clamp. The efficiency is now carried up to the value at which the warning fires, and the clamps field records that it was moved so a reader can see it happen.",
  "A rewrite of the colour logic alone."],
 "The trigger is 0.100000 percentage points of shortfall, measured by bisecting the availability at which the warning first appears. A guard on the quantity you care about survives a change in how the inputs arrive at it.")

q(2, "Before the repair thirteen defects planted one at a time left the validation suite entirely green, and the oracle caught none of seventeen paired moves. What was wrong with the oracle?",
 "Five of its routes were the engine's own expressions written out again and one was the engine's own line rearranged algebraically, while its docstring called that an independent re-derivation.",
 ["Its tolerances were set from the engine's own output rather than from the physics, so every route passed at whatever gap the engine happened to produce on that row.",
  "It carried no cases at all for six of the module's doors, so the routes it did carry were sound and the coverage around them was the part that was missing.",
  "It read its expected values out of the golden file at run time, so a golden regenerated from the engine made every route agree with the engine by construction."],
 "A constant that lives in two files cannot be validated by comparing those two files. The planted defects included a sour threshold moved by a factor of ten and a mass-transfer coefficient moved by a sixth.")

emit(Q, '/root/wt-fc9-nextgen/tools/course-banks/corrosion/advanced/fc9a_m06.json', expect_n=15)
finish()
