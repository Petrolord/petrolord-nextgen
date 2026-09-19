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

q(3, "At IBAFO the offered load is 3.6000 erlangs. What is an erlang in this model?",
 "One bay kept busy for a whole hour.",
 ["One truck arriving in an hour.",
  "One mean load of 24 minutes.",
  "The idle share of one bay's hour between loads."],
 "Offered load = arrivals per hour / (60 / load minutes). At 9 arrivals and 24 minutes a load it is 3.6000 erlangs: the arriving work would keep that many bays busy on average if it could be spread perfectly over them.")

q(1, "The bay sweep holds IBAFO's 9 arrivals an hour and 24 minute loads. Going from 4 bays to 5, which printed figure moves, and how?",
 "The utilisation, from 0.900000 to 0.720000.",
 ["The offered load, from 3.6000 to 2.8000 erlangs.",
  "The probability of waiting, from 0.900000 to 0.720000.",
  "Neither ratio; both come from the traffic."],
 "Utilisation = offered load / bays, so it falls from 0.900000 to 0.720000. The offered load is a property of the traffic and the load time and reads 3.6000 erlangs in every row of the bay sweep. The 2.8000 erlangs belong to the arrivals sweep at 7 arrivals an hour, and the probability of waiting at 5 bays is 0.410394.")

q(2, "IBAFO's rack prints a utilisation of 0.900000 and a probability of waiting of 0.787753. What does 0.787753 measure?",
 "The chance that an arriving truck finds every bay busy and queues.",
 ["The share of each bay's hour spent loading, across the 4 bays.",
  "The chance a truck finding every bay busy is turned away.",
  "The share of the day's 216 trucks that load within the mean load minutes."],
 "The probability of waiting is Erlang C, a statement about how often the whole rack is full when a truck arrives. The share of bay time spent loading is the utilisation, 0.900000. A truck turned away belongs to the Erlang B model, which rackQueue does not report.")

q(3, "Two rows of the engine's sweeps share a utilisation of 0.600000. Which probability of waiting does the rack of 6 bays at 9 arrivals an hour print?",
 "0.196566",
 ["0.287043",
  "0.410394",
  "0.600000"],
 "The 6 bay rack at 9 arrivals prints 0.196566. The 4 bay rack at 6 arrivals has the same utilisation and prints 0.287043. A larger rack at the same utilisation pools more bays against the same bunching, so a utilisation limit quoted with no bay count is silent on the difference. 0.410394 is the 5 bay row and 0.600000 is the utilisation itself.")

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
 "Erlang B is the probability that every bay is busy in a rack with no waiting room, so the cost is a lost lifting. Erlang C, 0.787753, assumes the truck joins a line and loads later. A rack with a truck park is the waiting case, and that is the one rackQueue reports.")

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
 "The bay count enters the recursion as a count, and the engine checks it before anything else runs. A rack of 2.5 bays does not exist, and a tool that quietly rounds it up has changed the question without saying so. 1.200000 is the utilisation of a real 3 bay rack.")

q(0, "The bay count is left blank on an otherwise complete IBAFO call. Which answer does the engine give?",
 "The whole number sentence, the same one it gives for 0 bays.",
 ["A run on 4 bays, the typical count it keeps.",
  "The sentence asking for arrival rate and load time.",
  "The offered load alone, with every probability none."],
 "The refusal table prints the same sentence for 0, 2.5 and none: \"The number of bays must be a whole number, one or more.\" A blank bay count is a missing input, and the engine does not fill it with a typical figure.")

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
 "Stability needs a utilisation below one. The sweep marks 3 bays false and 4 bays true. Stable is a low bar: at 4 bays an arriving truck still waits with a probability of 0.787753, so keeping up on average and serving promptly are separate standards.")

q(2, "The engine counts 216 trucks a day at IBAFO's arrival rate. What does that count tell a depot manager?",
 "The mean arrival rate multiplied out over the day, with nothing on how trucks bunch.",
 ["The trucks the 4 bays can load in a day before the rack stops being stable.",
  "The trucks that load without waiting, the day's share not caught by the Erlang C.",
  "The day's liftings in trucks, the divisor the tank farm uses for days of cover."],
 "The day count is a mean rate multiplied out. It says nothing about how the trucks bunch within an hour, and bunching is what builds a queue. The tank farm divides by its daily throughput in m3, which the caller supplies.")

q(0, "A depot turns trucks away at its gate when the yard is full. Why does the lesson say to note that beside rackQueue's probability of waiting?",
 "The engine models only the waiting case, so its figure describes a rack with a larger yard.",
 ["The engine then switches to the Erlang B model and prints the blocking probability instead.",
  "A fenced yard lowers the arrival rate, and the engine cannot know the arrivals it lost.",
  "The printed probability counts the turned away trucks twice, once at the gate and once queued."],
 "rackQueue assumes every truck that finds the bays busy joins a line and loads later. A depot that turns trucks away is partly a loss system, and its drivers meet something between the Erlang C of 0.787753 and the derived Erlang B of 0.270685.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/intermediate/tdsi_m01.json', label='tdsi_m01', expect_n=15)
finish()
