import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Associate m03, The Product Slate. Written from digest.txt SECTION 4,
# which is the five lessons of this module: three configurations, value per
# barrel of crude, the loss is carried, an unpriced product is named, and yields
# that do not close.

q(3, "Which two units does a hydroskimming plant carry on top of crude distillation?",
 "A naphtha reformer and a diesel hydrotreater",
 ["A fluid catalytic cracker and a hydrotreater",
  "A naphtha reformer and a catalytic cracker",
  "A diesel hydrotreater alone, since the naphtha is sold as it comes"],
 "Topping is crude distillation alone. Hydroskimming adds a naphtha reformer and a diesel hydrotreater, and conversion adds a fluid catalytic cracker to those."),

q(1, "The hydroskimming yield row prints a dash under naphtha. What does the dash mean for its slate?",
 "The plant makes none, so the slate carries no naphtha row.",
 ["The naphtha yield is unknown, so it is named as unpriced.",
  "Naphtha is made and valued at zero, like the loss.",
  "The naphtha yield is folded into the loss column of 0.0200."],
 "A dash means the configuration makes none of that product. Topping sells naphtha at a yield of 0.1800 and no gasoline; hydroskimming and conversion sell gasoline and no naphtha, because the reformer takes it."),

q(2, "Read the fuelOil column of the yield table. What is the conversion plant's fuelOil yield?",
 "0.1400",
 ["0.3000", "0.3400", "0.3300"],
 "The fuelOil column reads 0.3400 for topping, 0.3000 for hydroskimming and 0.1400 for conversion. 0.3300 is conversion's diesel yield."),

q(0, "In the topping slate, diesel carries a yield of 0.3000 at a price of 101.0000. What value per barrel of crude does its row print?",
 "30.3000",
 ["32.3200", "33.3300", "101.0000"],
 "productSlate values each product at its yield times its price, per barrel of crude. 32.3200 and 33.3300 are diesel's rows in the hydroskimming and conversion slates, and 101.0000 is the price, a figure per barrel of diesel."),

q(2, "Which gross value per barrel of crude does the conversion slate print at OKORDIA's prices?",
 "90.6300",
 ["83.7900", "76.9400", "81.1900"],
 "Topping prints 76.9400, hydroskimming 83.7900 and conversion 90.6300. 81.1900 is the hydroskimming row typed with yields that total 0.9700."),

q(0, "How does productSlate treat the loss of 0.0200 that every configuration carries?",
 "As a yield with no value, so the row closes and nothing is added for it",
 ["As a cost line, subtracted from the gross margin per barrel",
  "It is dropped from the row, and the other yields are scaled up",
  "As a yield valued at the crude cost of 76.0000 a barrel"],
 "The loss sits in the yield row beside the products, so yields total 1.0000 and yields close true. It has no price, so nothing is added to the gross value for it."),

q(3, "The gross margin per barrel has no separate term for the loss. Where does the loss reach the margin?",
 "Inside the gross value, as a yield that adds nothing",
 ["In the variable operating cost on each barrel",
  "As a fourth term the margin subtracts after the variable cost",
  "Nowhere, since the loss is dropped once the yields are summed"],
 "productSlate carries the loss as a yield with no value, so it sits in the yield row and adds nothing to the gross value per barrel of crude. The gross margin per barrel is gross value less crude cost less variable operating cost, so the loss reaches the margin through the gross value and has no term of its own."),

q(1, "Topping is valued with the naphtha price left blank. What does productSlate return?",
 "Gross value 63.6200; unpriced: naphtha",
 ["A refusal naming naphtha, as a blank money box on the inputs is refused",
  "Gross value 76.9400; naphtha valued at its last typed price",
  "Gross value 63.6200; unpriced: none, since the row still closes"],
 "A blank product price is answered, with the product named on the unpriced list and adding nothing. In the full slate naphtha's row carries 13.3200 a barrel of crude."),

q(0, "Topping is valued with the naphtha price left blank and prints a gross value of 63.6200. What on the slate says a product is missing from that figure?",
 "The unpriced list, which names naphtha",
 ["A refusal beside the figure",
  "A gross value printed as null in its place",
  "Nothing; 63.6200 is the whole value"],
 "The engine prints gross value 63.6200; unpriced: naphtha. The unpriced product is named and adds nothing to the value. The figure is in the same unit and at the same precision as the full topping slate's 76.9400, so only the list shows that naphtha is missing."),

q(1, "The hydroskimming yields are typed so they total 0.9700. What does productSlate do with the row?",
 "Values it as typed, prints 81.1900 and sets yields close to false.",
 ["Scales every yield up so the row totals 1.0000, and prints 83.7900.",
  "Refuses the row by name until the yields total 1.0000 again.",
  "Adds the missing fraction to the loss and sets yields close to true."],
 "The engine reports the gap and does not normalise the yields. Normalising would spread the missing fraction across every product, a guess nobody made."),

q(3, "Compare OKORDIA's hydroskimming row with the typed row that totals 0.9700. Which typed yields differ?",
 "gasoline, diesel and fuelOil",
 ["lpg, kerosene and the loss row",
  "gasoline, kerosene and diesel",
  "diesel, fuelOil and the loss"],
 "The typed row reads gasoline 0.1900, diesel 0.3100 and fuelOil 0.2900 against 0.2000, 0.3200 and 0.3000. lpg 0.0300, kerosene 0.1300 and the loss 0.0200 are unchanged."),

q(2, "Which three check lines does the engine print under each slate?",
 "yields total, yields close, and the unpriced list",
 ["gross value, gross margin, unpriced list",
  "yields total, the loss, and the capital per bpd",
  "yields close, the loss, and the ratio flag"],
 "On all three configurations at OKORDIA's prices they read yields total 1.0000, yields close true, unpriced: none. Between them they say whether the gross value describes a complete, fully priced barrel."),

q(0, "The yield table carries three rows: topping, hydroskimming and conversion. What does each row describe?",
 "What one plant's units make of the same crude",
 ["One of three crudes run through one plant",
  "One crude's assay at three cut points",
  "Three supply scenarios for the same plant and crude"],
 "They are three plants running one crude. OKORDIA's crude costs 76.0000 a barrel whichever configuration is picked, and the yields describe what the units make of it."),

q(1, "In the hydroskimming slate, which product brings in the most per barrel of crude?",
 "diesel, at 32.3200",
 ["gasoline, the highest priced product, at 20.8000",
  "fuelOil, 16.5000",
  "kerosene, at 12.6100 on a price of 97.0000"],
 "The value column reads lpg 1.5600, gasoline 20.8000, kerosene 12.6100, diesel 32.3200 and fuelOil 16.5000. Gasoline has the highest price at 104.0000, but diesel's larger yield of 0.3200 gives the larger value."),

q(2, "Topping's fuelOil row reads 18.7000 a barrel of crude and conversion's 7.7000. What does the pair show?",
 "Conversion puts fewer of its barrels into fuel oil.",
 ["Conversion sells fuel oil at a lower price than topping does.",
  "Topping runs more crude through the plant each year.",
  "Conversion carries a larger loss inside its fuelOil value."],
 "Both slates price fuel oil at 55.0000. The value moves with the yield: 0.3400 for topping and 0.1400 for conversion, where the cracker turns heavy material into lighter products."),

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/beginner/rfb_m03.json', label='rfb_m03', expect_n=15)
finish()
