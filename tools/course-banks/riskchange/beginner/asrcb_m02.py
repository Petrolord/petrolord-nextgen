import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Associate m02, The Matrix and Its Bands. Written from digest.txt
# SECTION 2, which is the five lessons of this module: five levels on two axes,
# twenty five cells and one product, four bands found by their lower edges,
# the scores the grid cannot hold, and values off the scale.

q(2, "How does riskScoring turn a likelihood level and an impact level into a score?",
 "It multiplies the two whole levels, each on a scale from 1 to 5.",
 ["It adds the two levels and doubles the total, so the top cell reaches 20.",
  "It takes the larger of the two levels and squares it, so a single high axis dominates.",
  "It averages the two levels."],
 "The scale runs from 1 to 5 on each axis and a score is the product of the two levels. Likelihood 3 and impact 4 score 12, and that one multiplication is the whole scoring rule."),

q(0, "A spreadsheet import delivers a likelihood as the text \"3.0\" against an impact of 4. What score and band does the engine return?",
 "12, \"High\"",
 ["0, \"None\", because text is off the scale",
  "3, \"Low\"",
  "It refuses the text with ok false and a reason"],
 "A whole number written as text or with a decimal point is still that level. \"3\", \" 3 \" and \"3.0\" all score exactly as the number 3 does against an impact of 4: 12, \"High\"."),

q(3, "The value true arrives as a likelihood. Asked against an impact of 1, what does the engine show it reads true as?",
 "Level 1, since true against an impact of 1 scores 1",
 ["Level 5, the top of the scale, so it scores 5",
  "No level, so it scores 0 and bands \"None\" as false does",
  "Level 3, the middle of the scale, so it scores 3"],
 "True against an impact of 1 scores 1, so true is read as level 1, and true against an impact of 5 scores 5, \"Medium\". False against an impact of 1 scores 0, \"None\". The register's own form stores whole numbers, so this is a value the form never writes."),

q(1, "Counted from the grid of twenty five cells, how many cells band \"Medium\"?",
 "7 cells",
 ["6 cells",
  "8 cells",
  "4 cells"],
 "The grid gives \"Critical\" 6, \"High\" 4, \"Medium\" 7 and \"Low\" 8, and 6 plus 4 plus 7 plus 8 is 25, one band for every cell."),

q(1, "How many distinct scores does the five by five grid hold?",
 "14",
 ["25",
  "11",
  "15"],
 "The grid has twenty five cells and 14 distinct scores, because the same product sits in several cells, as 20 does at likelihood 4 impact 5 and at likelihood 5 impact 4. The 11 whole numbers from 1 to 25 that no cell holds make up the rest."),

q(0, "Which of these whole numbers is the score of no cell on the grid?",
 "18",
 ["16",
  "20",
  "15"],
 "No two whole levels from 1 to 5 multiply to 18, so it is one of the 11 numbers no cell holds: 7, 11, 13, 14, 17, 18, 19, 21, 22, 23, 24. 16 is 4 by 4, 20 is 4 by 5 and 15 is 3 by 5."),

q(0, "A score of 26 reaches riskScoring, from somewhere other than two levels. Which band does it read?",
 "\"Critical\", found by its lower edge of 15",
 ["\"None\"",
  "It is refused as above the grid",
  "\"High\""],
 "Each band is found by its LOWER edge only, so any score that reaches 15 is \"Critical\". The upper edge of 25 printed in the band table is a label rather than a limit, and this is a stated limit of the engine that the course grades nothing on."),

q(2, "What band does a score of 14.5 read?",
 "\"High\", by the lower edge at 10",
 ["\"Critical\", after rounding up to 15",
  "\"None\", as a fraction is off the scale",
  "\"Low\""],
 "14.5 reaches the lower edge of \"High\" at 10 and falls short of \"Critical\" at 15, so it reads \"High\". A fraction as a LEVEL is off the scale, while a score is only ever compared with the lower edges."),

q(3, "A score equals 10 exactly. How does the engine band it, and why?",
 "\"High\", as a score equal to a lower edge belongs to that band.",
 ["\"Medium\", as lower edges are excluded.",
  "\"Medium\", as a tie goes down.",
  "\"Critical\", because 10 is the product of 5 and 2, which sits on the top row of the grid."],
 "Reading from the top, 10 does not reach 15 and does reach 10, so it is \"High\". There is no gap between bands: the upper edge of \"Medium\" at 9 sits one below the lower edge of \"High\"."),

q(0, "An assessor who cannot choose between 2 and 3 writes 2.5 as the likelihood, with impact 4. Which result follows?",
 "A score of 0 and the band \"None\"",
 ["A score of 12 and the band \"High\", after rounding 2.5 up to 3",
  "A score of 8 and the band \"Medium\", after rounding 2.5 down to 2",
  "10, \"High\""],
 "The scale is five WHOLE levels. A fraction is off the scale and unscored, the same as a level of 6 or a blank, and the engine returns 0 and \"None\" rather than guessing which level the assessor meant."),

q(1, "A likelihood of 6 is handed in against an impact of 4. What happens to it?",
 "It is unscored: 0 and \"None\".",
 ["Capped at 5: 20, \"Critical\".",
  "It is multiplied as given and scores 24, \"Critical\", by the lower edge.",
  "It is refused with ok false and the reason that 6 is above the scale."],
 "The scale stops at 5. A 6 might be a typing error for 5 or a level from a company scale with more steps, and the engine does not know, so it does not pick. It returns a score of 0 and the band \"None\"."),

q(2, "Why is the band \"None\" kept apart from \"Low\" when both sit at the bottom of the scores?",
 "So that an unscored risk can never be counted as a low one.",
 ["Because \"None\" is kept for closed risks and \"Low\" for live ones, so it is a status and never a band.",
  "Because \"None\" covers the residual score and \"Low\" covers the inherent score of the same risk.",
  "So the heatmap has a fifth colour for scores above the grid."],
 "\"None\" is the one band that means no score. A score of zero or below reads \"None\", and keeping it apart means a risk the engine could not score cannot be mistaken for a small one."),

q(2, "One risk sits at likelihood 5, impact 1 and another at likelihood 1, impact 5. What does their band fail to tell a reviewer?",
 "Which of the two axes carries the high level, since both score 5 and band \"Medium\".",
 ["Whether either of them is live, since the band depends on the status.",
  "Nothing, since two risks with the same score must be the same kind of risk.",
  "Which of them is unscored, since one of the two bands \"None\"."],
 "The product does not care which axis a level sits on, so one likely and moderate risk and one rare and severe risk can share a score and a band. The register keeps both levels on the record for exactly that reason."),

q(0, "A register row carries a score of 13 beside its two levels. What should a reviewer conclude?",
 "Something other than the product of two whole levels produced it, although the engine still bands it \"High\".",
 ["The risk sits between two cells, and the engine rounds it to 12 before banding it.",
  "The risk is unscored, because 13 is a score the engine reads as \"None\".",
  "Nothing, since 13 is an ordinary cell on the fourth row of the grid."],
 "13 is one of the 11 whole numbers from 1 to 25 that no cell holds, so the record cannot have come from two whole levels on this scale. The band looks normal, which is why the check has to multiply the levels."),

q(3, "The band table prints 14 as the upper edge of \"High\", and 14 is a number no cell of the grid holds. What does that show about the printed upper edges?",
 "They are labels for people; no score is tested against them.",
 ["They are ignored for \"High\" only, because 14 cannot be a product of two levels.",
  "They are limits, so a score above one reads \"None\" until the next band's lower edge.",
  "They are the edges the engine tests first, before it reads any lower edge at all."],
 "The band is found by its lower edge alone, so the upper edge printed beside each floor is a label. A label can name a number the grid never produces, which is one more reason to read the lower edges only."),

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/beginner/asrcb_m02.json', label='asrcb_m02', expect_n=15)
finish()
