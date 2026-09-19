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

q(1, "fleetSizing prints 58 IBAFO trucks. Where does its trips a truck a day of 0.664260 come from?",
 "The IBAFO lane, from its cycle of 18.065 hours.",
 ["The rack's 216 trucks a day.",
  "The farm's 44.1108 turns a year, spread over 365 days.",
  "fleetSizing works it out from the demand and the payload."],
 "The fleet table labels 0.664260 trips a truck a day (from the lane), and on the lane trips a truck a day = working hours / cycle, with 12 working hours and a cycle of 18.065 hours. fleetSizing refuses without it: \"Demand, payload and trips per truck per day are required and must be positive.\" Demand over payload gives the trips needed, 38.181818.")

q(3, "A manager plans for traffic growth on IBAFO's 4 bays. What do the printed rows say lies one step past 9.5 arrivals an hour?",
 "At 10 arrivals no average wait exists.",
 ["At 10 arrivals the wait reaches 245.7297 minutes.",
  "At 10 arrivals the rack is stable at a utilisation of 1.000000.",
  "At 10 arrivals the rack keeps up once a fifth bay is typed."],
 "At 9.5 arrivals the mean wait is 106.9703 minutes. At 10 the engine refuses: the rack cannot keep up and the queue grows without limit. 245.7297 minutes belongs to the load minutes sweep at 26 minutes a load.")

q(0, "The IBAFO morning report sets the farm's pumpable stock of 10123.000 m3 beside its daily liftings of 2640.000 m3. Which printed figure is the first over the second?",
 "Days of cover, 3.8345.",
 ["The turns a year, 44.1108.",
  "Fleet utilisation, 0.991038.",
  "The rack's utilisation, 0.900000."],
 "Days of cover = pumpable stock / daily throughput, and the farm table prints 3.8345. Turns a year divide the daily throughput x 365 by the working capacity, 44.1108. The two utilisations belong to the fleet and the rack.")

q(2, "Which IBAFO figure joins the rack's queue to the farm's cover?",
 "None: they are separate engine calls with separate limits.",
 ["The rack's 216 trucks a day, which the farm divides into its days of cover.",
  "The daily throughput of 2640.000 m3, which the rack reads as its arrivals.",
  "The mean queue of 7.0898 trucks, which the farm reads as its liftings."],
 "The rack limits how fast product can leave; the farm limits how long there is product to send and how much room there is for the next receipt. The engine prints no figure that joins them, so a report keeps them in separate tables with their own units.")

q(1, "The IBAFO lane prints complete true on its invented costs. What does that flag rest on?",
 "No cost box was left blank.",
 ["The diesel emission factor was supplied.",
  "The payload fits.",
  "The fleet is sized."],
 "complete true says no cost is missing. A blank or null cost box reads complete false with the cost named, and a cost left out of the call takes the default the signature states and still reads complete true. The carbon figure reads none because no diesel emission factor was supplied, and complete stays true. The payload check is the station's and the fleet is fleetSizing's.")

q(3, "On the lane, which printed figure feeds the trips a truck a day, the depreciation a trip and the fleet together?",
 "The cycle, 18.065 hours.",
 ["The litres delivered a trip, 32901.00.",
  "The payload of 33000.00 litres.",
  "The Diesel line, 278553.60 naira a trip."],
 "Trips a truck a day = working hours / cycle, the truck's capital is spread over the trips a year that cycle allows, and fleetSizing takes the lane's trips a truck a day. The payload sets the trips needed and the litres delivered set the cost per litre; the Diesel line is one cost a trip.")

q(0, "The IBAFO fleet of 58 runs at a fleet utilisation of 0.991038. What does that say about breakdowns?",
 "Nothing: the engine sizes for the average cycle and the operator adds any spare.",
 ["The 0.345262 spare trips a day are the engine's reserve for breakdowns.",
  "The ceiling adds one truck for breakdowns before it reports 58.",
  "At 0.991038 the fleet is unstable, as a rack is above one."],
 "A fleet utilisation is a figure for an average day. The spare of 0.345262 trips and 11393.64 litres a day is what the ceiling bought. A truck in the workshop changes what the fleet can make, and the engine prints no allowance for it.")

q(2, "At one IBAFO forecourt with 6 nozzles, which utilisation, probability of waiting and mean wait does stationSizing print, in that order?",
 "0.878289, 0.688546 and 2.2083 minutes.",
 ["0.900000, 0.787753 and 47.2652 minutes.",
  "0.878289, 1.000000 and none.",
  "1.053947, 1.000000 and none."],
 "The forecourt table prints a utilisation of 0.878289, a probability of waiting of 0.688546 and a mean wait of 2.2083 minutes at 6 nozzles, stable true. 0.900000, 0.787753 and 47.2652 minutes are the rack at 4 bays, and 1.053947 with no mean wait is the forecourt at 5 nozzles, stable false.")

q(3, "The IBAFO lane's payload reappears at the station. What does stationSizing check it against, and with which volume?",
 "The ullage at reorder, with the 33000.00 litres loaded.",
 ["The ullage at reorder, with the 32901.00 litres delivered after the transit loss.",
  "The usable tank litres, with the 33000.00 litres loaded.",
  "The dead stock, with the 32901.00 litres delivered."],
 "stationSizing checks the payload loaded against the 28125.00 litres of ullage at the reorder level and warns that a 33000 litre load cannot discharge into it. The lane delivers 32901.00 litres a trip after its transit loss, and the station's check does not use that figure.")

q(1, "Along the IBAFO chain, what does a blank box give at each link?",
 "A refusal, a none or a named gap, and never a silent zero.",
 ["A typical figure the engine keeps for the link, named in a note.",
  "A zero at every link, with the answer marked complete.",
  "A refusal at the first link, and nothing printed after it."],
 "A missing demand or nozzle count is refused. A farm with no daily throughput reads days of cover none. A blank fixed cost is taken as zero and named in assumedZero, a blank driver cost reads complete false with Driver named, and a blank truck capital cost reads a floor with Truck depreciation named.")

q(0, "The morning report asks which IBAFO tank is below its heel. Which row answers it?",
 "IB-T2, 164.700 m3 against a heel of 210.000 m3.",
 ["IB-T4, 1377.000 m3 against a heel of 85.000 m3.",
  "IB-T3, 3902.600 m3 against a heel of 150.000 m3.",
  "IB-T1, 5288.400 m3 against a heel of 210.000 m3."],
 "IB-T2's stock of 164.700 m3 is under its heel of 210.000 m3, and its pumpable stock prints 0.000 m3. The other three tanks hold more than their heels and print a pumpable stock above zero: IB-T1 5078.400 m3, IB-T3 3752.600 m3 and IB-T4 1292.000 m3.")

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
 "RATE_DISCLAIMER calls every rate a required input, and each line of IMPORT_TEMPLATE and PUMP_TEMPLATE ships its rate as none. The course invents each rate it uses, as it invented the throughput fee and the lane's costs in this tier.")

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
