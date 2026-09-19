import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Professional m06, the professional reading.
# Draws on m06's three lessons only: the IBAFO rack and farm read as one
# morning's report (SECTIONS 9 to 12), the lane, fleet and forecourt read as one
# chain (SECTIONS 14 to 16), and what the Expert tier changes, asked without a
# figure from a later tier. Money on the lane is in naira and every cost is
# INVENTED for this course. Every figure is a string the digest prints.

q(1, "A morning report on the IBAFO rack must lead with the figures a driver feels. Which pair should head it?",
 "Probability of waiting 0.787753 and mean wait 47.2652 minutes.",
 ["Utilisation 0.900000 and offered load 3.6000 erlangs, the rack's own view.",
  "Trucks per day 216 and mean queue 7.0898 trucks.",
  "Utilisation 0.900000 and the mean time on site."],
 "A report that leads with a utilisation of 0.900000 invites the reader to think the rack has room. An arriving truck finds every bay full with a probability of 0.787753, and averaged over every truck it waits 47.2652 minutes.")

q(3, "A manager plans for traffic growth on IBAFO's 4 bays. What do the printed rows say lies one step past 9.5 arrivals an hour?",
 "At 10 arrivals no average wait exists.",
 ["At 10 arrivals the wait reaches 245.7297 minutes.",
  "At 10 arrivals the rack is stable at a utilisation of 1.000000.",
  "At 10 arrivals the rack keeps up once a fifth bay is typed."],
 "At 9.5 arrivals the mean wait is 106.9703 minutes. At 10 the engine refuses: the rack cannot keep up and the queue grows without limit. 245.7297 minutes belongs to the load minutes sweep at 26 minutes a load.")

q(0, "A morning stock report on the IBAFO farm quotes 10077.700 m3 as pumpable. What has the writer done?",
 "Netted the farm's heel across tanks, lending IB-T2 product from other tanks.",
 ["Counted each tank's stock above its own heel, as tankFarmCover does.",
  "Left IB-T2 out of the farm entirely, stock and heel together.",
  "Taken the working capacity less the ullage for each tank."],
 "The farm's stock less its heel is 10077.700 m3, a figure the engine prints only to say it does not use it. Counted tank by tank, with IB-T2's 164.700 m3 below its 210.000 m3 heel contributing 0.000 m3, the pumpable stock is 10123.000 m3.")

q(2, "Which IBAFO figure joins the rack's queue to the farm's cover?",
 "None: they are separate engine calls with separate limits.",
 ["The rack's 216 trucks a day, which the farm divides into its days of cover.",
  "The daily throughput of 2640.000 m3, which the rack reads as its arrivals.",
  "The mean queue of 7.0898 trucks, which the farm reads as its liftings."],
 "The rack limits how fast product can leave; the farm limits how long there is product to send and how much room there is for the next receipt. The engine prints no figure that joins them, so a report keeps them in separate tables with their own units.")

q(1, "The IBAFO lane prints complete true on its invented costs. What does that flag rest on?",
 "Every cost box was typed.",
 ["The diesel emission factor was supplied.",
  "The payload fits.",
  "The fleet is sized."],
 "complete true says no cost line is missing. The carbon figure reads none because no diesel emission factor was supplied, and the engine says it is absent rather than zero; that does not make the cost answer incomplete.")

q(3, "On the lane, which input carries the weight of the trips a truck a day, the depreciation a trip and the fleet together?",
 "The cycle, through its typed queue hours and average speed.",
 ["The transit loss of 0.3 percent, through the litres delivered.",
  "The payload of 33000.00 litres, through the trips needed a day.",
  "The invented Diesel line, through the cost a trip at each distance."],
 "The cycle sets the trips a truck a day, 0.664260, which sets both the depreciation a trip and the fleet of 58. The queue hours and average speed are typed inputs, so they are the first to check.")

q(0, "The IBAFO fleet of 58 runs at a fleet utilisation of 0.991038. What does that say about breakdowns?",
 "Nothing: the engine sizes for the average cycle and the operator adds any spare.",
 ["The 0.345262 spare trips a day are the engine's reserve for breakdowns.",
  "The ceiling adds one truck for breakdowns before it reports 58.",
  "At 0.991038 the fleet is unstable, as a rack is above one."],
 "A fleet utilisation is a figure for an average day. The spare of 0.345262 trips and 11393.64 litres a day is what the ceiling bought. A truck in the workshop changes what the fleet can make, and the engine prints no allowance for it.")

q(2, "At the IBAFO forecourt, which two inputs decide whether the queue is stable and whether a full truck can discharge?",
 "The peak share and the reorder level.",
 ["The litres a transaction and the dead stock.",
  "Dispense rate and capacity.",
  "The daily throughput and the delivery size."],
 "The peak share sets the 135.00 transactions an hour the forecourt is sized for, and so whether the queue at 6 nozzles is stable. The reorder level sets the ullage at reorder, 28125.00 litres, into which the delivery must fit.")

q(3, "The IBAFO lane's payload reappears at the station. What does stationSizing check it against, and with which volume?",
 "The ullage at reorder, with the 33000.00 litres loaded.",
 ["The ullage at reorder, with the 32901.00 litres delivered after the transit loss.",
  "The usable tank litres, with the 33000.00 litres loaded.",
  "The dead stock, with the 32901.00 litres delivered."],
 "stationSizing checks the payload loaded against the 28125.00 litres of ullage at the reorder level and warns that a 33000 litre load cannot discharge into it. The lane delivers 32901.00 litres a trip after its transit loss, and the station's check does not use that figure.")

q(1, "Along the IBAFO chain, what does a blank box give at each link?",
 "A refusal, a named missing input or a floor, and never a silent zero.",
 ["A typical figure the engine keeps for the link, named in a note.",
  "A zero at every link, with the answer marked complete.",
  "A refusal at the first link, and nothing printed after it."],
 "A blank driver cost reads complete false with Driver named; a blank truck capital reads a floor; a missing demand or nozzle count is refused. The chain holds only while every box was filled by someone who measured it.")

q(0, "The farm's days of cover of 3.8345 pools three products. What figure does the course give for the petrol that can be lifted today?",
 "IB-T1's pumpable 5078.400 m3.",
 ["The farm's pumpable 10123.000 m3.",
  "IB-T2's stock of 164.700 m3.",
  "IB-T1's stock of 5288.400 m3."],
 "IB-T2 holds petrol below its heel and adds nothing until it is filled above it. The days of cover divide all three products' pumpable stock by all liftings, so the petrol figure comes from the petrol tanks alone.")

q(2, "The Expert tier converts one cargo between tonnes, cubic metres, litres and barrels. Which input can a conversion between mass and volume not proceed without?",
 "A density.",
 ["A VCF.",
  "An exchange rate.",
  "A freight rate."],
 "The conversion between mass and volume needs a density the engine never assumes. The same rule held in this tier: a loss with no density has no weight, and the carbon side is not computed.")

q(3, "Why is every freight, duty, levy and exchange rate in the Expert tier labelled invented?",
 "The engine ships no rate by design.",
 ["Rates are hidden from learners.",
  "The rates are published and current, and are rounded for teaching.",
  "Only large rates are invented."],
 "Real rates are set by regulation and contract, differ by market and change. The engine ships no rate for any of them, and the course invents every one, as it invented the throughput fee and the lane's costs in this tier.")

q(0, "On the lane a transit loss spread the trip's cost over fewer litres. Where does the Expert tier meet the same effect?",
 "On a whole cargo at sea: the importer pays for what was loaded and sells what arrives.",
 ["At the forecourt, where the reorder level leaves too little ullage.",
  "At the rack, where a queue lowers the trucks loaded each day.",
  "In the tank farm, where a heel holds stock back from the pumps."],
 "The lane's 33000.00 litre payload delivers 32901.00 litres after the transit loss, and the cost is spread over what arrives. The next tier meets that effect on a cargo, and says the losses divide.")

q(1, "Which habit from this tier does the Expert tier rely on when an incomplete build-up is labelled by the engine?",
 "Reading a floor as a lower bound with its missing lines named.",
 ["Reading a floor as the cost once the missing lines are set to zero.",
  "Reading an incomplete build-up as refused, with nothing printed.",
  "Reading a floor as a typical cost the engine fills in."],
 "In this tier the lane with no truck capital cost printed 13.2401 naira a litre with Truck depreciation named as missing, which is a floor. The Expert tier's engine labels an incomplete build-up as a floor in its own words, and it is read the same way.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/intermediate/tdsi_m06.json', label='tdsi_m06', expect_n=15)
finish()
