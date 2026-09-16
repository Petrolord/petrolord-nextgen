import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Expert m01, Three Phases in One Vessel. Digest section 13.

q(2, "AGBAMI carries 12000.000000 bpd of oil held 5.000000 minutes and 8000.000000 bpd of water held 8.000000 minutes, and the engine gives the water 0.516129 of the liquid cross-section. Where does that share come from?",
 "Duty, which is a rate times a retention time: the water asks for 8000.000000 times 8.000000 barrel-minutes against the oil's 12000.000000 times 5.000000.",
 ["The water cut arriving at the inlet, which is 8000.000000 bpd of the 20000.000000 bpd of liquid, scaled by the level of 0.500000.",
  "The ratio of the two specific gravities, since the denser phase settles into the larger band once the level fixes the liquid area.",
  "The water area of 20.268340 ft2 divided by the gas-liquid chord of 10.000000 ft, which is the width the liquid surface spans across the drum at a level of 0.500000."],
 "Rate alone would have given the water 0.400000 of the cross-section. The extra water retention moved the share to 0.516129, which is the whole point of a retention-proportional rule.")

q(0, "The water area on AGBAMI is 20.268340 ft2 in a drum 10.000000 ft across. How does the engine turn that area into an interface height of 3.049149 ft?",
 "It asks which depth in the circle produces a segment of exactly 20.268340 ft2, and bisects until it has it.",
 ["It divides 20.268340 ft2 by the gas-liquid chord of 10.000000 ft, which is the width of the liquid surface at a level of 0.500000 and the divisor the engine used before FC1-0.",
  "It gives the water the same fraction of the liquid depth of 5.000000 ft that it gave of the liquid area, so the share of 0.516129 places the interface directly.",
  "It divides the water retention volume by the liquid area of 39.269908 ft2 and reads the result as a depth, because a volume over an area is a length in ft."],
 "The chord rule gives 2.026834 ft on this vessel against the exact 3.049149 ft. A segment narrows toward the bottom of the drum, so one width overstates the area a given thickness can hold.")

q(1, "Across the published three-phase cases every retired chord-rule water layer sits below the exact figure. Why does that error never change sign?",
 "The chord is the widest line the liquid has across the drum, and a segment narrows steadily downward, so dividing an area by that single width always understates the thickness the area really takes up.",
 ["The bisection stops after 100 iterations and truncates, so the retired figure is the same answer rounded down on every published case.",
  "The retired rule divided the oil area of 19.001568 ft2 rather than the water area, and the oil area is the smaller of the two.",
  "Every published case runs at a liquid level of 0.500000, where the chord is the full diameter of 10.000000 ft and is the largest width available."],
 "On thickOilWaterCarryover the retired water layer is 3.020762 ft against the exact 4.088701 ft, and on lowLevelSmallOilDropCarryunder it is 0.617770 ft against 1.249328 ft at a level of 0.300000.")

q(3, "Pinning the AGBAMI water share at 0.300000 takes the vessel from 12.311666 ft to 21.181362 ft. Why does a thinner water band produce a longer drum?",
 "The water still owes 8.000000 minutes, and a smaller cross-section buys that time only with length: it asks 21.181362 ft against the oil's 8.510368 ft.",
 ["The pin enlarges the gas space above the liquid, so gas capacity takes the length over from liquid retention and sets it at 21.181362 ft on a drum 10.000000 ft across.",
  "The oil layer grows to 2.925687 ft and the oil is the larger stream at 12000.000000 bpd, so the oil sets the requirement once the interface has dropped to 2.074313 ft.",
  "A pinned share makes the engine take the largest retention length on file rather than sizing this drum."],
 "retentionPhase reads water. The pin starved the phase with the longest retention time of cross-section, and the drum had to grow lengthways to hand back the 8.000000 minutes.")

q(0, "On the proportional AGBAMI case phaseRetentionLengthsFt and retentionPhase both come back null. What is the engine reporting?",
 "That the split was built to make the two phase lengths agree, so no contest was held and there is no second length to print.",
 ["That the two phase lengths tied inside the relative gap of 1e-9 the constant RETENTION_TIE_REL allows, which is the one situation where the phase field is suppressed.",
  "That the controlling requirement on this row was gas rather than liquid retention, so a retention phase has no meaning here and both fields are blanked together.",
  "That the oil and the water were given equal retention times, which leaves neither phase able to claim the requirement of 12.311666 ft as its own."],
 "One liquid retention requirement of 12.311666 ft comes back. A genuine tie inside 1e-9 also leaves retentionPhase null, and that is a different situation from a split that produced one length by construction.")

q(2, "gasOverloaded6ftGasControls reports a retention requirement of 0.689497 ft, a length of 16.976527 ft, controlling gas and retentionPhase null. What do those fields say together?",
 "Gas capacity beat liquid retention for the length of 16.976527 ft, and inside liquid retention, which asked only 0.689497 ft, no phase had to be named at all.",
 ["The gas requirement of 16.976527 ft was produced by the water phase, so retentionPhase is left null rather than naming the water twice.",
  "Liquid retention was never computed here, so 0.689497 ft is a figure carried across from the two-phase path and the phase field has nothing to report.",
  "Each phase needed 0.689497 ft and the gas needed the remainder, which is why the retention figure is the smaller and why no phase is named."],
 "Two contests run on a three-phase row. Liquid retention against gas capacity sets the length, and here gas won it at 16.976527 ft; oil against water inside liquid retention was never held.")

q(1, "A reviewer reports the AGBAMI water cut as 0.516129. Which figure did they want, and what does 0.516129 actually describe?",
 "They wanted 0.400000, the 8000.000000 bpd of water in 20000.000000 bpd of liquid; 0.516129 is the share of cross-section the retentions ask for.",
 ["They wanted 0.300000, the share an interface controller would be pinned at, and 0.516129 is the fraction of the liquid depth of 5.000000 ft that the water band fills.",
  "They wanted 0.285714, the water share on the published low level case, and 0.516129 is a fraction of the diameter.",
  "Both figures describe one quantity and 0.516129 is the more exact, since it is built from the rates and the retention times."],
 "The two agree only where the retention times are equal. The water is held 8.000000 minutes against the oil's 5.000000, so the cross-section share of 0.516129 sits above the rate share of 0.400000.")

q(3, "A two-phase habit brings a single dropletMicron argument to a three-phase call. What happens?",
 "A SeparatorInputError on dropletMicron, with a message naming waterDropletMicron and oilDropletMicron as the two replacements.",
 ["The figure is accepted and applied to both checks, which is what the argument meant before the two droplet sizes were separated out of it into their own inputs.",
  "An object comes back carrying an error string, because one size standing for two directions is a fair question that this method has no answer for.",
  "A SeparatorInputError on waterDropletMicron, the first size the engine looks for."],
 "A water drop falls through oil and an oil drop rises through water, so the two checks carry different sizes, directions and layers. The message names the replacements rather than reporting an unknown argument.")

q(0, "A missing qOilBpd throws, while gravities the wrong way round inside a droplet calculation come back as an object carrying an error string. Why the two shapes?",
 "A throw says the caller left out something it was required to supply, while an error object says the question asked was fair and this method has no answer for it.",
 ["A throw stops the caller where an error object lets a sweep finish its remaining rows, so the choice is about how much of a family survives one bad input value.",
  "A throw is reserved for a value outside its domain and an error object for a value that is missing.",
  "The error object is the newer shape and the throws are the calls FC1-0 has not converted yet."],
 "sgWater (1) must exceed sgOil (1.1) for the water to settle is thrown on a named input, while the heavy phase must be denser than the light phase is returned from a calculation that cannot proceed.")

q(2, "explicit25pctWaterWaterRetentionSets pins the water at 0.250000 of the liquid area and reports retentionPhase water with a length of 7.943011 ft. What made the water the named phase?",
 "Its band is the thinner at an interface of 1.826477 ft under 3.173523 ft of oil, and a thin band needs more length to hold its retention time.",
 ["Its retention time is the longer of the two, and the longer retention time names the phase on every pinned case whatever share the interface controller was set to.",
  "The pinned share of 0.250000 sits below the share the retentions would have produced, and the engine names whichever phase the pin squeezed without comparing lengths.",
  "The water is the denser phase and lies along the bottom of the drum, so a length is always measured in the water band and the field records which band it was measured in."],
 "The requirement is the larger of the two phase lengths, 7.943011 ft here. The AGBAMI pin at 0.300000 names the water for the same reason, 21.181362 ft against the oil's 8.510368 ft.")

q(3, "thickOilWaterCarryover holds 0.769231 of its liquid area as water, with an interface at 4.088701 ft and an oil layer of 0.911299 ft in a drum 10.000000 ft across at a level of 0.500000. What did the retired chord rule report on that same vessel?",
 "A water layer of 3.020762 ft and an oil layer of 0.906229 ft.",
 ["A water layer of 4.088701 ft and an oil layer of 0.911299 ft, because at a level of 0.500000 the chord is the full diameter and the two rules land on the same answer there.",
  "A water layer of 2.026834 ft, which is what the chord rule returns on any drum 10.000000 ft across at a level of 0.500000, whatever share the two retentions produced.",
  "A water layer of 1.570796 ft under an oil layer of 2.356194 ft, which are the chord-rule figures for a 10.000000 ft drum held at a liquid level of 0.500000."],
 "The chord rule understates the water layer on every case, here by more than a foot, and its two layers do not have to add back to the liquid depth of 5.000000 ft the way the exact ones do.")

q(1, "A drum 8.000000 ft across at a level of 0.350000 has a liquid depth of 2.800000 ft and an area of 15.678751 ft2, and feeding that area back returns 2.800000 ft. What is being shown?",
 "The area to depth inversion is exact to double precision, so a depth turned into an area and then back into a depth comes out as the depth it started from.",
 ["Segment area runs linearly with depth below a level of 0.500000, which is why the figure comes back unchanged and why the chord rule was adequate on shallow liquid levels.",
  "The bisection leaves an error too small to see at 8.000000 ft, so the round trip measures that tolerance.",
  "The level of 0.350000 and the diameter of 8.000000 ft put 15.678751 ft2 on a bisection boundary."],
 "The engine bisects 100 times and the depth returns unchanged, which is what lets an interface of 3.049149 ft be quoted to six decimals rather than to the nearest inch.")

q(0, "An interface controller setpoint arrives as a water share of exactly 0. What does three-phase sizing do with it?",
 "It throws a SeparatorInputError on waterFracOfLiquid, saying the share must lie strictly between 0 and 1 when it is given at all.",
 ["It falls back to the retention-proportional split, which is what happens whenever a pin cannot be honoured, and sizes AGBAMI at 12.311666 ft as though no pin had arrived.",
  "It clamps the share to a small positive value so the area inversion has something to work on, and records the clamp in the warning field beside the result it returns.",
  "It returns an object carrying an error string, because a drum with no water band is a state with no answer."],
 "A vessel with no water band is a two-phase vessel and should be sized as one. There is no clamp and no fallback, and a share of exactly 1 is refused in the same words.")

q(2, "A reviewer fixes the AGBAMI interface where they want it and then opens an argument about the retention times. What is wrong with that order of work?",
 "The share follows from the retentions, so raising the water retention above 8.000000 minutes widens the water band and lifts the interface.",
 ["Nothing, provided the pin is recorded on the datasheet, since a pinned share of 0.300000 and the proportional share of 0.516129 both size AGBAMI at 12.311666 ft.",
  "The interface cannot be placed until the length is known, because the vessel length of 12.311666 ft fixes the areas that the water share of 0.516129 then divides between the phases.",
  "A pinned interface takes the droplet verdicts out of the result, so the retention times cannot be argued about."],
 "Pinning is allowed and it is priced: the pin at 0.300000 took AGBAMI from 12.311666 ft to 21.181362 ft. What cannot be done is to treat a derived share as an input and reason back to the retentions.")

q(1, "Before FC1-0 a three-phase call with no oil gravity still produced two droplet verdicts. What were they, and why is that worse than a refusal?",
 "Both came back false, which is the word this engine uses for a vessel that passed, so a run with no density difference to work from read as a clean result.",
 ["Both came back true, which sent designers away to widen vessels that were already adequate, so the defect cost money rather than costing safety on the plant.",
  "Both came back null, which a caller rendering a boolean showed as a blank cell for a reviewer to fill in by eye.",
  "Only the carryunder verdict came back, because the water gravity was present and the rising drop leans on that one."],
 "The repair is a refusal by name, a SeparatorInputError on sgOil. A verdict for an input the engine could not read said nothing, and it said nothing in the reassuring direction.")

emit(Q, '/root/fc-wip-separation/banks/fc1a_m01.json')
finish()
