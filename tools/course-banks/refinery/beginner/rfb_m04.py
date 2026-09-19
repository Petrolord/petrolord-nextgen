import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Associate m04, Throughput and the Gross Margin. Written from
# digest.txt SECTION 5, which is the five lessons of this module: nameplate,
# days and utilisation; utilisation is a fraction; the gross margin per barrel;
# the annual streams; and capital in the construction years.

q(2, "OKORDIA is run at a utilisation of 1, with its 5000 bpd and its 330 on-stream days unchanged. What annual throughput does the screen print?",
 "1650000.00 bbl",
 ["1518000.00 bbl, the firm supply figure",
  "1530000.00 bbl, as with every term left out",
  "5000 bpd over all 366 possible days"],
 "At utilisation 1 the plant runs at nameplate on every on-stream day and the engine prints 1650000.00 bbl. The firm supply case, 1518000.00 bbl, shares the capacity and the on-stream days and differs in utilisation alone. 1530000.00 bbl belongs to the engine's defaults.")

q(0, "OKORDIA is screened with its on-stream days box left blank. What annual throughput comes back?",
 "1530000.00 bbl, the figure the engine's defaults give",
 ["REFUSED: \"On-stream days must be between 1 and 366.\"",
  "1518000.00 bbl, as the blank keeps OKORDIA's 330 days",
  "0.00 bbl, since a blank day count runs no days at all"],
 "A schedule term left blank or left out reads as the engine's stated default for that term. With on-stream days blank the plant prints 1530000.00 bbl, as it does with every schedule term left out. OKORDIA's own inputs give 1518000.00 bbl, so check that each term is typed before reading the throughput.")

q(3, "Utilisation is tried on OKORDIA as 90, as -0.1, as 0 and left blank. Which entry returns an annual throughput of 0.00 bbl?",
 "0, which lies inside the range",
 ["-0.1, read as a plant that is shut",
  "The blank, read as nothing typed",
  "90, clipped to the top of its range"],
 "90 and -0.1 lie outside 0 to 1 and are refused with the example 0.9 for 90 percent. A blank utilisation reads as the engine's stated default and gives 1530000.00 bbl. A typed 0 is inside the range, so the engine answers it: annual throughput 0.00 bbl."),

q(1, "Which input carries the part of the year a plant is shut for maintenance, inspections and repairs?",
 "On-stream days, which OKORDIA sets at 330",
 ["Utilisation, which firm supply sets at 0.9200",
  "Capacity, the 5000 bpd of nameplate",
  "The variable operating cost of 3.2000 a barrel"],
 "On-stream days are the days in a year the plant runs at all. Utilisation is how hard it runs on those days. Folding one into the other counts the downtime twice or not at all.")

q(1, "OKORDIA's gross margin per barrel reads 4.5900. Which figures does the engine take it from?",
 "Gross value 83.7900, less crude 76.0000, less variable cost 3.2000",
 ["Gross value 83.7900, less crude 79.0000, less variable cost 3.2000",
  "Gross value 83.7900, less crude 76.0000, less fixed cost 7500000.00",
  "Revenue 127193220.00, less crude cost 115368000.00 and fixed opex"],
 "The engine states gross margin per barrel = gross value - crude cost - variable operating cost, all per barrel of crude. 79.0000 is the crude cost under tight supply, and the fixed cost is a yearly line in the streams.")

q(3, "Why does the screen keep the fixed operating cost of 7500000.00 a year out of the gross margin per barrel?",
 "Its cost per barrel depends on how many barrels there are.",
 ["It is paid in the construction years, before any barrel is run.",
  "It is folded into the capital's capex rows.",
  "It is too small beside the crude cost to move a figure at four decimals."],
 "A fixed cost spread per barrel would change every time the throughput did, and a margin that included it would describe one particular throughput. The engine keeps it as a yearly figure in the streams, starting in the first producing year.")

q(0, "The crude cost is raised on the panel and nothing else is touched. Which columns of the streams move?",
 "The crude cost column, while revenue stays still",
 ["Revenue and crude cost together, with crude run",
  "The fixed opex column, which follows the crude price",
  "Crude cost and capex, since capital buys the crude"],
 "Revenue is crude run times gross value, and the crude price is in neither. A change in capacity moves crude run, revenue and crude cost together; the fixed opex column moves only when the fixed operating cost itself changes.")

q(2, "Read year 1 of OKORDIA's streams. What does it carry?",
 "Producing false, crude run 0.00 bbl, capex 32000000.00",
 ["Producing true, crude run 1518000.00 bbl, no capex",
  "Producing false, fixed opex 7500000.00, no capex",
  "Producing true, capex 32000000.00, half the run"],
 "Year 1 is OKORDIA's second construction year: producing false, crude run 0.00 bbl and capex 32000000.00. Fixed opex starts in the first producing year: year 1 0.00, year 2 7500000.00.")

q(3, "With OKORDIA's 2 construction years and 20 operating years, which are the first and the last producing years?",
 "Year 2 first, and year 21 the last",
 ["Year 1 first, and year 20 the last",
  "Year 2 first, and year 22 last",
  "Year 0 first, and year 21 last"],
 "Years 0 and 1 carry the capital and nothing else. The first producing year is year 2 and the last is year 21, and the streams hold 22 years because they start at year 0.")

q(1, "How does the screen build the revenue of 127193220.00 in a producing year?",
 "Crude run 1518000.00 x gross value 83.7900",
 ["Crude run 1518000.00 x crude cost 76.0000",
  "Capacity 5000 x 330 days x the value 83.7900",
  "Crude run 1518000.00 x gross margin 4.5900"],
 "The engine prints revenue = crude run x gross value per barrel: 1518000.00 x 83.7900 = 127193220.00. Crude run times the crude cost of 76.0000 is the crude cost column, 115368000.00.")

q(0, "The screen prints 22 years in OKORDIA's streams. Which inputs give that count?",
 "2 construction years plus 20 operating years",
 ["20 operating years plus years 0 and 21 at either end",
  "The last year, 21, plus the first producing year",
  "22 producing years after the build is finished"],
 "Years in the streams are the construction years plus the operating years. The same rule gives 20 years with no construction period and 23 with three construction years.")

q(2, "OKORDIA is laid out with three construction years. What capex does each of them print, and what does the screen check?",
 "21333333.33 each, and the unrounded thirds sum to the capital: true",
 ["21333333.33 in each year, with the rounding cent put into the last",
  "32000000.00 in the first two years and nothing at all in the third",
  "64000000.00 in year 0, with the later construction years left at 0.00"],
 "The screen prints capital / construction years = 64000000.00 / 3. Each year is printed to the cent, and the engine carries the unrounded thirds, which sum to the capital: true. Nothing of the 64000000.00 is lost to rounding.")

q(2, "OKORDIA is laid out with no construction period at all. What does year 0 carry?",
 "Capex 64000000.00 and a crude run of 1518000.00 bbl",
 ["Capex 64000000.00 and a crude run of 0.00 bbl",
  "Capex 32000000.00 and a crude run of 1518000.00 bbl",
  "No capex, as the capital moves into the first operating year"],
 "With no construction period the capital is spent in year 0, the first operating year, and the plant also runs that year: year 0 capex 64000000.00, year 0 crude run 1518000.00 bbl, and 20 years in the streams.")

q(0, "The construction years on the panel go from 2 to 3. Which of these changes?",
 "The first producing year, from year 2 to year 3",
 ["The capital, which grows with the longer build",
  "The gross margin per barrel of 4.5900",
  "The annual throughput of 1518000.00 bbl"],
 "The capital typed into the screen is 64000000.00 in every case. Construction changes when the plant earns, and the streams grow from 22 years to 23. It does not change what a barrel earns or how many barrels a year are run.")

q(1, "The screen checks that every producing year carries the same figures as year 2, and prints true. What does that tell a reader about the streams?",
 "They carry no ramp up, price path or turnaround year.",
 ["Yields are re-checked for age each year.",
  "Year 2 is an average of the producing years.",
  "Only years 0 to 3 and year 21 are passed on for valuation."],
 "The streams are one producing year repeated, from year 2 to year 21. That keeps the valuation traceable, and it means no ramp up after start, no price path, no change in yields with age and no turnaround year.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/beginner/rfb_m04.json', label='rfb_m04', expect_n=15)
finish()
