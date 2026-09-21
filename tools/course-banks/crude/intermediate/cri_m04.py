import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Professional m04, netback. Every figure is from digest SECTION 16 (the
# Kwale term table, the wrong-way losses, the blank costs and the unpriced
# residue), with the partial blend's unyieldedCuts from SECTION 15.

q(2, 'In what order does netbackValue apply its terms?',
 'Cut yield fraction times product price, summed; that sum times (1 - loss percent / 100); then processing cost and freight subtracted.',
 ['Cut yield fraction times product price, summed; processing cost and freight subtracted; then the result times (1 - loss percent / 100).',
  'Processing cost and freight subtracted from each product price; each result times its cut yield fraction; then the loss percent taken off the sum.',
  'Cut yield fraction times product price, summed; then the loss percent, processing cost and freight each subtracted from the sum in dollars.'],
 'Losses are a volume shrinkage on the product side, so they come off the product value before the costs. All terms are per barrel of crude.')

q(0, "On the Kwale blend, what is Naphtha's value per barrel of crude, and what is it formed from?",
 '15.2137 $/bbl of crude, its yield of 20.5591 volume percent as a fraction times 74 $/bbl of product.',
 ['15.1460 $/bbl of crude, its yield of 20.5591 volume percent as a fraction times 74 $/bbl of product.',
  '74 $/bbl of crude, the naphtha price, since a price per barrel of product is a value per barrel of crude.',
  '15.2137 $/bbl of product, its yield of 20.5591 as a fraction times 74 $/bbl of crude.'],
 "Naphtha is 20.5591 percent of every barrel of the Kwale blend, and each of those barrels of product sells at 74. 15.1460 is Kerosene / DPK's value, 16.2860 percent at 93.")

q(3, 'What does the cut yield do in the gross product value?',
 'It converts a price per barrel of product into a value per barrel of crude.',
 ['It converts a price per tonne of product into a price per barrel of product.',
  "It weights each product price by the crude's mass share in that cut.",
  'It scales the product price for the loss before the costs are taken.'],
 'A barrel of the Kwale blend yields 20.5591 volume percent naphtha, so that fraction of every barrel of crude comes out as naphtha at 74 $/bbl of product.')

q(1, "Atmospheric residue is priced at 57 $/bbl of product and Diesel / AGO at 98. Why does residue contribute 24.5400 $/bbl of crude against diesel's 18.9972?",
 "Residue is 43.0526 volume percent of the blend against diesel's 19.3849, and a cut's contribution is its yield and its price together.",
 ["Residue carries no processing cost of its own at a topping refinery, so its value is left whole while diesel's value has the 6.8000 processing cost taken off first.",
  "Residue is sold by the tonne, so the engine values it on its mass-weighted yield of 43.2685, and that heavier basis lifts its contribution over diesel's.",
  "Diesel's value is shrunk by the loss at 0.8 percent and residue's value is not, since residue loses no volume."],
 "The engine's formula sums each cut's yield fraction times its product price, so a cut's share of the gross of 74.2412 $/bbl of crude rests on both columns.")

q(2, "In the Kwale netback, what are the gross product value and the netback the engine reports?",
 "74.2412 and 64.9473 $/bbl of crude.",
 ["74.2412 and 65.0169 $/bbl of crude.",
  "74.2412 and 67.4412 $/bbl of crude.",
  "49.7012 and 40.6036 $/bbl of crude."],
 "The term table reads gross product value 74.2412 and netback 64.9473 $/bbl of crude. 65.0169 is the netback with losses taken off after the costs, 67.4412 the netback with freight and losses left blank, and 49.7012 and 40.6036 the case with the residue price left blank.")

q(0, 'In the Kwale netback, what is the value lost to losses, and where does the engine take it?',
 '0.5939 $/bbl of crude, off the gross product value before processing and freight.',
 ['0.5939 $/bbl of crude, off the netback after processing and freight have come off.',
  '0.0696 $/bbl of crude, off the gross product value before processing and freight.',
  '0.8 $/bbl of crude, the loss percent charged as a cost per barrel beside freight.'],
 "A loss of 0.8 percent is a volume shrinkage on the product side. 0.0696 is how far the after-the-costs reading lands from the engine's netback of 64.9473.")

q(3, "If the loss percent is taken off the netback after processing and freight, what does the course print?",
 "65.0169 $/bbl, which is 0.0696 above the engine's netback.",
 ["65.5412 $/bbl, which is 0.5939 above the engine's netback.",
  "64.9473 $/bbl, which is 0.0000 from the engine's netback.",
  "65.0169 $/bbl, which is 0.5939 above the engine's netback."],
 "The engine takes losses off the product value before the costs, and this reading takes them off a figure that already has processing and freight removed. The course prints it at 65.0169, 0.0696 from the engine's 64.9473. 65.5412 is the reading with losses left out.")

q(1, 'Why are processing cost and freight not reduced by the product losses?',
 'They are charged per barrel of crude, and the loss is a shrinkage of the product side only.',
 ['They are reduced by the losses, and the engine folds that into the value lost.',
  'They are taken on mass, and the loss percent is a volume shrinkage only.',
  'They are blank in the Kwale case, so there is nothing for the loss to reduce.'],
 'Processing cost and freight are charged per barrel of crude. In the Kwale case processing is 6.8000 and freight 1.9000 $/bbl, taken off after the value lost to losses of 0.5939.')

q(2, "The losses left out reading lands 0.5939 above the engine's netback. Which figure in the engine's term table does that match?",
 'The value lost to losses at 0.8 percent, 0.5939 $/bbl of crude.',
 ['The distance of the after-the-costs reading from the engine, 0.0696 $/bbl.',
  'The freight, 1.9000 $/bbl of crude, taken off after the losses.',
  'The processing cost, 6.8000 $/bbl of crude, taken off before freight.'],
 "The losses left out reading is 65.5412 against the engine's 64.9473, and the course prints that difference as 0.5939, the figure it also prints as the value lost to losses at 0.8 percent.")

q(3, 'The engine can return assumedZero, unpricedCuts and unyieldedCuts. Which of them leaves the valuation complete?',
 'assumedZero: a blank cost is named and the valuation stays complete.',
 ['unpricedCuts: an unpriced cut adds nothing, so the rest stays complete.',
  'unyieldedCuts: a cut with no yield has no barrels to value, so none are missing.',
  'All three do, since each list names its gap and a named gap is complete.'],
 "A missing price or a missing yield makes the valuation incomplete: the residue left unpriced gives complete: false, and the partial Ebocha blend's unyieldedCuts, LPG / Light ends, Naphtha, give complete: false.")

q(0, 'Kwale is valued with freight and losses left blank. What does the engine return?',
 'A netback of 67.4412 $/bbl, assumedZero naming freight and losses, and complete: true.',
 ['A refusal naming freight and losses as costs the netback cannot be formed without.',
  'A netback of 67.4412 $/bbl with complete: false, since two costs were left blank.',
  'A netback of 64.9473 $/bbl, since blank costs fall back to the Kwale defaults.'],
 'A blank cost is taken as zero and NAMED. The complete Kwale valuation, every field filled, is 64.9473 $/bbl, and only the list beside each figure tells a reader which one they hold.')

q(1, 'Why does netbackValue take a blank cost as zero instead of refusing?',
 'A netback with no freight is a legitimate question, and the engine names the cost it took as zero.',
 ['A blank cost is almost always a typing slip, and zero is the least harmful figure to put in its place.',
  'The engine holds a default of zero for every input and applies it to any field left empty.',
  'Refusing would stop the stability screen, which runs inside the same call as the netback.'],
 'A blank cost is taken as zero and named. With freight and losses blank the Kwale netback is 67.4412 $/bbl and assumedZero reads freight, losses.')

q(2, "A blank freight is taken as zero and named. Why is a blank sulfur treated differently?",
 "A blank property is treated as absent: the sulfur comes back as no value, and the crude without it is named.",
 ["A blank sulfur is taken as zero as well, and it is named in assumedZero beside any blank cost, so the two blanks are in fact treated alike.",
  "A blank sulfur is filled from the other crude's sulfur, and that crude is named as the source of the figure.",
  "A blank sulfur is refused outright, since a blend with no sulfur cannot be sold at all."],
 "A blank cost is taken as zero and named in assumedZero. A blank sulfur is absent: the property comes back as no value, and the crude without it is named as missing.")

q(3, "Suppose nobody types a price for Atmospheric residue on the Kwale blend. What do the gross, the netback and the engine's lists read?",
 'Gross 49.7012 and netback 40.6036 $/bbl, unpricedCuts naming Atmospheric residue, and complete: false.',
 ['Gross 49.7012 and netback 40.6036 $/bbl, assumedZero naming the residue price, and complete: true.',
  'Gross 74.2412 and netback 64.9473 $/bbl, since a blank price falls back to the residue default.',
  'A refusal, since a netback cannot be formed while any cut in the set is left without a price.'],
 'A cut with no price contributes nothing and is named, and the valuation reports itself incomplete. The complete Kwale case priced residue at 57 for a value of 24.5400 $/bbl of crude.')

q(0, 'Why does a blank residue price make the valuation incomplete when a blank freight does not?',
 'A cut with no price contributes nothing, so Atmospheric residue, 43.0526 percent of every barrel of crude, goes unvalued in the netback.',
 ["A price is a market figure and a freight is a refinery figure, and the engine trusts only the refinery's blanks.",
  'The residue price multiplies the loss, so a blank price leaves the loss term unformed and the netback with it.',
  "Freight is small beside residue's value, and the engine marks incomplete only a blank worth more than the loss."],
 'A blank cost is named and does not make the valuation incomplete; a missing price or a missing yield does. complete: false says the 40.6036 figure leaves Atmospheric residue unvalued.')

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/intermediate/cri_m04.json', label='cri_m04', expect_n=15)
finish()
