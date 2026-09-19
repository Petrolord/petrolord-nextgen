import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Associate m05, Closing the Day. Digest sections 7 and 8.
# The 0.2 percent tolerance is the course's stated figure, chosen for it.

q(2, "On the AKODO day, which figure comes from the ledger and which from the tanks?",
 "The expected closing, 4508.100 m3, is the ledger's; the dipped closing, 4499.452 m3, is the tanks'.",
 ["The dipped closing, 4499.452 m3, is the ledger's; the expected closing, 4508.100 m3, is the tanks'.",
  "Both come from the tanks, since the ledger only records the opening stock of 4953.700 m3.",
  "Both come from the ledger, which is then checked against the throughput of 6182.500 m3."],
 "expected closing = opening + receipts - deliveries - known losses, which is paperwork. The dipped closing is the standard total the tank chain built from tapes and tables.")

q(0, "The AKODO day reads unaccounted -8.648 m3. What does the negative sign say?",
 "A loss: the tanks hold less than the ledger expected.",
 ["A gain: the tanks hold more than the ledger expected.",
  "A loss outside tolerance, since any negative gap fails the day.",
  "Nothing yet, since the sign is set only after the run of days is read."],
 "unaccounted = dipped closing - expected closing. The dip is below the ledger, so the engine reports direction loss, and within tolerance true against a band of 12.365 m3.")

q(3, "The AKODO day goes to reconcileStock with everything in place except the figure that starts the ledger. What is the answer?",
 "REFUSED: No opening stock, so the day cannot be closed. The opening stock is yesterday's closing dip.",
 ["expected closing 4508.100 m3, unaccounted none; note: No closing dip, so the day cannot be closed.",
  "unaccounted computed from an opening of 0.000 m3, with a note beside it saying the opening stock was assumed to be empty",
  "unaccounted 0.000 m3, balanced, with the opening taken from today's own closing dip"],
 "Without a starting point the ledger has nothing to add receipts to. The refusal names where the figure comes from: yesterday's closing dip, fixed before today's dips.")

q(1, "The demonstration takes the opening stock as closing dip - receipts + deliveries + known losses. With a closing dip of 4380.250 m3 it opens on 4825.850 m3. Why does the day read balanced?",
 "The ledger undoes exactly what the derivation did, so the expected closing is the dip itself whatever it reads.",
 ["The closing dip of 4380.250 m3 happens to fall inside the tolerance band of 12.365 m3 on that day.",
  "The engine detects that the opening was derived and switches off the check with the word balanced.",
  "The derived opening stock is at standard, while the real opening of 4953.700 m3 is gross observed."],
 "Every row of the demonstration balances with unaccounted 0.000 m3, so none of them measured anything. A leak overnight would lower the dip and the derived opening together.")

q(1, "Both the real AKODO day and the derived day close on 4499.452 m3. The real day opens on 4953.700 m3 and the derived day on 4945.052 m3. Which one measures the terminal?",
 "The real day, because its opening stock was measured before today's dips were taken.",
 ["The derived day, because its opening is built from today's own figures and so is more current.",
  "The derived day, because a balanced reading of 0.000 m3 is the goal of every reconciliation.",
  "Neither, until the two opening stocks agree to within the tolerance band of the day."],
 "The real day reads unaccounted -8.648 m3, direction loss, within 12.365 m3. The derived day reads 0.000 m3, balanced, because its answer was settled before the question was asked.")

q(3, "The AKODO tolerance is 0.2 percent. Of which figure is it a percent?",
 "Throughput, receipts plus deliveries: 6182.500 m3",
 ["The opening stock, 4953.700 m3",
  "The expected closing, 4508.100 m3",
  "The dipped closing at standard, 4499.452 m3"],
 "tolerance = a stated percent of throughput, and throughput = receipts + deliveries. 0.2 percent of 6182.500 m3 is printed as 12.365 m3.")

q(0, "The tolerance percent is moved from 0.1 to 0.2 on the same AKODO day. What changes?",
 "The band goes from 6.183 m3 to 12.365 m3 and the verdict from false to true.",
 ["The unaccounted figure goes from -8.648 m3 to 0.000 m3 and the verdict from false to true.",
  "The throughput goes from 3.091 m3 to 6.183 m3 while the verdict stays false in both rows.",
  "The band goes from 6.183 m3 to 12.365 m3 while the verdict stays true in both rows."],
 "Nothing about the tanks changes: the unaccounted figure stays -8.648 m3 in every row. Only the band moves, so the verdict depends on a percent somebody chose before the day was closed.")

q(2, "A still day: opening 4953.700 m3, no receipts and no deliveries, dipped at 4954.200 m3. Why is it outside tolerance?",
 "No product moved, so the throughput and the band are zero and any gap reads outside.",
 ["A gain of 0.500 m3 is outside the 0.2 percent band, which on a still day is set on the opening stock instead.",
  "The engine refuses a day with no movements and reports the verdict as false.",
  "Any gain is outside tolerance, since the band is applied to losses only."],
 "The engine prints unaccounted 0.500 m3, tolerance 0.000 m3, within tolerance false, direction gain. It invents no band for the still day and lets someone look.")

q(0, "The AKODO day prints unaccounted percent of throughput -0.1399 and a tolerance of 0.2 percent of throughput. How do the two percents differ?",
 "The 0.2 is the stated band; the -0.1399 is the day's result on the same base.",
 ["The 0.2 is the day's result; the -0.1399 is the band the terminal stated.",
  "The two are on different bases: the 0.2 on the opening stock, the -0.1399 on throughput.",
  "The -0.1399 is the cumulative percent over the nine days recorded."],
 "Both percents sit on the throughput of 6182.500 m3. Keep the units apart: one is a band chosen before the day, the other what the day produced.")

q(2, "Why does reconcileStock set its tolerance on throughput?",
 "Product that moves is measured on the way in or out, so a busy day leaves more room for honest error.",
 ["Throughput is a wide base, which keeps the band loose enough for an ordinary day to pass it.",
  "The opening stock is not known until the day closes, so throughput is the only base available.",
  "A band on throughput cancels the known losses, which are booked on receipts and deliveries."],
 "Tapes, thermometers, tables and meters each carry uncertainty on every transfer. On the AKODO day 0.2 percent of 6182.500 m3 gives a band of 12.365 m3.")

q(1, "Over nine days, what does trendUnaccounted report for the cumulative gap and the run?",
 "cumulative -27.200 m3 and a run of 6 days of loss ending on day 9",
 ["cumulative -27.200 m3 and a run of 9 days, since every day is counted",
  "cumulative -7.200 m3, the latest day, and a run of 3 days of loss",
  "cumulative 0.100 m3 at day 4 and a run of 5 days of loss after it"],
 "The running total ends at -27.200 m3. From day 4, -2.400 m3, to day 9, -7.200 m3, every day is a loss, so the run ending on the latest day is 6 days.")

q(3, "The same nine-day record is trimmed to its first six days. What does the engine report?",
 "A run of 3 days of loss and no prompt",
 ["A run of 6 days of loss and the prompt",
  "A run of 3 days of loss and the prompt",
  "A run of 0 days and a mean percent of none"],
 "The first six days alone: run 3 days of loss; prompt: none. Trimmed one day at a time, runs of 2 and 3 days print no prompt and runs of 4, 5 and 6 days print one.")

q(0, "The nine days' cumulative percent is -0.0494. On what base is that percent taken?",
 "The cumulative throughput, printed as 55085.000 m3",
 ["The latest day's throughput alone, 6310.000 m3 on day 9",
  "The AKODO day's throughput, 6182.500 m3, on the one day closed",
  "The cumulative gap itself, -27.200 m3, over the nine days"],
 "The engine prints the denominator of the mean percent as 55085.000 m3, the nine days' throughput summed. The percent states the whole gap on the whole throughput.")

q(3, "What three causes does the engine's prompt name for a run in one direction?",
 "A drifting meter, a passing valve, or a temperature effect not being corrected",
 ["A wet receipt, a leaking roof seal, or a strapping table cut too coarse",
  "A negative dip, a water cut above the dip, or a missing opening stock",
  "A tolerance set too tight, a still day, or a derived opening stock"],
 "None of the three is a single event, so each shows up as a run. The prompt reads: 6 days of loss in a row. One day is noise; a run in one direction is worth investigating.")

q(2, "trendUnaccounted is given no days at all. What does it report?",
 "cumulative 0.000 m3, run 0 and mean percent none",
 ["REFUSED, since a trend needs at least one day to read",
  "cumulative 0.000 m3, run 0 and a mean percent of zero",
  "cumulative none, run none and mean percent none"],
 "An empty record has nothing to average, so the mean percent is none. The running total of nothing is 0.000 m3 and there is no run.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_m05.json', expect_n=15)
finish()
