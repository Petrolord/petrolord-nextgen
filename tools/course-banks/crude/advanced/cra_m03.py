import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Expert m03, Binding and Giveaway. Digest sections 21 and 22.

q(3, "The Apapa result prints \"Components at their availability: Butane.\" Butane sits at 400.0000 bbl and Reformate at 3284.6899 bbl against 3500 available. What does that line report?",
 "Butane's upper bound holds exactly, and no other bound does.",
 ["The kernel fills Butane first and then stops adding to it.",
  "Butane has run out, so the recipe is short of its 8000 bbl target by the missing barrels.",
  "Reformate is at a bound too, the most the rows let it take."],
 "A component at its availability is a bound holding exactly, one of the constraints that pin the vertex. Reformate at 3284.6899 bbl is inside its 3500 bbl, and the total is 8000.0000 bbl.")

q(1, "In the Apapa recipe, what share of the 8000 bbl cargo is FCC gasoline, and what does it cost over the batch?",
 "A volume fraction of 0.4414, costing 299792.2634 $.",
 ["A volume fraction of 0.4106, costing 308103.9109 $.",
  "A volume fraction of 0.4414, costing 308103.9109 $.",
  "A volume fraction of 0.0980, costing 69165.3861 $."],
 "FCC gasoline enters at 3531.1221 bbl, a volume fraction of 0.4414, at a cost of 299792.2634 $. The 0.4106 and 308103.9109 $ row is Reformate, and 0.0980 with 69165.3861 $ is Isomerate.")

q(2, "The Apapa pool has four variables. Which four constraints hold exactly at its optimum?",
 "The batch row, Butane's upper bound, the sulfur row and the RVP row.",
 ["The batch row and the RON, MON and density rows, each met at its template limit.",
  "The four upper bounds, each component at its availability.",
  "The sulfur and RVP rows, each counted as row and bound."],
 "Four variables need four things holding exactly. At Apapa they are the batch row, Butane at its availability, and the binding Sulfur and RVP rows; RON, MON and Density carry giveaway.")

q(1, "The Apapa result lists Sulfur and RVP as binding. What does the course say a binding specification is?",
 "Met exactly, with the optimum pressed against it, so relaxing it lowers the cost.",
 ["Met with a giveaway of 3.5010, so it is the row holding the octane up.",
  "Met anywhere inside its range, so relaxing it leaves the cost where it is.",
  "Typed by the planner as a must-hit target, so the recipe is built to land on it."],
 "A binding specification is met exactly; the optimum is pressed against it, and relaxing it lowers the cost. At Apapa Sulfur achieves 50.0000 against 50 and RVP 9.0000 against 9, each with a giveaway of 0.0000. 3.5010 is RON's giveaway, and RON does not bind.")

q(3, "RON is achieved at 94.5010 against its minimum of 91. What giveaway does the engine report, and by which rule?",
 "3.5010, the achieved value minus the limit for a minimum.",
 ["3.4928, the limit minus the achieved value, the rule the engine keeps for a maximum.",
  "0.0000, since a minimum that is met gives nothing away.",
  "94.5010, the achieved value itself, the octane the cargo delivers."],
 "Giveaway is how far inside its limit the blend sits. For a minimum that is the achieved value minus the limit. 3.4928 is the MON giveaway.")

q(2, "Density is achieved at 0.7547 kg/l inside a range of 0.72 to 0.775, with a giveaway of 0.0203. Which gap is that?",
 "The gap to the 0.775 maximum, which is the nearer of the two ends.",
 ["The gap to the 0.72 minimum, since a density range is measured from its floor.",
  "The sum of the gaps to both ends, the room the blend has across the range.",
  "The gap to the midpoint, the target of a range."],
 "For a range the engine reports the smaller of the two gaps. The blend sits nearer the maximum, and 0.0203 kg/l is that distance.")

q(1, "The AGO cargo at the same terminal binds on Cetane number and Density, and there sulfur gives away 21.8467 ppm. What does that say about binding?",
 "Binding is a verdict about one pool at one set of prices.",
 ["A sulfur specification binds on every gasoline and never on a gasoil, since the two templates set different sulfur limits.",
  "The AGO recipe is off specification on sulfur, since a gasoil must meet its limit exactly.",
  "Sulfur binds only where the template carries it on mass, and the AGO sulfur row is on volume."],
 "At Apapa sulfur binds with a giveaway of 0.0000. On the AGO pool it does not, and both templates carry sulfur on mass. Binding belongs to a recipe, a pool and its prices.")

q(3, "A binding specification shows a giveaway of 0.0000 and binding true. What does the Apapa table show about those two columns in every row?",
 "Each zero giveaway is a true.",
 ["A true can carry a positive giveaway when the limit is a range and the recipe sits inside both ends.",
  "The columns are independent: binding is typed by the user and giveaway is computed by the engine.",
  "Every false carries a giveaway below one unit of its property, whatever the specification."],
 "A specification either binds with zero giveaway or gives quality away and does not bind. At Apapa the two zeros, Sulfur and RVP, are the two trues.")

q(0, "Why does the Apapa recipe deliver a RON of 94.5010 against a RON minimum of 91?",
 "The recipe is held by the sulfur and RVP rows, and the octane arrives with the barrels they call for.",
 ["The optimizer adds octane on purpose, as a safety margin against a failed certificate at the port.",
  "RON blends on mass, so the volume figure overstates what the buyer receives in the tank.",
  "Octane carries no cost in this pool, so the kernel adds it freely to the recipe."],
 "RON does not bind: its giveaway is 3.5010 and it blends on volume. The recipe sits where the sulfur and RVP rows hold it, and it includes Reformate at 3284.6899 bbl, which carries 98.6 RON.")

q(1, "valueGiveaway prices the MON giveaway of 3.4928 at a typed 0.4 $ per unit per bbl. What does it report over the 8000 bbl batch?",
 "11176.9355 $, the MON gap valued at the typed unit value.",
 ["16804.7174 $, the figure printed for the RON giveaway.",
  "not priced, the entry for a gap with no unit value",
  "0.0000 $, since MON does not bind and its row is slack"],
 "The MON row reads a giveaway of 3.4928, a typed unit value of 0.4 and 11176.9355 $. The RON row reads 16804.7174 $, and Density reads not priced.")

q(2, "The RON giveaway of 3.5010 is valued at 16804.7174 $ over the batch. Where does the worth of one octane number come from?",
 "From the user, who typed a unit value of 0.6 $ per unit per bbl.",
 ["From the kernel, which reads a price per octane number off the RON row's dual at the optimum.",
  "From a market feed of octane premiums at run time.",
  "From the 50 ppm gasoline template, which carries a value beside each limit."],
 "An octane number has no price inside the optimizer. The 0.6 is the user's typed unit value, and the RON row's own value of relief is 0.0000.")

q(3, "Density's giveaway of 0.0203 kg/l has no unit value typed. What does valueGiveaway report for it?",
 "not priced",
 ["0.0000 $, since a blank unit value is read as a price of zero",
  "a price at the RON unit value of 0.6, carried across to every row",
  "an error, because every row of the table needs a unit value"],
 "Where no unit value is given the gap is reported without a price. A figure of zero would be a price nobody typed.")

q(0, "The giveaway value table lists RON and MON and Density, and leaves out Sulfur and RVP. Why?",
 "They are binding, so they give nothing away and there is nothing to price.",
 ["Sulfur and RVP blend on mass and index, and valueGiveaway only prices properties blended on volume.",
  "Their unit values were left blank, so the rows are dropped.",
  "Their units are ppm and psi, which valueGiveaway cannot price."],
 "The table says so in its own line: specifications with no giveaway (binding) are not listed: Sulfur, RVP.")

q(1, "The RON minimum's value of relief is 0.0000 while the RON giveaway, priced at the typed 0.6, is 16804.7174 $. How do the two figures sit together?",
 "They answer different questions: what moving the limit saves, and what the delivered quality is worth.",
 ["One of them is wrong, since a limit with priced giveaway must carry a value of relief.",
  "The giveaway value is the relief price times the volume blended over the batch.",
  "The relief price is the giveaway value per barrel, spread over the 8000 bbl."],
 "The recipe is held by sulfur and RVP, so relief on RON saves nothing. The priced giveaway values the octane above 91 at the user's price per unit over the volume blended.")

q(0, "A reader wants to add the RON giveaway of 3.5010 and the Density giveaway of 0.0203 into one figure of quality handed over. What is wrong with that?",
 "They are in different units, octane numbers and kg/l.",
 ["Density's giveaway would need doubling first, since a range has two ends to count.",
  "Nothing, once each is rounded to four decimals and written in the same table.",
  "Density's is subtracted, since it sits in a range."],
 "Giveaway is measured in the property's own unit. Whether either is worth money is a separate question that needs a price per unit from the user.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/advanced/cra_m03.json', label='cra_m03', expect_n=15)
finish()
