import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Professional tier exam, 42 questions over all six modules.
# Digest SECTIONS 9 to 16 with the refusals of SECTION 2 the lessons quote.
# Money: US dollars in SECTION 13, naira on the lane; every fee, cost and
# factor is INVENTED (the 850 kg CO2e a tonne factor SYNTHETIC) and each stem
# that uses one says so. The Erlang B and the queued-truck 60.0000 minutes are
# labelled in the digest as worked out from engine figures and keep that label.
# The eleven questions under "two modules at once" each need two modules.

# ---- the rack (m01, m02)
q(2, "A consultant quotes IBAFO's 3.6000 erlangs and says the rack needs 3.6000 bays. What is the flaw?",
 "Offered load is traffic; bays come whole and the engine refuses a fraction.",
 ["Offered load is already divided by the bays, so 3.6000 is a utilisation.",
  "Offered load counts trucks a day, so it must first be divided by the 216 trucks.",
  "Nothing: the engine rounds 3.6000 bays to 4 and runs the rack."],
 "Offered load = arrivals per hour / (60 / load minutes), a property of the traffic and the load time. The bay count is a design decision that enters the recursion as a count, and 2.5 bays is refused with \"The number of bays must be a whole number, one or more.\"")

q(0, "Read the load minutes sweep at 26 minutes a load on IBAFO's 4 bays. Which set of figures does it print?",
 "Utilisation 0.975000, probability of waiting 0.945114, mean wait 245.7297 minutes.",
 ["Utilisation 0.950000, probability of waiting 0.891419, mean wait 106.9703 minutes.",
  "Utilisation 0.975000, probability of waiting 0.300939, mean wait 245.7297 minutes.",
  "Utilisation 1.000000, probability of waiting 1.000000, mean wait none."],
 "At 26 minutes the engine prints 0.975000, 0.945114 and 245.7297 minutes. The 0.300939 at that row is the Erlang B the digest derives from the Erlang C. The 0.950000 row is 9.5 arrivals in the arrivals sweep.")

q(1, "At 16 minute loads the digest prints a probability of waiting of 0.287043 and an Erlang B of 0.138706 worked out from it. Which one is the chance an arriving truck queues?",
 "0.287043, the Erlang C.",
 ["0.138706, the blocking figure.",
  "Both: they describe one rack.",
  "Neither: the rack is unstable."],
 "The engine reports Erlang C as the probability of waiting. Erlang B is the probability every bay is busy in a rack with no queue, where the truck leaves, and the digest derives it from the engine's Erlang C.")

q(1, "The IBAFO rack's mean wait is 47.2652 minutes and the digest works out 60.0000 minutes from the engine's figures. Which statement is true?",
 "47.2652 averages every truck; 60.0000 averages the trucks that queue.",
 ["47.2652 averages the trucks that queue; 60.0000 averages every truck.",
  "60.0000 is the mean wait plus the 24 minute load, the time on site.",
  "60.0000 is the wait at 5 bays, 47.2652 the wait at 4."],
 "The digest prints 47.2652 / 0.787753 = 60.0000 minutes. Dividing by the probability of waiting leaves out the trucks that load at once. The time on site adds the load itself, and the 5 bay wait is 7.0353 minutes.")

q(2, "In the bay sweep at 9 arrivals an hour, the 6 bay row prints a mean wait of 1.9657 minutes. Which mean queue sits beside it?",
 "0.2948 trucks",
 ["1.0553 trucks",
  "0.0913 trucks",
  "0.196566 trucks"],
 "The 6 bay row prints 0.2948 trucks. 1.0553 is the 5 bay row, 0.0913 the 7 bay row, and 0.196566 is the 6 bay probability of waiting, a probability with no unit of trucks.")

q(0, "A call to rackQueue carries 9 arrivals an hour and 4 bays and no load time at all. What comes back?",
 "The refusal asking for both the arrival rate and the load time.",
 ["The whole number sentence, since the bays cannot be loaded without a load time.",
  "The rack cannot keep up, since a service rate of none gives no spare capacity.",
  "A run at a typical 24 minute load, named as assumed in the engine's note."],
 "The refusal table prints \"Arrival rate and load time are both needed.\" for a load time of none and for 0. The engine does not borrow a typical depot's load time.")

q(3, "With only 3 bays against IBAFO's traffic, the mean queue column is empty. Why?",
 "A queue that grows without limit has no average length.",
 ["The engine prints queues only at 4 bays or more, where it is stable.",
  "No truck queues when all 3 bays are loading.",
  "Its Erlang B cannot be derived above one, so no queue can follow."],
 "At 3 bays the utilisation is 1.200000 and the rack is unstable. Just as no average wait exists, no average queue exists, and the engine prints none in both columns.")

q(1, "Between the 7 and 8 arrivals rows of the arrivals sweep, how does the chance of queueing move?",
 "From 0.428654 to 0.596432.",
 ["From 0.700000 to 0.800000.",
  "From 0.596432 to 0.787753.",
  "From 0.287043 to 0.428654."],
 "The arrivals sweep prints 0.428654 at 7 arrivals and 0.596432 at 8. 0.700000 and 0.800000 are the utilisations of those rows; the other pairs are the steps from 8 to 9 and from 6 to 7.")

# ---- the farm (m03)
q(2, "How does tankFarmCover count the IBAFO farm's ullage?",
 "Each tank's capacity less its stock, never below zero, summed.",
 ["The farm's capacity less the farm's stock, taken in one step for the farm.",
  "The farm's working capacity less the pumpable stock, heel left out.",
  "Each tank's capacity less its heel, summed over the tanks."],
 "Ullage is counted the same way as pumpable stock: tank by tank. The farm's ullage is 11767.300 m3, and a receipt can use only the ullage of the tank its product goes into.")

q(0, "Read IB-T1's row: 5288.400 m3 in the tank above a 210.000 m3 heel. Which pumpable figure sits in it?",
 "5078.400 m3",
 ["5288.400 m3",
  "2211.600 m3",
  "7500.000 m3"],
 "Pumpable stock is stock above the tank's own heel: 5078.400 m3. 2211.600 m3 is IB-T1's ullage. 7500.000 m3 is its capacity.")

q(3, "The IBAFO farm turns 44.1108 times a year. Which formula does the engine use?",
 "Daily throughput x 365 / working capacity.",
 ["Pumpable stock x 365 / daily throughput, a cover in days.",
  "Daily throughput x 365 / capacity, heel included.",
  "Daily throughput x 365 / pumpable stock."],
 "Turns a year = daily throughput x 365 / working capacity, 2640.000 m3 a day over 21845.000 m3. The heel never turns, so the divisor leaves it out.")

q(3, "On this IBAFO morning, which tank decides that the netted and tank-by-tank stock figures part company?",
 "IB-T2, below its heel.",
 ["IB-T1, the petrol tank in use.",
  "IB-T3, the gas oil tank.",
  "IB-T4, the kerosene tank."],
 "IB-T2 holds 164.700 m3 against a heel of 210.000 m3. When every tank stands above its heel the two methods agree; they part on a morning when a tank runs low.")

q(2, "Where does the farm total of 655.000 m3 in the heel column come from?",
 "The sum of the four tanks' typed heels.",
 ["A fixed share of the farm's 22500.000 m3 capacity.",
  "The stock the engine holds back from the daily liftings.",
  "The volume below the lowest dip on the strapping tables."],
 "Each tank carries its own heel: 210.000, 210.000, 150.000 and 85.000 m3. The farm's working capacity is its capacity less that heel, 21845.000 m3.")

# ---- throughput economics (m04)
q(0, "IBAFO's invented costs are 2.35 USD/m3 variable and 9400.00 USD fixed. Which margin does the engine print with both typed?",
 "4988.00 USD",
 ["14388.00 USD",
  "20592.00 USD",
  "1.89 USD"],
 "Margin = revenue - throughput x variable cost - fixed cost, 4988.00 USD. 14388.00 USD is the margin with the fixed cost blank and taken as zero, 20592.00 USD the revenue, and 1.89 USD the margin per m3.")

q(3, "What does assumedZero report on a throughputEconomics answer?",
 "Which blank cost or loss was taken as zero.",
 ["Which carbon figure was left as none.",
  "Which input was refused.",
  "Which rate was invented."],
 "A blank cost or loss is taken as zero and named. With nothing blank it reads assumedZero: none; with the fixed cost blank it reads assumedZero: fixed cost and a margin of 14388.00 USD.")

q(1, "Using the course's synthetic factor of 850 kg CO2e a tonne, what emissions does the IBAFO period's loss produce?",
 "2913.7320 kg CO2e",
 ["1.481061 kg CO2e per tonne",
  "3.4279 tonnes of CO2e",
  "none"],
 "Emissions = loss tonnes x factor: 3.4279 tonnes at the synthetic factor gives 2913.7320 kg CO2e. 1.481061 is the intensity per tonne of throughput, and 3.4279 is the loss in tonnes.")

q(0, "The carbon columns of the IBAFO cases fail in a chain. With no density, where does the first none fall?",
 "At loss tonnes, and every carbon figure after it.",
 ["At emissions, with loss tonnes still at 3.4279 tonnes.",
  "At revenue, since the money needs a weight.",
  "At the intensity alone."],
 "Each none sits at the first link with no input and at every link after it. Without a density the loss has no weight, so loss tonnes, emissions and the intensity all read none; without a factor the first none is the emissions.")

q(2, "Which course owns discounting and investment appraisal, if IBAFO's throughput margin is to be turned into a valuation?",
 "The Economics courses; this course teaches no NPV or IRR.",
 ["This course's Expert tier, which discounts the margin to a value.",
  "The refinery course, which owns a refinery's margin and its value.",
  "The crude course, which owns blending and the value of a blend."],
 "The throughput margin is a period's margin and never a valuation: it discounts nothing and carries no capital. The Economics courses own discounting and investment appraisal.")

# ---- the lane, the fleet and the station (m05)
q(3, "On the IBAFO lane, why is trips a truck a day 0.664260, below one?",
 "The cycle of 18.065 hours is longer than the 12 hour working day.",
 ["The engine rounds each trip down to the part a driver can finish.",
  "The transit loss removes a share of every trip.",
  "The queue hours are counted twice."],
 "Trips a truck a day = working hours / cycle. A cycle longer than the working day gives a figure below one: a trip spans more than one working day, and the engine does not round it.")

q(1, "On the IBAFO lane at 156.00 km, what are the cycle hours and trips a truck a day?",
 "11.283 hours and 1.063584 trips.",
 ["18.065 hours and 0.664260 trips, the 312.00 km row.",
  "24.848 hours and 0.482940 trips.",
  "11.283 hours and 0.482940 trips."],
 "The distance sweep prints 11.283 hours and 1.063584 trips at 156.00 km. Only the driving time changes between rows; the load, discharge and queue hours are the same in each.")

q(2, "Which invented cost line of the IBAFO lane is spread over the 199.2780 trips a truck a year?",
 "Truck depreciation, 60217.39 naira a trip.",
 ["Driver, 58000.00 naira a trip.",
  "Overhead, 37500.00 naira a trip.",
  "Diesel, 278553.60 naira a trip."],
 "Truck depreciation is the truck's capital spread over the trips a year the cycle allows, so a lane allowing fewer trips loads more capital onto each. At 468.00 km it prints 82826.09 naira a trip.")

q(0, "A null arrives in the driver cost field of the IBAFO lane, whose costs are invented. What reads out?",
 "complete false, missing Driver, 437830.99 naira a trip.",
 ["complete true, missing none, 437830.99 naira a trip.",
  "complete true, missing none, 495830.99 naira a trip.",
  "REFUSED: Distance, payload and average speed are required and must be positive."],
 "The null row reads the same as the blank row: complete false with Driver named. Only a driver cost left out of the call reads complete true, because driverCostPerTrip defaults to 0 in the signature.")

q(3, "At 330000.00 litres a day on the IBAFO lane, what does fleetSizing print?",
 "10.000000 trips needed, 16 trucks, fleet utilisation 0.940897.",
 ["10.000000 trips needed, 31 trucks, fleet utilisation 0.991038.",
  "20.000000 trips needed, 31 trucks, fleet utilisation 0.971248.",
  "10.000000 trips needed, 16 trucks, fleet utilisation 0.992594."],
 "The demand sweep prints 10.000000 trips needed, 16 trucks and 0.940897 at 330000.00 litres a day. 0.991038 belongs to 1260000.00 litres, and 0.992594 to 1980000.00.")

q(1, "The IBAFO forecourt sells 36000.00 litres a day at 32 litres a transaction with a peak share of 0.12. Which figures does stationSizing print?",
 "1125.0 transactions a day and 135.00 at the peak hour.",
 ["1125.0 transactions a day and 2.342 at the peak hour.",
  "135.00 transactions a day and 1125.0 at the peak hour.",
  "36000.00 transactions a day and 135.00 at the peak hour."],
 "Transactions a day = throughput / litres a transaction, 1125.0; the peak hour carries its share of them, 135.00. The queue is sized for the peak, and 2.342 is the service minutes a transaction.")

q(2, "Fed the station's printed 135.00 and 2.342, rackQueue answers 0.688454. The station prints 0.688546. Which should a report quote?",
 "0.688546, the station's own figure.",
 ["0.688454, the rack model's own answer.",
  "Their mean, as the two roundings straddle it.",
  "Neither, since the two models disagree."],
 "The station and rackQueue agree when rackQueue is given the station's unrounded arrivals and service minutes. The station reports those inputs rounded, so feeding back the printed roundings moves the answer.")

q(0, "At 7 nozzles the IBAFO forecourt prints what?",
 "Utilisation 0.752820, probability of waiting 0.392371, mean wait 0.5311 minutes.",
 ["Utilisation 0.658717, probability of waiting 0.209905, mean wait 0.1801 minutes.",
  "Utilisation 0.878289, probability of waiting 0.688546, mean wait 2.2083 minutes.",
  "Utilisation 0.752820, probability of waiting 0.086243, mean wait 0.6088 minutes."],
 "The nozzle sweep prints 0.752820, 0.392371 and 0.5311 minutes at 7. 0.086243 and 0.6088 are the 7 bay row of the rack, a different queue.")

q(3, "The IBAFO station tank holds 40000.00 litres with 2500.00 litres of dead stock. What are its usable litres and reorder level at 0.25?",
 "37500.00 usable, reorder at 11875.00.",
 ["40000.00 usable, reorder at 10000.00.",
  "37500.00 usable, reorder at 6250.00.",
  "37500.00 usable, reorder at 28125.00."],
 "Usable = capacity less dead stock, 37500.00 litres. Reorder level = dead stock + usable x the reorder fraction, 11875.00 litres, which leaves 28125.00 litres of ullage at reorder.")

q(1, "At a reorder fraction of 0.15, what does the IBAFO station print?",
 "Ullage at reorder 31875.00 litres, payload fits false.",
 ["Ullage at reorder 33750.00 litres, payload fits true.",
  "Ullage at reorder 31875.00 litres, payload fits true.",
  "Ullage at reorder 30000.00 litres, payload fits false."],
 "At 0.15 the reorder level is 8125.00 litres and the ullage 31875.00 litres, too little for a 33000 litre load, so the warning prints. Only 0.1, with 33750.00 litres, fits.")

# ---- two modules at once
q(1, "The IBAFO lane types 1.75 queueing hours a cycle, and the rack prints a mean wait of 47.2652 minutes. How are the two linked in the engine?",
 "They are not linked: the lane takes its own typed figure.",
 ["The lane reads the rack's mean wait and converts it to hours.",
  "The lane reads the rack's mean time on site, wait and load together.",
  "The rack reads the lane's 1.75 hours as its load time."],
 "The lane's queue hours are an allowance for all the waiting in a cycle, at the depot and at the stations, typed by the caller. The rack model prints its own wait, and it is the caller's job to make the lane's figure honest.")

q(0, "A blank fixed cost in throughputEconomics and a blank driver cost in truckingEconomics are treated how?",
 "The first is taken as zero and named in assumedZero; the second makes the answer complete false with Driver named.",
 ["Both are refused, since every money input is required.",
  "Both are taken as zero silently, and both answers read complete.",
  "The first is refused; the second is filled with its typed default."],
 "throughputEconomics refuses only a blank throughput or fee, and a blank cost reads margin 14388.00 USD with assumedZero: fixed cost. truckingEconomics names a blank cost as missing: complete false, 437830.99 naira a trip.")

q(2, "IBAFO prints three utilisations: the rack's 0.900000, the forecourt's 0.878289 and the fleet's 0.991038. Which of them is not a queue figure?",
 "The fleet's 0.991038.",
 ["The rack's 0.900000.",
  "The forecourt's 0.878289.",
  "All three are queue figures."],
 "The rack and the forecourt are both rackQueue, with bays or nozzles. The fleet utilisation is the share of the fleet's trip capacity the demand uses, a figure the ceiling sets, and it has nothing to do with a queue.")

q(1, "The farm's daily throughput is 2640.000 m3 and the throughput economics period throughput is also 2640.000 m3. What does each call use it for?",
 "The farm divides pumpable stock by it; the economics call earns its invented fee on it.",
 ["Both calls divide pumpable stock by it to get days of cover.",
  "The farm earns the fee on it; the economics call works out turns.",
  "The farm reads it from the rack; the economics call reads it from the farm."],
 "Days of cover = pumpable stock / daily throughput, 3.8345 days. Revenue = throughput x fee, 20592.00 USD at the invented 7.80 USD/m3. Both are typed inputs; neither call infers it.")

q(2, "The station's dead stock of 2500.00 litres and IB-T3's heel of 150.000 m3 play which common role?",
 "Volume below the suction that cannot be sold, taken off before usable room is counted.",
 ["Free water that the dip less the water height removes.",
  "Ullage kept empty for the next receipt.",
  "A reserve the operator holds for breakdowns."],
 "The station's usable litres are capacity less dead stock, 37500.00 litres, just as a depot tank's working capacity is capacity less heel. Both are typed for the tank.")

q(0, "Where must a receipt's room be counted, at the depot and at the station alike?",
 "In the tank the product goes into.",
 ["Across the whole farm or forecourt.",
  "In the tank with the lowest stock.",
  "In the tank nearest the rack."],
 "A gas oil receipt at IBAFO has IB-T3's 1097.400 m3 of ullage, however much room the petrol tanks have. A station delivery must fit the ullage at reorder, 28125.00 litres at IBAFO's forecourt.")

q(3, "The farm prints 3.8345 days of cover to four decimals; the station prints 1.04 cover days. Why only two decimals at the station?",
 "The engine rounds station cover days to two.",
 ["The station's litres print to two decimals, so its cover does too.",
  "The station's cover is in hours.",
  "The station's cover is a floor, since the delivery does not fit."],
 "cover days = usable tank litres / litres a day, and the engine rounds it to two decimals, so it prints to two where the farm's cover and turns print to four.")

q(1, "The rack refuses a bay count of 2.5, and fleetSizing prints 58 trucks for 38.181818 trips needed. How do the two treat a count that is not whole?",
 "The rack refuses a typed fraction; the fleet rounds a computed one up.",
 ["Both round up to the next whole unit and report the spare.",
  "Both refuse any input that is not whole.",
  "The rack rounds up; the fleet refuses a fractional truck."],
 "A bay count is an input that must be a whole number, one or more. The fleet's trucks are computed, and the engine takes the ceiling and reports the spare it buys, 0.345262 trips a day.")

q(2, "Which two notes say a carbon figure is absent because the engine ships no factor?",
 "The depot's no-emission-factor note and the lane's diesel note.",
 ["The depot's no-density note and the lane's diesel note, both about factors.",
  "The depot's no-density note and assumedZero.",
  "The lane's floor and the station's warning."],
 "throughputEconomics: \"No emission factor supplied, so the carbon side is not computed.\" truckingEconomics: \"No diesel emission factor supplied, so the carbon figure is absent rather than zero.\" The no-density note is about the loss's weight.")

q(0, "At the forecourt the mean wait is 2.2083 minutes at 6 nozzles. Which cars does it average over?",
 "Every car, including the ones that drive straight to a free nozzle.",
 ["Only the cars that queue, as the rack's 60.0000 minutes does.",
  "Only the cars in the peak hour that find the nozzles full.",
  "The cars that queue plus their time at the nozzle."],
 "The forecourt is rackQueue with nozzles for bays, so its mean wait averages over every arrival, as the rack's 47.2652 minutes does. The 60.0000 minutes the digest works out for the rack averages the trucks that queue.")

q(3, "The daily count of 216 trucks at the rack sits beside days of cover of 3.8345. Why does the farm not use the truck count?",
 "The rack model carries no load volume.",
 ["216 is below the farm's liftings in m3 a day.",
  "The farm counts its liftings in trucks per hour.",
  "The count is an Erlang B figure."],
 "The daily throughput in m3 is a measured or planned rate the caller supplies. The rack's 216 trucks a day is a count of trucks, whose loads the rack model does not carry.")

q(1, "Both the lane's floor and the no-density period show the engine stopping at a missing link. What does each still print?",
 "The lane prints 13.2401 naira a litre; the period prints its margin of 4988.00 USD.",
 ["Both print none for everything after the gap and before it.",
  "The lane prints 15.0704 naira; the period prints its loss tonnes.",
  "The lane refuses; the period prints its emissions of 2913.7320."],
 "Nothing before a gap is lost and nothing after it is guessed. The lane with no truck capital prints a floor with Truck depreciation named; the period with no density prints its money side and reads none from loss tonnes on.")

q(2, "The rack's refusal says to add a bay, and a forecourt can add a nozzle. Which input do both change?",
 "The c of the M/M/c queue.",
 ["The arrivals in the peak hour.",
  "The service minutes.",
  "The offered load."],
 "Bays at the rack and nozzles at the forecourt are the same input of one queue model. Adding one lowers the utilisation and leaves the offered load where it was, 3.6000 erlangs at IBAFO's rack.")

q(3, "Why do the farm's 44.1108 turns a year interest the side of the depot that earns IBAFO's invented throughput fee?",
 "The fee earns on every cubic metre that passes.",
 ["Turns set the fee rate the engine applies to each cubic metre.",
  "Each turn adds the invented fixed cost of 9400.00 USD once more.",
  "The margin per m3 of 1.89 USD is paid once for each turn."],
 "A throughput fee earns on every cubic metre that passes, so more turns on the same tanks earn more fees from the same steel. Turns = daily throughput x 365 / working capacity; the fee, 7.80 USD/m3, is an invented input the caller types.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/intermediate/tdsi_exam.json', label='tdsi_exam', expect_n=42)
finish()
