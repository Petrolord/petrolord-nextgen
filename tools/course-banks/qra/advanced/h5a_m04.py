import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 qra, Expert tier, module 04 "Gross Disproportion".
# Digest sections drawn on: 31 (the test, the DF sweep, strictly greater, the
# largest reasonably practicable cost), 26 (a threshold belongs to the lower
# band), 27 (DFs from upwards of 1), the costBenefit refusals of section 3,
# and section 34.

q(2,
 "In the HSE checklist's test, when is a measure NOT reasonably practicable?",
 "When its costs divided by its benefits are GREATER than the disproportion factor, that is cost > DF x benefit.",
 ["When its costs are greater than its benefits at all, since a DF only matters once the ratio of the two exceeds one.",
  "When its costs divided by its benefits are at least the disproportion factor, so equality already fails the measure.",
  "When its ICAF is greater than the VPF, whatever the DF, since the DF is a matter for the ALARP note alone."],
 "The checklist's test is cost > DF x benefit, strictly greater. A cost merely above its benefit is expected under ALARP, which is why a DF of more than 1 exists. 'At least' would put equality in the upper band, the convention the engine declined. The ICAF against the VPF ignores the DF and the injury lines, so it is no substitute for the test."),

q(0,
 "The EDIKAN firewall, undiscounted, has a cost of 350000.00 against a benefit of 40000.00. What does the engine return at its stated DF of 3?",
 "A ratio of 8.750000, GROSSLY_DISPROPORTIONATE, and a largest reasonably practicable cost of 120000.00.",
 ["A ratio of 8.750000, NOT_GROSSLY_DISPROPORTIONATE, because the ratio is compared with a DF of 10 whatever the caller states.",
  "A ratio of 8.750000, GROSSLY_DISPROPORTIONATE, and a largest reasonable cost of 400000.00.",
  "A ratio of 9.350247, GROSSLY_DISPROPORTIONATE, the figure the engine gives at the 2003 checklist limits."],
 "350000.00 over 40000.00 is 8.750000, which is greater than 3, so the verdict is GROSSLY_DISPROPORTIONATE, and DF 3 times 40000.00 is 120000.00, as the DF sweep prints. The engine compares with the DF the caller states. 400000.00 is the largest reasonable cost at a DF of 10, and 9.350247 is the discounted ratio, which this undiscounted question does not ask for."),

q(3,
 "Along the DF sweep of the undiscounted EDIKAN firewall, at which of the swept factors does the verdict first turn to NOT_GROSSLY_DISPROPORTIONATE?",
 "At a DF of 10, where the largest reasonably practicable cost is 400000.00, above the cost of 350000.00.",
 ["At a DF of 5, where the largest reasonable cost of 200000.00 passes the cost.",
  "At no swept DF at all, because a ratio of 8.750000 is grossly disproportionate at every factor the checklist allows.",
  "At a DF of 3, where the ratio of 8.750000 falls below three times the benefit and the measure becomes practicable."],
 "The sweep prints GROSSLY_DISPROPORTIONATE at DF 1, 2, 3 and 5, and NOT_GROSSLY_DISPROPORTIONATE at DF 10, where 400000.00 exceeds the cost of 350000.00. At DF 5 the largest reasonable cost of 200000.00 is below the cost, so the measure fails there. A ratio of 8.750000 is below a DF of 10, and it is well above 3."),

q(1,
 "Across the DF sweep of the undiscounted firewall, which quantity stays the same at every factor?",
 "The cost to benefit ratio, 8.750000, because the DF moves only the verdict and the largest reasonable cost.",
 ["The largest reasonably practicable cost, 120000.00, because it is fixed by the cost and the benefit alone, whatever the DF.",
  "The verdict, GROSSLY_DISPROPORTIONATE, because a verdict is a property of the measure whatever factor is applied to it.",
  "The margin by which the cost exceeds the limit, since the cost and the benefit are fixed."],
 "The course says the cost to benefit ratio does not depend on the DF; only the verdict and the largest reasonable cost do. The largest reasonable cost runs 40000.00, 80000.00, 120000.00, 200000.00 and 400000.00 down the sweep, and the verdict turns at DF 10. The margin between the cost and that limit shrinks as the limit climbs, although the cost and the benefit themselves stay fixed."),

q(2,
 "What is the largest reasonably practicable cost the engine returns for the undiscounted firewall at a DF of 1, and why that figure?",
 "40000.00, DF times the present value of the benefit, which at a DF of 1 is the benefit itself.",
 ["120000.00, because the engine replaces a DF of 1 with the firewall's stated DF of 3 before it multiplies anything.",
  "350000.00, the present value of the cost, because at a DF of 1 the limit is simply whatever the measure costs.",
  "400000.00, the figure at a DF of 10, because a DF of 1 is below the checklist's range and is lifted to its top."],
 "The engine returns DF times the present value of the benefit, so at DF 1 it is 40000.00, the benefit. 120000.00 is the figure at DF 3 and 400000.00 at DF 10, each a real sweep row at the wrong factor. The limit is set by the benefit; 350000.00 is the cost that is compared against it."),

q(0,
 "The golden case exactly-at-df gives a cost of 9000.000000000002 against DF 3 times a benefit of 3000.00, which is exactly equal on paper. What does the engine return?",
 "NOT_GROSSLY_DISPROPORTIONATE with `atBoundary` true, so the measure is still reasonably practicable and the duty to adopt it stands.",
 ["GROSSLY_DISPROPORTIONATE, because the double precision cost sits a hair above DF times the benefit and the comparison is strict.",
  "GROSSLY_DISPROPORTIONATE with `atBoundary` true, since a boundary case goes to the band that errs toward rejecting the measure.",
  "A refusal, because a cost exactly equal to DF times the benefit leaves the test undecided and the analyst must choose a DF."],
 "The course shows the golden result: NOT_GROSSLY_DISPROPORTIONATE, atBoundary true. A cost exactly DF times the benefit belongs to the lower band by the owner's decision, the 1e-9 snap absorbs the hair in double, and the checklist says \"greater than\". No verdict rejects a measure at the boundary, and the engine never refuses a case for sitting on it."),

q(3,
 "A caller weighs a measure with a disproportion factor of 0.5. What does the engine return?",
 "disproportionFactor: must be 1 or more: HSE, \"DFs that may be considered gross vary from upwards of 1\"",
 ["A verdict at a DF of 1, the engine raising any factor below one to the smallest one the HSE guidance allows it to take.",
  "A verdict at 0.5, since a DF below one simply asks for a stricter test and the engine applies whatever factor it receives.",
  "A verdict at a DF of 10, the checklist's example figure, which the engine applies whenever a stated factor is out of range."],
 "The quoted message is the engine's own refusal, and it cites HSE's own wording that DFs vary from upwards of 1. A refusal returns no verdict, so the engine neither lifts the factor to 1, nor applies 0.5, nor substitutes the checklist's example DF of 10."),

q(1,
 "What does the checklist's worked example say about a DF above 10, and how does the engine treat one?",
 "The example says \"a DF of more than 10 is unlikely\"; the engine accepts it, since it refuses only a DF below 1.",
 ["The example forbids a DF above 10, and the engine refuses any factor above that ceiling in its own words to the caller.",
  "The example treats 10 as the default DF, which the engine applies to every call that leaves the factor out.",
  "The example requires a DF above 10 for a major hazard, and the engine lifts a smaller DF to 10."],
 "The course quotes the checklist: a DF of more than 10 is unlikely, which is guidance to the analyst. The engine's only DF refusal is a factor below 1. There is no ceiling refusal, no default DF, and nothing in the course makes 10 a floor for any kind of site."),

q(2,
 "Quoted exactly, how does the engine's result state the model behind its verdict?",
 "grossly disproportionate when cost / benefit > DF; benefit = (dPLL x VPF + other harms) per year over the life; CPF = cost / (dPLL x years)",
 ["grossly disproportionate when cost / benefit >= DF; benefit = (dPLL x VPF + other harms) per year over the life; CPF = cost / (dPLL x years)",
  "grossly disproportionate when cost / benefit > DF; benefit = dPLL x VPF per year over the life; CPF = cost / (discounted dPLL x years)",
  "grossly disproportionate when benefit / cost > DF; benefit = (dPLL x VPF + other harms) per year over the life; CPF = cost / dPLL"],
 "The course quotes the model string verbatim: strictly greater, other harms inside the benefit, and a CPF over dPLL times the years. The '>=' string would put equality in the upper band. The second drops the other harms and discounts the fatalities, and the third inverts the ratio and loses the years from the CPF."),

q(3,
 "At the 2003 checklist limits the EDIKAN firewall's ratio is 9.350247, and under R2P2's convention 9.328625. What is the verdict at its stated DF of 3 under each?",
 "GROSSLY_DISPROPORTIONATE under both, as it is undiscounted at 8.750000.",
 ["NOT_GROSSLY_DISPROPORTIONATE under both, because discounting lowers the cost and the measure then passes at a DF of 3.",
  "GROSSLY_DISPROPORTIONATE at the checklist limits, and NOT_GROSSLY_DISPROPORTIONATE under R2P2, the lower of the two ratios.",
  "NOT_GROSSLY_DISPROPORTIONATE at the checklist limits, since the checklist is the source of the test and favours the measure."],
 "The course shows GROSSLY_DISPROPORTIONATE at DF 3 under all three conventions: every ratio, 8.750000, 9.350247 and 9.328625, is greater than 3. Discounting lowers the benefit too, so the ratio actually rises above its undiscounted value. A slightly lower ratio under R2P2 is still nearly three times the DF, and no source's test favours a measure."),

q(0,
 "The measure under study prevents no fatality and no injury at all. What does `costBenefit` return, in its own words?",
 "deltaPllPerYr: the measure prevents nothing (no PLL reduction and no other harm): there is no benefit to weigh the cost against",
 ["A ratio of zero with the verdict NOT_GROSSLY_DISPROPORTIONATE, since a measure that costs something and prevents nothing is harmless.",
  "An infinite ratio, GROSSLY_DISPROPORTIONATE, since any cost against a zero benefit is out of proportion.",
  "A largest reasonably practicable cost of zero, with the verdict left for the analyst to write into the ALARP note in their own words."],
 "A measure that prevents nothing has no benefit to weigh, and the engine refuses it with the message quoted, which is its own. A refusal returns no ratio, no verdict and no largest cost, so an infinite ratio, a zero ratio and a zero limit are all results the engine does not produce."),

q(1,
 "Why does a cost exactly equal to DF times the benefit leave the measure reasonably practicable, in the engine's own reasoning?",
 "Because the checklist's test is costs over benefits \"greater than\" the DF, and the owner's decision puts a value at a threshold in the lower band.",
 ["Because R2P2's bias to safety puts every value on a threshold on the side that adopts the measure, which is the engine's source for the rule.",
  "Because the engine rounds the ratio to six decimals before comparing, and a ratio that rounds to the DF is treated as below it.",
  "Because the engine gives the benefit of the doubt to the duty holder whenever the verdict would otherwise be close to the line."],
 "The checklist words its test as \"greater than\" the DF, and the owner's decision is that a value exactly at a threshold belongs to the lower band, which for this test is NOT_GROSSLY_DISPROPORTIONATE. R2P2's bias to safety is named as the argument for the other convention on individual risk. The engine rounds nothing before comparing, and it favours no party."),

q(2,
 "The firewall fails at a factor of two, with 80000.00 as the most it could cost there. How should a duty holder read that figure?",
 "That the firewall would be reasonably practicable at a DF of 2 only if its cost did not exceed 80000.00, while it costs 350000.00.",
 ["That the duty holder should spend 80000.00 on the firewall and no more, adopting a cheaper version of the same measure at that price.",
  "That 80000.00 is the benefit of the firewall at a DF of 2, since the engine doubles the benefit when a DF of 2 is applied.",
  "That the firewall is GROSSLY_DISPROPORTIONATE by 80000.00, the amount by which its cost exceeds the limit at that factor."],
 "The largest reasonably practicable cost is DF times the present value of the benefit, 2 x 40000.00, the most the measure could cost and still pass. The firewall costs 350000.00, so it fails at DF 2. The figure prescribes no spend, the benefit stays 40000.00 whatever the DF, and the gap to the cost is far larger than 80000.00."),

q(3,
 "An analyst reports the EDIKAN firewall as 'NOT_GROSSLY_DISPROPORTIONATE at DF 10'. Which statement about that verdict is true?",
 "It holds only at a DF of 10; at DF 1, 2, 3 and 5 the same measure is GROSSLY_DISPROPORTIONATE.",
 ["It holds at every DF above 3, since the firewall's stated DF of 3 is the only factor at which the measure is weighed at all.",
  "It holds at every DF, since the ratio of 8.750000 is fixed and the verdict follows the ratio alone, whatever factor is chosen.",
  "It holds at every DF of 5 or more, since a largest reasonable cost of 200000.00 at DF 5 already clears the cost."],
 "The DF sweep shows the verdict turns between DF 5 and DF 10: GROSSLY_DISPROPORTIONATE at 1, 2, 3 and 5, and NOT_GROSSLY_DISPROPORTIONATE at 10. The ratio is fixed, but the verdict compares it with the DF, so it cannot be the same at every factor. 200000.00 is below the cost of 350000.00, so DF 5 does not clear it."),

q(0,
 "A measure's cost exceeds DF times its benefit by the smallest amount the snap does NOT absorb. What happens, and why is the 1e-9 snap still needed at this test?",
 "It is GROSSLY_DISPROPORTIONATE, strictly greater; the snap exists so a cost equal to DF times the benefit on paper, but a hair above it in double, stays at the boundary.",
 ["It is NOT_GROSSLY_DISPROPORTIONATE, because any cost within one percent of the limit is taken as the limit; the snap is only needed for individual risk bands.",
  "It is refused, because the engine will not decide a case so close to the line; the snap exists to widen the refusal to one part in a billion.",
  "It is NOT_GROSSLY_DISPROPORTIONATE with `atBoundary` true, because every cost above the limit is snapped back onto it by the 1e-9 rule."],
 "Above the snap, the strictly greater rule applies and the verdict is GROSSLY_DISPROPORTIONATE. The golden exactly-at-df case shows why the snap is needed: 9000.000000000002 is equal on paper to three times 3000.00 and lands a hair above in double, and it stays NOT_GROSSLY_DISPROPORTIONATE. The snap is 1e-9 relative, far narrower than one percent, it snaps only values that close, and the engine refuses no case for being near the line."),

emit(Q, '/root/hse-wip-qra/banks/h5a_m04.json', expect_n=15)
finish()
