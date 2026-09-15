import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Associate m02, The Gas at Separator Conditions. Digest section 2, with
# the DAK range lines the module enforces.

q(1, "One sizing run on ABANA-1 has 600.000000 psig and 614.700000 psia live at the same moment. Which step takes which figure?",
 "The reduced pressure and the gas law take 614.700000 psia while the K lookup takes 600.000000 psig, because the pressure rule is written against a gauge reading and the gas law needs an absolute one.",
 ["Both steps take 614.700000 psia, since one sizing run carries one pressure and the gauge reading is only the number that happens to be printed on the instrument in the field.",
  "The reduced pressure takes 600.000000 psig and the gas law takes 614.700000 psia, because Ppr is a ratio and a ratio built from two gauge figures is unaffected by the atmosphere.",
  "The K lookup takes 614.700000 psia and the gas law takes 600.000000 psig, which is the pairing that makes a mesh pad K of 0.300000 and a density of 2.239712 lb/ft3 agree."],
 "Ppr 0.922896 was built from 614.700000 psia. The module's pressure rule deducts against gauge pressure above 100 psig, and at 600.000000 psig it records a vertical mesh pad at 0.300000."),

q(3, "\"pPsia must be a finite, positive absolute pressure\" and \"pPsig must be a finite, non-negative gauge pressure\". Why does one demand more than the other?",
 "Zero gauge is ordinary atmospheric pressure, and zero absolute is not a gas.",
 ["The absolute figure divides into a pseudo-critical pressure of 666.055360 psia to give Ppr, and a division by zero is the outcome the stricter wording exists to prevent.",
  "A gauge figure is read against the atmosphere and can go below it in a vessel under vacuum, so its guard has to admit the whole range down to and beneath zero.",
  "The two words belong to the steps they guard: a density may legitimately be zero where an allowable velocity may not, so the stricter one attaches to the input reaching the settling velocity."],
 "A gas at 0.000000 psig is a gas at 14.700000 psia. Feed a gauge pressure into the gas law and the density falls to zero at atmospheric conditions."),

q(0, "Raising the gas gravity from 0.680000 to 0.700000 takes Tpc from 372.642400 to 377.590000 degR and Ppc from 666.055360 to 663.336000 psia. At fixed conditions, what does that do to the reduced pair?",
 "It lowers Tpr and raises Ppr, and the two shifts add rather than cancel.",
 ["It raises both, because a heavier gas sits further from ideal behaviour on each axis and the reduced pair measures that distance rather than being two independent ratios.",
  "It lowers both, which is why AGBAMI sits at Ppr 0.549797 and Tpr 1.508700 against the ABANA pair of 0.922896 and 1.488478 on the rows above it.",
  "It leaves the pair where it stood, because the two shifts are of similar size in opposite directions, and that cancellation is what reduced coordinates exist to provide."],
 "Tpr is absolute temperature over Tpc and Ppr is absolute pressure over Ppc, so a higher Tpc lowers Tpr while a lower Ppc raises Ppr. AGBAMI differs from ABANA for a separate reason, which is that it sits at 364.700000 psia and 110.000000 degF."),

q(2, "Nothing in the ABANA vessel is at 372.642400 degR or anywhere near 666.055360 psia. What are those two figures for?",
 "They are a change of coordinates that puts gases of different compositions onto one surface a single fitted correlation can describe.",
 ["They are the conditions at which this gas would condense, which is why a stream below them is refused.",
  "They are the reference state the standard rate of 208.333333 standard ft3/s was measured at, which is why that rate has to be scaled by 14.7 over the absolute pressure before the vessel sees it.",
  "They are the pseudo-critical point of the real mixture, measured in a laboratory on a sample."],
 "The Sutton correlations turn one gravity into the pair, and the pair turns psia and degR into the reduced coordinates the fit works in. Neither is a state the gas ever reaches."),

q(1, "Build Tpr for ABANA-1. Which two figures divide, and what does that settle about the temperature unit?",
 "554.670000 degR over 372.642400 degR gives 1.488478, so the temperature has to reach the correlation in Rankine.",
 ["95.000000 degF over 372.642400 degR gives the reduced temperature directly, and the conversion happens inside the correlation, which is why the input field is labelled in degF.",
  "554.670000 degR over 666.055360 psia is the reduced pair taken together, and 1.488478 is read from it.",
  "520 degR over 372.642400 degR, since the reduced temperature is measured against the standard temperature the gas rate was reported at rather than against the vessel temperature."],
 "Tpr is the absolute temperature over the pseudo-critical temperature. 95.000000 degF is 554.670000 degR by adding 459.67, and that over 372.642400 degR is 1.488478."),

q(0, "Three conditions are refused by name: Tpr 0.848, Tpr 3.176 and Ppr 37.306. One message carries a reason the other two do not. Which one?",
 "Tpr 0.848, because below the pseudo-critical temperature the correlation would be describing a region that may hold no single-phase gas at all.",
 ["Ppr 37.306, because the limit of 30 is a limit on the fit data while the temperature bounds are limits on the physics, so its message has to say which kind of bound was crossed.",
  "Tpr 3.176, because an extrapolation upward runs toward the ideal gas limit where z tends to 1.",
  "None of the three carries a reason. Each quotes the reduced figure and the bound it crossed."],
 "Its message says the z factor would be an extrapolation below the critical temperature, so it is refused. The other two state the bound and stop."),

q(2, "At Ppr 0.149225 the engine returns z 0.986286 with a note attached. At Ppr 37.306 it returns nothing. What separates the two treatments?",
 "Below the fit data the surface runs to the ideal gas limit, so an answer is worth giving with a caution, and above the validity limit there is no answer at all.",
 ["The first sits inside the Tpr band of 1.0 to 3.0 and the second does not, and the temperature bound is the only one this module enforces by refusing outright.",
  "The first is an ordinary low-pressure separator and the second a pressure no vessel runs at, so one is answered and one declined.",
  "The first carries a density of 0.317797 lb/ft3 a caller can check by hand against the ideal gas law, and the second has no such fallback to fall back on."],
 "A refusal says there is no answer. A note says here is the answer and here is the reason to read it carefully: \"Ppr 0.149 is below the 0.2 where the DAK fit data start\"."),

q(3, "Across the published cases z reads 0.986286 at Ppr 0.149225, 0.871027 at 1.492250 and 0.828979 at 3.768829. What does that sequence rule out?",
 "Interpolating z by hand from a couple of remembered values, because the surface turns further up.",
 ["Using z at all below Ppr 0.2, since these three are falling and a fourth would have to rise to reach the ideal gas limit of 1 that the note below the fit data describes.",
  "Sizing a low-pressure stage on the same correlation as a high-pressure one, because one fit cannot hold a value that falls and then rises without a discontinuity somewhere in it.",
  "Reading z as a correction that always falls as pressure rises, which these cases show."],
 "z falls from 0.986286 to 0.828979 across these cases and turns and rises again further up the pressure axis. That shape is the reason a correlation exists at all."),

q(1, "The retired app held z at 0.850000. Read against the four published density cases, where was that substitution worst?",
 "At the low-pressure case, where the correlation returns 0.986286 and a gas near the ideal limit was being corrected as though it were dense.",
 ["At the 2500.000000 psia case, where the correlation returns 0.828979 and the density reaches 9.344827 lb/ft3.",
  "At the 1000.000000 psia case, where the correlation returns 0.871027, because that is the condition an ordinary separator runs at, so it is the error most often made in practice.",
  "Nowhere in particular, since 0.850000 sits between 0.828979 and 0.986286 on the four cases."],
 "0.850000 against 0.986286 is the widest of the four gaps, and a low-pressure stage is exactly where it sits. Density is proportional to one over z, so the error runs straight into the density."),

q(2, "What happens to a vertical vessel sized with z left at 1 in place of 0.908065?",
 "It comes out too small, because the gas is reported about a tenth lighter than it is and drops appear to fall faster than they do.",
 ["It comes out too large, because a higher z means a larger volume at conditions and a larger gas area.",
  "It is unchanged, because z enters the density and enters the actual rate again, and those two occurrences move the required area in opposite directions by the same proportion.",
  "It is refused, because a z of exactly 1 describes an ideal gas and the engine tests it against the DAK range."],
 "Density is proportional to one over z, so at 0.908065 the real gas is denser than an ideal one. A lighter gas raises the settling velocity and shrinks the area, and the direction is the unforgiving one: the error flatters the design."),

q(0, "AGBAMI carries the heavier gas at 0.700000 gravity and its gas weighs 1.276898 lb/ft3 against the 2.239712 lb/ft3 on the ABANA streams. What is doing that?",
 "Pressure. AGBAMI sits at 364.700000 psia against 614.700000 psia.",
 ["Temperature, since AGBAMI runs at 110.000000 degF against 95.000000 degF and the absolute temperature sits in the denominator of the gas law where it drives the density down.",
  "The z factor, since AGBAMI returns 0.947166 against 0.908065 and density is proportional to one over z, which is the one route the conditions take into the density figure.",
  "The pseudo-critical pressure of 663.336000 psia, which is below the 666.055360 psia the ABANA streams carry, so the same absolute pressure buys less reduced pressure and less density with it."],
 "The temperature and z both push the same way here and neither is large enough to matter. The absolute pressure is a little over half, and pressure dominates the gas law."),

q(3, "Two published cases share a gas and a temperature and differ tenfold in pressure, returning 0.317797 and 3.598498 lb/ft3. Why is the density ratio above ten?",
 "z is 0.986286 on the light case and 0.871027 on the dense one, which makes the high-pressure gas relatively denser still.",
 ["The pseudo-critical pressure enters the reduced pressure as well as the density, so Ppr 0.149225 and Ppr 1.492250 do not stand in the same proportion as the two absolute pressures do.",
  "Density is proportional to absolute pressure, and the two cases were reported at gauge figures, so the real ratio is taken against those figures once 14.7 has been added to each of them.",
  "The gas gravity of 0.650000 sets the molecular weight, which multiplies the pressure term."],
 "Density is proportional to pressure over z. Ten in pressure and 0.871027 against 0.986286 in z together give a little over eleven."),

q(1, "The standard against actual table reports a shrinkage of 43.171559 on both ABANA rows and 23.909612 on AGBAMI. What is that figure?",
 "The standard rate over the actual rate, which is why the two ABANA rows agree: it depends on the conditions and z rather than on how much gas is arriving.",
 ["The ratio of the ABANA gas rates of 110.000000 and 18.000000 MMscfd against the AGBAMI rate.",
  "The absolute pressure of 614.700000 psia over 14.7, which is why the ABANA figure is the larger.",
  "The volume a barrel of liquid loses on its way to the tank, carried on the gas rows for the same reason."],
 "1273.148148 standard ft3/s over 29.490437 ft3/s and 208.333333 over 4.825708 both give 43.171559, because ABANA-1 and ABANA-2 share a pressure, a temperature and a z."),

q(2, "Name what takes 1273.148148 standard ft3/s to 29.490437 ft3/s, and which term does most of the work.",
 "14.7 over the absolute pressure, the absolute temperature over 520 degR, and z, with pressure dominating because the vessel holds the gas at about forty times atmospheric.",
 ["The 86400 seconds in a day, the absolute temperature over 520 degR and z, with the seconds doing most of it.",
  "14.7 over the absolute pressure and z alone, with pressure dominating and the temperature term dropped.",
  "The absolute pressure over 14.7, the absolute temperature over 520 degR and z, with pressure dominating, which is why the actual rate is the larger of the two figures."],
 "Pressure squeezes the gas, temperature expands it and z corrects for the gas being real. The vessel passes about one fortieth of the standard volume."),

q(0, "ABANA-1 and AGBAMI both carry 18.000000 MMscfd and arrive at 4.825708 and 8.713371 ft3/s. What does that make of a nameplate rate?",
 "It is no measure of duty until somebody states the pressure and the temperature beside it.",
 ["It is a measure of duty once the gas gravity is stated beside it, since 0.680000 and 0.700000 are what separate the two streams and the conditions follow from a gravity through the reduced pair.",
  "It is a measure of duty within one orientation, since the ratio between the two figures is the ratio of the K values of 0.300000 and 0.525000 those two vessels carry.",
  "It is a measure of duty on the liquid side, since retention is built from bpd."],
 "AGBAMI sits at 364.700000 psia against 614.700000 psia, so nearly twice the room for the same gas rate. The standard rate says nothing about how much room the gas needs until the conditions are applied to it."),

emit(Q, '/root/fc-wip-separation/banks/fc1b_m02.json')
finish()
