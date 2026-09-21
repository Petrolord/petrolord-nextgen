import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Professional tier exam, 42 questions across the six modules of the tier.
# Digest Sections 8 to 13 and 19, at the rendering those sections print.
# Nothing here reaches the allowance door's own section, the band table, the
# binding-constraint summary, the whole-screen field list or the refusal
# catalogue, all of which belong to the tier above this one, and no question
# turns on a corrosion rate the correlation produced, a band label, a threshold
# verdict, a severity region or a material.

# --- m01, the wetting regime ------------------------------------------------

q(0, "Which single input on this screen is chosen from a list rather than measured, and takes the rate from 1.676428 mm/yr to zero with nothing else touched?",
 "The wetting regime, which is chosen from a list of three.",
 ["The in-situ pH, which moves the rate by a decade every two units.",
  "The velocity, which reaches the rate twice.",
  "The corrosion inhibitor availability."],
 "Almost every other input is a measured quantity with a unit, and this one is a word that can zero the rate on its own.")

q(2, "Two of the three regimes ignore the water cut box entirely. What wetting factor does each of them use?",
 "1.000000 water wet and 0.000000 oil wet.",
 ["0.370000 water wet and 0.000000 oil wet.",
  "1.000000 water wet and 1.000000 oil wet.",
  "Whatever the box says, the regime word only labelling the row."],
 "The box sits on the screen all the time and is read in one branch only. In the other two the factor is pinned at the top and at the bottom of its range.")

q(1, "A user types waterwette into the regime box. What comes back?",
 "A refusal quoting the string and naming the three regimes the engine accepts.",
 ["The water-wet branch, reached by the matcher's fuzzy spelling rules.",
  "The intermittent branch, which is the middle of the three.",
  "A screening with the regime row marked as assumed."],
 "Five spellings of oil wet resolve because they are unambiguous. A string the matcher cannot resolve refuses, because an unrecognised regime falling through would choose an input that can zero the rate from a typing mistake.")

q(3, "Which of these is not one of the three wetting regimes this engine accepts?",
 "gasWet.",
 ["oilWet.",
  "waterWet.",
  "intermittent."],
 "The list is closed at three and there is no gas-wet, stratified or annular option. No door in this module works out a flow pattern, so the three entries are an interpretation the engineer supplies.")

q(1, "On an oil-wet case one reported field becomes null rather than zero. Which?",
 "The effective corrosion inhibition.",
 ["The wetting factor, which the regime sets.",
  "The wall shear, which no longer has a film to act on.",
  "The water cut."],
 "With the rate zero by assumption, a percentage describing how much metal loss was removed has no subject. Reporting an absence is how the engine avoids making a claim about the chemical it was never in a position to make.")

q(0, "The regime is intermittent and the water cut box reads 0.000000. What comes back?",
 "A wetting factor of 0.000000, which lands on the oil-wet answer from the other end.",
 ["A refusal, because a water cut of zero is not a water cut at all.",
  "A wetting factor of 1.000000, supplied by the default parameter.",
  "A wetting factor of 0.370000, which is the shipped intermittent figure."],
 "Both ends of the intermittent range coincide with one of the other two branches, and that is what makes it an interpolation rather than a third mechanism of its own.")

q(2, "Nought to one on every fraction is one of the range guards this module enforces. Which of these is another?",
 "Nought to fourteen on the in-situ pH.",
 ["A velocity below an erosional limit for the line.",
  "A wall shear below the film-stripping threshold.",
  "A rate below the top band edge the category table carries."],
 "Nought to one on every fraction, nought to fourteen on pH, a temperature above absolute zero, and the partial-pressure sum against the total are all enforced on what a caller types. Every published validity band of every correlation is held rather than enforced.")

# --- m02, efficiency against availability ------------------------------------

q(1, "Which row of the corrosion inhibitor table carries an effective protection of 90.250000 percent?",
 "An efficiency of 95.000000 at an availability of 95.000000 percent.",
 ["An efficiency of 95.000000 at an availability of 90.000000 percent.",
  "An efficiency of 90.000000 at an availability of 95.000000 percent.",
  "An efficiency of 95.000000 at an availability of 98.000000 percent."],
 "Its shortfall is 4.750000 percentage points and its metal loss is 1.950000 times the datasheet number. Two inputs reach that figure and the engine asks for them one at a time.")

q(3, "Two percentage points of availability are lost, from 100.000000 to 98.000000, at an efficiency of 95.000000 percent. What is the metal loss then?",
 "1.380000 times the datasheet number.",
 ["1.000000 times it.",
  "1.950000 times it, which is what a lower availability row carries.",
  "1.900000 times it, which is the shortfall in percentage points."],
 "The effective protection on that row is 93.100000 percent, a shortfall of 1.900000 percentage points, which reads as almost nothing. A reader who summarises by the protection column and one who summarises by the loss column are looking at the same row.")

q(2, "At 95.000000 percent efficiency and 70.000000 percent availability, what is the shortfall?",
 "28.500000 percentage points short of the datasheet figure.",
 ["25.000000 percentage points, the drop in the availability.",
  "6.700000 percentage points, which is the metal loss ratio there.",
  "19.000000 percentage points, which the row above it carries."],
 "The effective protection there is 66.500000 percent and the metal loss is 6.700000 times the datasheet number. The chemical is the same 95 percent product on every row of that table.")

q(1, "On one row of the corrosion inhibitor table the effective protection and the shortfall are the same number. Which availability?",
 "50.000000 percent, where both read 47.500000.",
 ["25.000000 percent, where both read 23.750000.",
  "95.000000 percent, where both read 90.250000.",
  "100.000000 percent, where both read 95.000000."],
 "Half the datasheet efficiency is delivered and half of it is lost, so the two columns meet. The metal loss on that row is 10.500000 times the datasheet number.")

q(0, "The availability box reads 130.000000 percent beside an efficiency of 90.000000. What protection is reported?",
 "90.000000 percent.",
 ["130.000000 percent, the availability being taken as typed.",
  "100.000000 percent, which is where the availability was clamped to.",
  "0.000000 percent, the whole case being rejected as impossible."],
 "The engine moved the availability to its ceiling and recorded that move on the screening in a field of its own. That field is empty on the studio's shipped case, where nothing was moved.")

q(3, "The warning on the studio's shipped screen names a metal loss. What figure does it give?",
 "1.45 times the metal loss of the datasheet number.",
 ["4.80 times it, which is the figure at 80 percent availability.",
  "1.000000 times it.",
  "2.900000 times it."],
 "The shipped programme is a 90 percent corrosion inhibitor at 95 percent availability, giving 85.5 percent effective protection. Those are the engine's own words and the shortfall behind them is 4.500000 percentage points.")

q(1, "An efficiency of 120.000000 percent is typed. What does the engine report about it?",
 "That the efficiency was clamped from 120 to 100 percent.",
 ["That it was rejected.",
  "That the efficiency was accepted as typed, the arithmetic being valid.",
  "That the availability was clamped instead, to keep the product below one."],
 "A percentage slightly outside its range is almost always a typing slip on a quantity whose intent is obvious, and the nearest valid value carries that intent. The declaration is what stops the convenience becoming a silent assumption.")

# --- m03, the wall shear ------------------------------------------------------

q(2, "Only one of the six screened streams falls outside the turbulent branch. Name it.",
 "Angiama, at a Reynolds number of 3.3754.",
 ["Tunu, at a Reynolds number of 1063231.0691.",
  "Opukushi, at a Reynolds number of 193290.8250.",
  "Etelebou, at a Reynolds number of 313781.4400."],
 "Every other stream in that table sits in the hundreds of thousands or above. This one is small, slow and viscous, so it lands on a branch of its own.")

q(0, "The course's swept branch table carries seven rows. How many of them are flagged as near the switch?",
 "Four.",
 ["Seven, every row on the table being inside the flagged band.",
  "One, which is the row sitting exactly on the switch itself.",
  "Three."],
 "The flag is set at 3600.0000, 3960.0000, 4000.0000 and 4040.0000, and clear at 2000.0000, 4400.0000 and 8000.0000.")

q(3, "On the two swept rows either side of the branch change, what pair of friction factors comes back?",
 "It goes from 0.004000 to 0.008739.",
 ["It goes from 0.003660 to 0.002867, which is the spread across the streams.",
  "It stays at 0.046000000000, which is the Blasius coefficient itself.",
  "It goes from 4.740191 to 0.008591, which is a fall of three orders."],
 "Those two rows sit at 4000.0000 and 4040.0000, and the wall shear across them goes from 0.003200 Pa to 0.007132 Pa. Across the switch itself, over two ten-thousandths of the Reynolds number, the jump is 2.189815.")

q(1, "The velocity sweep runs at 8.000000 m/s. What wall shear does this module return there?",
 "97.225957 Pa.",
 ["100.000000 Pa, which is where the film-stripping verdict turns.",
  "201.718855 Pa, which is the row at 12.000000 m/s.",
  "27.920824 Pa, which is the row at 4.000000 m/s."],
 "That row is below the stripping threshold and the corrosion inhibitor credit is still taken on it. At 12.000000 m/s the shear is 201.718855 Pa and the credit is removed.")

q(2, "The engine's own note near the friction branch switch ends with an instruction. What is it?",
 "To read the shear as a bracket rather than as a single value.",
 ["To lower the velocity until the Reynolds number leaves the switch.",
  "To take the laminar value.",
  "To average the two branch values."],
 "Near the switch the shear is a range with two candidates in it. Away from the switch it is a single number, which is what the flag is telling you.")

q(0, "The velocity box is blank and the shear door is called. What is the engine's own message?",
 "Wall shear stress needs a positive velocity.",
 ["A positive velocity is required, an absent velocity not being unlimited capacity.",
  "Screening incomplete, because the film survival check could not be run.",
  "The velocity must be finite."],
 "Four inputs reach that door and each of the four refusals names its own box. The longer sentences belong to other doors on the same engine, and quoting the wrong one attributes a message to a call that never produced it.")

q(3, "One course stream has a friction factor of 4.740191 and another has 0.002867. Why are they so far apart?",
 "They come from two different expressions, one on each branch.",
 ["One is a Fanning factor and the other is a Darcy factor.",
  "One was measured on the engine and the other read from its export.",
  "One is this module's factor and the other is the line sizing course's."],
 "Neither branch is wrong on its own ground, and nothing in either expression requires the two to agree at any particular Reynolds number. Both expressions and the switch between them are held for literature.")

# --- m04, the shear acting on the rate ----------------------------------------

q(1, "Of the six streams the course screens, how many have their corrosion inhibitor film stripped?",
 "One.",
 ["None, every one of the six sitting below the threshold.",
  "Three, being the three with the highest wall shear figures.",
  "Six, the credit being removed on every stream in the table."],
 "On the five others the rate column and the credited rate column carry the same figure and the two life columns carry the same figure, so the ratio between them is 1.000000.")

q(2, "On the one stripped stream, what are the two remaining lives the engine reports?",
 "0.161915 yr, against 0.760876 yr with the credit kept.",
 ["1.655305 yr against 7.681561 yr.",
  "4.207953 yr, against 0.242737 yr once the credit has been kept.",
  "36.112878 yr against 192.123424 yr."],
 "That is the cost of the shear verdict stated in years on the same row as the verdict itself. The two lives carry the same information as the two rates, because the allowance is common to both.")

q(0, "The engine's warning when the credit is removed says two useful things. What are they?",
 "It names the datasheet figure that stopped applying, and says the rate above is now the uninhibited one.",
 ["It names the stripping threshold, and gives the velocity that would restore the film.",
  "It names the band label, and gives the allowance a reinstatement would need.",
  "It names the wetting regime, and gives the water cut the regime was read at."],
 "The reader can see which number stopped applying and what the headline figure now is, rather than working the second out from the first.")

q(1, "Why does a stripped rate divided by its credited rate carry no held constant at all?",
 "Because the two run the same chain on the same inputs, so everything but one factor divides out.",
 ["Because the constants cancel between the two branches of the friction factor.",
  "Because the quotient is formed from mole fractions, which need no pressure.",
  "Because the engine forms the quotient from the typed percentages directly."],
 "They differ in exactly one factor, which is the corrosion inhibitor credit. Every coefficient and every correction appears identically on both sides.")

q(3, "On a case where the corrosion inhibitor credit was taken in full, what does the credited rate column show?",
 "The same figure the rate column shows.",
 ["A blank.",
  "The uninhibited rate, which is what the credit was taken off.",
  "The rate the datasheet would give at one hundred percent availability."],
 "The engine reports both on every case whether or not the credit was actually taken. Printing a figure twice looks redundant until you meet the case where they differ.")

q(2, "Why is a blank density here not simply a missing row on the summary?",
 "Because the rate depends on the film verdict, so the module would not know which of two rates to issue.",
 ["Because the density is an argument of the correlation the rate comes from.",
  "Because a remaining life cannot be divided without a density for the stream.",
  "Because the wetting regime is resolved from the density of the phase."],
 "The screening computes the wall shear first for exactly this reason. Issuing a rate while the credit question is open would be choosing between two candidates on the reader's behalf.")

q(0, "On the studio's shipped default case, what does the film verdict say and at what wall shear?",
 "Not stripped, at a wall shear of 14.408065 Pa.",
 ["Stripped, at a wall shear of 362.474888 Pa.",
  "Not stripped, at a wall shear of 369.638295 Pa.",
  "Stripped, at a wall shear of 100.000000 Pa."],
 "Nothing was taken away on that screen, so the two rate columns carry one figure between them. The verdict moves only once the velocity is raised.")

# --- m05, the allowance -------------------------------------------------------

q(1, "Which two figures does the shipped screening set against each other to reach its design life verdict?",
 "The 4.207953 yr the allowance reaches, against the 20.000000 yr asked for.",
 ["The 3.175000 mm allowance, against the 15.090473 mm demanded.",
  "The 11.915473 mm gap, against the 3.175000 mm allowance.",
  "The remaining allowance, against a minimum thickness held internally."],
 "The engine prints the life it actually reaches beside the life it was given, and it says which of the two governs. There is no minimum thickness anywhere in this module to compare anything against.")

q(3, "Put a consumed depth into the box on a case that had none. Which fields move?",
 "The remaining allowance, the remaining life and the shortfall.",
 ["The required allowance alone.",
  "The rate and the band label, both of which are taken off the wall that is left.",
  "The wall shear and the film verdict, which are taken on the reduced bore."],
 "The allowance a design life demands is the rate multiplied by that design life. It is the allowance a new line would need, so it takes no account of what has already been consumed.")

q(0, "Two of the course's streams report remaining lives of 36.112878 yr and 192.123424 yr. What does a life of that size tell you?",
 "How long the typed allowance lasts at the computed rate, and nothing more.",
 ["When the line should next be inspected, counted in years from today's date onwards.",
  "How long before the wall reaches its retirement thickness.",
  "Whether the line remains fit for service over that period."],
 "An inspection interval, a minimum thickness, a retirement thickness and a fitness-for-service assessment are all listed by the engine as not provided. A reader who treats the years as an inspection date has read a division as a programme.")

q(2, "The wall this studio is consuming an allowance off is which wall?",
 "One the module knows nothing about, since it holds no thickness of its own.",
 ["The pressure-containing wall the line sizing studio sized.",
  "The shell course the storage tank studio sized.",
  "The wall the vendored golden's own cases were built against."],
 "Nothing carries a thickness from one app to another and no minimum thickness exists anywhere in this module. If somebody sizes a line in one studio and screens it in this one, the two allowances agree only because a person made them agree.")

q(1, "How many entries does each of the engine's two absence lists carry?",
 "Eight not provided and eleven held for literature.",
 ["Eleven not provided and eight held for literature.",
  "Eight in each of the two lists the engine exports.",
  "Eleven in each of the two lists the engine exports."],
 "The screening returns both so a caller shows the absences rather than meeting them one at a time. The studio prints the second list behind a disclosure.")

q(3, "How should the name of this studio be expanded honestly?",
 "A CO2 corrosion rate screen with a remaining-life division on the end of it.",
 ["A fitness-for-service assessment with a corrosion rate feeding it.",
  "An inspection planning tool built on a sour-service severity region.",
  "A wall thickness calculator that sizes a line against a design life."],
 "That is a useful tool and a narrower one than the title suggests. The word integrity here means one arithmetic, and a reader who takes the remaining life for an inspection plan has crossed into what a standard would have to supply.")

q(0, "What does this module hold that would let it say how much wall sits under the allowance?",
 "Nothing at all, because it carries no minimum thickness of any kind.",
 ["A thin-wall relation with a design factor typed in beside it.",
  "A retirement thickness, which the reader supplies on the form.",
  "The wall the line sizing studio computed for the same pipe."],
 "A corrosion allowance divided by a rate is the whole arithmetic here. What the allowance is being taken off is a question this studio cannot reach, and the course names the owner and stops.")

# --- m06, which film governs --------------------------------------------------

q(2, "One course stream sits at an H2S to CO2 ratio of 0.140495867769. What does the engine report for it?",
 "The sulphide regime, with the band label and the life both null.",
 ["The mixed regime, with the rate flagged as an upper bound.",
  "The carbonate regime, the CO2 rate model applying in full.",
  "The unknown regime, with a note saying that no ratio at all could be formed."],
 "Its withheld block names the rate as an upper bound. The engine could have refused the rate entirely or graded it as if nothing had changed, and it does neither.")

q(1, "A stream carries a CO2 mole fraction of 0.020000 and an H2S mole fraction of 0.000010. Which regime?",
 "Carbonate, at a ratio of 0.000500000000.",
 ["Mixed, at a ratio of 0.000500000000.",
  "Sulphide, at a ratio of 0.050000000000.",
  "Unknown, the H2S fraction being too small to form a ratio."],
 "In that regime the CO2 rate model applies and the rate is issued plainly, with no upper-bound flag on it. The ratio is the same at any total pressure whatever.")

q(1, "A stream at a CO2 mole fraction of 0.020000 has its H2S mole fraction raised from 0.000010 to 0.000800. What happens?",
 "The ratio becomes 0.040000000000 and the regime becomes mixed.",
 ["The ratio becomes 0.040000000000 and the regime stays carbonate.",
  "The ratio falls and the regime becomes sulphide.",
  "The ratio is unchanged."],
 "In the mixed regime the model still applies and the rate is issued with a flag saying it is a ceiling. Three regimes are three positions on the same question about one rate.")

q(3, "The sour door is handed a blank H2S partial pressure. What comes back?",
 "A finite H2S partial pressure is required.",
 ["The H2S partial pressure must be non-negative.",
  "A comparison taken at zero.",
  "The unknown regime, with a note about the missing ratio."],
 "That door owns two refusals and each names its input. A negative partial pressure gets the other of the two, and a partial pressure of exactly zero is answered rather than refused.")

q(0, "An H2S partial pressure of zero reaches the sour door. Is that a refusal?",
 "No. The comparison is answered, and the decade count is reported as an absence.",
 ["Yes, because a partial pressure of zero fails the finiteness check.",
  "Yes, because the logarithm the door forms is undefined there.",
  "No, and the decade count comes back as minus infinity."],
 "A typed zero is a positive assertion and a blank box is a question the engine cannot answer, and this module treats the two differently throughout.")

q(2, "The threshold this door compares against is printed in psia as 0.050763208303. How was that figure reached?",
 "It was derived from the bar value rather than rounded or typed separately.",
 ["It was read from the published standard the threshold comes from.",
  "It was rounded to twelve figures from a value of exactly 0.05 psia.",
  "It was fitted so that the golden's psia rows would agree with the engine."],
 "Carrying a second rounded literal is how two copies of one threshold drift apart. The engine prints both units from one number, and it declares in a field of its own that the VALUE is held for literature.")

q(0, "Where does the H2S to CO2 ratio reach, once it has produced its regime word?",
 "It enters no calculation, and through the regime word it decides whether the band label and the life are issued.",
 ["The rate, which it multiplies by a sulphide correction factor.",
  "The wall shear, through the density of the sour phase.",
  "The allowance division, which it shortens in the sulphide regime."],
 "Its job is to say whether a CO2 rate model is still the right model for the surface. In the sulphide regime that withholds the band label and the life and keeps the rate as a stated upper bound, and the rate itself does not move.")

emit(Q, "/root/wt-fc9-nextgen/tools/course-banks/corrosion/intermediate/fc9i_exam.json", label="fc9i_exam", expect_n=42)
finish()
