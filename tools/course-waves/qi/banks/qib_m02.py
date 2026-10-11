import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Associate m02, The data inventory.
# Sources: what a QI study needs from each well; the twelve-well inventory;
# the usability rule, the Ekene matrix and its counts; the issue register,
# its severities, its remedy and the user's choices; what is never graded.

q(1, "Which two curves does the course say rock physics needs from a well before it can run at all?",
 "A sonic for Vp, and a density log.",
 ["A shear sonic and a gamma ray log.",
  "Porosity and saturation curves.",
  "Checkshots and a deviation survey, because without them the well cannot be placed in time or depth."],
 "Rock physics needs Vp, from a sonic, and density; sonic and density are the two required items, graded missing when absent. Shear, porosity and saturation are limited when absent, checkshots tie the well to the seismic, and the survey places it in depth, with fewer than two checkshot levels and no survey both limited.")

q(3, "What does a measured shear log change about a well's results in a QI study?",
 "The shear-dependent results rest on a measurement; without one they rest on an estimate.",
 ["It lets rock physics run at all, so a well without shear is graded missing.",
  "Nothing, since QI computes Vs from Vp by Greenberg and Castagna at every well.",
  "It ties the well to the seismic in time."],
 "A measured shear log means the shear-dependent results rest on a measurement, where without one they rest on an estimate; shear is limited when absent because the study can go on with an estimate. Rock physics runs on Vp and density, so a well without shear is limited, and checkshots are what tie the well to the seismic; every logged Ekene well carries DTS.")

q(0, "Which logged Ekene well has no density log, and what does the matrix grade its cell?",
 "Ekene-9, graded missing; its density item reads \"No density over the zone.\"",
 ["Ekene-9, graded limited, since density can be estimated as shear is.",
  "Ekene-10, the one well with 12 curves, graded limited.",
  "Ekene-11, the planned well, graded missing on every item."],
 "Ekene-9's curves are CALI, GR, DT, DTS and RT, so it is the well without density, and density is a required item graded missing when absent. Ekene-10 carries density, and Ekene-11 has no logs, so it is not among the 10 graded cells.")

q(2, "Ekene-1 grades good on sonic, density, shear, checkshots, datum and survey, and limited on porosity, shale volume and saturation. What is its cell?",
 "Limited: a cell takes the worst of its items.",
 ["Good: six of its nine items are good.",
  "Missing: three limited items add up to one missing item.",
  "Good for the elastic work and limited for the substitution: two cells."],
 "QI Studio grades each well item by item and a cell takes the worst of its items, so Ekene-1's cell is limited. The matrix prints one cell per well and target interval, and nine of the ten Ekene cells are limited this way.")

q(2, "Why does no cell in the Ekene usability matrix grade good?",
 "The LAS files carry no porosity, shale volume or saturation curve, so those three items read as absent and limited at every logged well.",
 ["Every logged well lacks a deviation survey, which grades limited and so holds every cell below good.",
  "Fewer than two checkshot levels were recorded in each logged well, which grades the checkshot item limited.",
  "Shear is estimated at every well, and an estimate is graded limited whatever curves the files carry."],
 "The matrix reads the porosity, shale volume and saturation curves the LAS files carry, and they carry none of the three, so each is limited and the counts are good 0, limited 9, missing 1. The survey, checkshot and shear items are good at every limited well, with 21 or more checkshot levels and a DTS log in each.")

q(0, "How many issues does QI Studio suggest on the Ekene matrix, and of what severity?",
 "31: 1 high and 30 medium.",
 ["10, one per graded well.",
  "3, one for each item kind below good, each raised once for the whole field.",
  "32: 1 high, 30 medium, and 1 more raised for Ekene-11 as a planned well with no logs."],
 "suggestedIssues raises one issue per well and item kind that is not good: 31 issues on this matrix, 1 high and 30 medium. The high one is Ekene-9's density, and the thirty medium ones are the three curve items at each of the 10 logged wells; Ekene-11 is not in the matrix.")

q(3, "A logged well has no deviation survey. What issue does QI Studio suggest for that item?",
 "A medium issue, since no deviation survey grades limited.",
 ["A high issue, since a well that cannot be placed in depth is missing.",
  "None: suggestedIssues lists missing items only.",
  "A high issue with the density log remedy."],
 "No deviation survey is limited, and a limited item raises a medium issue while a missing one raises a high issue. The register lists limited items too, which is where its 30 medium issues come from, and the density remedy belongs to a missing density log.")

q(1, "What does the user do with each issue that QI Studio suggests?",
 "Keeps, edits or dismisses it.",
 ["Nothing: each line closes on its own when the data arrives.",
  "Accepts or rejects it all.",
  "Grades it for the capstone."],
 "QI Studio suggests the issues and the user keeps, edits or dismisses each one. No usability grade or category is ever graded, and every capstone field is an engine return value on a held-out synthetic case.")

q(0, "Besides sonic and density, which item does the usability rule grade missing when it is absent?",
 "An unset elevation.",
 ["A shear log, since without measured Vs every result that depends on shear stops at that well.",
  "Fewer than two checkshot levels, since the well then cannot be tied to the seismic in time.",
  "No deviation survey, since the depths of a deviated well cannot be read straight down."],
 "Sonic and density are missing when absent, and an unset elevation is missing too. Shear is limited when absent because the study can go on with an estimate, and fewer than two checkshot levels and no deviation survey are both limited.")

q(2, "A logged well carries one checkshot level. How does the usability rule grade its checkshot item?",
 "Limited.",
 ["Missing, because a checkshot is what ties a well to the seismic, and no tie can be made from a single level.",
  "Good, since one level is enough to tie the well and only a well with no checkshots at all is graded below good.",
  "Missing for a vertical well and limited for a deviated one, which also carries its deviation survey."],
 "Fewer than two checkshot levels is limited under QI Studio's rule, whatever the kind of well. On Ekene every logged well carries 21 or more levels, so the item is good everywhere.")

q(3, "Ekene-11 is planned and Ekene-12 is survey_only. How do they enter the Ekene usability matrix?",
 "They do not: neither has logs, and the matrix holds the 10 logged wells.",
 ["Both graded missing on every item, each a high issue.",
  "Both graded limited, since a planned well can be logged.",
  "Ekene-11 is graded missing on density and Ekene-12 limited on its deviation survey item."],
 "10 of 12 wells have logs, and the counts are over those 10 cells: good 0, limited 9, missing 1. The register's single high issue is Ekene-9's density, so neither Ekene-11 nor Ekene-12 raises one.")

q(1, "Of the 10 logged Ekene wells, how many carry a density log?",
 "9.",
 ["10, since every logged well that carries a sonic also carries a density log in the inventory.",
  "4, the pack wells Ekene-1 to Ekene-4, which are the only wells with RHOB in their curves.",
  "12, counting the planned well and the survey location, which are graded as if logged."],
 "Of the 10 logged wells, 10 carry a shear sonic, 9 a density log and 10 two or more checkshot levels. Ekene-9 is the well without density, and Ekene-5 to Ekene-10 apart from Ekene-9 carry RHOB as well as the pack wells.")

q(3, "Where does the course say porosity, shale volume and saturation curves come from in practice?",
 "From Petrophysics Studio, before the QI study starts.",
 ["From the LAS files of each well.",
  "From the Greenberg-Castagna regression, the published estimate a limited item falls back on when a curve is absent.",
  "From the engines, which compute porosity and saturation from Vp and density whenever the caller leaves them out."],
 "In practice the porosity, shale volume and saturation curves come from Petrophysics Studio before a QI study starts, which is why the pack carries the kit's PHIT, VSH and SW for Ekene-1 to Ekene-4. The LAS files carry none of the three, Greenberg-Castagna estimates shear from Vp, and the engines take porosity and saturation as stated inputs.")

q(0, "Which logged Ekene wells are deviated, so that each needs its survey to be placed in depth?",
 "Ekene-8, Ekene-9 and Ekene-10.",
 ["Ekene-1 to Ekene-4, the pack wells.",
  "Ekene-11 and Ekene-12, the two wells with no logs.",
  "Ekene-5, Ekene-6 and Ekene-7."],
 "The inventory lists Ekene-8, Ekene-9 and Ekene-10 as deviated, each with 24 checkshot levels and a survey graded good. The pack wells and Ekene-5 to Ekene-7 are vertical, Ekene-11 is planned and Ekene-12 is survey_only.")

q(1, "What remedy does QI Studio suggest for Ekene-9's one high issue?",
 "\"Request the density log; rock physics cannot run without it.\"",
 ["Estimate density from Vp by Greenberg and Castagna.",
  "Dismiss it, since Ekene-9 has shear and 24 checkshot levels.",
  "Request a shear log, the curve Ekene-9 lacks."],
 "The suggested remedy for a missing density log is \"Request the density log; rock physics cannot run without it.\" Greenberg-Castagna estimates shear, Ekene-9's five curves are CALI, GR, DT, DTS and RT, so it has DTS, and a remedy is suggested for the user to keep, edit or dismiss.")

emit(Q, '/root/qi-wip-qi/banks/qib_m02.json', expect_n=15)
finish()
