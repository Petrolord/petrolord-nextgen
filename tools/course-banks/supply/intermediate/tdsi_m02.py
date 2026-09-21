import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Professional m02, waiting time and a full rack.
# Draws on m02's four lessons only: digest SECTION 9 (mean wait, time on site,
# queue length, Little's law and the queued-truck figure), the bay and load
# minutes sweeps of SECTION 10 and the arrivals sweep of SECTION 11. The
# 60.0000 minutes is labelled in the digest as worked out from the engine's
# figures (47.2652 / 0.787753), and every question that uses it keeps that label.

q(1, "rackQueue's mean wait = Erlang C / (bays x service rate - arrivals). Which printed IBAFO figure is its numerator?",
 "The probability of waiting, 0.787753.",
 ["The utilisation, 0.900000.",
  "The Erlang B worked out from it, 0.270685.",
  "The offered load of the traffic, 3.6000 erlangs."],
 "The IBAFO table prints the probability of waiting as Erlang C, 0.787753, and the mean wait formula divides that Erlang C. 0.900000 is the utilisation and 3.6000 erlangs the offered load. 0.270685 is the Erlang B the course works out from the Erlang C, and the engine does not export it.")

q(3, "IBAFO's mean wait is 47.2652 minutes. Which trucks is that figure averaged over?",
 "Every arriving truck, the ones that load at once counted as zero.",
 ["Only the trucks that queue, since a truck that finds a free bay has no wait to record.",
  "The trucks that queue in the peak hour, the only hour the rack is ever full.",
  "The trucks on the bays and in the yard together, the whole visit of each one."],
 "The course says the engine's averageWaitMinutes averages over every truck, the ones that load at once included. The mean wait of a truck that does queue, 47.2652 / 0.787753 = 60.0000 minutes, is worked out in the course. The mean time on site is a separate row of the table.")

q(0, "A driver who queued asks what the average wait is for trucks that actually queue at IBAFO. Which figure does the course give, worked out from the engine's figures?",
 "60.0000 minutes, the mean wait over the probability of waiting.",
 ["47.2652 minutes, the engine's averageWaitMinutes.",
  "7.0353 minutes, the 5 bay wait.",
  "24 minutes, the mean time on the bay."],
 "The course prints 47.2652 / 0.787753 = 60.0000 minutes and labels it as worked out from the engine's figures. The engine's 47.2652 averages over every truck; dividing by the probability of waiting leaves the average over the trucks that queue.")

q(2, "Read the arrivals sweep at 8 trucks an hour on IBAFO's 4 bays. Which utilisation, probability of waiting and mean wait does that row print, in that order?",
 "0.800000, 0.596432 and 17.8930 minutes.",
 ["0.700000, 0.428654 and 8.5731 minutes.",
  "0.800000, 0.787753 and 17.8930 minutes.",
  "0.800000, 0.596432 and 47.2652 minutes."],
 "The arrivals sweep prints a utilisation of 0.800000, a probability of waiting of 0.596432 and a mean wait of 17.8930 minutes at 8 arrivals. 0.428654 and 8.5731 minutes are the 7 arrival row, and 0.787753 and 47.2652 minutes the 9 arrival row.")

q(3, "The course checks the queue length by Little's law: 9 x 47.2652 / 60 = 7.0898. Why is the division by 60 there?",
 "It turns the wait from minutes into hours.",
 ["It turns 9 arrivals an hour into arrivals a minute for each bay.",
  "It spreads the queue over a bay's hour.",
  "It converts the load time to a rate."],
 "Little's law reads queue length = arrivals per hour x mean wait in hours. The arrivals are per hour, the wait prints in minutes, so the wait is divided by 60 to match. The result agrees with the engine's own queue length of 7.0898 trucks.")

q(1, "What does IBAFO's mean queue length of 7.0898 trucks count?",
 "Trucks waiting for a bay, on average.",
 ["Trucks waiting and trucks on the bays, on average.",
  "The most trucks the yard holds at the busiest moment.",
  "Trucks waiting for a bay in the peak hour alone."],
 "The course reaches 7.0898 by Little's law from the mean wait: 9 x 47.2652 / 60, the arrivals times the wait in hours. The time on the bay is not in that line. The figure is a mean queue length, so it is no maximum, and rackQueue has no peak hour.")

q(2, "The load minutes are swept on IBAFO's 4 bays at 9 arrivals an hour. If the mean load drops from 24 minutes to 20, which printed pair describes the change?",
 "Mean wait from 47.2652 minutes to 10.1887.",
 ["Mean wait from 47.2652 minutes to 7.0353, the fifth bay row.",
  "Mean wait to 20.1822 minutes.",
  "Probability of waiting from 0.787753 to 0.410394."],
 "The load minutes sweep prints 10.1887 minutes at 20 minutes a load. The 20.1822 minutes is the 22 minute row; 7.0353 minutes and 0.410394 belong to the bay sweep at 5 bays, a different lever.")

q(0, "The arrivals rise to 10 an hour on IBAFO's 4 bays with 24 minute loads. What does rackQueue answer?",
 "REFUSED: The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.",
 ["REFUSED: Arrival rate and load time are both needed.",
  "REFUSED: The number of bays must be a whole number, one or more.",
  "No refusal: stable true, mean wait 245.7297 minutes."],
 "At 10 arrivals the utilisation reaches 1.000000 and the arriving work equals what the bays can load. The engine does not print a very large wait; it refuses. 245.7297 minutes is the 26 minute row of the load minutes sweep at 9 arrivals.")

q(1, "At 10 arrivals an hour the engine refuses a mean wait. What does it still report for that row?",
 "Stable false and a probability of waiting of 1.000000.",
 ["Stable true and a probability of waiting of 0.891419.",
  "Stable false and a mean queue of 7.0898 trucks, the last figure it could form.",
  "Nothing at all, since a refused call prints no figure."],
 "The engine reports what it can: stable false, probability of waiting 1.000000, mean wait none. Every arriving truck waits. 0.891419 is the probability at 9.5 arrivals, the row before it.")

q(3, "Why does the engine print no mean wait at a utilisation of exactly 1.000000?",
 "The queue grows without limit, so no average waiting time exists.",
 ["The wait exceeds a ceiling of minutes that the engine refuses to print past.",
  "Erlang C can only be formed below one, so the recursion stops before the wait.",
  "A mean wait needs a derived Erlang B, which cannot be formed at one."],
 "The refusal gives the engine's own reason: \"The queue grows without limit, so no average waiting time exists.\" The engine still forms Erlang C at that row and prints 1.000000, and the mean wait formula divides the Erlang C, with no Erlang B in it.")

q(2, "The refusal names three remedies. Which input does \"load faster\" change?",
 "The mean load minutes, which lowers the offered load.",
 ["The bay count, which lowers the utilisation.",
  "The arrivals in the peak hour.",
  "The rack's queueing hours, typed as an allowance."],
 "Adding a bay raises the denominator of the utilisation; spreading the arrivals lowers the peak arrivals; loading faster shortens the load minutes and so lowers the offered load. On 4 bays at 9 arrivals the load minutes sweep prints 10.1887 minutes of wait at 20 minutes a load.")

q(0, "IBAFO adds a fifth bay at the same 9 arrivals an hour and 24 minute loads. Which figure is the same for the 5 bay rack as for the 4 bay rack?",
 "The offered load, 3.6000 erlangs.",
 ["The utilisation, 0.900000.",
  "The mean queue, 7.0898 trucks.",
  "The probability of waiting, 0.787753."],
 "Offered load = arrivals per hour / (60 / load minutes); the bay count is not in it, so both racks carry 3.6000 erlangs. At 5 bays the sweep prints a utilisation of 0.720000, a probability of 0.410394 and a queue of 1.0553 trucks.")

q(3, "What does a decision to build IBAFO's fifth bay need that rackQueue does not print?",
 "A cost for the bay and a cost for a truck's hour.",
 ["The fifth bay's probability of waiting, which the sweep leaves out.",
  "The mean queue at 5 bays, since only the 4 bay rack has one.",
  "The offered load at 5 bays, since it changes with each bay added."],
 "The sweep prints the service consequence of each whole rack: at 5 bays a probability of 0.410394, a wait of 7.0353 minutes and a queue of 1.0553 trucks. The rack model prices nothing, so a bay decision joins the sweep to costs from outside the engine.")

q(1, "Traffic at IBAFO grows from 9 to 9.5 arrivals an hour on the same 4 bays. How far does the average wait climb?",
 "From 47.2652 minutes to 106.9703.",
 ["From 47.2652 minutes to 245.7297, the wait at 26 minute loads.",
  "From 17.8930 minutes to 47.2652.",
  "From 47.2652 minutes to none."],
 "The arrivals sweep prints 106.9703 minutes at 9.5 arrivals an hour, and the refusal comes at 10. 17.8930 minutes is the row at 8 arrivals, and 245.7297 minutes is a load minutes row.")

q(2, "Why does the course print the Little's law line beside the engine's queue length?",
 "It reaches the engine's 7.0898 a second way, from the arrivals and the mean wait.",
 ["It shows the yard never holds more than 7.0898 trucks at any moment.",
  "It derives the Erlang B of the rack from the engine's queue length.",
  "It replaces the engine's figure, which the Erlang recursion cannot form."],
 "The course prints Little's law, queue length = arrivals per hour x mean wait in hours: 9 x 47.2652 / 60 = 7.0898, and beside it the engine's queue length, 7.0898. The Erlang B is worked out from the Erlang C, and a mean queue is no maximum.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/intermediate/tdsi_m02.json', label='tdsi_m02', expect_n=15)
finish()
