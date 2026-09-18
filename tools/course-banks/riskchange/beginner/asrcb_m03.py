import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Associate m03, Residual and Appetite. Written from digest.txt
# SECTION 3 and the OBODO rows the module's five lessons quote: inherent and
# residual, falling back one axis at a time, a blank beside an off-scale level,
# a target and three answers, and when there is no answer.

q(3, "The Risk Register stores one band per risk in a column called rating. Which band is it?",
 "The inherent band, written from the engine on every save",
 ["The residual band, since it is the risk as it stands with its controls",
  "The higher of the inherent and residual bands",
  "Whichever band the assessor last chose to save by hand, with the engine checking only its spelling"],
 "rating is the INHERENT band and it always matches the inherent levels on the record. The residual band has to be read separately, and it is the residual score that appetite compares with the target."),

q(1, "Appetite on a risk compares two values. Which two?",
 "The residual score and the risk's own target",
 ["The inherent score and the risk's own target",
  "The residual score and one target shared by the whole register",
  "The inherent score and the residual score, so a risk is within appetite when its controls lower it"],
 "The question appetite asks is whether the organisation can live with the risk as it stands, with its controls in place, so it reads the RESIDUAL. The target is set by people for each risk."),

q(0, "A risk has inherent likelihood 4 and impact 5. Its residual likelihood is 2 and its residual impact is left blank. What is its residual?",
 "10, \"High\"",
 ["0, \"None\", as the blank impact is read as zero",
  "20, \"Critical\", as the whole residual falls back to the inherent score",
  "2, \"Low\""],
 "A residual axis that has not been assessed falls back to the inherent level on that axis alone. The blank impact becomes the inherent 5 and the assessed likelihood of 2 is kept: 2 times 5 is 10, \"High\"."),

q(2, "Take a risk scored 4 by 5 before controls. The assessor fills in only the residual impact, as 3, and leaves the likelihood empty. Which residual does the engine derive?",
 "12, \"High\", with the blank likelihood read as the inherent 4",
 ["6, \"Medium\"",
  "15, \"Critical\", with the blank read as the top level",
  "0, \"None\", because a residual with one blank axis is left unscored"],
 "The blank likelihood falls back to the inherent 4 and the assessed impact of 3 is used, so the residual is 4 times 3, which is 12, \"High\". Each axis is decided separately."),

q(0, "OB-03 is \"Under Review\" with inherent levels of 5 and 4. Neither residual axis has been assessed. What is its residual?",
 "20, \"Critical\"",
 ["0, \"None\", because nothing has been assessed",
  "It has no residual until one axis is assessed",
  "4, \"Low\""],
 "Null, an absent key and a blank all mean \"not assessed\", and each unassessed axis falls back to its inherent level. So OB-03's residual is 5 times 4, the same 20 as its inherent score: a risk whose controls have not been assessed is carried at its inherent level."),

q(3, "An assessor enters a residual likelihood of 2.5 and a residual impact of 3 on a risk with inherent levels 4 and 5. What is the residual?",
 "0, \"None\": the residual is unscored",
 ["12, \"High\", with 2.5 falling back to the inherent 4",
  "9, \"Medium\", with 2.5 rounded to 3",
  "6, \"Medium\", with 2.5 rounded to 2 so that the reading stays cautious"],
 "A residual axis that WAS assessed with a value off the scale does not fall back. It leaves the residual unscored, 0 and \"None\", because replacing a value somebody chose with a level they did not choose would hide their error."),

q(1, "A residual likelihood of 7 is entered against a residual impact of 3. What does the engine do with the 7?",
 "It leaves the residual unscored, since 7 was assessed and is off the scale.",
 ["It caps the 7 at 5 and scores the residual 15, \"Critical\".",
  "It falls back to the inherent likelihood, because it treats 7 as a blank.",
  "It keeps it and scores 21, which bands \"Critical\"."],
 "A likelihood of 7 is above the top level of 5. It is an assessed value, so it does not fall back, and the residual is 0, \"None\". The engine neither caps nor rounds."),

q(2, "Why does the engine let a blank residual axis fall back and refuse to let an off-scale one do the same?",
 "A blank means nobody has looked yet, while an off-scale value means somebody looked and wrote something the scale cannot hold.",
 ["A blank is always a typing error, while an off-scale value is usually a deliberate choice.",
  "Falling back is allowed for likelihood only, and an off-scale value is usually on impact.",
  "An off-scale value would push the score above 25."],
 "Falling back to the inherent level on an off-scale value would throw the assessor's judgement away without telling anyone. Leaving the residual unscored keeps the problem visible where the owner can correct it to a whole level."),

q(1, "A residual of 8 is compared with a target of 8. What is the appetite answer?",
 "\"Within appetite\"",
 ["\"Above appetite\"",
  "\"Not set\"",
  "\"Within appetite\" only when the inherent score is also 8"],
 "A residual EQUAL to the target is within appetite. The target is the most residual risk the organisation will carry for that hazard, so reaching it exactly is still acceptable."),

q(0, "A risk has a residual of 6 and a target of 0. What does appetite read?",
 "\"Not set\", as if no target existed",
 ["\"Above appetite\", as 6 is above 0",
  "\"Within appetite\"",
  "\"Above appetite\" for every risk with a residual band above \"Low\""],
 "With no target, or a target of zero, or a residual that cannot be scored, the answer is \"Not set\". A target of zero reads the same way as a target nobody set."),

q(3, "A risk's residual cannot be scored, so its residual score is 0, and its target is 8. What does appetite read?",
 "\"Not set\", with no residual to compare",
 ["\"Within appetite\", because 0 is below 8",
  "\"Above appetite\", since an unscored residual is treated as a failure",
  "\"Within appetite\" until the residual is scored"],
 "Appetite compares the residual score with the target, and an unscored residual leaves one side of that comparison empty. The engine gives the same \"Not set\" here as it gives for a missing target or a target of zero."),

q(2, "OB-01 has a residual band of \"High\" and reads \"Within appetite\". OB-02 has a residual band of \"Medium\" and reads \"Above appetite\". How can both be right?",
 "Each is measured against its own target: OB-01 has 10 against 10 and OB-02 has 8 against 6.",
 ["They cannot both be right, so one of the two targets must have been typed into the wrong row.",
  "Appetite reads the inherent band, which is higher on OB-02 than it is on OB-01.",
  "OB-02 is closed, so its appetite is read from an older band."],
 "A higher band does not mean a worse appetite answer. The band ranks risks against one another on a common scale, and appetite measures each one against the level the organisation set for that hazard."),

q(0, "OB-06 has a residual of 4, \"Low\", and reads \"Not set\" for appetite. Which side of the comparison is missing?",
 "The target: none has been set.",
 ["The residual, which has not been assessed on either axis.",
  "Both sides, since a \"Low\" residual is never compared with anything.",
  "Neither: \"Not set\" is how the engine spells a pass on a \"Low\" residual."],
 "OB-06 has a perfectly good residual and no target. It could well be acceptable, and the engine will not say so, because nobody has decided what acceptable means for this hazard. The fix is a target on the record."),

q(2, "OB-08 has a target of 5 and reads \"Not set\" for appetite. What does its record need before it can have an appetite answer?",
 "A residual likelihood that is a whole level from 1 to 5, because its 2.5 is off the scale.",
 ["A target, because a target of 5 is below the lower edge of \"Medium\".",
  "A residual impact, because its impact axis was left blank.",
  "An inherent impact on the scale."],
 "OB-08's residual likelihood of 2.5 is off the scale, so its residual is 0, \"None\", and appetite has no residual to compare. OB-11 is the risk whose inherent impact of 6 is off the scale."),

q(1, "Which of these does the engine read as a residual axis that has not been assessed?",
 "Null, an absent key or a blank form field",
 ["A zero, a null or a blank form field",
  "Any value off the scale, including a fraction",
  "A blank form field only, since a null on a residual axis is refused with a reason"],
 "Null, an absent key and a blank form field all mean \"not assessed\", and each falls back to the inherent level on its own axis. A value off the scale is an assessment and leaves the residual unscored."),

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/beginner/asrcb_m03.json', label='asrcb_m03', expect_n=15)
finish()
