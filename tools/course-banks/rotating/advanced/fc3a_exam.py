import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Expert final exam, 42 questions across digest sections 11 to 17.

q(1, "On the identity table the pair k of 1.400000 and an efficiency of 0.820000 gives an exponent ratio of 0.348432056. Multiplied by that efficiency it gives 0.2857142857142857 against an isentropic exponent ratio of 0.28571428571428564. What is being demonstrated?",
 "That the product is the isentropic exponent ratio exactly, to within double-precision rounding.",
 ["That the product drifts from the isentropic figure as k rises, which is why the table stops at 1.400000.",
  "That the efficiency has to be applied twice, once to the exponent and once to the head.",
  "That a richer gas needs a larger residual, which the last column of the table records."],
 "Because that relation holds for every pair, dividing the isentropic head by the isentropic efficiency and dividing the polytropic head by the polytropic efficiency are one expression.")

q(3, "Walk the polytropic efficiency upward across one stage and the exponent ratio runs 0.341215205 at 0.650000 and 0.257895213 at 0.860000. What is a better machine doing to the path?",
 "Flattening it, because less of the work is being turned into heat in the gas.",
 ["Steepening it, because a better machine delivers more head for the same ratio.",
  "Leaving it alone, because the exponent is a property of the gas and the efficiency enters later.",
  "Reversing it, because above an efficiency of 0.755000 the isentropic exponent becomes the larger."],
 "The discharge follows the exponent, falling from 378.6113 degF at 0.650000 to 301.1829 degF at 0.860000 on that same walk.")

q(0, "A stage asked for a ratio of only 1.500000 leaves 92.000000 psia at 138.0000 psia and 175.3008 degF. What are its head and its gas power?",
 "19739.9969 ft lbf per lbm and 707.4815 hp.",
 ["35245.9460 ft lbf per lbm and 1263.2148 hp.",
  "19739.9969 ft lbf per lbm and 2279.6019 hp.",
  "48215.9853 ft lbf per lbm and 1728.0611 hp."],
 "That row carries a null warning. The discharge pressure, the temperature, the head and the power all rise together as the ratio the stage is asked to take rises.")

q(2, "One stage returns a polytropic efficiency of 0.755000000 and an isentropic efficiency of 0.722539710. What is the relationship, and by how much?",
 "The isentropic figure is the lower of the two, by 0.032460290.",
 ["The polytropic figure is the lower of the two, by 0.032460290.",
  "They are two names for one quantity and the small gap is rounding.",
  "The isentropic figure is the lower of the two, by 0.957006239."],
 "The isentropic head of 60870.3418 ft lbf per lbm is also the smaller of the two heads, so each member of the isentropic pair is smaller than its polytropic counterpart.")

q(1, "A reviewer is handed any gate at all and wants to know whether it is worth anything. What is the single question to ask?",
 "What input would make it fail.",
 ["What tolerance it carries and how that tolerance was chosen.",
  "Whether it runs on the published cases or on cases the wave generated.",
  "Whether it compares two routes or one route against a stored value."],
 "If there is no such input, the gate is a restatement of the formula rather than a test of it, and the confidence it produces is manufactured.")

q(3, "A stage at 92.000000 psia is asked for a ratio of 3.200000. What is its discharge pressure, and is that figure a result or an input?",
 "294.4000 psia, and it follows from the suction and the ratio.",
 ["294.4000 psia, and it is an input the caller states beside the ratio.",
  "985.000000 psia, which is the discharge the whole duty is working toward.",
  "202.7701 psia, which is where the first stage of the train lands."],
 "The pressure ratio and the suction fix the discharge pressure. Everything thermodynamic then follows from the exponent applied at that ratio.")

q(0, "Held at one set of conditions and walked across k, the discharge runs 269.0103 degF at 1.200000 and 415.6938 degF at 1.400000. What does that say about where k comes from?",
 "The gas analysis, since nothing in the engine measures k and the caller supplies it.",
 ["The suction state, since the correlation returns k along with the compressibility there.",
  "The polytropic efficiency, since the exponent ratio is the isentropic one divided by it.",
  "The standard base the module carries, so every duty in this package sits on one row."],
 "Nothing in the engine measures it. A handbook value for a gas the stream is not will produce an exponent, a temperature and a power that are all internally consistent and all wrong.")

q(2, "One row of the sweep has both rules asking for the same thing, 2 stages, at an overall ratio of 4.891304348. What goes into the governed-by field there?",
 "Both equally, and it says so rather than picking one of them.",
 ["The ratio limit, because it is the rule evaluated first.",
  "Discharge temperature, because it is the rule that governs every other row.",
  "Neither, because a rule is named only where the two demands differ."],
 "The ratio per stage there is 2.211629342. On such a row the count sits on the edge of both rules at once, so a small move in either input changes the answer.")

q(0, "The last row of the sweep runs to a discharge of 2400.000000 psia. What are the overall ratio, the count and the brake power there?",
 "26.086956522, 4 stages and 6085.1118 brake hp.",
 ["26.086956522, 3 stages and 5365.9149 brake hp.",
  "20.652173913, 4 stages and 5615.9251 brake hp.",
  "13.043478261, 4 stages and 6085.1118 brake hp."],
 "Power climbs smoothly along that table and the stage count climbs in steps, and each step is a machine, a cooler and a foundation.")

q(1, "The sweep also carries a fuel column, running 0.432769057 MMscfd at the lowest discharge pressure and 1.200960144 at the highest. What does that column follow?",
 "The brake horsepower, because the driver is sized on the whole train's shaft work.",
 ["The overall ratio, because fuel is charged against the pressure the duty asks for.",
  "The stage count, because each machine carries its own driver and its own heat rate.",
  "The cooling duty, because the fuel gas is drawn off downstream of the last cooler."],
 "More machines means more brake power, and more brake power at one heat rate means more of the stream going up the stack. Fuel compounds with the staging.")

q(3, "The cooling column on the same sweep runs from 2.9723 MMBtu per hr to 13.4048. What kind of quantity is that, and who owns it?",
 "A real exchanger duty, and it belongs on somebody's equipment list.",
 ["A correction applied to the brake power, which the driver calculation then removes.",
  "A bookkeeping figure that closes the energy balance on the stage table.",
  "The heat the driver rejects, which is why it rises with the brake horsepower."],
 "Read that total beside the brake horsepower total. Moving the approach moves both of them, and the direction that helps one is the direction that hurts the other.")

q(2, "The refusal at the twelve-stage cap ends with the clause \"from an inlet of 100.0 F\". What does that clause add?",
 "It says how much room the duty ever had, since the limit of 110.0 F sits barely above it.",
 ["It identifies which stage of the train the measurement was taken on.",
  "It gives the suction temperature, which is the only inlet a stage count is ever tested from.",
  "It records the approach the cooler reached, so the cooling can be corrected."],
 "Reporting the limit on its own would leave a reader wondering whether the inlet was the problem. Almost no compression fits in the space between those two figures.")

q(0, "Four other faults reach the same function as the twelve-stage cap, and each of them has its own refusal. What does that buy a reader who meets the cap?",
 "Certainty that this refusal is the cap and not one of the four, so the diagnosis starts in the right place.",
 ["A guarantee that all four are re-tested at each of the twelve trials, so a late one cannot slip through.",
  "The four messages, returned alongside the cap's own, so every possibility is listed.",
  "A count of how many guards the call passed before it reached the cap."],
 "That is the difference between being told something is wrong and being told what is wrong. The count tried is on the return for the same reason, saying the search ran to its bound.")

q(1, "On the discharge-pressure sweep the hottest stage runs 218.0060 degF at the lowest pressure and 290.6346 degF on the 600.000000 psia row. Which row is closest to the stated limit, and by how much?",
 "The 600.000000 psia row, with 9.3654 degF left.",
 ["The lowest-pressure row, with 81.9940 degF left.",
  "The 1500.000000 psia row, with 10.9272 degF left.",
  "The 2400.000000 psia row, with 35.8243 degF left."],
 "That column is derived on each row as the stated limit less the hottest stage. It is non-negative on all nine rows of the table.")

q(3, "The first stage of the SOKU train returns 1461.7913 gas hp and 1510.1150 brake hp. What is the difference between those two figures?",
 "The mechanical losses of that one machine, the gearbox, the bearings and the seals.",
 ["The driver losses, which the fuel calculation applies again downstream.",
  "The cooling duty on that stage, expressed as power rather than as Btu per hr.",
  "The share of the train total that the second and third stages do not carry."],
 "Every stage on the train carries the same step. Gas horsepower is what the gas receives and brake horsepower is what the coupling has to deliver.")

q(2, "Cool a three-stage train back to 90.0000 degF between stages and the stage discharges come out 251.2956, 233.6372 and 233.6372 degF. Why is the first one the hottest?",
 "Stage one runs from the suction of 104.0000 degF, which is warmer than the cooler reaches.",
 ["Stage one takes the largest share of the overall ratio, and the two after it split the remainder.",
  "Stage one is the only stage whose compressibility is evaluated at both ends.",
  "Stage one is uncooled on its inlet and also uncooled on its outlet, so its heat carries forward."],
 "A single stage starts from the suction and every stage after the first starts from the interstage cooler, so on a cold approach the first stage is the odd one out.")

q(0, "Cool the same train back to 180.0000 degF instead and the discharges come out 188.2466, 275.6056, 275.6056, 275.6056 and 275.6056 degF. What has happened to the first stage?",
 "It has become the coolest on the train, because the approach now sits well above the suction.",
 ["It has been given a smaller ratio than the four after it, which is how the engine holds the limit.",
  "It has been cooled on its inlet for the first time, which is what drops it below the others.",
  "It has stayed where it was, and what changed is only how many stages follow it."],
 "That walk holds the count at 3 through 130.0000 degF and then buys a fourth machine at 150.0000 degF and a fifth at 180.0000 degF.")

q(1, "At an intercooler approach of 130.0000 degF the hottest stage on a three-stage train reaches 284.0898 degF. How much room is left under the stated limit?",
 "15.9102 degF.",
 ["41.1365 degF.",
  "48.7044 degF.",
  "6.7096 degF."],
 "The room shrinks as the approach rises while the count holds, going 48.7044, then 41.1365, then 15.9102 degF across the three-stage rows. Past that the count moves instead.")

q(3, "At an approach of 150.0000 degF the count steps to 4 and the hottest stage is 265.9556 degF. What happened to the room under the limit?",
 "It went back up, to 34.0444 degF, because the extra machine cut the ratio each stage takes.",
 ["It stayed at 15.9102 degF, since the limit is what fixed the count in the first place.",
  "It fell further, to 24.3944 degF, which is what buys the fifth machine at the next step.",
  "It became meaningless, since the limit is applied to the final discharge rather than to the hottest stage."],
 "The count moving is what keeps the discharge inside the limit. What the warmer approach bought was a machine rather than a hotter train.")

q(2, "At an approach of 180.0000 degF the totals are 8.6948 MMBtu per hr of cooling and 4572.5633 gas hp. How does that row sit against the three-stage rows below it?",
 "It carries more cooling than the warmest three-stage row and more power than any of them.",
 ["It carries less cooling than every three-stage row and more power than any of them.",
  "It carries more cooling and less power than every three-stage row, which is the trade reversed.",
  "It carries the same cooling as the coldest three-stage row, which is what five stages buy back."],
 "The warmest three-stage row sits at 8.1149 MMBtu per hr and 4453.3383 hp. The trade only reads cleanly on rows that share a stage count.")

q(0, "The Compressor Station Designer ships with an intercooler approach of 110 degF against a suction of 100 degF. What does a studio opened and not touched already sit on?",
 "The warm side of the comparison, where the approach is what the later stages start from.",
 ["A refusal, because an approach above the suction is outside what the staging calculation accepts.",
  "The cold side, since 110 degF is below the temperature any stage will reach.",
  "A default discharge limit, which the approach then has no effect on."],
 "What sits on that side of the comparison is a stage count, and a stage count is a cooler, a foundation and a machine.")

q(1, "The same molar flow occupies 4758.4333 acfm at a suction of 60.000000 psia and 442.2902 acfm at 600.000000 psia. What does a screen do with a rate quoted in MMscfd alone?",
 "Nothing useful, because two duties at one rate can land on opposite sides of the thresholds it uses.",
 ["It converts the rate at the standard base, which is all the screen needs before the ratio.",
  "It applies the thresholds directly, since the acfm thresholds are stated at the standard base.",
  "It refuses, because the screen takes a volume and a rate cannot be coerced into one."],
 "A rate says nothing about casing size until it has been put at the suction conditions. One low-pressure duty is a large casing and one high-pressure duty at the same rate is a small one.")

q(3, "A duty at 43053.4421 acfm with an overall ratio of 2.600000 and 14500.0000 brake hp is screened. Besides its size, what does the second reason line say?",
 "That over 10,000 bhp is turbine-driven centrifugal territory.",
 ["That an overall ratio of 2.600000 is too high for a wheel to take in one bite.",
  "That at that volume the decision goes on footprint and maintenance philosophy.",
  "That under 200 bhp a packaged gas-engine recip would be the usual answer."],
 "The first reason is that 43053 acfm at a modest ratio is centrifugal territory. Two reasons can point the same way, and it is the first that the branch was decided on.")

q(2, "A screening suction at 1000.000000 psia and -150.0000 degF is refused. On what grounds?",
 "Tpr 0.848 sits below the DAK validity range of 1.0 to 3.0, so the z-factor would be an extrapolation below the critical temperature.",
 ["The temperature is below absolute zero, so no reduced coordinate can be formed at all.",
  "Ppr at that pressure sits above the validity limit of 30, so the z-factor is refused.",
  "The solver failed to converge at that state, which the return reports alongside the refusal."],
 "The screen asks for the compressibility before it asks for the volume, so a suction state outside the correlation is refused by name rather than as a missing volume.")

q(0, "A driver at 7600.000000 Btu per hp hr is put against the same train. What does it burn, at what efficiency, and what share of the stream?",
 "0.829792706 MMscfd at 33.479389 percent, which is 3.191510 percent of throughput.",
 ["0.829792706 MMscfd at 36.349051 percent, which is 2.939549 percent of throughput.",
  "0.764282755 MMscfd at 33.479389 percent, which is 3.191510 percent of throughput.",
  "1.004485907 MMscfd at 27.656887 percent, which is 3.863407 percent of throughput."],
 "The heat rate is the driver's characteristic, the heating value is a property of the gas being burned, and the brake power came from the staging. A fuel figure quoted without all three cannot be reproduced.")

q(1, "Two of the module's constants come out of one return, the mass flow of a single MMscfd of a gravity-one gas. Which two, and in what order?",
 "379.483572 standard cubic feet per lbmol first, and 28.962500 for the molecular weight of air once the first is known.",
 ["28.962500 for the molecular weight of air first, and 379.483572 standard cubic feet per lbmol once the first is known.",
  "1545.350400 for the gas constant first, and 379.483572 standard cubic feet per lbmol once the first is known.",
  "459.670000 for the Rankine offset first, and 28.962500 for the molecular weight of air once the first is known."],
 "Each constant is measured out of a return rather than read off a source file, which is what makes the measurement evidence about the engine that ships.")

q(3, "One constant is read out of the mass, the head, the power and the efficiency of a single stage. Which is it?",
 "33000.000000 ft lbf per minute per horsepower.",
 ["2544.433577644024 Btu per horsepower hour.",
  "1545.350400 ft lbf per lbmol degR.",
  "0.028279485058 psia per degR."],
 "It is the definition of a horsepower, and it appears in the engine only as part of the packaging the stage power is expressed in.")

q(0, "The Rankine offset is 459.670000 and the molecular weight of air is 28.962500. Where does the compression module get them?",
 "It reads both from the gas properties module and keeps no copy of either.",
 ["It carries its own copies, which the gas properties module is checked against.",
  "It derives both from the standard base, which is why the base can be measured from outside.",
  "It reads the offset from the gas properties module and keeps its own molecular weight of air."],
 "Importing rather than restating is what keeps the provenance of every downstream number knowable. The gas constant in the same module is settled by exactly that rule.")

q(2, "Two pump refusals read \"a speed change needs a duty to change\" and \"a trim needs a duty to trim\", and both go on to list what is missing. What do they list?",
 "The flow, the head and the brake power, at the present speed and at the full diameter respectively.",
 ["The flow and the head only, since the brake power is then derived from those two by the affinity laws.",
  "The pump curve and the system curve, which are what together would give a duty to change or to trim.",
  "The speed ratio and the trim ratio, which are what the two calls were given instead."],
 "A reader has one thing to correct and the job of the message is to name it. A generic refusal is a correct sentence that costs somebody an hour.")

q(1, "A viscosity correction is asked at zero speed and again at a negative speed. What comes back each time?",
 "The same refusal both times, that the correction needs a positive pump speed in rpm.",
 ["A refusal on the zero and a warning on the negative, since a sign can be a typing slip.",
  "A refusal naming the viscosity rather than the speed, which is the input the correction is about.",
  "A NaN both times, because the correction is one of the bare-number functions."],
 "Neither zero nor a negative is a speed a machine turns at, and one rule covers both. The guard is positivity here because a pump speed cannot be negative.")

q(3, "Two and a half pumps are asked for in parallel. What does the engine say?",
 "That parallel operation needs a pump curve and a whole number of machines, at least one.",
 ["That the count is rounded down to two machines and a warning is attached to the returned result.",
  "That a fractional count is accepted and read as a partially loaded machine.",
  "That the curve is missing, which is the first input the parallel call reads."],
 "A count is a number of machines. The message names both halves of what the call needs rather than reporting only the one it noticed first.")

q(0, "Where is the compressibility validity window declared, and how does the compression module get it?",
 "The separator sizing module in the same package declares it, and the compression module imports those bounds.",
 ["The gas properties module declares it alongside the correlation, and the compression module imports it.",
  "The compression module declares it itself, which is why it can refuse on it by name.",
  "The wave's goldens declare it, and both modules are checked against the published figures."],
 "A restated window drifts, and a package holding two opinions about where a correlation stops cannot say which of them any answer sits inside. It is the same one-owner rule the gas constant is settled by.")

q(2, "What does a refusal outside that window carry besides its message?",
 "The reduced coordinates, the pressure and temperature they were taken at, and which end of the train died.",
 ["The reduced coordinates alone, since the state the caller typed is already in the message.",
  "The converged flag, so a reader can see the solver was happy at a state that was still refused.",
  "The z the correlation would have returned, so the size of the extrapolation can be judged."],
 "The reduced pair is what the window is written in and the pressure and temperature are what the user typed, so reporting both saves working out the pseudo-criticals by hand.")

q(1, "A suction at 12 psia and 100 F gives a reduced pressure below where the fit data start. Is it refused?",
 "No. It is accepted and a note is attached saying the z-factor runs toward the ideal-gas limit.",
 ["Yes, on exactly the same footing as a state sitting above the reduced pressure limit of 30 the window states.",
  "No, and nothing at all is reported, because a low reduced pressure is an ordinary state for a machine.",
  "Yes, but as a warning rather than an error, so the numbers still come back."],
 "A window has two kinds of edge and they are not the same kind: extrapolation into unknown behaviour, and extrapolation toward known behaviour.")

q(3, "compression.dischargeTempR is handed a suction temperature that is not a number. What comes back?",
 "NaN, because it is one of the bare-number functions.",
 ["An object carrying an error naming the suction temperature.",
  "An Infinity, which is what a non-numeric input propagates to here.",
  "The value at the standard base, which is the documented fallback."],
 "It has nowhere to put an error key. A caller has to test for finiteness, and a test asking whether the result equals NaN is always false because a NaN is not equal to anything including itself.")

q(2, "One stage moves 53577.2205 lb per hr. Where does that figure enter the calculation?",
 "It is what the head per pound is multiplied by to reach a power.",
 ["It is what the volume at the flange is divided by to reach a density.",
  "It is what the ratio per stage is applied to, since mass is what a stage takes a bite of.",
  "It is what the compressibility is evaluated at, before the two ends are averaged."],
 "Head is work per pound and power is that head carried by the mass, so a rate has to become a mass flow before any horsepower exists at all.")

q(0, "The published field table leaves some fields of each case out of the comparison. Which, and why?",
 "The ones the file states as inputs, because they are what the case is.",
 ["The ones that come back bit for bit, because they cannot discriminate anything.",
  "The ones the engine does not return, because there is nothing to compare them against.",
  "The ones with no tolerance declared beside them in the file."],
 "Checking a case against its own inputs is a comparison that cannot come out false. What is compared is what the engine produced from those inputs.")

q(1, "The operating-region bands sit at 50, 70, 120 and 140 percent of best efficiency flow. What is their standing?",
 "Customary and unsourced in this repository, which puts them among the eight items held for literature.",
 ["Measurable out of the engine by bisection, so a region can be graded once the boundary is known.",
  "Published in this repository, which is why all four boundaries can be quoted to the digit.",
  "Defaults the caller may override, so they are graded only where a caller states them."],
 "A region, a percentage of best efficiency flow and a preferred flag are all off the graded list because of it. Four boundaries, none of them sourced here.")

q(3, "The NPSH margin rule is the larger of 3 ft and 35 percent of required. Both halves of it are measurable out of the engine. Why is the rule still held?",
 "Because measuring what the engine does is not the same as sourcing where the rule came from.",
 ["Because the two halves change places at a required NPSH the engine does not report.",
  "Because the margin is returned as a ratio rather than as a rule, so nothing can be measured.",
  "Because the severities the rule produces are words and a graded field has to be a number."],
 "The measurement is evidence about the engine that ships. A customary figure stays held until somebody reads a publication against it.")

q(0, "The implied water density of the pump packagings is held for literature, yet a power and a pressure conversion are both gradeable. How do those sit together?",
 "The packagings are the engine's own definitions and are measurable, while the handbook figure they approximate is not in this repository.",
 ["The conversions are graded only at a specific gravity of one, where the density cancels out.",
  "The density is held because it is derived twice, and a derived figure cannot be graded.",
  "The conversions are graded against the published golden cases rather than against the packagings."],
 "What is held is the comparison to a published water density. What is measurable is what the engine carries, and the two questions are not the same question.")

q(2, "The Hydraulic Institute viscosity correction is held, and the course names a further simplification inside it. What is it?",
 "The head factor is taken equal to the flow factor at best efficiency.",
 ["The efficiency factor is taken equal to the flow factor at best efficiency.",
  "The correlating parameter is evaluated at the shutoff head rather than at the duty.",
  "The flow factor is inverted in closed form rather than solved, which loses a digit."],
 "The correction is empirical and unsourced in this repository, so no graded value in this course is a corrected flow, head or efficiency.")

q(1, "This package has no required-NPSH-against-flow curve anywhere in it. What does that absence force a reader to do?",
 "Read the vendor curve at the duty flow before treating any suction margin as meaningful.",
 ["Take the required NPSH from the margin rule, which is the only figure the engine carries.",
  "Treat the available figure as the margin, since there is nothing to subtract from it.",
  "Read the required NPSH off the published golden cases, which carry two of them."],
 "Until the required value is read at the flow the machine will actually run at, a suction margin is a subtraction with one side of it missing.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/advanced/fc3a_exam.json', expect_n=42)
finish()
