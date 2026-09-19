import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Expert m02, Volume and Price Variance. Digest section 20 only, as the
# five lessons of m02 teach it: the match on material and type, the volume and
# price variance, money with no barrels (Forcados) and the unmatched lpg row.
# Every sign here is AS RECORDED; margin is module 3. 15 questions.

q(2, "attributeVariance lays the ODIOMA plan ledger beside the actual ledger. On what does it match a plan line to an actual line?",
 "Material and type together.",
 ["Material alone.",
  "Type alone.",
  "Material, type and the event date."],
 "A plan line and an actual line are the same line only when both the material and the type agree. Material alone would merge a receipt and a delivery of the same material, and type alone would merge four products that are all deliveries.")

q(0, "What volume variance does the escravos receipt line read?",
 "10651500.00",
 ["955500.00", "11607000.00", "-11607000.00"],
 "Volume variance = (actual quantity - plan quantity) x plan unit value. The escravos line moved 735000.00 bbl against a plan of 600000.00 bbl, a quantity gap of 135000.00 at 78.9000, and reads 10651500.00. 955500.00 is its price variance, 11607000.00 its total and -11607000.00 its margin effect.")

q(3, "Which figure is the diesel delivery line's price variance?",
 "-536800.00",
 ["-9054000.00", "-9590800.00", "168000.00"],
 "Diesel sold at an actual unit value of 98.4000 against a plan of 100.6000 on 244000.00 bbl, and the line reads a price variance of -536800.00. -9054000.00 is its volume variance, -9590800.00 its total, and 168000.00 is the fuel_oil line's price variance.")

q(1, "At which unit value does the volume variance price a line's quantity gap?",
 "The plan unit value, the plan line's value per barrel.",
 ["The actual unit value, so a dearer barrel in the month raises the volume variance.",
  "The mean of the plan and actual unit values, so neither ledger dominates.",
  "The configuration's capacity cost, 1.4000 a barrel on every line."],
 "Volume variance = (actual quantity - plan quantity) x plan unit value. Pricing the barrel gap at the plan's own price keeps the volume variance free of any price change, which is left to its own term.")

q(3, "In the price variance, (actual unit value - plan unit value) is multiplied by which quantity?",
 "The actual quantity.",
 ["The plan quantity.",
  "The quantity gap.",
  "The mean of the plan and actual quantities."],
 "Price variance = (actual unit value - plan unit value) x actual quantity. A price change matters only on barrels that actually moved, so the difference in unit value is taken on the actual quantity.")

q(0, "No Forcados (illustrative) barrels arrived in the month. What price variance does its line read, and why?",
 "0.00, because the actual quantity it is taken on is 0.00.",
 ["-30720000.00, the whole planned purchase at 76.8000.",
  "212000.00, the bill that arrived with no barrels.",
  "-400000.00, the quantity gap on the line."],
 "The price variance is taken on the actual quantity, and the actual quantity is 0.00, so it reads 0.00. -30720000.00 is the line's volume variance, 212000.00 its unexplained and -400000.00 its quantity gap in bbl.")

q(2, "Forcados (illustrative) recorded 0.00 bbl and an actual value of 212000.00. In which column of the variance line does that 212000.00 appear?",
 "The unexplained column.",
 ["The price variance.",
  "The volume variance column.",
  "No column; it is listed as unmatched."],
 "Unexplained = total - volume - price, and it is zero unless money moved with no barrels. On the Forcados line the volume variance is -30720000.00, the price variance 0.00 and the unexplained 212000.00, the money with no barrels shown on its own.")

q(1, "The engine defines unexplained = total - volume - price. When is that term anything but zero?",
 "When money moved with no barrels.",
 ["When the unit values differ.",
  "When a movement sits in one ledger and not the other.",
  "When an event was recorded with cost null."],
 "Seven of the eight ODIOMA lines read 0.00 unexplained. The Forcados line reads 212000.00 because a bill arrived with 0.00 bbl. A price difference goes to the price variance, and a movement in one ledger only is listed as unmatched.")

q(3, "The actual ledger holds an lpg delivery of 9000.00 bbl for 441000.00, and the plan sells no lpg. What does attributeVariance do with it?",
 "Lists it as unmatched and folds it into no variance line.",
 ["Adds it to the gasoline delivery line, the nearest light product.",
  "Puts its 441000.00 into the unexplained column of a delivery line.",
  "Refuses the actual ledger until a plan line for lpg is typed."],
 "Movements in one ledger and not the other are listed as unmatched and folded into no variance line. The row shows lpg, delivery, present in actual, 9000.00 bbl and 441000.00.")

q(0, "Why can the engine form neither a volume variance nor a price variance for the unmatched lpg row?",
 "The row has no plan line, so it has no plan unit value to price a gap or to compare a price against.",
 ["Its actual unit value is 0.0000, the figure the engine gives when no barrels arrived.",
  "Its quantity of 9000.00 bbl falls below the cargo size of 350000.00 bbl.",
  "A delivery line is revenue, and variance is formed on cost lines alone."],
 "Both formulas need a plan unit value: the volume variance prices the barrel gap at it and the price variance compares against it. With no plan line, any figure would rest on a price nobody planned.")

q(2, "Over the month, what did each barrel of Escravos (illustrative) cost, as its variance line reads the actual unit value?",
 "80.2000",
 ["78.9000", "76.8000", "74.0000"],
 "Actual unit value = actual value / actual quantity: 58947000.00 over 735000.00 bbl reads 80.2000, against a plan unit value of 78.9000. 76.8000 is the Forcados plan unit value.")

q(1, "The gasoline line reads a volume variance of -5606770.00 and a price variance of 179070.00. Read as recorded, what do the two signs say?",
 "Fewer barrels sold than planned, each at a better price than planned.",
 ["More barrels sold than planned, each at a lower price than planned.",
  "Fewer barrels sold than planned, each at a lower price than planned.",
  "The line lost money on both counts, since both terms reduce margin."],
 "Gasoline sold 112660.00 bbl against a plan of 163400.00 bbl, so the volume variance is negative. Its actual unit value of 112.0895 beats the plan's 110.5000, so the price variance is positive.")

q(0, "Which two product delivery lines read a negative price variance?",
 "jet and diesel",
 ["gasoline and fuel_oil", "diesel and fuel_oil", "gasoline and jet"],
 "Jet reads -80980.00 at 104.0998 against 104.9000, and diesel -536800.00 at 98.4000 against 100.6000. Gasoline reads 179070.00 and fuel_oil 168000.00, both sold above their plan prices.")

q(3, "What quantity gap does the reformer unit_run line read?",
 "-59000.00 bbl",
 ["-265000.00 bbl", "131000.00 bbl", "-182900.00 bbl"],
 "Quantity gap = actual quantity - plan quantity: 131000.00 against 190000.00 bbl reads -59000.00. -265000.00 is the crude unit's gap, 131000.00 the reformer's actual run, and -182900.00 is the reformer's volume variance in money.")

q(1, "The crude unit's actual run and the escravos receipt each read 735000.00 bbl. What does that pair show about the month?",
 "The only crude that arrived is the crude the unit ran.",
 ["The crude unit ran at its full capacity.",
  "The Forcados barrels were recorded as escravos.",
  "The cdu line's volume variance is zero."],
 "Forcados (illustrative) reads 0.00 bbl received. The escravos receipt reads 735000.00 bbl and the cdu ran 735000.00 bbl, against a plan of 1000000.00 bbl and a volume variance of -371000.00.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/advanced/rfa_m02.json', expect_n=15)
finish()
