import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Associate m01, What a Separator Is For. Digest section 1, plus the unit
# and refusal material the four lessons of this module carry.

q(2, "A flowsheet asks what the gas leaving an inlet separator at 614.700000 psia and 95.000000 degF contains. What does this sizing engine return for that request?",
 "Nothing. It holds no equation of state and no component list, and the split of a feed at a stated pressure and temperature is a flash calculation living in engines/fluid/separator.js.",
 ["The gas density of 2.239712 lb/ft3 and the actual rate of 4.825708 ft3/s, which together are the outlet composition expressed in the units a vessel is sized in.",
  "A composition rebuilt from the gas gravity of 0.680000, since one gravity stands in for the whole mixture and the pseudo-critical pair can be read backwards to it.",
  "The liquid rates it was handed, on the argument that whatever fails to leave with the gas leaves as liquid, so the two outlet streams follow from the inlet rates on their own."],
 "Sizing returns lengths and areas: an area of 3.308855 ft2, a diameter of 2.052551 ft, a height of 16.605223 ft. None of those is a composition, a recovery or a rate leaving the vessel."),

q(0, "One refusal arrives as a thrown SeparatorInputError and another as an object carrying an error string. Which situation produces the second, and why does it help in a sweep over a dozen candidate diameters?",
 "The inputs are valid and the method has no answer for the state they describe, so the one failed candidate carries its reason while the others still return their numbers.",
 ["The input is absent rather than merely out of domain, so the engine carries on with what it has and reports at the end which candidate lacked the value it needed most.",
  "The fault was found inside the geometry rather than inside the input guard, so the error string reformats the message a throw would carry.",
  "A sweep is running, and the caller converts every throw into a returned object so that one unusable diameter cannot stop a batch of twelve that is otherwise complete."],
 "{ error: \"a positive settling velocity is needed\" } describes a state the method cannot size, and it arrives as data so a caller can show it beside the results. A missing gas gravity is thrown and names itself."),

q(3, "A liquid level of 0 and a liquid level of 1 are both finite numbers and both refused. What is that guard checking?",
 "The domain as well as the presence, because a level of 0 or 1 describes a vessel holding no liquid or no gas at all.",
 ["Whether the level agrees with the retention volume of 35.091146 ft3, which neither an empty drum nor a completely full one can hold at the diameter that was supplied with it.",
  "Whether the figure was typed as a fraction rather than as a percentage, since a level of 1 is the reading a user meant to enter as one hundredth of the vessel diameter.",
  "The presence of the value alone, so both reach the geometry and fail later."],
 "The message is \"liquidLevelFrac must lie strictly between 0 and 1 (got 0)\". A gauge pressure of -20 is refused the same way, a perfectly good number sitting outside its domain."),

q(1, "The retired app held z at 0.850000, used one K at every pressure, sized two-phase vessels only, and took its gas velocity from the diameter of the previous render. Which of those four is hardest to catch?",
 "The velocity from the previous render, because what prints is a correct calculation on a diameter the user has already replaced.",
 ["The single K at every pressure, because a table row that never moves with pressure gives a settling velocity wrong by a fixed proportion on every vessel that app ever sized.",
  "The two-phase limit, because a drum holding oil and water is sized on one mixed density.",
  "The held z of 0.850000, because the four published cases return 0.871027, 0.986286, 0.828979 and 0.873908, so the error differs on every stream and leaves no trace on any of them."],
 "A stale velocity is arithmetically correct against an input nobody can see any more. The other three are wrong in ways a reader can reproduce, and 0.850000 can be checked against 0.908065 at the ABANA conditions."),

q(3, "Two K lookups fail. One names no mist extractor at all, the other names verticalFoam. What does each message do that the other cannot?",
 "The first offers the other route by name, kOverride, and the second quotes the rejected string back so a typing error is visible.",
 ["The first states the domain of the input while the second states its type, which is the difference between a value that is missing and a value of entirely the wrong kind.",
  "The first is thrown and the second comes back as an error object, since an unknown name is a state.",
  "The first names K_BASE as the table to choose from and the second names the orientation."],
 "\"internalsId is required: name a mist extractor from K_BASE or give kOverride\" and \"internalsId 'verticalFoam' is not a mist extractor in K_BASE\". Both are thrown and both name internalsId."),

q(0, "A user types 614.700000 into the field the K lookup reads. What has gone wrong, and does anything object?",
 "The lookup derates against a pressure the vessel never sees, and nothing objects, because that figure is finite and non-negative.",
 ["The lookup refuses it, since a gauge pressure ending in .700000 is the signature of an absolute figure and the guard tests for it before the pressure rule is applied to a row.",
  "Nothing has gone wrong. The pressure rule is written against absolute pressure, so 600.000000 psig would be the error.",
  "The K comes back floored at 0.120000, because the extra 14.7 carries the deduction past the floor."],
 "The pressure rule is written against gauge pressure above 100 psig, and both pressures are live inside one sizing run. The label is the only thing separating 600.000000 psig from 614.700000 psia."),

q(1, "Why does 95.000000 degF have to become 554.670000 degR before the correlations see it?",
 "Tpr is that temperature over a pseudo-critical temperature of 372.642400 degR, and a ratio only means something when both figures are measured from absolute zero.",
 ["The correlation had its coefficients regressed in Rankine, so the conversion matches the units the fit was written in.",
  "The gas law takes 614.700000 psia, and the temperature is converted alongside it so both carry the same reference.",
  "Rankine keeps the arithmetic in whole degrees where Fahrenheit does not, which matters at six decimals."],
 "554.670000 degR over 372.642400 degR is Tpr 1.488478. Nothing in the method takes Fahrenheit directly."),

q(2, "110.000000 MMscfd becomes 1273.148148 standard ft3/s by one piece of arithmetic. What has that step done, and what has it left undone?",
 "It has made a daily volume into a volume per second, and it has left the gas at standard conditions, which is nowhere inside the vessel.",
 ["It has taken the rate to the conditions in the drum by applying the 86400 seconds in a day.",
  "It has applied the pressure and the temperature and left z out, which is why the figure is still called standard and why 0.908065 is applied to it in the step that follows.",
  "It has produced the numerator of the gas area, so dividing 1273.148148 ft3/s by 1.458422 ft/s gives the area."],
 "The rate times a million over 86400 is arithmetic. Pressure, temperature and z then take 1273.148148 standard ft3/s to 29.490437 ft3/s inside the vessel."),

q(2, "3000.000000 bpd held 3.000000 minutes comes to 35.091146 ft3. Which two constants carry that conversion?",
 "5.614583333333333 ft3 per barrel and the 1440 minutes in a day.",
 ["The 86400 seconds in a day together with 5.614583333333333 ft3 per barrel, since every other rate in this method is taken to a per-second basis before the geometry sees it.",
  "62.4 lb per ft3 for water and 5.614583333333333 ft3 per barrel, because a retention volume is a mass of liquid held for a time and a density is what converts it back to a volume.",
  "The 1440 minutes in a day on its own, because a barrel per day held for one minute is already a volume once the rate and the holding time are stated in the same unit of time."],
 "A liquid rate in bpd becomes a volume per minute through the barrel conversion and the 1440 minutes in a day, and 3.000000 minutes of it is 35.091146 ft3."),

q(0, "The gas-sized ABANA-1 vessel reports a slenderness of 8.090042 with no unit beside it. Why is that right rather than an omission?",
 "It is a height of 16.605223 ft over a diameter of 2.052551 ft, and a length over a length cancels.",
 ["It is a dimensionless group in the same sense as the reduced pressure of 0.922896, so its unit is carried by the pseudo-critical figure it was divided by rather than printed next to it.",
  "Slenderness is reported in feet per foot, and the engine drops the unit because both figures on that row already carry ft, which would otherwise print the same unit three times over.",
  "It is a ratio of two areas rather than two lengths, and the ft2 figures cancel too."],
 "16.605223 ft over 2.052551 ft is 8.090042. Once everything is in ft3 per second, ft per second and ft, the geometry is ordinary and a ratio of two lengths is a bare number."),

q(3, "A caller catches the SeparatorInputError for a missing gas gravity and carries on with a substituted value. What does the run then produce?",
 "A complete vessel built on a number nobody supplied.",
 ["A diameter that is right and a height that is wrong, because the gravity enters on the gas side of the calculation and the retention volume of 35.091146 ft3 is untouched by any of it.",
  "A refusal further down, because the substituted gravity fails the domain check at the reduced pair and the second guard catches what the first one was silenced on.",
  "The same answer as before, because the engine re-reads the gravity from the stream record when the density step runs and the substituted value never reaches that step at all."],
 "The gravity feeds Ppr and Tpr, then z, then the density, then the settling velocity and the diameter. That is what the retired app did by holding z at 0.850000: a full set of dimensions printed every time."),

q(1, "A user interface is being laid out for the studio. Which kind of refusal belongs beside the results, and which belongs on the input that produced it?",
 "The returned error string belongs beside the results, because the run continued and other candidates still have numbers, and the thrown error belongs on the input it names.",
 ["The thrown error belongs beside the results, because it carries the value that arrived and a reader can see which input moved.",
  "Both belong on the input, since every message this engine produces names an input and a failed run has no results.",
  "Both belong beside the results, since a sweep produces a mixture of the two and separating them would split one table."],
 "A throw names an input somebody has to fix. { error: \"settling needs a positive K and a liquid denser than the gas\" } arrives as data, so it can be shown next to the candidates that did return numbers."),

q(0, "Three separators run in series at falling pressures. How many problems does this engine solve, and what has to come from somewhere else?",
 "Three sizing problems, and the stream feeding each stage below the first, which is a flash result this engine takes as given.",
 ["One sizing problem in three parts, since the engine carries the stream from stage to stage and only the first set of conditions has to be supplied by hand at the top of the train.",
  "Three sizing problems and nothing further, because the rates follow from the pressure drop through the train.",
  "Two sizing problems and one flash, since the first vessel takes the wellstream as measured and the stages beneath it are sized on the gas the engine released at the stage above."],
 "It takes the gas rate and the liquid rates as given, reads them at conditions, and sizes a drum around them. Type the flash result in and it will size the vessel."),

q(2, "What claim is being made when a report states that ABANA-1 needs 2.052551 ft of diameter?",
 "That the gas has room for a drop to fall at 1.458422 ft/s, and nothing at all about what the gas leaving the vessel carries with it.",
 ["That every drop size present in the gas reaches the liquid surface before the gas leaves the vessel.",
  "That the vessel meets the carryover specification the mist extractor was selected against, since K entered the settling velocity and K is fitted to observed carryover behaviour.",
  "That the gas leaves dry, which is the meaning of a velocity margin of 1.000000 at the gas-required diameter."],
 "A sized vessel and a stream that splits the way a flowsheet says it will are two separate claims. This method returns lengths and areas and never a composition."),

q(1, "An engineer reads 600 off a drawing and hands it straight to the gas law. What one check would have caught that before a vessel was sized?",
 "An absolute pressure at these conditions ends in .700000, and 600 does not.",
 ["A reduced temperature outside the DAK range of 1.0 to 3.0, which is what an absolute pressure entered as a gauge figure produces at the ABANA conditions of 95.000000 degF.",
  "A gas density returning zero, which is what the gas law gives whenever a gauge pressure is handed to it in the place where an absolute pressure belongs.",
  "A velocity margin away from 1.000000 at the gas-required diameter, since the margin is built from the same pressure and would have moved along with it."],
 "The absolute figure is the gauge figure plus 14.7, so 600.000000 psig is 614.700000 psia. At separator pressures the error moves Ppr, z, the density, the settling velocity and the diameter by amounts too small to look wrong."),

emit(Q, '/root/fc-wip-separation/banks/fc1b_m01.json', expect_n=15)
finish()
