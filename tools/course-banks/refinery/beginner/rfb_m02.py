import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Associate m02, Capital and the Scaling Law. Written from digest.txt
# SECTION 3 and held item H1 as the lessons state it, which are the five lessons
# of this module: cost from a reference point, six tenths and nine tenths, the
# crossover at the reference size, cost per barrel of capacity, and the
# exponents are held.

q(1, "OKORDIA's quotation is 64000000.00 for a 5000 bpd plant. Why does each scaling law return exactly 64000000.00 at 5000 bpd?",
 "The capacity ratio is 1 there, and 1 raised to any exponent is 1.",
 ["The engine snaps both laws to the quotation by tolerance.",
  "Both exponents are reset to 1 at the reference size.",
  "The stick-built figure is copied across into the modular column there."],
 "scaleCapex computes cost = reference cost x (capacity / reference capacity) ^ exponent. At 5000 bpd the bracket is 1, so both laws return the quotation itself, and the ratio column reads 1.0000."),

q(3, "scaleCapex is called at 20000 bpd with no exponent passed. What does it return?",
 "A cost of 222860944.20, reporting exponent 0.9",
 ["A cost of 147033389.44, reporting exponent 0.6 as the stick-built default",
  "null for the cost, because an exponent is a required input to the law",
  "A cost of 128000000.00 with an exponent of 1"],
 "scaleCapex defaults to the modular exponent when none is passed. 147033389.44 is the stick-built law at 20000 bpd, and 128000000.00 is the exponent of 1 figure at 10000 bpd."),

q(0, "Read the 10000 bpd row of scaleComparison. What cost does the stick-built law print there?",
 "97005860.26",
 ["119428222.92",
  "64000000.00",
  "42224253.14"],
 "At 10000 bpd the stick-built law (0.6) prints 97005860.26 and the modular law (0.9) prints 119428222.92. 64000000.00 is the quotation itself at 5000 bpd, and 42224253.14 is the stick-built law at 2500 bpd."),

q(2, "What do the ratio and the modular cheaper flag read at 2500 bpd?",
 "A ratio of 0.8123, and modular cheaper true",
 ["A ratio of 1.2311, and modular cheaper false",
  "A ratio of 0.6170, modular cheaper true",
  "A ratio of 0.8123, and modular cheaper false, since both laws equal"],
 "The ratio is the modular cost over the stick-built cost. At 2500 bpd it reads 0.8123 and modular cheaper reads true. 0.6170 is the 1000 bpd row and 1.2311 the 10000 bpd row."),

q(0, "At 5000 bpd the modular cheaper flag reads false. What does the table say about the two laws at that size?",
 "Neither is cheaper: the two laws equal flag reads true.",
 ["The stick-built law is cheaper there, since modular cheaper reads false.",
  "The modular law is dearer there by its ratio of 1.0000.",
  "Both flags read false, so the comparison is undecided."],
 "At the reference size both laws return 64000000.00, the ratio reads 1.0000 and the two laws equal flag reads true. Reading modular cheaper false as a win for stick-built is the mistake the lesson names."),

q(1, "At 30000 bpd, which law gives the lower capital, and what does it print?",
 "The stick-built law, at 187529987.30",
 ["The modular law, at 321008180.00",
  "The modular law, at 187529987.30, with its per bpd of 6251.00",
  "The stick-built law, at 321008180.00, with its per bpd of 10700.27"],
 "Above the reference size the law with the stronger economy of scale, 0.6, gives the lower cost: 187529987.30 stick-built against 321008180.00 modular, a ratio of 1.7118."),

q(3, "Scaled with an exponent of 1 to 10000 bpd, the quotation gives 128000000.00 and 12800.00 per bpd. Why does the per bpd figure equal the reference row's?",
 "An exponent of 1 carries no economy of scale, so each bpd costs what it did at 5000 bpd.",
 ["The engine holds per bpd fixed at its reference value on every law.",
  "Doubling capacity doubles the exponent, cancelling the capacity ratio.",
  "The per bpd column is copied from the 5000 bpd row when the ratio is blank."],
 "Cost in proportion to capacity means every barrel a day costs 12800.00, the reference row's figure, whatever the size. Both real laws print per bpd figures that change with capacity."),

q(2, "Down the scaleComparison table, what does the screen check about capital per bpd and total capital as capacity rises?",
 "Per bpd falls at every step and total rises at every step, true under both laws.",
 ["Per bpd falls under stick-built only; modular per bpd holds at 12800.00.",
  "Per bpd rises at every step and total rises at every step, under both laws.",
  "Total rises under the modular law only, and per bpd goes unchecked."],
 "The digest prints: capital per bpd falls at every step as capacity rises, modular true, stick-built true; total capital rises at every step, modular true, stick-built true. The plant costs more and each bpd of it costs less."),

q(0, "Which exponent carries the stronger economy of scale, and where does that give it the lower cost?",
 "0.6, above the reference size of 5000 bpd",
 ["0.9, above the reference size of 5000 bpd",
  "0.6, below the reference size of 5000 bpd",
  "0.9, at every size from 1000 to 30000"],
 "The lower the exponent, the more slowly cost grows with size, so 0.6 is the strong economy of scale. Above 5000 bpd it gives the lower cost; below, the same property runs the other way and 0.9 is cheaper, for example 15035122.47 against 24366770.42 at 1000 bpd."),

q(3, "The crossover in scaleComparison sits at 5000 bpd. Which change would move it?",
 "Anchoring the laws to a quotation at another size",
 ["Changing the modular exponent while keeping the anchor at 5000 bpd",
  "Switching the configuration to conversion",
  "Choosing tight supply for the crude the plant runs"],
 "Both curves are drawn through one quotation, so they cross at that quotation and nowhere else. Changing an exponent moves the curves apart on either side, and the crossover stays at 5000 bpd."),

q(1, "What does the course hold about the exponents 0.6 and 0.9 as held item H1?",
 "They are defaults for a vendor's own figures to replace.",
 ["They are published industry constants that the engine cites.",
  "They are fixed in the engine and cannot be overridden by a user.",
  "They are graded values the capstone asks a learner to compute with."],
 "H1 says the scaling exponents 0.6 and 0.9 are defaults for a vendor's own figures to replace, and no published source for them is in the engines repository. The engine names them as overridable parameters."),

q(2, "What would best replace the default exponent for a modular plant being screened at 20000 bpd?",
 "A vendor quotation at a second size for the same kind of plant",
 ["A third exponent of 1, which removes the economy of scale",
  "The stick-built exponent of 0.6 applied in place of the modular",
  "A ratio of 1.5157 read off the table and applied to the quotation"],
 "With quotations at two sizes the exponent stops being an assumption and becomes something the quotations imply. A quotation near the size screened is worth more than any exponent."),

q(0, "At 10000 bpd the modular law prints 11942.82 per bpd and the stick-built law 9700.59. What is the gap between them?",
 "The gap between two exponents applied to one quotation",
 ["An economy of scale measured across two real plants",
  "The gap between nameplate and annual throughput",
  "A second vendor quotation set against the first"],
 "Both figures come from the one 64000000.00 quotation for 5000 bpd. The gap is the gap between 0.9 and 0.6, and that gap is an assumption."),

q(2, "OKORDIA's screen prints a capital per bpd of 12800.00. What is that a cost per?",
 "Barrel a day of capacity at nameplate",
 ["Barrel of crude refined over a whole year",
  "Barrel of product sold in the first year",
  "Barrel of throughput at the plant's utilisation on each on-stream day"],
 "Capacity is what the plant was built for and throughput is what it does. Capital per bpd divides by capacity, 5000 bpd, and leaves the throughput out."),

q(1, "The exponent on the screen is changed from its default. Which of OKORDIA's outputs move?",
 "The capital figures, and nothing else",
 ["The capital and the gross margin per barrel together",
  "The capital, the annual throughput and the product slate",
  "Only the gross value per barrel of crude, from the slate"],
 "The exponent changes the capital and nothing else. The product slate, the throughput and the gross margin per barrel do not depend on it, which is why a screen can carry a range of exponents cheaply."),

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/beginner/rfb_m02.json', label='rfb_m02', expect_n=15)
finish()
