import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Professional m06, the Professional reading. Digest Sections 12, 14 and
# 21. Section 14 is shared with Expert m01 and Section 12 with m04 l05, so
# both are inside this tier's ownership. The order identity is written the way
# the digest states it: the stage numbers move and the outlet does not.

q(0, "What separates a dissolved gas cell from an induced gas one in this module?",
 "The bubble size and the gas rate, and nothing else about the two boxes differs.",
 ["The residence time and the cell depth, since a dissolved cell holds its water far longer.",
  "The attachment efficiency and the interception coefficient, which each machine carries its own value of.",
  "The grade curve sharpness, 2 induced and 3 dissolved."],
 "The presets read 0.2 and 300 micron for the induced cell and 0.03 and 80 micron for the dissolved one. Everything else is the same physics of bubbles rising through water and intercepting oil.")

q(2, "The two presets report cuts of 17.235518 micron and 6.128184 micron. What do those figures give when divided?",
 "That the dissolved cell cuts 2.812500 times finer, and on 0.150000 times the gas.",
 ["That the dissolved cell cuts 2.812500 times finer, and on 2.812500 times the gas.",
  "That the induced cell cuts 2.812500 times finer, which is what the higher gas rate buys it.",
  "That the two cells cut within 0.150000 of each other."],
 "Both figures are derived, the pairs on those two rows divided. The finer cut on far less gas is what the interception law makes sense of, since the rate carries the inverse cube of the bubble diameter and carries the gas rate only once.")

q(3, "Why is the comparison between those two presets a test of the MODEL rather than of the menu?",
 "Because a model in which the bubble size could not move the cut would make the two presets the same device behind two labels.",
 ["Because the presets are the only two arrangements the golden file carries a published row for.",
  "Because a preset that moved no reported field would be refused by the module rather than answered.",
  "Because the two rows are the only place the module reports the superficial gas velocity back."],
 "So a reader handed a studio with two device buttons has a question to ask before trusting either: which inputs differ between them, and does the model use those inputs. If the answer is a label and a different picture, the two buttons are decoration.")

q(1, "One cell of 60 m3 and twelve cells of 5 m3 are run at equal total volume and equal total gas. What does the module report for the cut size?",
 "48.447550 micron on both, and on the two arrangements in between as well.",
 ["48.447550 micron for the single cell and a finer cut for the twelve, which is what staging buys.",
  "A cut size that falls steadily as the bank is split into more cells, since each one is fed its own share of the gas.",
  "A cut size that rises as the bank is split into more cells, since splitting the volume shortens the residence in each."],
 "The spread across the four arrangements is 7.11e-15 micron, which is derived, the largest minus the smallest, and it is machine noise. A jest test asserts the invariance to 1e-12.")

q(2, "Why did the gas ratio have to be scaled by the cell count for that comparison to mean anything?",
 "Because the ratio is applied to EACH cell, so holding it fixed would feed twelve cells twelve times the gas.",
 ["Because the module refuses a gas ratio above 3 and twelve cells at the single cell ratio would exceed it.",
  "Because the residence time is computed per cell, so the ratio has to be divided to keep it constant.",
  "Because the plan area of each cell falls with the cell count, and the gas flux would otherwise have to be reported per bank instead."],
 "Two things had to be held: the total volume, so the water spends the same time in the bank, and the total gas, so the bank is fed the same gas whichever arrangement it is in.")

q(0, "What WOULD have been wrong if the cut size had moved across those four arrangements?",
 "The model would have picked up a dependence on how a user chose to describe the same equipment.",
 ["The model would have been reporting the gas per cell where it should report the bank total.",
  "The model would have been using a residence time that carries the cell count as well as the volume.",
  "The model would have been refusing an arrangement it should have answered, which is the harder defect."],
 "That is a defect rather than a feature, and it is nearly impossible to spot from a single run because there is no obvious wrong answer to look for. The only way it shows up is by asking the model the same question twice in two forms.")

q(3, "Does the cell count ever move the answer in this module?",
 "Yes, when the gas RATIO is held instead of the total gas, because four cells at a ratio use four times the gas of one.",
 ["No, because the chain is built from the total volume and the total flow and never from the count.",
  "Yes, but only past twelve cells, where the residence in each one falls under the declared threshold.",
  "No, and the module reports the count back purely so that a reader can check the arrangement."],
 "The return reports the gas per cell AND the total on every call, so that reason is on the screen rather than left to be inferred. A reader comparing two arrangements can see at once whether they were fed the same gas.")

q(1, "The KOKORI train puts three unlike devices in series. Which argument produced which cut size?",
 "A field and a travel gives 4.430689 micron, a collision rate against a residence gives 23.734355, and an exponential through a depth gives 9.149437.",
 ["A field and a travel gives 9.149437 micron, a collision rate against a residence gives 4.430689, and an exponential through a depth gives 23.734355.",
  "A surface loading inverted gives 4.430689 micron, an exponential through a depth gives 23.734355, and a collision rate gives 9.149437.",
  "All three come from the same inverted settling balance, applied at three different effective areas."],
 "Three numbers of the same kind, produced by three arguments with almost nothing in common. A reader who can say which argument produced which number, and which input each one responds to, has finished the tier.")

q(0, "On that train the flotation stage has the coarsest cut of the three and removes 11.678001 percent. What is the right reading of that figure?",
 "That the water reaching it had a median of 6.843000 micron, because the liner bank had already taken the coarse oil out.",
 ["That the cell is undersized for this flow, since it is the only one of the three stages that carries a residence time at all.",
  "That the cell is a weaker device than the bed, which removes 36.459384 percent from the same water.",
  "That a coarse cut size is always worth less in a train, whatever position the device is put in."],
 "A device removes the droplets it is good at, so the next device faces finer water than the inlet did and performs worse on it than its own cut size suggests. Judging one stage without knowing what reached it is the mistake this table exists to prevent.")

q(2, "What does that three stage train leave, on 900 ppm at d50 20 micron and sigma 0.7?",
 "25.742373 ppm, 97.139736 percent removed, and a droplet median of 5.557324 micron.",
 ["45.869949 ppm, 94.903339 percent removed, and a droplet median of 6.843000 micron.",
  "40.513256 ppm at 11.678001 percent removed, with a median of 6.471437 micron, which is what the middle stage of that train reports.",
  "25.742373 ppm at 36.459384 percent removed."],
 "The overall removal is over every stage in the train rather than any one of them, and the median falls from 20.000000 micron at the inlet. The two distractor pairs above are stage figures read as though they were the train's.")

q(1, "Five IDENTICAL devices, each cutting at 9 micron, are put in series on one water. What does the removal column do?",
 "It falls from 65.398946 percent at the first stage to 12.284239 percent at the fifth.",
 ["It holds at 65.398946 percent on every stage, because the devices are identical and the water is the same.",
  "It rises from 12.284239 percent to 65.398946 percent, because each stage faces a cleaner and easier feed.",
  "It falls to zero by the third stage, since a device cannot remove oil finer than its own cut size."],
 "If a device were a fixed efficiency every row would be the same number. The fifth removes what it does because the water reaching it has had its coarse oil taken out four times already.")

q(3, "Compounding that first stage removal five times over predicts an outlet of 8.927280 ppm. What does the train actually report?",
 "250.692079 ppm, because the later stages face water the earlier ones have already stripped of its coarse oil.",
 ["250.692079 ppm, because the binned quadrature loses its accuracy once the surviving volume has fallen below the module reporting floor.",
  "8.927280 ppm, which is what makes the compounding a fair shortcut for a train of identical devices.",
  "250.692079 ppm, because the module applies a declared coupling penalty at each stage after the first."],
 "The compounded figure is derived, the first stage removal raised to the fifth. The gap between the two is the entire case against reading a train as a chain of fixed efficiencies.")

q(0, "The four stages of a train are reversed. What moves and what does not?",
 "Every stage removal moves and the train outlet and the outlet median do not.",
 ["Every stage removal moves and so does the train outlet, because the coupling is order dependent.",
  "Nothing moves at all, because a train is a product of survivals and the order of the stages is arbitrary.",
  "The train outlet moves and the stage removals do not, because each device keeps its own grade curve."],
 "A device removes a fixed FRACTION of each droplet size, so the volume surviving in any one size bin is the PRODUCT of the survivals across the devices, and a product does not care what order it is taken in.")

q(2, "By how much do the per stage removals move when that train is reversed, and what should a reader conclude?",
 "By as much as 57.344778 percentage points, so two trains must be compared on their OUTLETS.",
 ["By as much as 57.344778 percentage points, which is why the module reports the stages in a fixed order.",
  "By less than the six decimals the removals are printed to, which is what makes the identity checkable.",
  "By an amount that depends on the inlet distribution, so no general figure can be quoted for it."],
 "The outlet concentration agrees to 7.09e-16 relative both ways, which is float rounding. A reader judging one stage must know what reached it, and a reader comparing two trains must look at what came out.")

q(3, "What engineering question does that order identity NOT answer?",
 "Why a designer still puts the coarse device first, which is decided by fouling, plugging and how much oil each device can take in its reject.",
 ["Whether the reversed train leaves the same outlet concentration, which is the quantity the identity is stated on.",
  "Whether the per stage removals change when the order does, which the reversed table prints in full.",
  "Whether the outlet droplet median depends on the order the devices were placed in."],
 "This module carries none of those three. An invariance in a model is a statement about the model, and reading it as a statement about a plant is how a correct identity becomes a wrong design.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/intermediate/fc7i_m06.json', label='fc7i_m06', expect_n=15)
finish()
