import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, ASSOCIATE m02 "Enabling Conditions and Conditional Modifiers".
# Digest sections drawn on: 4 (the ORONI scenario, its enabling condition, its
# two conditional modifiers and the products the engine returns) and 5 (the
# same row with one term left out, and what the frequency becomes).

q(2,
  "In this engine's vocabulary, what is an enabling condition?",
  "A state that must hold for the initiating event to lead anywhere, such as the separator being on the high pressure manifold.",
  ["A protective layer that acts after the initiating event, entered with its own figure and independence flag.",
   "A probability that the consequence follows once the initiating event has happened and the plant was in the state.",
   "A frequency per year that the enabling equipment fails."],
  "The course defines an enabling condition as a state that must hold for the initiating event to lead anywhere, and gives the separator on the high pressure manifold as the one on this row. A probability that the consequence follows once the event has happened is a conditional modifier. A protective layer is an IPL and carries its own flags. An enabling condition is a probability and never a frequency.")

q(0,
  "What does a conditional modifier describe?",
  "The probability that the consequence follows once the initiating event has occurred and the enabling conditions hold.",
  ["The fraction of the year the plant spends in the configuration that lets the initiating event propagate to this row's consequence at all.",
   "The probability that a credited protective layer fails to act when this particular scenario calls upon it to act.",
   "The frequency per year at which the consequence is tolerated."],
  "Ignition and somebody in the blast zone are conditional modifiers: each is a probability that the consequence follows once the event has happened. The fraction of time in a configuration is how an enabling condition is defended. A layer failing on demand is an IPL PFD. The tolerated frequency is the TMEL, which is no factor in the product at all.")

q(3,
  "The engine multiplies enabling conditions and conditional modifiers into the same product. Why does it still keep them in two lists?",
  "So that the worksheet shows which factor is which, because the difference lies in how the analyst justifies each kind.",
  ["Because the enabling conditions are applied to the initiating event frequency and the conditional modifiers are applied afterwards to the credited layers on the row.",
   "Because a conditional modifier is allowed above one and an enabling condition is held to a probability, so the two lists carry different admissible ranges.",
   "Because only the conditional modifiers are named, and an enabling condition is entered as a bare figure with no name beside it on the worksheet."],
  "The course says the engine treats both the same way, as factors in one product, and that the difference is in how the analyst justifies them, so the engine keeps them in two lists to show which is which. Both are applied at the same place in the product, both are held to a probability above 0 and no more than 1, and every entry of either kind needs a name.")

q(1,
  "ORONI's enabling condition is the separator being on the high pressure manifold. What is its stated probability and what does the engine report as `enablingProduct`?",
  "0.3 stated, and `enablingProduct` reads 0.300000000000.",
  ["0.3 stated, and `enablingProduct` reads 0.045000000000 once the condition has been combined with the other factors on the row.",
   "0.5 stated, and `enablingProduct` reads 0.100000000000, which is the figure the engine prints for the enabling side of this particular row.",
   "0.1 stated, and `enablingProduct` reads 0.100000000000."],
  "The scenario table states the separator on the high pressure manifold at 0.3, and the engine key `enablingProduct` reads 0.300000000000. With one condition on the row the product is that condition itself. 0.5 is the stated ignition modifier and 0.100000000000 is `modifierProduct`, which is the other list.")

q(2,
  "Which two conditional modifiers does the ORONI row carry, and at what stated probabilities?",
  "Ignition at 0.5 and operator in the blast zone at 0.2.",
  ["Ignition at 0.5 and the separator on the high pressure manifold at 0.3, which are the two factors the engine holds in the modifier list for this row.",
   "Operator in the blast zone at 0.2 and the level control valve failing open at 0.45, both of them read by the engine as probabilities for the row.",
   "Ignition at 0.2 and operator in the blast zone at 0.5."],
  "The scenario table states ignition at 0.5 and operator in the blast zone at 0.2. The separator on the high pressure manifold at 0.3 is the enabling condition and sits in the other list, and the level control valve failing open at 0.45 per year is the initiating event frequency, which is a frequency and no modifier.")

q(0,
  "Which figure does the engine report under the key `modifierProduct` for this row?",
  "0.100000000000, from the two factors in that list.",
  ["0.300000000000, which is the separator configuration figure carried into this key as well because it multiplies at the same place.",
   "0.013500000000 per year, which is where both products together carry the initiating event frequency on this row.",
   "0.7, the two figures added."],
  "The engine key `modifierProduct` reads 0.100000000000, which is ignition at 0.5 multiplied by operator in the blast zone at 0.2. The separator on the high pressure manifold at 0.3 is reported under `enablingProduct` as 0.300000000000, and 0.013500000000 per year is `unmitigatedFrequencyPerYr`, further down the chain. Factors on a LOPA row are multiplied and never added.")

q(3,
  "Starting from an initiating event frequency of 0.45 per year, what is `unmitigatedFrequencyPerYr` on this row and what has been applied to reach it?",
  "0.013500000000 per year, after the enabling product of 0.300000000000 and the modifier product of 0.100000000000.",
  ["0.013500000000 per year, after the enabling product, the modifier product and also the product of the IPL PFDs that the row has already credited.",
   "0.000013500000 per year, after both products and the tolerable frequency for the row.",
   "0.045000000000 per year, after the modifier product alone."],
  "The engine keys give `unmitigatedFrequencyPerYr` as 0.013500000000 per year, which is 0.45 per year carried by 0.300000000000 and then by 0.100000000000. The word unmitigated means unmitigated by protection layers, so no IPL PFD has been applied yet. 0.000013500000 per year is the mitigated frequency once the credited layers are in, and 0.045000000000 per year is the row with its enabling condition left out.")

q(1,
  "The engine's method string sets out the order of the product. Which order does it give?",
  "The initiating event frequency, then the product of the enabling conditions, then the product of the conditional modifiers, then the credited layers.",
  ["The initiating event frequency, then the tolerable frequency, then the enabling conditions and last the modifiers.",
   "The product of the enabling conditions, then the credited layers, then the initiating event frequency.",
   "The credited layers first, then the initiating event frequency."],
  "The method string is the engine's own words: CCPS (2001) Layer of Protection Analysis: f = IEF x prod(enabling) x prod(conditional modifiers) x prod(PFD of credited IPLs); RRF = f / TMEL; required PFDavg = TMEL / f; SIL band low demand per IEC 61511-1. The tolerable frequency divides that result to give the RRF and is no factor inside the product.")

q(2,
  "The ORONI row is run again with its enabling condition left off. What does the unmitigated frequency become?",
  "0.045000000000 per year on the enabling condition row.",
  ["0.013500000000 per year, because the enabling condition of 0.3 is a state of the plant with no probability attached, so leaving it off the row changes nothing in the product.",
   "0.027000000000 per year, because dropping the condition removes one factor from a product the engine has already formed.",
   "0.135000000000 per year."],
  "The table of the same row with one term left out gives 0.045000000000 per year for the enabling condition left out. The full row is 0.013500000000 per year, so nothing unchanged is right. 0.135000000000 per year is the row with every modifier left out, which is a different omission.")

q(0,
  "Which single omission takes this row's unmitigated frequency to 0.027000000000 per year?",
  "Ignition left out.",
  ["The enabling condition left out, which is the largest single factor the row carries and so the omission with the largest effect on the frequency.",
   "The blast zone modifier left out, which removes the occupancy claim and leaves the ignition modifier in place on the row.",
   "Every modifier left out at once."],
  "The table gives ignition left out at 0.027000000000 per year. The enabling condition left out gives 0.045000000000 per year, the blast zone modifier left out gives 0.067500000000 per year, and every modifier left out gives 0.135000000000 per year.")

q(1,
  "The blast zone modifier is dropped from the row and nothing else changes. Which frequency does the engine report, and what is the derived figure over the full row?",
  "0.067500000000 per year, derived 5.000000 over the full row.",
  ["0.067500000000 per year, derived 2.000000 over the full row, which is the figure the course shows beside that omission in its own table.",
   "0.027000000000 per year, derived 5.000000 over the full row, because the modifier dropped is the larger of the two the row carries in its list.",
   "0.013500000000 per year, derived 1.000000 over the full row."],
  "The table prints the blast zone modifier left out at 0.067500000000 per year with a derived 5.000000 over the full row, which is the reciprocal of the 0.2 that was dropped. The derived 2.000000 belongs to ignition left out at 0.027000000000 per year, and 1.000000 is the row with nothing left out at 0.013500000000 per year.")

q(3,
  "Every conditional modifier is left off the row at once. Where does the unmitigated frequency land, and by what derived factor?",
  "10.000000, reaching 0.135000000000 per year.",
  ["3.333333, reaching 0.135000000000 per year, which is the pair of figures the course shows against this omission in its table of five rows.",
   "10.000000, reaching 0.045000000000 per year, because between them the two modifiers carry a whole decade of the product this row forms.",
   "10.000000, reaching 0.067500000000 per year."],
  "Every modifier left out gives 0.135000000000 per year with a derived 10.000000, which is the reciprocal of 0.5 times 0.2. The derived 3.333333 belongs to the enabling condition left out at 0.045000000000 per year, and 0.067500000000 per year is the blast zone modifier left out on its own.")

q(2,
  "What derived figure does the course print beside the enabling condition left out, and what does it mean?",
  "3.333333, the factor by which the frequency rises over the full row when that one condition is dropped.",
  ["3.333333, the factor by which the required risk reduction factor falls when the enabling condition is dropped from the product the engine forms.",
   "0.300000000000, the enabling product printed again in the derived column.",
   "1.000000, because the derived column always reads one for a single omission."],
  "The table's derived column is the frequency over the full row, and the enabling condition left out reads 3.333333 there against 0.045000000000 per year. A larger frequency demands more risk reduction and never less. 0.300000000000 is `enablingProduct` and belongs to a different column, and 1.000000 is the row with nothing left out.")

q(0,
  "Why does the course say a forgotten factor is never harmless?",
  "Because leaving out a real enabling condition overstates the frequency and the reduction demanded, and typing one the analyst cannot justify understates it.",
  ["Because the engine always errs high when a factor is missing, so the row is left conservative and the only cost of the omission is money.",
   "Because a missing factor is caught by the engine, which refuses the row and names the field the analyst failed to fill in on it.",
   "Because the engine recomputes the row with a default factor in place."],
  "The course says a forgotten factor is never harmless in the direction of safety or of cost, and it gives both directions: leaving out a real enabling condition overstates the frequency and so the risk reduction demanded, and typing a factor the analyst cannot justify understates it. The engine has no way to know a factor is missing, so it refuses nothing and defaults nothing.")

q(1,
  "Why does the engine keep the name the analyst gave to each factor on the row?",
  "Because every factor has to be defended in writing, and the name is what a reviewer argues with alongside the figure.",
  ["Because the engine looks the factor up by name in its own table of generic enabling conditions and conditional modifiers before it applies the figure.",
   "Because the credit rule compares factor names against the credited layers.",
   "Because a factor with no name is silently dropped from the product."],
  "The course closes the forgotten factor lesson with the reason: every factor on the row has to be defended in writing, which is why the engine keeps each one with its name. The engine holds no table to look a factor up in, the duplicate check on names belongs to the IPL list, and an entry with no name is refused and never dropped in silence.")

emit(Q, '/root/hse-wip-lopa/banks/h3b_m02.json', expect_n=15)
finish()
