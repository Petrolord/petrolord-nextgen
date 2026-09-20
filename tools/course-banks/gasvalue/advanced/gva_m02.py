import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Expert m02, Vaporizer, Carousel and Float. Digest SECTIONS 27, 28
# and 29 (KANO's cylinders; the trailers are m05). 15 questions.

q(1, "Which term of KANO's vaporizer duty does the engine print at 0.8368 of the duty?",
 "Boil it, 71.8176 kW of the dutyKW 85.8215 kW",
 ["Warm the liquid to boiling, 8.8472 kW",
  "Superheat the vapour, 5.1567 kW",
  "designDutyKW, 98.6948 kW"],
 "SECTION 27's term table prints Boil it at 71.8176 kW and 0.8368 of the duty. Warming the liquid is 8.8472 kW at 0.1031 and superheating is 5.1567 kW at 0.0601; designDutyKW 98.6948 kW carries no share.")

q(3, "KANO's vaporizer takes 650 kg/h with a design margin of 15 percent. What design duty does the engine give?",
 "98.6948 kW",
 ["85.8215 kW",
  "71.8176 kW",
  "8.8472 kW"],
 "designDutyKW is dutyKW times one plus the margin percent over 100, and SECTION 27 prints it as 98.6948 kW. 85.8215 kW is dutyKW before the margin, 71.8176 kW the boil term alone, and 8.8472 kW the warming term.")

q(0, "KANO's vaporizer duty is asked for with the boiling point left blank. Which result comes back?",
 "dutyKW 71.8176, with warming and superheat named as missing terms",
 ["dutyKW 85.8215, on butane's typical boiling point of -0.5 C",
  "REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed.",
  "designDutyKW 98.6948, with the boiling point taken at 38 C"],
 "SECTION 27: with the boiling point left blank the engine gives the boil alone: dutyKW 71.8176, missingTerms Warm the liquid to boiling; Superheat the vapour, and a note that the duty is a floor. The latent heat refusal is the probe with no latent heat.")

q(2, "n-butane's atmospheric boiling point of -0.5 C from LPG_REFERENCE is typed for KANO's vaporizer, with the liquid entering at 18 C. What does the engine print?",
 "REFUSED: The liquid enters at 18 C, above the boiling point given (-0.5 C).",
 ["dutyKW 71.8176, the boil alone, with the engine's note that the duty is a floor.",
  "REFUSED: The vapour leaves at 30 C, below the boiling point given (38 C), so it would condense.",
  "A duty whose warming term is printed below zero kW."],
 "SECTION 27 prints the refusal in full: \"The liquid enters at 18 C, above the boiling point given (-0.5 C). A liquid above its boiling point is not liquid: give the boiling point at the vaporizer's operating pressure.\" The boil alone is the blank boiling point; the condense refusal is the outlet at 30 C.")

q(3, "KANO's vaporizer is given a design margin of -5 percent. What comes back?",
 "REFUSED: The design margin cannot be negative.",
 ["designDutyKW equal to dutyKW, 85.8215 kW, the margin taken as zero.",
  "A design duty below the 85.8215 kW dutyKW.",
  "REFUSED: A latent heat of vaporisation is required."],
 "SECTION 27's probe table prints \"REFUSED: The design margin cannot be negative.\" for a margin of -5 percent. The margin is refused; it is neither taken as zero nor applied.")

q(1, "How does vaporizerDuty form its Boil it term, before dividing by KJ_PER_KWH?",
 "The mass flow times the latent heat.",
 ["The mass flow times the vapour heat capacity times (outlet less boiling point).",
  "The mass flow times the liquid heat capacity times (boiling point less inlet).",
  "dutyKW times one plus the margin percent over 100."],
 "SECTION 27: boil it is the mass flow times the latent heat. The heat capacity products are the superheat and warming terms, and dutyKW times one plus the margin percent over 100 is designDutyKW.")

q(2, "On how many positions does the engine run KANO's carousel queue, from 18 positions each available 0.92 of the time?",
 "16, the floor of the 16.56 positions working",
 ["17, 16.56 rounded to the nearest",
  "18, every position on the carousel",
  "13, minimumPositionsForThroughput"],
 "SECTION 28 prints effectivePositions 16.5600 and queuePositions 16: the queue runs on the positions wholly working, the floor of the positions times the availability. 17 is the positions rounded to the nearest whole one, which the digest names as the shortcut the engine does not take; 13 is minimumPositionsForThroughput.")

q(0, "KANO's carousel prints throughputCapacityPerDay 4516.3600. Which positions figure does the engine use for it?",
 "The unrounded 16.56 of effectivePositions",
 ["The 16 working positions the queue itself runs on",
  "The 17 positions rounded to the nearest",
  "The 13 positions of minimumPositionsForThroughput"],
 "The positionRoundingNote reads: \"The queue is computed on 16 working positions, rounded down from 16.56, because a queue has a whole number of servers. The throughput capacity below uses the unrounded figure.\"")

q(3, "KANO's carousel prints a queue utilisation of 0.7333 beside an availability of 0.92. What does the engine's note say about the two?",
 "Availability reduces the positions that are working; utilisation is how busy the working ones are.",
 ["Availability is how busy the working positions are; utilisation reduces the positions that are working.",
  "They are one number read two ways, so a plant may be sized on either alone.",
  "Utilisation is availability applied to the 18 positions, read as a share."],
 "The note: \"Availability reduces the positions that are working; utilisation is how busy the working ones are. They are different numbers and a plant sized on one alone comes up short.\"")

q(0, "KANO's carousel is run at availability 1 on 17 positions. What average wait does the digest print?",
 "0.0450 minutes",
 ["0.0912 minutes",
  "0.0222 minutes",
  "0.9850 minutes"],
 "The whole-positions table prints 0.0912 minutes on 16, 0.0450 minutes on 17 and 0.0222 minutes on 18. 0.9850 minutes is the studio's opening carousel.")

q(0, "bottlingPlant is given one position at availability 0.4. What does it print?",
 "REFUSED: Only 0.4 positions are working on average: fewer than one.",
 ["REFUSED: Shift hours must be positive and availability must lie in (0, 1].",
  "REFUSED: Demand, fill time and a position count are required and must be positive.",
  "A queue on one position, since a queue has a whole number of servers."],
 "SECTION 28's probe table prints \"REFUSED: Only 0.4 positions are working on average: fewer than one.\" for this case. The other two refusals are for blank shift hours or availability 1.2, and for no fill time.")

q(2, "Which two of the carousel probes print the same refusal?",
 "Shift hours left blank, and availability 1.2",
 ["Availability 1.2, and one position at availability 0.4",
  "No fill time, and shift hours left blank",
  "One position at availability 0.4, and no fill time"],
 "SECTION 28 prints \"REFUSED: Shift hours must be positive and availability must lie in (0, 1].\" for both shift hours left blank ('') and availability 1.2. One position at 0.4 and no fill time each print a refusal of their own.")

q(3, "Which field does assetFloat print as 7296.0000 for KANO's cylinders?",
 "sparesAllowance",
 ["spareCapacityUnits",
  "inCirculation",
  "fleetRequired"],
 "The KANO cylinders table prints inCirculation 91200.0000, sparesAllowance 7296.0000, fleetRequired 98496 and spareCapacityUnits 0.0000. The spares allowance is the assets in circulation times the spares fraction of 0.08.")

q(1, "KANO's cylinder cycle is 28.5000 days. Which stage does assetFloat name as dominantStage, and at what share of the cycle?",
 "At the customer, 0.8421",
 ["At the plant, 0.0526",
  "In transit back, 0.0526",
  "On station, 0.5556"],
 "The KANO cylinders table prints At the customer at 24 days and 0.8421 of the cycle, and dominantStage At the customer. The two transit stages and At the plant each print 0.0526; On station, 0.5556, is a stage of IBAFO's trailers.")

q(2, "KANO's cycle is put to assetFloat with the At the customer stage left blank. What does the engine print?",
 "REFUSED: No duration for At the customer.",
 ["A fleet sized on the other stages, with that stage in missingInputs.",
  "REFUSED: At least one cycle stage with a duration is required.",
  "REFUSED: The spares allowance cannot be negative."],
 "SECTION 29 prints \"REFUSED: No duration for At the customer. A stage left out shrinks the fleet by the assets in it, so the fleet is not sized without it.\" The at least one stage refusal is the probe with no stages; the spares refusal is a negative spares allowance.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/advanced/gva_m02.json', expect_n=15)
finish()
