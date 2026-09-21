import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Professional m04, throughput economics.
# Draws on m04's four lessons only: digest SECTION 13. Money is in US dollars.
# The fee, the variable cost and the fixed cost are INVENTED for this course,
# and the 850 kg CO2e a tonne factor is SYNTHETIC; every stem that uses one says
# so. Every figure is a string the digest prints.

q(1, "IBAFO's invented period inputs are a throughput of 2640.000 m3 at an invented fee of 7.80 USD/m3. Which figure is the period's revenue?",
 "20592.00 USD",
 ["4988.00 USD",
  "14388.00 USD",
  "9400.00 USD"],
 "Revenue = throughput x fee, 20592.00 USD. 4988.00 USD is the margin after the invented variable and fixed costs, 14388.00 USD the margin with the fixed cost left blank, and 9400.00 USD the invented fixed cost itself.")

q(3, "IBAFO's invented fixed cost goes untyped for the period. Which line does throughputEconomics print?",
 "margin 14388.00 USD; assumedZero: fixed cost",
 ["margin 14388.00 USD; assumedZero: none",
  "margin 4988.00 USD; assumedZero: fixed cost",
  "REFUSED: Throughput and the throughput fee are both needed for the money answer."],
 "A blank cost is taken as zero and named. The margin rises to 14388.00 USD, and assumedZero says which zero the engine assumed. A margin quoted from that row without its assumedZero line is a margin with the fixed cost silently left out.")

q(0, "An operator forgets to type IBAFO's invented throughput fee. Which answer comes back?",
 "REFUSED: Throughput and the throughput fee are both needed for the money answer.",
 ["margin 4988.00 USD with the fee named in assumedZero.",
  "revenue none and margin none, with the carbon side computed.",
  "margin 14388.00 USD, since the fee is read as the fixed cost."],
 "The money answer needs the throughput and the fee, and a blank in either is refused. Only a blank cost or loss is taken as zero and named in assumedZero.")

q(2, "Which two inputs does throughputEconomics need for its money answer, refusing the call when either is blank?",
 "The throughput and the fee.",
 ["The fee and the fixed cost, the two money inputs of the period.",
  "The throughput and the density, since the loss needs both.",
  "The emission factor and the density, since carbon needs both."],
 "The refusal names the throughput and the throughput fee. A blank cost or loss is taken as zero and named; a missing density or emission factor leaves the carbon side as none while the money side prints.")

q(1, "IBAFO's invented revenue is 20592.00 USD and its margin 4988.00 USD. What does throughputEconomics take off the revenue to reach the margin?",
 "The variable cost on the throughput and the fixed cost.",
 ["The variable cost on the throughput, and nothing else.",
  "The fixed cost of 9400.00 USD, and nothing else.",
  "The fixed cost and the period's loss priced at the fee."],
 "Margin = revenue - throughput x variable cost - fixed cost, with the invented variable cost of 2.35 USD/m3 and fixed cost of 9400.00 USD. With the fixed cost blank the margin reads 14388.00 USD. The margin formula has no loss in it; the loss is weighed in tonnes for the carbon side.")

q(3, "IBAFO's period loss of petrol, at a density of 745.2 kg/m3, weighs 3.4279 tonnes. Why is there a division by 1000?",
 "It turns kilograms into tonnes.",
 ["It converts m3 to litres.",
  "It turns the density into a VCF.",
  "It spreads the loss over a thousand m3 of throughput."],
 "Loss tonnes = loss m3 x density / 1000. Cubic metres times kilograms per cubic metre gives kilograms, and the division turns them into tonnes. Nothing else enters.")

q(2, "Density is missing from the IBAFO period. Which note explains the gap in the carbon columns?",
 "No product density supplied, so the loss has no weight and the carbon side is not computed.",
 ["No emission factor supplied, so the carbon side is not computed. Factors are published, versioned data; an invented one would be worse than none.",
  "No diesel emission factor supplied, so the carbon figure is absent rather than zero.",
  "REFUSED: Density is required to convert between mass and volume; it is not assumed."],
 "throughputEconomics does not refuse the call; it prints the money side and names why the carbon side is missing. The refusal about mass and volume belongs to cargoQuantities, and the diesel note to the truck lane.")

q(0, "With the density blank, which IBAFO figures read none?",
 "Loss tonnes, emissions and the intensity.",
 ["Emissions and the intensity only; loss tonnes still print 3.4279.",
  "Margin, loss tonnes and emissions, since the call is incomplete.",
  "Revenue and margin."],
 "With no density the loss has no weight, so every figure built on it reads none: loss tonnes, emissions and kg CO2e per tonne of throughput. The money columns still print 20592.00 USD and 4988.00 USD.")

q(3, "The IBAFO call is run with no emission factor and the density typed. What does loss tonnes read?",
 "3.4279",
 ["none",
  "1.481061",
  "2913.7320"],
 "Without a factor the loss still has a weight, 3.4279 tonnes; only the emissions and the intensity read none. 1.481061 is the intensity per tonne of throughput and 2913.7320 the emissions in kg CO2e with the synthetic factor.")

q(1, "What is the 850 kg CO2e a tonne factor used in the IBAFO carbon ledger?",
 "A synthetic factor invented for the course.",
 ["The engine's shipped default for petrol.",
  "A published factor for petrol, quoted here for the arithmetic.",
  "The PRODUCT_REFERENCE value the engine reads when none is typed."],
 "The engine ships no emission factor. The course labels 850 kg CO2e a tonne SYNTHETIC, invented for this course and not a published figure. It exists only to show the arithmetic.")

q(0, "With the synthetic 850 kg CO2e a tonne factor, IBAFO prints 1.481061 kg CO2e per tonne of throughput. What is that figure?",
 "The emissions spread over the period's throughput weighed in tonnes.",
 ["The emissions spread over the loss tonnes of 3.4279.",
  "The emissions spread over the throughput in m3.",
  "The emissions spread over the margin in US dollars."],
 "It is an intensity: 2913.7320 kg CO2e over the period's throughput in tonnes, so a period can be compared with another at a different volume. It inherits the synthetic factor and is quoted only with the factor beside it.")

q(2, "Why does the engine ship no emission factor?",
 "Factors are published, versioned data; an invented one would be worse than none.",
 ["Emissions are the Economics courses' ledger, which the depot engine leaves alone.",
  "A factor needs the density first, and the density is never typed.",
  "The throughput fee already carries the cost of carbon in its rate."],
 "The engine's own note gives the reason: \"Factors are published, versioned data; an invented one would be worse than none.\" The engine computes emissions from a factor the caller supplies, and IBAFO types its density, 745.2 kg/m3.")

q(3, "Between the IBAFO case with factor and density supplied and the case with no density, which column changes?",
 "Loss tonnes, from 3.4279 to none.",
 ["Margin, from 4988.00 USD to none.",
  "Revenue, from 20592.00 USD to none.",
  "Margin per m3, from 1.89 USD to none, as the loss is not weighed."],
 "The money columns are identical in all three cases, because revenue and margin need the throughput, the fee and the costs, and none needs a density. The carbon columns fail from the first link that has no input onward.")

q(0, "A report stretches IBAFO's margin of 4988.00 USD into a value for the depot. What is the margin, by the engine's formula?",
 "Revenue less costs for one period, with no discounting in it.",
 ["A valuation once the invented fixed cost is spread over the depot's life.",
  "A present value, since the fee is paid within the period.",
  "The depot's IRR once divided by the throughput."],
 "Margin = revenue - throughput x variable cost - fixed cost, and the fixed cost is for the period. Nothing in the formula discounts, and no rate of return is formed; this course computes no NPV or IRR.")

q(1, "The pricing module's PRODUCT_REFERENCE lists a typical petrol density. With the density box blank, does throughputEconomics use it?",
 "No. The loss gets no weight.",
 ["Yes. It weighs the loss at the typical density and names it in assumedZero.",
  "Yes. It weighs the loss at the typical density, as the loss rows print.",
  "No. It refuses the whole call until a density is typed."],
 "Nothing in the module reads PRODUCT_REFERENCE unless a caller passes a figure in. IBAFO's typed density is 745.2 kg/m3, from the product actually lost. With the box blank the engine gives the loss no weight and still prints the margin.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/intermediate/tdsi_m04.json', label='tdsi_m04', expect_n=15)
finish()
