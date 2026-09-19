import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Professional m01, the loading rack as a queue.
# Draws on m01's five lessons only: digest SECTION 9 and the bay, load minutes
# and refusal tables of SECTION 10, with the arrivals rows of SECTION 11 the
# lessons quote. Every figure and refusal is a string the digest prints. The
# Erlang B figures are labelled in the digest as worked out from the engine's
# Erlang C, and every question that uses one keeps that label.

q(2, "rackQueue models the IBAFO loading rack as an M/M/c queue. What does that model assume about the trucks and the bays?",
 "Trucks arrive at random around a mean rate, each holds a bay for a random time around a mean, and there are c bays.",
 ["Trucks arrive on a booked timetable, each load takes exactly the mean minutes, and there are c bays.",
  "Trucks arrive at random, and a truck that finds c bays busy gives up and drives away without loading.",
  "Trucks arrive at random, and a priority lane serves the trucks with the shortest loads before the rest."],
 "The first M is random arrivals around a stated mean rate, the second M a random time on the bay around a stated mean, and c is the bay count. Nothing else is assumed: no appointment system, no priority lane and no truck that gives up.")

q(0, "The IBAFO rack is called with 9 arrivals an hour, 4 bays and a load time typed as 0 minutes. What does the engine answer?",
 "REFUSED: Arrival rate and load time are both needed.",
 ["REFUSED: The number of bays must be a whole number, one or more.",
  "REFUSED: The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.",
  "No refusal: stable true and a mean wait of none."],
 "A load that takes no time is a missing measurement. The digest's refusal table prints the load time of 0 against 9 arrivals and 4 bays with the sentence about the arrival rate and the load time, the same sentence a blank load time gets.")

q(3, "At IBAFO the offered load is 3.6000 erlangs. How does rackQueue form it?",
 "Arrivals per hour / (60 / load minutes).",
 ["Arrivals per hour / (60 / load minutes) / bays.",
  "Arrivals per hour x bays / (60 / load minutes).",
  "Probability of waiting x bays."],
 "The digest prints offered load (erlangs) = arrivals per hour / (60 / load minutes), and utilisation = offered load / bays. Dividing the offered load by the bays again gives the utilisation, 0.900000. The bay count is not in the offered load, and neither is the probability of waiting, 0.787753.")

q(1, "The bay sweep holds IBAFO's 9 arrivals an hour and 24 minute loads. Going from 4 bays to 5, which printed figure moves, and how?",
 "The utilisation, from 0.900000 to 0.720000.",
 ["The offered load, from 3.6000 to 2.8000 erlangs.",
  "The probability of waiting, from 0.900000 to 0.720000.",
  "Neither ratio; both come from the traffic."],
 "Utilisation = offered load / bays, and the bay sweep prints it falling from 0.900000 to 0.720000. The bay sweep prints no offered load, and the offered load formula, arrivals per hour / (60 / load minutes), has no bays in it. The 2.8000 erlangs belong to the arrivals sweep at 7 arrivals an hour, and the probability of waiting moves from 0.787753 to 0.410394.")

q(2, "IBAFO's rack prints a utilisation of 0.900000 and a probability of waiting of 0.787753. What does 0.787753 measure?",
 "The chance that an arriving truck has to wait for a bay.",
 ["The share of each bay's hour spent loading, across the 4 bays.",
  "The chance a truck finding every bay busy is turned away.",
  "The share of the day's 216 trucks that load within the mean load minutes."],
 "The digest names it: the probability that an arriving truck waits is Erlang C. 0.900000 is the utilisation, offered load / bays. Erlang B, the rack where a truck that finds every bay busy leaves, is not exported by the engine, and 216 is the trucks per day at this arrival rate.")

q(3, "The 6 bay rack at 9 arrivals an hour and the 4 bay rack at 6 arrivals an hour both print a utilisation of 0.600000. Which probability of waiting does the 6 bay rack print?",
 "0.196566",
 ["0.287043",
  "0.410394",
  "0.600000"],
 "The bay sweep prints 0.196566 for 6 bays at 9 arrivals. The arrivals sweep prints 0.287043 for 4 bays at 6 arrivals, and the load minutes sweep prints the same 0.287043 for 4 bays at 16 minutes a load, also at 0.600000. The same utilisation prints two different probabilities. 0.410394 is the 5 bay row and 0.600000 is the utilisation itself.")

q(3, "The digest prints an Erlang B of 0.270685 beside the IBAFO rack's Erlang C of 0.787753. Where does that Erlang B come from?",
 "The digest works it out from the engine's Erlang C by an identity.",
 ["rackQueue exports it as a blocking probability.",
  "The engine's probability of waiting at 16 minute loads.",
  "The utilisation times the engine's Erlang C."],
 "The engine builds Erlang C from the Erlang B recursion and exports only Erlang C. The digest derives B = C x (1 - utilisation) / (1 - utilisation x C), which gives 0.270685 on the IBAFO rack, and labels it as worked out from the engine's figure.")

q(1, "What rack does the derived Erlang B of 0.270685 describe?",
 "A rack with no queue, where a truck that finds every bay busy leaves.",
 ["The IBAFO rack as it runs, where a truck that finds every bay busy waits in the yard.",
  "A rack where every truck waits in the yard.",
  "A rack of one bay, where B and C agree."],
 "The digest defines this Erlang B for a rack with NO queue, in which a truck that meets every bay busy drives off, and works it out for IBAFO as 0.270685. rackQueue runs the M/M/c queue instead and reports its Erlang C, 0.787753.")

q(2, "The load minutes are swept at 9 arrivals an hour on 4 bays. At 20 minutes a load, which figure is rackQueue's probability of waiting?",
 "0.509434",
 ["0.206107",
  "0.750000",
  "0.642160"],
 "At 20 minutes the engine's Erlang C is 0.509434. The 0.206107 is the Erlang B the digest derives from that Erlang C, 0.750000 is the utilisation, and 0.642160 is the probability of waiting at 22 minutes a load.")

q(3, "The IBAFO rack is called with its 9 arrivals and 24 minute loads and a bay count of 2.5. What happens?",
 "REFUSED: The number of bays must be a whole number, one or more.",
 ["The engine rounds the bay count up to 3 and prints the unstable row with a wait of none.",
  "REFUSED: Arrival rate and load time are both needed.",
  "The engine runs the Erlang recursion on 2.5 bays and prints a utilisation of 1.200000."],
 "The refusal table prints this sentence for 2.5 bays, as for 0 bays and for none. The engine does not round the bay count. 1.200000 is the utilisation of the 3 bay rack in the bay sweep, and the sentence about the arrival rate and the load time belongs to a missing or zero load time.")

q(0, "The bay count is passed as none on an otherwise complete IBAFO call. Which answer does the engine give?",
 "The whole number sentence, the same one it gives for 0 bays.",
 ["A run on 4 bays, the typical count it keeps.",
  "The sentence asking for arrival rate and load time.",
  "The offered load alone, with every probability none."],
 "The refusal table prints the same sentence for 0, 2.5 and none: \"The number of bays must be a whole number, one or more.\" The engine runs no rack on a typical count.")

q(1, "What does the bay sweep print for the 3 bay rack at 9 arrivals an hour?",
 "Stable false, probability of waiting 1.000000.",
 ["Stable false, probability of waiting 1.200000, its utilisation.",
  "Stable true, probability of waiting 0.787753.",
  "Stable false, probability of waiting none."],
 "At 3 bays the utilisation is 1.200000, the arriving work needs more bay time than the rack has, and every arriving truck waits: the probability prints 1.000000 and the rack is marked unstable. It is the mean wait and mean queue that print none.")

q(3, "Among the racks the bay sweep prints at 9 arrivals an hour, which is the smallest whole rack the engine marks stable?",
 "4 bays, at a utilisation of 0.900000.",
 ["3 bays, at a utilisation of 1.200000, since 3.6000 erlangs rounds down to it.",
  "5 bays, the first row whose probability of waiting falls below 0.787753.",
  "6 bays, where the utilisation of 0.600000 matches the 4 bay rack at 6 arrivals."],
 "The bay sweep marks 3 bays stable false at a utilisation of 1.200000 and 4 bays stable true at 0.900000. At 4 bays an arriving truck still waits with a probability of 0.787753, and the mean wait is 47.2652 minutes.")

q(2, "The engine counts 216 trucks a day at IBAFO's arrival rate. What is that count?",
 "The trucks a day at the rack's mean arrival rate of 9 an hour.",
 ["The trucks the 4 bays can load in a day before the rack stops being stable.",
  "The trucks that load without waiting, the day's share not caught by the Erlang C.",
  "The day's liftings in trucks, the divisor the tank farm uses for days of cover."],
 "The digest labels it trucks per day at this arrival rate, and the rate is 9 arrivals an hour. The bays do not enter it, and neither does the probability of waiting. The tank farm divides by its daily throughput in m3, 2640.000 m3.")

q(0, "A depot turns trucks away at its gate when every bay is busy. Why note that beside rackQueue's probability of waiting?",
 "rackQueue models an M/M/c queue, and the no-queue Erlang B is not exported.",
 ["The engine then switches to Erlang B and prints the blocking probability instead.",
  "rackQueue counts the turned away trucks in its mean queue length of 7.0898.",
  "The printed probability counts the turned away trucks twice, once at the gate and once queued."],
 "The engine's figure is the Erlang C of an M/M/c queue, 0.787753, in which a truck that finds every bay busy waits. The digest works the no-queue Erlang B, 0.270685, out of it by an identity, and the engine exports none. Little's law gives its queue length of 7.0898 from the arrivals and the mean wait.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/intermediate/tdsi_m01.json', label='tdsi_m01', expect_n=15)
finish()
