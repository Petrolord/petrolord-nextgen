import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 consequence, Expert tier, module "TNT and the Scaled Distance".
# Digest sections drawn on: 23 (the TNT equivalent mass), 24 (cube root
# scaling, the Kinney and Graham overpressure and its judged range), 3 (the
# explosions refusals), 4 (the KG source string) and 32 (single route).

q(2,
 "BONGA is a butane cloud of 3000 kg with a heat of combustion of 45700000 J/kg, and the TNT blast energy is stated as 4600000 J/kg. What TNT equivalent mass does `tntEquivalentMass` return at a yield factor of 0.1?",
 "2980.434783 kg",
 ["596.086957 kg, which is the row printed for a yield factor of 0.02",
  "5960.869565 kg, which is the row printed for a yield factor of 0.2",
  "1192.173913 kg, which is the row printed for 0.04"],
 "The engine's model string is Q_TNT = alpha_e Qf Emf / Em_TNT and the engine returns 2980.434783 kg against a yield factor of 0.1. 596.086957, 1192.173913 and 5960.869565 kg are the rows for 0.02, 0.04 and 0.2: each is the right arithmetic at a different stated yield, and the TNT mass is linear in the yield, so reading the wrong row moves the answer in proportion."),

q(0,
 "On the same BONGA cloud, which stated yield factor produces the TNT equivalent mass of 1192.173913 kg?",
 "0.04",
 ["0.02", "0.1", "0.2"],
 "The course's table pairs 1192.173913 kg with a yield factor of 0.04. The yield of 0.02 gives 596.086957 kg, 0.1 gives 2980.434783 kg and 0.2 gives 5960.869565 kg. The yield is the caller's input; the Yellow Book reports 0.02 to 0.2 in use, and the engine carries no default for it."),

q(3,
 "An analyst types the TNT blast energy in kJ/kg instead of J/kg. What does the engine return, in its own words?",
 "A refusal naming `tntBlastEnergyJKg`: \"tntBlastEnergyJKg: must be the TNT blast energy in J/kg, between 4.0e6 and 5.0e6 (the YB cites 4.19e6 to 4.65e6)\"",
 ["A result with a TNT mass one thousand times too large, since the engine never converts a unit it was not asked to convert",
  "A refusal naming `yieldFactor`, because the slip is caught as a yield outside the band of 0.02 to 0.2 the Yellow Book reports in use",
  "A result carrying a warning that the energy lies outside the Yellow Book's cited 4.19e6 to 4.65e6 J/kg"],
 "The course lists this refusal: the TNT blast energy is refused outside 4.0e6 to 5.0e6 J/kg precisely to catch a units slip, and the field named is `tntBlastEnergyJKg`. No result comes back, so neither a scaled up TNT mass nor a warning is returned. The yield field is a different refusal with its own message."),

q(1,
 "A yield factor is typed as a percentage, 10, where the engine expects a fraction. Which message does the engine return?",
 "\"yieldFactor: the TNT equivalency (yield) must lie in (0, 1]: the YB reports 0.02 to 0.2 in use\"",
 ["\"tntBlastEnergyJKg: must be the TNT blast energy in J/kg, between 4.0e6 and 5.0e6 (the YB cites 4.19e6 to 4.65e6)\"",
  "\"dischargeCoefficient: must lie in (0, 1]: the YB recommends 0.62 for a sharp orifice\"",
  "\"radiativeFraction: must lie in (0, 1]: the YB gives 0.1 to 0.4\""],
 "The yield must lie in (0, 1], so 10 is refused on the field `yieldFactor` with the message quoted. The TNT energy message belongs to a units slip in the blast energy. The discharge coefficient and radiative fraction messages share the (0, 1] form but belong to `liquidOrificeDischarge` and `surfaceEmissivePower`, and the engine names the field that failed."),

q(1,
 "The course's test plants the same mistake in the engine and its oracle and asks what still catches it. What does it say catches a mistake in the TNT equivalence?",
 "Nothing: the transcription alone, so the TNT equivalence is taught and never graded",
 ["The published conference column, which the golden labels as a published case and reproduces within 1.70e-4",
  "The OSD/30 printed lethal doses, read against the engine to the digits the table prints",
  "The Yellow Book worked cases, together with the oracle's own nozzle maximisation"],
 "The course's row for the TNT equivalence reads 'nothing: the transcription alone' and 'no' under graded. The conference column stands behind Kinney and Graham, the OSD/30 lethal doses behind the thermal presets, and the Yellow Book worked cases with the nozzle maximisation behind the outflow through a hole. That is why every capstone that needs a TNT mass STATES it."),

q(3,
 "BONGA's stated charge is 500 kg of TNT. What scaled distance does the engine report for a target 100 m away?",
 "12.599210 m/kg^(1/3)",
 ["6.299605 m/kg^(1/3), the Z of the 50 m row",
  "25.198421 m/kg^(1/3), the Z of the 200 m row",
  "2.519842 m/kg^(1/3)"],
 "The engine's model string is \"Hopkinson-Cranz cube-root scaling, Z = R / W^(1/3)\", and the 100 m row of BONGA's 500 kg table prints Z = 12.599210. The values 2.519842, 6.299605 and 25.198421 are the same charge at 20, 50 and 200 m, which scale linearly with the distance because the charge is held."),

q(0,
 "Under Hopkinson-Cranz scaling, at what distance does a charge eight times heavier give the same peak overpressure as the original charge?",
 "At twice the distance, because Z = R / W^(1/3) and the cube root of the charge ratio is two",
 ["At eight times the distance, since the overpressure would then scale in direct proportion to the charge mass",
  "At the square root of eight times the distance, as a square root scaling law would give",
  "At the same distance, because the overpressure ratio is independent of the charge"],
 "Two charges give the same overpressure at the same Z, and Z divides the distance by the cube root of the charge. A charge eight times heavier therefore meets the same Z at twice the distance. Proportional scaling and square root scaling are wrong laws for this model, and holding the distance fixed raises the overpressure because Z falls."),

q(2,
 "The course runs eight times BONGA's 500 kg charge at twice 100 m. What overpressure does the engine print for that case?",
 "7457.699887 Pa",
 ["3427.919093 Pa, the original 500 kg charge at the 200 m row",
  "19626.657230 Pa, which is the original charge at the 50 m row",
  "9985.363723 Pa"],
 "Eight times the charge at twice the distance has the same Z as the original charge at 100 m, so the engine gives 7457.699887 Pa both ways. 3427.919093 Pa is the original charge at 200 m, which forgets to scale the charge. 19626.657230 Pa is the 50 m row, and 9985.363723 Pa is the ratio table at Z = 10, a nearby Z that is not this one."),

q(3,
 "In the course's table of the ratio over ambient against Z, what overpressure in Pa does the Kinney and Graham fit give at Z = 5?",
 "29238.106780 Pa",
 ["9985.363723 Pa",
  "207926.999232 Pa",
  "0.288558 Pa, the fit's ratio read as a pressure"],
 "At Z = 5 the fit's ratio is 0.288558 and the overpressure is 29238.106780 Pa. Reporting 0.288558 as a pressure forgets that the fit returns ps/pa and has to be multiplied by the ambient. 207926.999232 Pa and 9985.363723 Pa are the Z = 2 and Z = 10 rows."),

q(0,
 "The Kinney and Graham fit returns 9.955978 at Z = 1. What is that number?",
 "The peak side-on overpressure over the ambient, a ratio, which the engine reports as 1008789.503793 Pa",
 ["The peak side-on overpressure in kPa, which the engine then multiplies by one thousand to report it in Pa",
  "The overpressure in psig, which the engine converts with `PA_PER_PSI` before it reports the figure in Pa",
  "The overpressure in bar, a convenient unit close to the charge, which the engine rescales before it reports Pa"],
 "The engine's model string gives ps/pa, the overpressure divided by the ambient pressure, and the table prints the ratio 9.955978 beside 1008789.503793 Pa at Z = 1. The ratio carries no unit, so reading it as kPa, psig or bar invents a conversion the engine never makes. `PA_PER_PSI` belongs to the overpressure probit."),

q(2,
 "What does the engine's validation record say about the range Z from 0.05 to 40 over which the Kinney and Graham fit is used?",
 "It is a judgement: the sources it read print no range for the fit itself, and the span is borrowed from the Kingery-Bulmash compilation",
 ["It is printed by Kinney and Graham (1985) with the fit, and the engine copies it without change from their edition",
  "It is the span the Yellow Book states for the TNT equivalence method as a whole",
  "It is fixed by the conference column, whose five published cases run from Z = 0.05 up to 40"],
 "The course says the validation record calls the range a JUDGEMENT, and the engine's range string reads \"Z in [0.05, 40] m/kg^(1/3) (judgement; see findings)\". The sources read print no range for Kinney and Graham itself, so it is neither printed with the fit nor stated by the Yellow Book, and the conference column's five cases do not define a span."),

q(1,
 "A call asks `kinneyGrahamOverpressure` for a scaled distance beyond 40 m/kg^(1/3). What comes back?",
 "A refusal naming `scaledDistanceMKg13`: \"scaledDistanceMKg13: Z lies outside 0.05 to 40 m/kg^(1/3), the range this fit is used over\"",
 ["A result carrying a warning to treat it as an extrapolation, the way the Briggs sigmas behave outside 100 m to 10 km",
  "The overpressure at the edge of the range, 2121.136283 Pa, since the engine clamps Z to 40",
  "A result with the state BEYOND_SEARCH_RANGE and a distance of null"],
 "The engine refuses outside its judged range and names the field `scaledDistanceMKg13`. The Briggs sigmas are the function that warns and still returns, and nothing in the explosions section clamps Z. BEYOND_SEARCH_RANGE is a state of the plume and heat flux distance searches."),

q(0,
 "BONGA's 500 kg charge is evaluated at 300 m, its farthest printed row. What overpressure does the engine give there?",
 "2247.931733 Pa",
 ["2121.136283 Pa, which is the value at the Z = 40 edge of the ratio table",
  "3427.919093 Pa, which is printed for the same charge at the 200 m row",
  "4393.409670 Pa, which the ratio table gives at Z = 20"],
 "The 300 m row prints Z = 37.797631 and 2247.931733 Pa, just inside the judged range. 2121.136283 Pa is Z = 40, 3427.919093 Pa is the 200 m row and 4393.409670 Pa is Z = 20: each belongs to a different scaled distance."),

q(3,
 "At a yield factor of 0.2 BONGA's TNT equivalent mass, 5960.869565 kg, is larger than its fuel mass of 3000 kg. What in the engine's model string makes that possible?",
 "The fuel's heat of combustion, 45700000 J/kg, is much larger than the TNT blast energy, 4600000 J/kg, and their ratio multiplies the yield",
 ["The engine adds the fuel mass and the TNT mass together before it reports Q_TNT, so the charge that the blast fit takes always exceeds the fuel",
  "The yield factor is applied twice, once to the fuel mass and once to the heat of combustion",
  "The engine multiplies the TNT mass by the ambient pressure of 101325 Pa before it reports the charge"],
 "Q_TNT = alpha_e Qf Emf / Em_TNT, so the ratio of heats, 45700000 over 4600000 J/kg, multiplies the yield and the fuel mass. Nothing is added, the yield enters once, and the ambient pressure appears only in turning the fit's ratio into pascals."),

q(2,
 "Every basis block names its source. Which source string does the Kinney and Graham overpressure carry, verbatim, from `CONSEQUENCE_SOURCES`?",
 "Kinney and Graham (1985) Explosive Shocks in Air, 2nd ed.; as printed by Guzas and Earls (2010) eq. 5",
 ["TNO Yellow Book CPR 14E (2005), the source that fixes the TNT equivalence and the outflow through a hole",
  "UK HSE SPC/Tech/OSD/30, Indicative human vulnerability to the hazardous agents present offshore",
  "TNO Purple Book CPR 18E (1999), the source of the probit to probability table"],
 "The KG key in `CONSEQUENCE_SOURCES` reads as quoted and fixes the free air peak side-on overpressure closed form. The Yellow Book fixes the TNT equivalence, OSD/30 the thermal, toxic and overpressure probits, and the Purple Book the probit table and its toxic coefficients. The 2020 conference paper is the golden's secondary evidence and is no source key."),

emit(Q, '/root/hse-wip-consequence/banks/h4a_m01.json', expect_n=15)
finish()
