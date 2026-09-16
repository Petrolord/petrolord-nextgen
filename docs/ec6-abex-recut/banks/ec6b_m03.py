import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(2, "The FPSO development concept holds drilling 520.0000, facilities 1350.0000 and subsea 380.0000. What does the engine do with those three fields?",
 "It reads all three and runs the screening economics on their sum of 2250.0000 million USD.",
 ["It reads the largest of them, the 1350.0000 million USD of facilities, and treats the drilling and subsea figures as a breakdown sitting behind it.",
  "It adds the drilling and the facilities and holds the 380.0000 of subsea back, since subsea hardware is charged against the tie-back concept.",
  "It prices each field as its own case and reports three NPVs."],
 "The tie-back reaches 730.0000 the same way from 240.0000, 180.0000 and 310.0000, and the FPSO's year 0 cash flow row is -2250.0000, the whole capex before production starts.")

q(0, "The tie-back carries 310.0000 million USD of subsea against 180.0000 of facilities, while the FPSO carries 1350.0000 of facilities against 380.0000 of subsea. What does that split tell you?",
 "What kind of development each one is: the FPSO puts its money into the vessel, and the tie-back puts more into subsea hardware because it hangs off a host that already exists.",
 ["That the tie-back's subsea scope is the larger of the two in absolute terms, which is what lets it reach first oil a full year earlier.",
  "That the two concepts were costed by different teams, since a subsea figure above a facilities figure is the mark of a hardware estimate.",
  "That the tie-back is the more expensive development, since two of its three fields are larger than the matching FPSO fields."],
 "The FPSO totals 2250.0000 million USD and the tie-back 730.0000, and the split says where each of them spends it.")

q(3, "A concept is entered carrying a facilities figure of 1350.0000 million USD with the drilling and subsea boxes left empty. What does the engine return?",
 "A total capex of 1350.0000 million USD, and no complaint.",
 ["A refusal naming the two empty boxes, since a concept must carry a drilling, a facilities and a subsea figure before the engine will price it.",
  "A total of 2250.0000 million USD, the empty fields filled from the other concept of that type which the plan already holds.",
  "A warning that the capex is incomplete, with the screening case held back until the two empty fields are filled in or confirmed as zero."],
 "A blank capex field is zero rather than missing: a concept with at least one capex figure has a capex, and the refusal fires only when all three are empty.")

q(1, "What comes back when all three of a concept's capex fields are empty?",
 "The refusal \"the concept carries no capex: enter a drilling, facilities or subsea capex\", which names the fields that would satisfy it.",
 ["A screening case on a capex of zero, so the NPV is the discounted revenue of the production shape with no capital charged against it anywhere in the case.",
  "A total capex of 100 million USD, the default the engine once substituted and still applies when every capex box is blank.",
  "A refusal on the scenario instead, since an oil price cannot be applied to a concept whose capital cost is unknown."],
 "Strip the capex fields off the EGINA FPSO concept and the same message comes back, and the case stops there rather than running on a figure nobody entered.")

q(0, "A planner types -520 into the drilling capex box of the EGINA FPSO concept. What does the engine answer?",
 "\"the drilling capex may not be negative: -520\", which names the field and quotes the value back so the cell can be found.",
 ["It takes the value as entered in magnitude and prices the concept on the full 2250.0000 million USD, noting in the case the sign that it corrected.",
  "It nets the -520 against the facilities figure of 1350.0000 million USD and prices the concept on what is left.",
  "It refuses the whole plan, since a negative entry anywhere in the concepts section stops the document being generated."],
 "A capex typed as text comes back the same way, \"the concept capex is not a number: lots\", naming the field and repeating what was typed.")

q(2, "A concept is entered with its drilling and subsea figures typed and its facilities cost left for later. What happens when somebody prices it?",
 "It returns a screening NPV on a capex missing its largest component, and complains about nothing.",
 ["It is refused until the facilities cost is entered, since the engine checks a concept's three fields against its concept type before pricing.",
  "It is priced on the facilities figure carried by the other concept in the plan, 180.0000 million USD, as the nearest estimate the studio holds.",
  "It is priced and marked provisional, with a note naming the empty field."],
 "A concept with one populated field has a capex, so the refusal fires only when all three are empty: check the three fields against the total before quoting anything downstream.")

q(1, "A planner puts the whole 2250.0000 million USD into one capex box rather than into the three fields. What does the engine return, and what has gone?",
 "The same total capex of 2250.0000 million USD, and with it the split that said how much was drilling, how much facilities and how much subsea.",
 ["A refusal, since a pre-totalled figure is not one of the three fields the engine reads and the concept counts as uncosted.",
  "The same total, and nothing has gone, since the three fields are a display and the engine adds them into one figure before it prices anything.",
  "A total of 2250.0000 million USD booked as facilities, since a single capex entry is carried into the largest of the three fields."],
 "A concept with at least one capex figure has a capex, so nothing complains; the split of 520.0000, 1350.0000 and 380.0000 is what said the money was going into a vessel.")

q(3, "How does the FPSO development reach a lifecycle cost of 4150.0000 million USD?",
 "Capex of 2250.0000 plus 95.0000 a year across 20.0000 years, which is 1900.0000.",
 ["Capex of 2250.0000 plus the operating cost of 3049.6464 million USD that the Base case burns over the profile it prices.",
  "Capex of 2250.0000 plus 1900.0000 of operating cost plus the decommissioning provision of 260.0000 million USD in the cost breakdown.",
  "Capex of 2250.0000 discounted at 10.0000 percent plus the 95.0000 a year."],
 "The tie-back reaches 1330.0000 the same way, 730.0000 plus 40.0000 across 15.0000 years, and nothing in either sum is discounted.")

q(1, "What is the life field of 20.0000 years doing to the FPSO's lifecycle cost?",
 "Turning the annual 95.0000 million USD into the 1900.0000 added to the capex, so a life longer than the concept will really run overstates the total by the difference.",
 ["Discounting the operating cost across 20.0000 years, which is how 95.0000 a year comes to 1900.0000 rather than a larger figure.",
  "Setting the years the production shape declines over, with no part in the lifecycle sum itself.",
  "Capping the operating cost at the capex of 2250.0000 million USD, which is why the 1900.0000 stops short of it."],
 "Operating cost of 1900.0000 million USD is most of the way to the 2250.0000 of capex, so the life field is carrying real weight in that total.")

q(3, "The lifecycle totals are 4150.0000 million USD for the FPSO and 1330.0000 for the tie-back. What can that pair of figures not do?",
 "Rank the two concepts by value.",
 ["Say how much cash each concept consumes in total, which needs a year by year profile rather than a plain sum of two cost lines.",
  "Show which concept commits more capital, since the operating cost of 1900.0000 million USD dominates the FPSO's own total.",
  "Be set against each other at all, since the two concepts run for different lives of 20.0000 years and 15.0000 years."],
 "A lifecycle cost is money as it is spent, with no discounting, no price, no royalty and no tax in it, and the ordering by value comes from the NPVs of 2015.4123 and 1013.7182 million USD.")

q(2, "The EGINA cost breakdown carries a decommissioning provision of 260.0000 million USD typed as ABEX. Where does it sit inside the concept's lifecycle of 4150.0000 million USD?",
 "Nowhere: the engine's totals are CAPEX 2250.0000 and OPEX 95.0000 a year, and an ABEX line is in neither of them.",
 ["In the operating cost of 1900.0000 million USD, spread across the 20.0000 years the concept is expected to run for.",
  "In the capex of 2250.0000 million USD, since a provision is committed at sanction with the rest.",
  "In the lifecycle once the facility's own decommissioning estimate of 204.5029 is added to it, which is how 4150.0000 covers the end of the field's life."],
 "Facilities carry their own estimate of the same thing, 204.5029 million USD for the Egina FPSO, so two figures for the end of life sit outside the 4150.0000, and the case charges the plan's own line in production year 20.")

q(0, "The FPSO concept's profile reads 60.0000, 60.0000, 60.0000, 54.0000, 48.6000 and 43.7400 kbpd. How is that 54.0000 arrived at?",
 "Year 3 multiplied by 0.900000, the fixed factor applied to every year once the plateau ends at year 3.",
 ["The peak of 60.0000 kbpd cut by the share of the life already produced.",
  "The peak of 60.0000 kbpd scaled to what is left of the oil P50 of 130.0000 MMbbl after three years at plateau.",
  "The rate the reservoir can still deliver once the plateau wells decline, which the engine reads off the recovery factor."],
 "The factor never changes, so year 5 is 48.6000 and year 6 is 43.7400, and the last year of the profile reads 10.0063 kbpd.")

q(3, "A peak rate and a life draw the whole screening profile. What does the engine check that profile against before returning a screening case?",
 "Nothing at all.",
 ["The oil P50 of 130.0000 MMbbl, which is why a plateau the reserves cannot feed is cut back before the case is priced.",
  "The 4 wells the plan carries, so the plateau is held to what those wells can deliver at the concept's peak rate.",
  "The recovery factors of 0.340000 and 0.280000 in the reserves table, which set how steeply the profile may decline."],
 "The plan's oil P50 of 130.0000 MMbbl is never consulted, so a concept whose plateau and life the reserves cannot support still returns a full set of screening economics.")

q(1, "An FPSO concept is given a start date of 2028-02-29. When does it reach first oil, and why that date?",
 "2031-03-01, because the engine adds the 36 whole months an FPSO carries and lands on a date that exists.",
 ["The last day of February in that year, because a start on a leap day is moved back before the whole months are added.",
  "2030-04-01, because first oil for this concept type is fixed there.",
  "It is refused, because the engine will not date a schedule from a leap day."],
 "The duration belongs to the concept type, 36 months for an FPSO against 24 for the tie-back, so moving the sanction date moves first oil with it.")

q(0, "A concept carries no start date and no today is passed in. What does the engine do, and what is the refusal protecting?",
 "It answers \"the concept has no start date: enter one, or pass today to date the schedule from\", so that no date in a plan is ever picked up off the machine that opened it.",
 ["It dates the schedule from the day the plan was opened and stamps that day on the case, so a reader can see which one was used.",
  "It dates the schedule from the other concept's sanction date of 2027-04-01 and records where the date was borrowed from.",
  "It returns the 36 months as a duration with no dates attached and leaves the reader to place it on a calendar."],
 "A schedule that dates itself from a clock slips every day nobody opens it, so two people reading one plan a month apart get different first oil dates.")

emit(Q, '/root/ec-wip-fdp/banks/ec6b_m03.json')
finish()
