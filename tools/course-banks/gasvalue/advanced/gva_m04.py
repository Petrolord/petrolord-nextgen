import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Expert m04, The Cascade. Digest SECTIONS 31, 32 and 33. The
# compressor is a unit bridge only: no question on head, efficiency or power.
# 15 questions.

q(1, "IBAFO's cascade counts 38 fills and stops. What does it print for hitFillLimit and for the next vehicle?",
 "hitFillLimit false; next vehicle reaches 197.7590 bar(a)",
 ["hitFillLimit true; the maxFills cap was reached at 38",
  "hitFillLimit false; the next vehicle reaches 195.5640 bar(a)",
  "hitFillLimit true; the next vehicle reaches 197.7590 bar(a)"],
 "The cascade lesson prints hitFillLimit false and nextVehicleReachesBar 197.7590: hitFillLimit reads true only when the count reaches the maxFills cap the call carries, and here it stopped on a vehicle that could not reach its target. 195.5640 bar(a) is the studio's opening cascade.")

q(3, "What leftInBanksKg does IBAFO's three-bank cascade print?",
 "665.879 kg",
 ["608.505 kg",
  "1084.729 kg",
  "542.689 kg"],
 "IBAFO's cascade prints leftInBanksKg 665.879 and deliveredKg 608.505. 1084.729 kg is left in the same 6.0000 m3 held as one bank at 250 bar(a), and 542.689 kg is the studio's opening cascade.")

q(0, "The same 6.0000 m3 is held as one bank at 250 bar(a). What does the cascade print?",
 "fillsBeforeRecharge 12, cascadeEfficiency 0.1505",
 ["fillsBeforeRecharge 38, cascadeEfficiency 0.4775",
  "fillsBeforeRecharge 33, cascadeEfficiency 0.4577",
  "fillsBeforeRecharge 12, cascadeEfficiency 0.4577"],
 "One bank at 250 bar(a) prints 12 fills at cascadeEfficiency 0.1505. The pair 38 and 0.4775 is IBAFO's three banks, and 33 and 0.4577 the studio's opening cascade.")

q(2, "At which pressure does IBAFO's High bank end when the cascade stops?",
 "202.6470 bar(a)",
 ["118.3350 bar(a)",
  "58.9110 bar(a)",
  "197.7590 bar(a)"],
 "The bank table prints the High bank from 270.0000 to 202.6470, the Mid from 250.0000 to 118.3350 and the Low from 230.0000 to 58.9110. 197.7590 bar(a) is what the next vehicle reaches.")

q(1, "Which banks did the third fill of IBAFO's cascade draw on?",
 "Low, Mid",
 ["Low",
  "Low, Mid, High",
  "Mid, High"],
 "The fills table prints Low for fills 1 and 2, Low, Mid for fill 3, and Low, Mid, High for fills 37 and 38.")

q(3, "In what order does a vehicle draw on IBAFO's banks, by the engine's note?",
 "It equalises with the lowest bank above it, then the next bank up, until it reaches its target.",
 ["It draws on the High bank first, then the Mid, then the Low, until it reaches its target pressure.",
  "It takes an equal share from each bank at once until it reaches its target.",
  "It empties the Low bank to the 25 bar(a) of its tank before it draws on the Mid."],
 "The note: \"Each vehicle equalises with the lowest bank above it, then the next bank up, until it reaches its target. A bank delivers only while its pressure exceeds the vehicle tank.\" The Low bank ends at 58.9110 bar(a).")

q(0, "What does the course say of the heat of a fast fill in the cascade?",
 "It is not modelled; the count is a ceiling in that one respect.",
 ["It is modelled, and it brings the count down from 38 fills to 33.",
  "It is taken from the Facilities compression engine's discharge.",
  "It raises the count, so 38 is a floor."],
 "The cascade lesson: both engine and oracle are isothermal: the heat of a fast fill is not modelled, so a real fill settles lower and the count is a ceiling in that one respect. 33 is the studio's opening cascade.")

q(3, "Which storedKg does IBAFO's cascade print, and what does the course print beside it?",
 "1274.384 kg, the same as the Low, Mid and High bank masses summed",
 ["608.505 kg, the same as the Low, Mid and High bank masses summed",
  "665.879 kg, the same as the Low, Mid and High bank masses summed",
  "1084.729 kg, the same as the Low, Mid and High bank masses summed"],
 "The cascade table prints storedKg 1274.384 and, beside it, the Low, Mid and High bank masses summed (the bank lesson) as 1274.384. storedKg minus deliveredKg minus leftInBanksKg prints 0.000.")

q(1, "What does cngCompression do with the Facilities compression engine?",
 "It converts units to and from the field units that engine speaks, and calls it.",
 ["It reimplements that engine's staging in the station's own metric units.",
  "It computes the polytropic head itself and hands only the Z on to that engine.",
  "It checks that engine's thermodynamics by an oracle of its own."],
 "The compressor lesson: cngCompression does not compute compression itself. It converts the station's metric inputs to the field units the Facilities compression engine speaks, calls it, and converts the answer back. Its basis reads that it converts units and does not reimplement the thermodynamics, and the compressor lesson says the thermodynamics belong to the Facilities course.")

q(0, "For IBAFO's 400 kg/h of gas 0.62 with suction at 5 bar(a), what does the bridge print?",
 "qMMscfd 0.4473 and a suction of 72.5189 psia",
 ["qMMscfd 72.5189 and a suction of 0.4473 psia",
  "qMMscfd 0.4473 and a suction of 5.0000 psia",
  "qMMscfd 0.4473 and a suction of 13.3620 psia"],
 "The bridge table prints qMMscfd 0.4473 (the throughput as standard volume) and suction 72.5189 psia. 5.0000 is the stage 1 suction in bar(a), and 13.3620 bar(a) is stage 1's discharge.")

q(3, "How many stages does the Facilities engine return for IBAFO's compressor, and at what ratio each?",
 "4 stages, each at 2.6723",
 ["3 stages, each at 2.6723",
  "4 stages, each at 13.3620",
  "2 stages, each at 35.7070"],
 "The compressor lesson prints stageCount 4 and a ratio of 2.6723 on every stage, from 5.0000 to 255.0000 bar(a). 13.3620 and 35.7070 are stage discharge pressures in bar(a).")

q(2, "cngCompression is given a discharge below its suction. What does it print?",
 "REFUSED: A suction pressure and a higher discharge pressure are required.",
 ["REFUSED: A start and a higher target pressure are required.",
  "REFUSED: A throughput is required.",
  "A train with a single stage whose ratio is below one."],
 "The compressor lesson's probe table prints this refusal for discharge below suction. The start and target refusal is the cascade's (the cascade lesson); the throughput refusal is the probe with no throughput.")

q(2, "IBAFO's forecourt takes 14 buses an hour at 6 minutes a fill. What average wait does it give on 3 dispensers?",
 "0.7588 minutes",
 ["5.7647 minutes",
  "0.5765 minutes",
  "0.2024 minutes"],
 "The forecourt lesson prints averageWaitMinutes 5.7647 on 2 dispensers and 0.7588 on 3. 0.5765 and 0.2024 are the probabilityOfWaiting on 2 and on 3.")

q(2, "IBAFO's forecourt is run at 25 buses an hour on 2 dispensers. What does cngDispensing return?",
 "An answer: stable false and utilisation 1.2500",
 ["REFUSED: The number of bays must be a whole number, one or more.",
  "An average wait that grows with the 1.2500 utilisation",
  "REFUSED: Arrivals, fill time and a dispenser count are required and must be positive."],
 "The forecourt lesson: at 25 buses an hour on 2 dispensers the engine gives an answer and no refusal: stable false, utilisation 1.2500, and the message that no average waiting time exists.")

q(1, "cngDispensing is asked for 2.5 dispensers. What comes back?",
 "REFUSED: The number of bays must be a whole number, one or more.",
 ["The queue on 2 dispensers, with 2.5 rounded down to a whole number of bays.",
  "The queue on 3 dispensers, with 2.5 rounded to the nearest whole bay.",
  "A queue on 2.5 dispensers, the count taken exactly as it was typed."],
 "The forecourt lesson's probe table prints \"REFUSED: The number of bays must be a whole number, one or more.\" for 2.5 dispensers.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/advanced/gva_m04.json', expect_n=15)
finish()
