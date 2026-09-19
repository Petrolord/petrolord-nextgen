import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Professional m05, the lane, the fleet and the station.
# Draws on m05's six lessons only: digest SECTIONS 14, 15 and 16, with the
# trucking, fleet and station refusals of SECTION 2 the lessons quote. Money on
# the lane is in naira and every cost is INVENTED for this course; every stem
# that quotes a cost says so. Every figure is a string the digest prints.

q(2, "The IBAFO lane's cycle is round trip / average speed + load + discharge + queue hours, 18.065 hours. Which terms of that cycle are typed as hours?",
 "The load, discharge and queueing hours.",
 ["The round trip and the average speed.",
  "The working hours a day and working days a year.",
  "The queueing hours alone, taken from the rack's mean wait."],
 "The lane types 1.5 h to load, 1.25 h to discharge and 1.75 h queueing. The round trip is 624.00 km and the speed 46 km/h, so that term is the driving time. The 12 working hours and 300 days are outside the cycle. The 1.75 h queueing is the lane's own typed figure, and the rack's mean wait is 47.2652 minutes.")

q(0, "On its invented costs, the IBAFO lane moves from 312.00 km to 468.00 km. Which printed pair describes the change?",
 "Cost per litre delivered from 15.0704 naira to 20.6072.",
 ["Cycle hours from 18.065 to 11.283.",
  "Trips a truck a day from 0.664260 to 1.063584.",
  "Cost a trip from 495830.99 naira to 313665.50."],
 "At 468.00 km the engine prints 24.848 cycle hours, 0.482940 trips a truck a day and 20.6072 naira a litre delivered, on invented costs. The 11.283 hours, 1.063584 trips and 313665.50 naira are the 156.00 km row.")

q(3, "Across the three distances of the IBAFO lane, which invented cost line prints a different figure at each distance?",
 "Truck depreciation",
 ["Driver",
  "Tolls and levies",
  "Overhead"],
 "Driver, Tolls and levies and Overhead print the same invented figure at 156.00, 312.00 and 468.00 km. Diesel, Maintenance and tyres and Truck depreciation move. Depreciation is the truck's capital spread over the trips a year, and a longer cycle allows fewer of them.")

q(1, "The IBAFO lane's invented cost a trip is 495830.99 naira. Which litres does the engine spread it over to print 15.0704 naira a litre?",
 "32901.00 litres delivered after the transit loss.",
 ["33000.00 litres, the payload loaded at the rack.",
  "28125.00 litres, the station's ullage at reorder.",
  "11393.64 litres, the fleet's spare litres a day."],
 "Cost per litre delivered = cost per trip / the litres delivered after the transit loss: 32901.00 litres from a 33000.00 litre payload at a transit loss of 0.3 percent. 28125.00 litres is the station's ullage at reorder and 11393.64 litres the fleet's spare litres a day.")

q(2, "The IBAFO lane reports 224.64 diesel litres a trip. What does it print for kg CO2e a trip?",
 "none, with a note that no diesel emission factor was supplied.",
 ["0, since a missing factor is read as a zero emission.",
  "A figure from the synthetic 850 kg CO2e a tonne factor.",
  "A refusal, with the lane left uncosted until a factor is typed."],
 "The engine ships no factor, so the diesel volume is computed and its emissions wait for a factor with a source. In the engine's words the carbon figure \"is absent rather than zero\". The rest of the lane still prints complete true.")

q(3, "The IBAFO lane is run with the invented driver cost box left blank. What does the engine print?",
 "complete false, missing Driver, 13.3075 naira a litre delivered.",
 ["complete true, missing none, 13.3075 naira a litre delivered.",
  "complete true, missing none, 15.0704 naira a litre delivered.",
  "complete false, missing Driver, 13.2401 naira a litre delivered."],
 "A blank cost box is a missing cost and is named. The cost a trip drops to 437830.99 naira and the answer is flagged incomplete. 13.2401 naira is the floor with no truck capital cost, and 15.0704 naira is the lane with every cost typed.")

q(1, "The IBAFO lane is run with the driver cost left out of the call entirely. Why does it read complete true at 13.3075 naira a litre?",
 "driverCostPerTrip defaults to 0 in the engine's signature.",
 ["The engine fills the typical invented driver cost of 58000.00 naira.",
  "A cost left out is named in assumedZero, which counts as complete.",
  "The driver is paid from the Overhead line of 37500.00 naira."],
 "An absent input takes the default the signature states, so the row reads the same 437830.99 naira a trip as the blank row with no missing input. A form that drops an empty field before calling the engine turns a missing driver cost into a complete answer.")

q(0, "With no truck capital cost, the IBAFO lane prints 13.2401 naira a litre delivered. What is that figure?",
 "A floor: the lane costs at least this, with Truck depreciation missing.",
 ["The lane's full cost, with the capital typed as a zero and complete true.",
  "The cost per litre on the loaded payload of 33000.00 litres.",
  "The cost at 156.00 km, the shortest distance swept."],
 "The engine prints complete false and names Truck depreciation as missing. A floor is a lower bound: the true cost per litre is that figure plus whatever the missing line would add, so it cannot be quoted as the lane's cost.")

q(2, "The IBAFO stations take 1260000.00 litres a day on a 33000.00 litre payload. Why does fleetSizing print 58 trucks?",
 "It takes the ceiling of trips needed over trips a truck a day.",
 ["It rounds 38.181818 trips needed to the nearest whole truck.",
  "It adds a spare truck for breakdowns to the fleet it computes.",
  "It divides the demand by the 32901.00 litres delivered a trip."],
 "Trips needed = demand / payload = 38.181818 a day; trucks = the ceiling of 38.181818 / 0.664260. A fleet one truck short fails the demand every day. The engine adds no allowance for breakdowns.")

q(3, "The 58 IBAFO trucks can make 38.527080 trips a day against 38.181818 needed. What is the spare of 0.345262 trips, or 11393.64 litres, a day?",
 "What the ceiling bought.",
 ["A reserve the engine adds for breakdowns and peaks.",
  "The trips lost to the lane's 0.3 percent transit loss.",
  "The share of the fleet held back for the forecourt peak."],
 "The spare is what rounding up to a whole truck buys, and the engine prints it in trips and in litres. The engine sizes for the average cycle, and any spare for breakdowns or peaks is a decision the operator adds.")

q(0, "On the IBAFO lane the demand rises from 1260000.00 to 1980000.00 litres a day. Which printed pair describes the change?",
 "Trucks required from 58 to 91.",
 ["Trucks required from 31 to 58.",
  "Trips needed from 38.181818 to 20.000000.",
  "Fleet utilisation from 0.940897 to 0.992594."],
 "The demand sweep prints 60.000000 trips needed, 91 trucks and a fleet utilisation of 0.992594 at 1980000.00 litres a day. 31 trucks and 20.000000 trips belong to the 660000.00 litre row, and 0.940897 to the 330000.00 litre row.")

q(1, "Nobody types the demand for the IBAFO fleet. Which answer does fleetSizing return?",
 "REFUSED: Demand, payload and trips per truck per day are required and must be positive.",
 ["REFUSED: Distance, payload and average speed are required and must be positive.",
  "REFUSED: Throughput, litres per transaction, dispense rate and nozzle count are required.",
  "Zero trucks required, with a fleet utilisation of none."],
 "A fleet sized for no demand is no fleet, and the trips a truck a day must come from a lane. The sentence about distance and speed is truckingEconomics' refusal and the one about nozzles is stationSizing's.")

q(3, "stationSizing sizes the IBAFO forecourt with rackQueue. Which station figure stands in for the rack's load minutes?",
 "Service minutes, 2.342.",
 ["Peak transactions an hour, 135.00.",
  "Transactions a day, 1125.0.",
  "Forecourt mean wait, 2.2083 minutes."],
 "Service minutes = litres a transaction / dispense rate + an overhead, the time a car holds a nozzle. The peak transactions an hour are the arrivals and the nozzles are the bays. The queue is sized on the peak hour, which carries a share of 0.12 of the day's transactions.")

q(2, "The nozzle sweep is read at the IBAFO forecourt's peak. What does it print for 5 nozzles?",
 "Stable false, probability of waiting 1.000000, mean wait none.",
 ["Stable true, probability of waiting 0.688546, mean wait 2.2083 minutes.",
  "Stable false, probability of waiting 1.053947, the same as its utilisation.",
  "Stable true, probability of waiting 0.392371, mean wait 0.5311 minutes."],
 "At 5 nozzles the utilisation is 1.053947, the forecourt cannot keep up with its peak, and the engine prints no wait, as it did for the rack at 3 bays. The smallest stable forecourt in the sweep has 6 nozzles.")

q(0, "The IBAFO station reorders at 0.25 of usable, leaving 28125.00 litres of ullage. Of the fractions swept, which one lets the 33000.00 litre delivery fit?",
 "0.1, with 33750.00 litres of ullage at reorder.",
 ["0.15, with 31875.00 litres of ullage at reorder.",
  "0.2, with 30000.00 litres of ullage at reorder.",
  "0.25, once the transit loss brings the load to 32901.00 litres."],
 "Ullage at reorder = capacity less the reorder level, and only 0.1 leaves room for a full load. The engine checks the payload loaded, so the lane's 32901.00 litres delivered does not enter the check.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/intermediate/tdsi_m05.json', label='tdsi_m05', expect_n=15)
finish()
