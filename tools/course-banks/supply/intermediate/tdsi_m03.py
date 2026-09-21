import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Professional m03, the tank farm.
# Draws on m03's four lessons only: digest SECTION 12, the IBAFO tank farm read
# by tankFarmCover. Every volume is in m3 as the digest prints it, and every
# figure is a string the digest prints.

q(2, "What is a tank's heel in the IBAFO farm?",
 "Each tank's own volume below which none of its stock is pumpable.",
 ["A figure the engine takes from PRODUCT_REFERENCE for each product.",
  "The free water below the product, which the dip less the water height removes.",
  "The room left above the stock, which a receipt must fit into."],
 "tankFarmCover counts each tank's pumpable stock as its stock above its own heel, never below zero, and working capacity is capacity less heel. Each tank carries its own heel: IB-T4 85.000 m3 and IB-T3 150.000 m3. PRODUCT_REFERENCE carries typical densities, free water is taken off at the dip, and capacity less stock is the ullage.")

q(0, "tankFarmCover divides by one farm figure to get turns a year. Which one?",
 "The working capacity, 21845.000 m3.",
 ["The capacity, 22500.000 m3.",
  "The ullage, 11767.300 m3.",
  "The pumpable stock, 10123.000 m3."],
 "Turns a year = daily throughput x 365 / working capacity, and working capacity is capacity less heel: the farm table prints 22500.000 m3, 655.000 m3 and 21845.000 m3.")

q(3, "IB-T2 holds 164.700 m3 of petrol against a heel of 210.000 m3. What pumpable stock does the engine give it?",
 "0.000 m3",
 ["164.700 m3",
  "210.000 m3",
  "7335.300 m3"],
 "Pumpable stock is counted above each tank's own heel and floored at zero. IB-T2's 164.700 m3 sits under 210.000 m3, so the row reads 0.000 m3; 7335.300 m3 is its ullage.")

q(1, "Which figure does tankFarmCover report as the IBAFO farm's pumpable stock?",
 "10123.000 m3",
 ["10077.700 m3",
  "10732.700 m3",
  "21845.000 m3"],
 "10123.000 m3 is the sum of each tank's stock above its own heel. 10077.700 m3 is the farm's stock less the farm's heel in one step, 10732.700 m3 the stock with no heel taken off, and 21845.000 m3 the working capacity.")

q(1, "The course prints the farm's stock less the farm's heel as 10077.700 m3 and says it is not pumpable stock. What is wrong with it?",
 "It fills IB-T2's heel shortfall with product from the other tanks.",
 ["It counts IB-T2's 164.700 m3 as pumpable, since the whole stock is netted in one step.",
  "It takes the heel off twice, once per tank and once again for the farm.",
  "It leaves the heel of IB-T4 out, since kerosene is netted apart from petrol."],
 "Netting across the farm lets IB-T2's missing heel volume be made good from other tanks' product. In the course's words, \"no pump lends one tank's volume to another's heel\". Counted tank by tank the pumpable stock is 10123.000 m3.")

q(0, "The IBAFO farm prints 3.8345 days of cover. Which two figures does the engine divide to get it?",
 "Pumpable stock 10123.000 m3 by daily throughput 2640.000 m3.",
 ["Stock 10732.700 m3 by daily throughput 2640.000 m3.",
  "Working capacity 21845.000 m3 by daily throughput 2640.000 m3.",
  "Pumpable stock 10123.000 m3 by the rack's 216 trucks a day."],
 "Days of cover = pumpable stock / daily throughput. The numerator is the tank-by-tank figure, so a cover built on the raw stock or the netted stock would count product that cannot all be lifted. The throughput is the depot's liftings in m3, supplied by the caller.")

q(3, "tankFarmCover is called on the IBAFO tanks with no daily throughput. What does it give?",
 "Days of cover none and turns a year none.",
 ["Days of cover none, and turns a year 44.1108 from the working capacity alone.",
  "Days of cover worked from the rack's count of 216 trucks a day.",
  "REFUSED: Throughput and the throughput fee are both needed for the money answer."],
 "Both figures divide or multiply by the daily throughput, and the engine does not infer it. With no throughput it gives none for both. The sentence about the throughput fee belongs to throughputEconomics, a different call.")

q(2, "IB-T1 and IB-T2 both hold petrol. How much petrol can the pumps lift at IBAFO this morning?",
 "5078.400 m3, IB-T1's pumpable stock.",
 ["5288.400 m3, IB-T1's stock.",
  "10123.000 m3, the farm's pumpable stock.",
  "3752.600 m3, IB-T3's pumpable."],
 "IB-T2 is below its heel and adds nothing until it is filled above it, so the liftable petrol is IB-T1's 5078.400 m3. The farm's pumpable stock pools petrol, gas oil and kerosene, and IB-T3 holds gas oil.")

q(2, "What ullage does tankFarmCover print for IB-T3, the farm's gas oil tank?",
 "1097.400 m3",
 ["11767.300 m3",
  "7335.300 m3",
  "3752.600 m3"],
 "IB-T3's row prints 1097.400 m3 of ullage, its capacity less its stock. 11767.300 m3 is the farm's ullage summed over the tanks, 7335.300 m3 is IB-T2's ullage and 3752.600 m3 is IB-T3's pumpable stock.")

q(0, "IB-T2 reads an ullage of 7335.300 m3 and a pumpable stock of 0.000 m3. What does that pair say?",
 "The tank ready to receive is the one that cannot yet deliver.",
 ["The tank is empty and can be taken out of the farm's capacity.",
  "The farm's ullage is overstated by the same volume.",
  "The tank's stock has been counted twice."],
 "Ullage is capacity less stock, never below zero; pumpable stock is stock above heel, never below zero. IB-T2 holds 164.700 m3, below its 210.000 m3 heel, and it has room for a receipt. It is a tank waiting for a receipt.")

q(3, "IB-T2 holds 164.700 m3 in a 7500.000 m3 tank. How does its ullage of 7335.300 m3 enter the farm's 11767.300 m3?",
 "As IB-T2's capacity less its stock, summed with the other tanks.",
 ["It is left out, since IB-T2 sits below its heel.",
  "It enters less IB-T2's heel of 210.000 m3.",
  "It enters as IB-T2's capacity less its heel."],
 "IB-T2's row prints capacity 7500.000 m3, stock 164.700 m3 and ullage 7335.300 m3, and the course counts the farm's ullage as each tank's capacity less its stock, never below zero, summed over the tanks. The heel appears in no part of that count.")

q(1, "IBAFO's days of cover of 3.8345 is pumpable stock over daily throughput. Which quantity has no place in that formula?",
 "A receipt due into the farm.",
 ["The heel of each tank, through the pumpable stock.",
  "The daily liftings of 2640.000 m3.",
  "The stock of each tank above its heel."],
 "Days of cover = pumpable stock / daily throughput, and the daily throughput is the liftings, 2640.000 m3. Pumpable stock is each tank's stock above its own heel, so the heel and the stock both enter it. No receipt enters the formula.")

q(2, "Why can the farm's days of cover not tell a manager how long the petrol alone will last?",
 "It pools petrol, gas oil and kerosene against all liftings together.",
 ["It uses the netted stock of 10077.700 m3, which mixes products across heels.",
  "It is printed to four decimals, and a product cover needs a finer precision.",
  "It leaves out IB-T2, which holds petrol, so petrol is understated."],
 "The farm figure divides all three products' pumpable stock by all liftings. A depot can run short of petrol while it still holds plenty of gas oil. A product's cover needs that product's tanks and that product's liftings.")

q(0, "Where does the daily throughput of 2640.000 m3 in the farm's cover and turns come from?",
 "The caller supplies it as the depot's liftings.",
 ["The engine works it out from the rack's 216 trucks a day.",
  "The engine takes it from the farm's working capacity.",
  "The engine sets it from the farm's ullage."],
 "The farm table labels it daily throughput (liftings), and with no daily throughput the engine gives days of cover none and turns a year none, so the engine does not infer it. The rack prints trucks a day and no volume.")

q(3, "The IBAFO farm's volumes print to three decimals of a cubic metre. How does tankFarmCover treat each tank's stock?",
 "As the depot's recorded stock, taken as given.",
 ["As a gross volume it corrects to standard with the farm's VCF.",
  "As a dip read through its strapping table.",
  "As a standard volume it converts back to gross before netting heels."],
 "The farm model does not correct a stock to standard; that is the Associate tier's work at AKODO. Read every IBAFO volume as the depot's recorded stock, and do not add a gross figure from one source to a standard figure from another.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/intermediate/tdsi_m03.json', label='tdsi_m03', expect_n=15)
finish()
