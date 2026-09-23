import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Associate m04, The Depth and Time Index.
# Sources: digest section 10, and the index refusal in section 4.
# Every figure is printed there.

q(2, "On the EKENE-7 splice index, entry 5 holds 8521.500000 ft and entry 4 holds 8522.000000 ft. Why is entry 5 flagged as a duplicate?",
 "Its depth equals entry 3's, and the rule flags a value equal to any earlier value in the index.",
 ["Its depth equals entry 4's to within the step tolerance, which the index check counts as a repeat of it.",
  "It is the second entry at a depth ending in .5 within one foot of another.",
  "Its depth equals entry 6's, the next entry, once the step tolerance is applied."],
 "A duplicate is a value equal to ANY earlier value. Entry 5 differs from its neighbour entry 4 and matches entry 3, two rows back; its reason reads \"index value 8521.5 repeats entry 3\". A neighbour-only check would pass it. The tolerance governs steps only, and nothing later in the index is compared for a duplicate."),

q(0, "On the same splice index, entries 7 and 8 both hold 8523.000000 ft. What makes this duplicate the simpler of the two?",
 "Entry 8 repeats the entry immediately before it, so even a check that compared neighbours only would find it.",
 ["Entry 8 is a missing entry, which the index check reports as a duplicate of the present entry that sits just before it.",
  "Entry 8 is also a reversal, so two rules find it at once.",
  "Entry 8 repeats an entry three rows back, which the duplicate rule can only find by widening its step tolerance far enough."],
 "Entry 8's reason reads \"index value 8523 repeats entry 7\": two rows at one depth, side by side. Entry 5 is the harder case, matching entry 3 two rows back. Entry 8 carries only the duplicate-index rule, and the missing entry on the splice is entry 12."),

q(1, "What does `indexCheck` report as the splice summary for the 15-entry EKENE-7 splice index, declared increasing?",
 "1 missing, 2 duplicates, 1 reversal, 3 irregular steps, and monotonic false.",
 ["1 missing, 2 duplicates, 0 reversals, 3 irregular steps, and monotonic true, since the index mostly increases.",
  "0 missing, 2 duplicates, 1 reversal, 4 irregular steps, since the null at entry 12 is read as a long step.",
  "1 missing, 1 duplicate, 1 reversal, 3 irregular steps, since entry 5 is counted under the reversal only."],
 "The splice reads 1 missing (entry 12), 2 duplicates (entries 5 and 8), 1 reversal (entry 5), 3 irregular steps (entries 6, 10 and 13) and monotonic false, because one reversal is enough to break it. Entry 5 counts under both rules, and the null is flagged as missing-index."),

q(3, "Entry 5 of the splice is flagged under two rules at once. Which two, and why does the engine report both?",
 "Duplicate-index and reversal: it returns to a depth already logged and it steps backward, and each rule asks its own question.",
 ["Duplicate-index and irregular-step, since a repeated depth is a step of the wrong size.",
  "Reversal and missing-index, since a step backward loses the depth it skipped.",
  "Reversal and irregular-step, since a backward step differs from the expected step."],
 "The duplicate rule asks whether this depth has been seen before, and the reversal rule asks whether the step goes the stated way. Entry 5 fails both, and the engine reports both so you see both problems at once. The next entry, 6, carries the irregular step, and the missing entry is 12. A backward step is excluded from the step test altogether."),

q(0, "The index 8410, 8409.5, 8409, 8408.5, 8408 is passed to `indexCheck` declared decreasing. What does it report?",
 "0 reversals, with an expected step of 0.500000, since every step goes the stated way.",
 ["4 reversals, since every step goes toward shallower depths.",
  "0 reversals, with no expected step, since a decreasing index has none to infer.",
  "A refusal, since a depth index must increase and a log recorded upward must be reversed first."],
 "Direction is a statement from the caller, and declared decreasing every step runs the stated way, so 0 reversals and an expected step of 0.500000. The step is reported as a size. The refusal belongs to the other declaration: the same index declared increasing has no step in the stated direction."),

q(2, "The same upward-recorded index, 8410 down to 8408, is declared increasing. What does the engine do?",
 "It refuses, saying the index has no step in the increasing direction and so nothing to infer an expected step from.",
 ["It reports 4 reversals, one for every step in the index, and an expected step of 0.500000 taken from the step sizes alone.",
  "It flips the declaration to decreasing so as to match the steps it finds, and reports 0 reversals with a note saying so.",
  "It reports the index as monotonic, since every step is the same size."],
 "The engine's own words are: index has no step in the increasing direction: nothing to infer an expected step from. The expected step is inferred from the steps that run the stated way, and here there are none. The engine never overrides a stated direction."),

q(3, "Why does `indexCheck` take the direction of the index as a statement from the caller?",
 "Because the caller knows how the log was recorded, and a guess from the data would be weakest in files that change direction partway.",
 ["Because the engine keeps no memory of earlier entries and so cannot see a direction for itself.",
  "Because the engine treats every index as increasing and needs the caller to override it.",
  "Because the engine reads the direction from the index header and needs the caller to confirm it."],
 "Stating the direction puts a fact the caller knows into the check, and every reversal is measured against it. A guess from the data would be weakest in exactly the files that need the check most, the ones that change direction partway. The engine has no default of increasing that the caller overrides."),

q(1, "Left to infer it, what expected step does `indexCheck` report for EKENE-7's full 240-entry depth index, and how does it get it?",
 "0.500000 ft, the median of the steps in the stated direction.",
 ["The mean of the steps, pulled a little above 0.500000 ft by the one long step after entry 149.",
  "1.000000 ft, the longest step, since the tolerance is set from the largest gap.",
  "0.500000 ft, read from the log header's step field, which the engine reads first."],
 "The expected step defaults to the median of the steps in the stated direction, reported with its source in words. The median ignores the one long step and returns the step the tool was set to; a mean would be pulled toward the long step. The engine reads no header, and no step is set from the largest gap."),

q(0, "On the splice, the step from entry 4 to entry 5 runs backward. What happens to it when the engine infers the expected step?",
 "It is left out, because only steps in the stated direction describe the regular spacing.",
 ["It is included with its sign, which pulls the median of the splice's steps below 0.500000 ft.",
  "It is included by its size, as a step of 0.500000 like the rest.",
  "It stops the inference, and the engine asks for an expected step."],
 "The expected step is the median of the steps in the stated direction. The reversal is a step backward, so it is left out of the median, and it is flagged under its own rule instead. Inference runs on the forward steps and needs no stated step here."),

q(2, "What step tolerance does `indexCheck` use on EKENE-7's full depth index by default, and why so tight?",
 "5.00e-7 ft, which is 1e-6 x the expected step: room for rounding in a stored depth and little else.",
 ["0.500000 ft, half a step either side, so only a doubled step is irregular.",
  "1e-6 ft whatever the step, a fixed allowance for floating-point error.",
  "5.00e-7 ft, measured as the mean difference between the delivered index and a perfect half-foot grid."],
 "The default tolerance is 1e-6 x expectedStep, which on a 0.500000 ft step is 5.00e-7 ft. It is scaled by the step, it is a stated default, and it is chosen to treat a regularly sampled log as regular while flagging a skipped sample. It is not measured from the data."),

q(1, "With expectedStep 0.5 and stepTolerance 0.6 stated, what does the splice read?",
 "0 irregular steps, with 2 duplicates and 1 reversal still flagged.",
 ["0 irregular steps, 0 duplicates and 0 reversals, since the loose tolerance lets every step pass as regular.",
  "3 irregular steps as before, since a stated tolerance cannot be larger than the expected step.",
  "0 irregular steps and 0 duplicates, with the reversal alone remaining, since duplicates sit within the tolerance."],
 "The tolerance loosens the step test only. All three irregular steps disappear, and with them the only sign of the skipped depth at entry 10, but equality is not a matter of degree, so the 2 duplicates stay, and the reversal stays too. A stated tolerance may exceed the step; that is the caller's statement."),

q(3, "EKENE-7's full depth index reads 1 irregular step, reason \"step 1 from entry 149 differs from the expected 0.5 by more than 5e-7\". What is that step, seen from the other checks?",
 "The skipped index sample that coverage found as the hole from 8474.500000 to 8475.500000 ft, and that completeness cannot see.",
 ["The density's pad lift, which completeness flagged as twelve missing samples in one run.",
  "A duplicate depth, which the step test reports when the tolerance is tight.",
  "The splice where two logging runs meet, which the full log index also holds."],
 "The index skips one sample after entry 149. Coverage finds it as a hole because the step is longer than half a foot, the index check as a step too long, and completeness never sees it because no row was there to be empty. The pad lift is a run of nulls with its index intact, and the full log index has 0 duplicates."),

q(0, "On the splice, entry 6 at 8522.500000 ft is flagged as an irregular step. What causes it?",
 "It is a forward step from entry 5's 8521.500000 ft, longer than the expected step: the index recovering from the reversal.",
 ["It repeats a depth already logged, and the irregular-step rule reports repeats after a reversal.",
  "It follows the lost entry at 12, so the step is measured from the last present entry.",
  "It is a skipped step, with the depth between entry 5 and entry 6 never logged."],
 "Entry 5 stepped back to 8521.500000 ft, and entry 6 is measured from there, a forward step longer than 0.5. The skipped step is entry 10, and the step after the lost entry is entry 13. 8522.500000 ft is logged nowhere else on the splice, so it is no repeat."),

q(3, "Entry 12 of the splice is null. How does the engine treat the step to entry 13 at 8526.000000 ft?",
 "It measures it from entry 11, the last present entry, so the lost row appears twice: as missing and as a long step.",
 ["It skips that step, since there is nothing at entry 12 to measure it from, and flags entry 12 as missing-index alone.",
  "It measures it from entry 12 as a zero, which makes the step far too long.",
  "It fills entry 12 with the depth midway between its two present neighbours, and then finds no irregular step there at all."],
 "Entry 12 is flagged as missing-index, and the step to entry 13 is measured from the last present entry, entry 11 at 8525.000000 ft, so it is flagged as irregular too. That is a stated choice: a lost row cannot hide the spacing problem it leaves. The engine fills nothing and never treats a null as zero."),

q(2, "`indexCheck` is handed an index with a single entry. What comes back?",
 "A refusal naming the field `index`, saying the index must be an array of at least two numbers.",
 ["A result with 0 flags and monotonic true.",
  "A result whose expected step is null, with a note that one entry has no step to take a median of.",
  "A refusal naming `expectedStep`, since the engine cannot infer one from a single entry and needs it stated."],
 "The engine's own words are: index must be an array of at least two numbers. One entry has no step, so there is nothing for any of the step rules to judge, and the engine refuses rather than report a clean result it has not earned. Stating an expected step would not help: the field named is `index`."),

emit(Q, '/root/dai-wip-dataqc/banks/d1b_m04.json', expect_n=15)
finish()
