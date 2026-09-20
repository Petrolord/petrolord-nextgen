import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Professional m03, hearing protector estimates.
# Figures from digest Section 13 (the four methods, the teaching cases, the OTM
# worked example, the NRR sweep, the floor), Section 3 (the measured 7, 0.5, 5
# and the NIOSH deratings) and Section 10 (the protector refusals). The NIOSH
# derating by type and the dual-protection 5 dB are ORACLE ONLY: they are taught
# for recognition and never keyed as a figure to compute. No capstone site,
# input or answer appears.

q(3, "The OSHA Technical Manual worked example puts a protector with an NRR of 25 on 98 dBA. What estimate does the field derating give?",
 "89.000000 dBA",
 ["80.000000 dBA", "87.600000 dBA", "77.600000 dBA"],
 "The field derating takes (NRR - 7) x 50 percent off an A-weighted level: 98 less half of (25 - 7) gives 89.000000 dBA, the value the manual prints and the engine reproduces. 80.000000 dBA is the same example under Appendix B, the full (NRR - 7). 87.600000 and 77.600000 dBA belong to this tier's teaching case, a different level and label.")

q(1, "The same OSHA Technical Manual example gives 80.000000 dBA under Appendix B. Which question does that figure answer?",
 "Whether the protector is adequate for the hearing conservation programme.",
 ["Whether the employer must turn to engineering controls before relying on protectors.",
  "What NIOSH would credit the protector with, given the kind of protector it is.",
  "What a plug and a muff worn together would deliver on that level."],
 "Appendix B of 1910.95 is the adequacy test for hearing conservation. The engineering controls question is answered by the field derating, which gives 89.000000 dBA on the same example; the NIOSH derating by type and the dual-protection rule are other methods, both ORACLE ONLY.")

q(2, "An A-weighted TWA of 97.600000 dBA is worn under a protector with an NRR of 27.000000 dB. What does Appendix B estimate?",
 "77.600000 dBA",
 ["87.600000 dBA", "72.600000 dBA", "76.200000 dBA"],
 "On A-weighted data Appendix B subtracts (NRR - 7), an attenuation of 20.000000 dB, so the estimate is 77.600000 dBA. 87.600000 dBA is the field derating, which halves that credit; 72.600000 dBA is the dual-protection rule, which adds 5 on top; 76.200000 dBA is the C-weighted teaching level under Appendix B.")

q(0, "A C-weighted level of 103.200000 dBC is worn under the same NRR 27.000000 dB protector. How does Appendix B treat it?",
 "It subtracts the full 27.000000 dB, giving 76.200000 dBA.",
 ["It subtracts 20.000000 dB, taking 7 off the label as for A-weighted data.",
  "It refuses the level, because Appendix B is published for A-weighted data only.",
  "It halves the label first and then subtracts 13.500000 dB."],
 "The NRR is itself stated against C-weighted sound, so on C-weighted data Appendix B credits the whole label: 103.200000 less 27.000000 is 76.200000 dBA. Taking the 7 off is the A-weighted rule applied to the wrong weighting. The refusal of C-weighted data belongs to the field derating, and halving the label is neither method.")

q(2, "Why does Appendix B take 7 dB off the label before crediting it against an A-weighted level?",
 "The NRR is stated against C-weighted sound, and the 7 is a flat allowance for the difference between the weightings.",
 ["The 7 dB allows for a protector being worn loosely, worn over glasses or removed for part of the shift, as fit in use demands.",
  "Seven is the number of test frequencies at which the label is measured in the laboratory, one decibel off for each band.",
  "It keeps the credit under the 7 dB floor below which the engine says a protector cannot help, so small labels are never overstated."],
 "The label is a C-weighted rating, and subtracting it whole from an A-weighted level would mix the two weightings in one sum; Appendix B allows for that with a single flat 7 dB, which the engine measures as 7.000000000000. Poor fit in use is what the field derating's 50 percent addresses. There is no count of frequencies in the rule, and the floor at zero is a separate matter.")

q(0, "On the A-weighted teaching case, 97.600000 dBA with an NRR of 27.000000 dB, what attenuation does the field derating credit?",
 "10.000000 dB",
 ["20.000000 dB", "13.500000 dB", "25.000000 dB"],
 "The field derating halves (NRR - 7): half of 20 is 10.000000 dB, leaving 87.600000 dBA. 20.000000 dB is Appendix B's credit before halving, 13.500000 dB is half the full label with the 7 forgotten, and 25.000000 dB is the dual-protection credit.")

q(1, "What does the engine return when a C-weighted level is sent to the field derating `OSHA_FIELD_50`?",
 "A refusal on `weighting`, because the source publishes that derating for A-weighted data only.",
 ["An estimate with the full label credited, the way Appendix B treats C-weighted data, with no warning.",
  "An estimate with 7 dB taken off first and then halved, with a warning.",
  "An estimate computed on the level less 7, converting the weighting."],
 "Judgement call J5: the field derating refuses C-weighted data, in the engine's words \"the OSHA 50 percent field derating is published for A-weighted exposures only\". The engine will not invent a rule the manual never wrote, so it neither borrows Appendix B's C-weighted rule nor converts the weighting.")

q(3, "In the NRR sweep on the teaching case, the gap between the field derating and Appendix B grows from 96.100000 against 94.600000 dBA at NRR 10 to 86.100000 against 74.600000 dBA at NRR 30. Why?",
 "Each decibel of label adds one decibel of credit under Appendix B and half a decibel under the field derating.",
 ["The field derating caps the credit at 10 dB, the teaching case's figure, so any label higher than 27 stops helping it.",
  "Appendix B adds the 5 dB dual allowance once the label passes 20 dB, which widens the gap at the top of the sweep.",
  "The engine switches the field derating to C-weighting above NRR 20."],
 "Appendix B credits NRR - 7 and the field derating (NRR - 7) x 50 percent, so the difference between them is half of (NRR - 7) and grows with the label. The field derating has no cap (it still falls to 86.100000 dBA at NRR 30), Appendix B never adds the dual 5, and the field derating refuses C-weighted data outright.")

q(0, "What is the evidence class of the NIOSH derating by protector type?",
 "Oracle only, since nothing printed is known to check the factors that the engine and its oracle share.",
 ["Published and reproduced, through the OSHA Technical Manual worked example that prints an estimate for each protector type.",
  "Transcription only, the same class as the NIOSH heat stress equations.",
  "Arithmetic by definition, since a derating is a fixed fraction."],
 "The OSHA Technical Manual example reproduces two methods only, the field derating and Appendix B. The NIOSH factors 0.750000000000, 0.500000000000 and 0.300000000000 agree between engine and oracle and nothing printed checks them, so they are ORACLE ONLY and never graded. A fixed fraction still has to be copied from a page, which is exactly what makes it more than arithmetic by definition.")

q(2, "What do the NIOSH derating factors say about protector types, whatever evidence class they carry?",
 "One label is worth a different amount on a different kind of protector: earmuffs keep three quarters, formable earplugs half and other earplugs less than a third.",
 ["Every protector type keeps its full label, and only the A-weighting allowance of 7 dB differs by type.",
  "Earplugs are credited above earmuffs, because a plug sits inside the ear canal.",
  "The factors apply only to C-weighted levels, so they never change an A-weighted estimate."],
 "The factors 0.750000000000, 0.500000000000 and 0.300000000000 say a type delivers a fraction of its label in use, and the fraction depends on the type. The 7 dB is the same for every type, earmuffs keep the largest share, and the factors apply before the A-weighted 7 is taken. This method is ORACLE ONLY and is taught for recognition.")

q(3, "Under the OSHA dual-protection rule, why is the second protector credited with 5 dB whatever its own label?",
 "Sound reaches the ear by paths the second protector does not block, so the two ratings do not add.",
 ["The second label is always assumed to be 5 dB, the smallest NRR that is sold.",
  "The rule adds the two labels together and then takes 5 dB off the sum to allow for the poor fit of two devices.",
  "The rule averages the two labels and then adds 5 dB as a fixed credit for the lower of the two ratings."],
 "The rule takes the higher NRR, subtracts 7 if the level is A-weighted, and adds 5, because a second protector cannot stop sound reaching the ear through the other paths. No label is assumed, and the rule neither adds nor averages the two labels. The dual-protection 5 dB is ORACLE ONLY and never graded.")

q(1, "A label NRR of 5 is put on 92 dBA A-weighted under Appendix B. What attenuation does the engine credit?",
 "0.000000 dB, with a warning that the credit is floored at zero",
 ["-2 dB, which raises the estimate above the unprotected level",
  "5 dB, the whole label, because a label below 7 is read as C-weighted",
  "A refusal on `nrrDb`, since a label under 7 cannot be used"],
 "NRR - 7 would give -2 dB and raise the estimate, which no protector does, so judgement call J5 floors the credit at 0.000000 dB and the engine warns in its own words: \"the method gives -2 dB of attenuation; a protector cannot raise the exposure, so the credit is zero\". The weighting is never guessed from the label, and a label of zero or more is accepted.")

q(1, "Which method answers whether an employer must turn to engineering controls instead of relying on hearing protectors?",
 "`OSHA_FIELD_50`, the field derating",
 ["`OSHA_APPENDIX_B`, the adequacy test of 1910.95",
  "`NIOSH_TYPE`, the derating by protector type",
  "`OSHA_DUAL`, the dual-protection rule"],
 "The manual halves the credit when the question is whether protectors may stand in for reducing the sound at source, so engineering controls are judged on the field derating. Appendix B is the adequacy test for hearing conservation; the NIOSH derating by type and dual protection answer other questions and are ORACLE ONLY.")

q(0, "What does the engine return when a protector call names a method it does not recognise?",
 "A refusal on `method`: \"method must be one of OSHA_APPENDIX_B, OSHA_FIELD_50, OSHA_DUAL, NIOSH_TYPE\"",
 ["An estimate under Appendix B, the default method, with a warning that the method named was not recognised",
  "A refusal on `protectorType`, asking for earmuff, formableEarplug or otherEarplug before any method is chosen",
  "An estimate by an octave-band method chosen from the label"],
 "Every call names its method and the engine refuses an unknown one on the field `method`, in its own words. The protectorType refusal belongs to the NIOSH method alone, and the engine has no door for spectral, octave-band methods at all.")

q(3, "A report writes \"protected level 87.600000 dBA\" for the teaching case. What is missing?",
 "The method and the question it answers, here the field derating for engineering controls.",
 ["Nothing, because a protected level is one figure whichever of the four methods produced it from the label.",
  "The C-weighted level, since every protected level must be quoted in dBC.",
  "The NRR, since the estimate is meaningless without the label alone."],
 "The same label and level give 77.600000 dBA under Appendix B and 87.600000 dBA under the field derating, so a figure without its method cannot tell the reader which question it answers. The estimates are in dBA, and the label on its own does not say which rule credited it.")

emit(Q, '/root/hse-wip-hygiene/banks/h2i_m03.json', expect_n=15)
finish()
