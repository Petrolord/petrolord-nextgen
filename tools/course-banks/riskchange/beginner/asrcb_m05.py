import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Associate m05, The Register as a Whole. Written from digest.txt
# SECTION 5, which is the five lessons of this module: live and not live, one
# row derived once, counting by band, four populations of one register, and
# what each heatmap plots.

q(2, "Which four statuses does the risk engine treat as live?",
 "\"Open\", \"Under Review\", \"Mitigated\" and \"Realized\"",
 ["\"Open\", \"Under Review\", \"Draft\" and \"Realized\"",
  "\"Open\" and \"Under Review\" only",
  "\"Open\", \"Under Review\", \"Mitigated\" and \"Closed\", which together cover every risk that has ever been assessed"],
 "Live statuses are the risks an organisation still carries. \"Draft\" is not yet a carried risk and \"Closed\" is one the organisation has stopped carrying, so those two are not live."),

q(0, "Why is a \"Mitigated\" risk still in the live group?",
 "Mitigation lowers the residual without removing the risk, so the organisation still carries it and its controls still need reviewing.",
 ["Because its inherent band is always \"Critical\" or \"High\".",
  "Because it has not yet been given a target, so appetite cannot be read on it.",
  "It is live only until its next review date, after which the engine reads it as closed."],
 "The hazard is still on the facility and the controls are what keep it at its residual level. The only statuses that leave the live group are \"Draft\" and \"Closed\"."),

q(1, "How many risks does the OBODO register hold, and how many of them are live?",
 "12 risks, 10 of them live",
 ["12 risks, 8 of them live, as the dashboard counts",
  "10 risks, all live, since drafts are not held in the register",
  "12 risks, 9 of them live"],
 "The two that are not live are OB-09, \"Draft\", and OB-10, \"Closed\". 12 risks minus those 2 leaves the 10 live ones."),

q(3, "Handed a list of risks, what does countByBand do about their statuses?",
 "Nothing: it counts whatever list it is handed.",
 ["It drops every \"Draft\" and \"Closed\" risk before counting.",
  "It counts live risks only, unless the caller passes every risk.",
  "It refuses a list that holds a risk which is not live, and names that risk in its reason."],
 "countByBand does not filter by status. Which risks to hand over, and whether to count inherent or residual, are both choices the caller makes."),

q(3, "Counted over every OBODO risk on the inherent band, how many are \"Critical\"?",
 "5",
 ["4",
  "1",
  "6"],
 "OB-01, OB-02, OB-03, OB-08 and OB-10 have inherent scores of 15, 16, 20, 15 and 20, all \"Critical\". Every risk counted inherent reads 5, 3, 2, 1 and 1 across \"Critical\", \"High\", \"Medium\", \"Low\" and \"None\", which adds to 12."),

q(1, "Between the count of every risk inherent and the count of live risks inherent, \"Critical\" drops from 5 to 4. Which risk left, and why?",
 "OB-10, because it is \"Closed\"",
 ["OB-09, because it is \"Draft\"",
  "OB-08, because its residual is unscored and so it is taken out of the live list",
  "OB-03, because it is \"Under Review\""],
 "Only the list changed. OB-10 is \"Closed\" with an inherent score of 20, so it leaves the live count. OB-09 also leaves, from the \"Low\" column, which drops from 1 to 0."),

q(0, "On the OBODO register, which population gives a \"Critical\" count of 1?",
 "Live risks counted on the residual band, where OB-03 alone is \"Critical\"",
 ["Live risks counted on the inherent band",
  "Every risk counted on the inherent band",
  "The Heatmap tab's population"],
 "The four populations give Critical counts of 5, 1, 4 and 1: every risk inherent, every risk residual, live risks inherent and live risks residual. OB-03's residual is 20 because neither residual axis is assessed."),

q(2, "Across its four populations, the OBODO register gives Critical counts of 5, 1, 4 and 1. What decides which of those a tile shows?",
 "Two choices the caller makes: which risks to hand over, and whether to count inherent or residual.",
 ["Only the as-of date the count was run on.",
  "The band table, which differs between the inherent and residual scores.",
  "Which of the four counts the engine judges to be correct for the register, which it reports as the headline figure."],
 "The same register gives 3 different values depending on those two choices. Each count is right for the question it answers, and a dashboard tile has to say which question that is."),

q(0, "Which OBODO risks land in the \"None\" column when all twelve are counted on their residual scores?",
 "2: OB-08 and OB-11",
 ["1: OB-11",
  "2: OB-03 and OB-11, as neither has an assessed residual",
  "3: OB-06, OB-08 and OB-11"],
 "OB-08 is unscored on the residual because 2.5 is not a whole level, and OB-11 because its impact of 6 leaves both of its scores at 0. OB-03 is counted \"Critical\", since its blank axes take the inherent levels."),

q(3, "Why does countByBand return a fifth column, \"None\", beside the four bands?",
 "So the columns still add to the length of the list, and an unscored risk stays visible.",
 ["So that closed risks can be counted apart from the live ones.",
  "It is where the engine puts risks above 25.",
  "So a reader can add \"None\" to \"Low\" to get the count of risks needing no action."],
 "OB-11 has no inherent score and must be counted somewhere. A report that shows only the four bands drops it without a trace, and a reader totalling those four columns finds one risk missing with no clue which."),

q(2, "Which population does the Risk Register dashboard count, and on which score?",
 "Only \"Open\" and \"Under Review\" risks, on the inherent score",
 ["The four live statuses, inherent",
  "\"Open\" and \"Under Review\" risks, residual",
  "Every risk in the register on both scores, drafts and closed risks included, with the inherent count shown first"],
 "The dashboard counts Open and Under Review risks and plots them INHERENT. The Heatmap tab plots the four live statuses INHERENT, and the Assurance hub counts live risks through countByBand."),

q(1, "On OBODO the Heatmap tab reads \"High\" 3 and the dashboard reads \"High\" 1. Which risks make the difference?",
 "OB-04 and OB-07, which are live and outside the dashboard's population",
 ["OB-09 and OB-10, which are not live, and so the Heatmap tab leaves them out as well",
  "OB-05 and OB-04",
  "OB-08 and OB-11"],
 "The dashboard takes \"Open\" and \"Under Review\" only. OB-04 is \"Mitigated\" and OB-07 is \"Realized\", both live, both with an inherent band of \"High\", and 3 minus 2 is 1."),

q(1, "What does the Assurance hub show for \"Critical\" on the OBODO register?",
 "4 inherent and 1 residual, from countByBand called twice over the live risks",
 ["5 inherent and 1 residual, over every risk",
  "4 inherent only",
  "1, the residual count, since the hub hides the inherent score"],
 "The hub calls countByBand twice over the live risks, once inherent and once residual, and shows both. Those are the two live rows of the four populations."),

q(0, "OB-05 is \"Open\" with levels 2 and 5, residual levels 1 and 5, and a target of 4. What does deriveRiskFields give?",
 "Inherent 10, \"High\"; residual 5, \"Medium\"; \"Above appetite\"",
 ["Inherent 10, \"High\"; residual 5, \"Medium\"; \"Within appetite\"",
  "Inherent 10, \"Medium\"; residual 5, \"Low\"; \"Above appetite\"",
  "Inherent 10, \"High\"; residual 4, \"Low\"; \"Within appetite\""],
 "2 times 5 is 10, which reaches the lower edge of \"High\". 1 times 5 is 5, which reaches the lower edge of \"Medium\". A residual of 5 is above a target of 4."),

q(2, "Which band does the register store as OB-05's rating?",
 "\"High\", its inherent band",
 ["\"Medium\", the residual band it reads today",
  "\"Above appetite\"",
  "Both bands, joined as \"High\" to \"Medium\""],
 "rating is the INHERENT band, written from the engine on every save. OB-05's inherent band is \"High\" while its residual band is \"Medium\", and appetite is a separate answer."),

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/beginner/asrcb_m05.json', label='asrcb_m05', expect_n=15)
finish()
