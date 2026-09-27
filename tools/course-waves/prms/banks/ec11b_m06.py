import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Associate m06, Nigerian Terms in Words.
# Sources: the provisions of the Petroleum Industry Act 2021 and S.I. No. 37 of
# 2023 as the course quotes them; the engine's Nigerian notes and the
# refusals of the nigeria block; the Commission's published national gas
# figures (figures and date only); what was not found; the capstone brief's
# rehearsal on the Ekene figures. Every key rests on a digest line or an
# engine return re-run in /root/cat-wip-prms/scratch/bank-beginner/witness.mjs.

q(3, "Under s.78(8) of the Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021), what must a licensee do once the appraisal programme is complete?",
 "Declare a commercial discovery, declare a significant gas or crude oil discovery, or tell the Commission the discovery is of no interest.",
 ["Submit a field development plan within 90 days, whatever the outcome of the appraisal.",
  "Report the discovery's 1P, 2P and 3P to the Commission under the Act's reserves booking rule.",
  "Relinquish the area unless a commercial discovery is declared on the day the appraisal ends."],
 "Section 78(8) gives the three declarations: (a) a commercial discovery, (b) a significant gas or crude oil discovery, or (c) informing the Commission of no interest. A field development plan follows a commercial discovery within two years (s.79(1)); 90 days is the Commission's approval of a significant discovery notice under reg. 6(2). No gazetted booking rule was found, and relinquishment follows the end of a retention period.")

q(1, "After a licensee declares a commercial discovery, within what period does s.79(1) of the Petroleum Industry Act 2021 require a field development plan?",
 "Within two years of the declaration.",
 ["Within 60 days of the declaration.",
  "Within 10 years of the declaration date.",
  "Within five years of the declaration."],
 "The quoted text reads: \"licensee shall within two years of the declaration, submit to the Commission a\" (PIA s.79(1)). Sixty days is the notice of a significant discovery under reg. 5(1) of S.I. No. 37 of 2023, 10 years is the retention cap of s.78(9), and the five-year benchmark is a PRMS figure for the time-frame criterion.")

q(0, "For how long at most may a licensee retain the area of a significant discovery under s.78(9) of the Petroleum Industry Act 2021?",
 "Not more than 10 years from the day the declaration was made.",
 ["Not more than 8 years in deep water and 5 years onshore and in shallow water.",
  "For as long as the Commission decides, since the Act sets no upper limit.",
  "Two years, after which a field development plan must be submitted."],
 "The Act caps retention: \"which shall not be more than 10 years from the day the declaration was made\" (PIA s.78(9)). The 5 and 8 years are the minimum approval periods of reg. 6(3) of S.I. No. 37 of 2023, and the Commission may grant up to the Act's maximum. Two years is the field development plan period after a commercial discovery.")

q(2, "What does reg. 6(3) of the Significant Crude Oil and Gas Discovery Regulations, 2023 (S.I. No. 37 of 2023) set for an approval of retention?",
 "A minimum of five years onshore and in shallow water, and eight years in deep water.",
 ["A maximum of five years onshore and eight years offshore, after which the area is relinquished.",
  "A fixed ten years for every terrain, counted from the approval.",
  "A minimum of 90 days, the period the Commission has to approve a notice."],
 "The regulation reads: \"(3) An approval pursuant to subregulation (2) of this regulation shall be for a minimum period of five years in the onshore and shallow water areas, and eight years in the deep-water areas,\" and the Commission may grant up to the maximum the Act prescribes. The 10 years is that maximum in s.78(9), and the 90 days is the approval period of reg. 6(2).")

q(2, "Within how many days of completing the appraisal programme must a significant discovery be notified to the Commission, and how long does the Commission have to approve it?",
 "60 days to notify (reg. 5(1)) and 90 days to approve (reg. 6(2)).",
 ["90 days to notify and 60 days to approve, both under reg. 6.",
  "60 days to notify and two years to approve, under s.79(1) of the Act.",
  "Two years to notify and 10 years to approve, under s.78(9) of the Act."],
 "S.I. No. 37 of 2023 sets the notice within 60 days after the appraisal programme (reg. 5(1)) and the Commission's approval within 90 days of the notice (reg. 6(2)). Two years is the field development plan period of s.79(1), and 10 years the retention cap of s.78(9).")

q(3, "The case \"A significant discovery eleven years on\" states a significant crude oil discovery declared 11 years ago. What does the engine's Nigerian note add that the note at 10 years does not?",
 "That the retention period has ended, so the area is relinquished unless a commercial discovery was declared (s.78(13)).",
 ["That the area may be retained for up to 10 more years if the licensee asks the Commission in writing before the period ends.",
  "That the class changes to Discovered Unrecoverable, since the area has been given up and no project can now recover it.",
  "Nothing: both notes read the same, since the engine counts no years."],
 "In the engine's own words the note at 11 years ends: 11 years since the declaration: the retention period has ended, so the area is relinquished unless a commercial discovery was declared (s.78(13)). At 10 years the note carries no such warning, since the tenth year is inside the period. The class stays Contingent Resources, because a note never changes the PRMS class.")

q(0, "EKN-1, which meets every commerciality criterion, is stated with a significant gas discovery declaration. What does the engine answer?",
 "A refusal naming nigeria.declaration: a significant discovery cannot be declared commercial (PIA 2021 s.318).",
 ["Contingent Resources, since a significant discovery is not yet commercial under the Act, and the declaration outweighs the criteria.",
  "Reserves, with a note that the significant declaration is out of date and should be replaced by a commercial one.",
  "Reserves with no note, since the Nigerian block is dropped when it contradicts the class."],
 "The engine's own words are: nigeria.declaration must be \"commercial-discovery\" for a project that meets every commerciality criterion: a significant discovery cannot be declared commercial (PIA 2021 s.318) and a discovery of no interest is not being developed (s.78(8)(c)); got \"significant-gas-discovery\". The notes do not change the class, so the contradiction is refused. Nothing in the box is dropped silently.")

q(1, "A learner adds the `nigeria` block {\"declaration\":\"commercial-discovery\",\"yearsSinceDeclaration\":0} to EKN-6, the Ekene Deep prospect. Which message comes back?",
 "nigeria must be left out for an undiscovered accumulation (PIA 2021 s.78(8) declarations follow a discovery); got {\"declaration\":\"commercial-discovery\",\"yearsSinceDeclaration\":0}",
 ["nigeria.declaration must be one of \"commercial-discovery\", \"significant-crude-oil-discovery\", \"significant-gas-discovery\", \"no-interest\"; got \"commercial-discovery\"",
  "A result with the class Reserves, since a declared commercial discovery passes the commerciality test.",
  "A result with Prospective Resources and a note that a field development plan is due within 2 years."],
 "Those are the engine's own words for the golden case class-refuse-nigeria-undiscovered: the declarations of s.78(8) follow an appraisal, and a prospect has not been discovered. The message listing the four accepted declarations answers a declaration outside them, and commercial-discovery is one of them. A declaration sets no class.")

q(1, "What does the engine answer when the Nigerian declaration is stated as \"significant\"?",
 "nigeria.declaration must be one of \"commercial-discovery\", \"significant-crude-oil-discovery\", \"significant-gas-discovery\", \"no-interest\"; got \"significant\"",
 ["A note for a significant gas discovery, the one the engine assumes when the kind is not given.",
  "nigeria.declaration must be \"commercial-discovery\" for a project that meets every commerciality criterion; got \"significant\"",
  "A note for a significant crude oil discovery, since oil is the first kind the Act names."],
 "Those are the engine's own words for the golden case class-refuse-nigeria-declaration: the declaration must be one of the four accepted declarations, and the short form names neither kind of significant discovery. The engine assumes no kind. The commerciality message answers a significant declaration on a project that meets every criterion.")

q(3, "How does a Nigerian note change the PRMS class the engine returns?",
 "It does not: the note is printed beside the class, which comes from the stated facts.",
 ["A commercial discovery note raises a Contingent project to Reserves.",
  "A significant discovery note lowers a project to Contingent Resources whatever its criteria.",
  "Any no-interest note turns the project into Undiscovered Unrecoverable."],
 "The Act's declaration is a legal step with the regulator, and the PRMS class describes the project's maturity; the engine carries the first as a note and leaves the second to the facts. Where the two contradict, as a significant declaration on a project meeting every criterion, the engine refuses. The no-interest case is discovered, and its class is Discovered Unrecoverable because its recovery project is none.")

q(2, "What does s.78(15) of the Petroleum Industry Act 2021 allow the Commission to do after a licensee declares a discovery of no interest?",
 "Require relinquishment of the parcels that cover the structure of the discovery.",
 ["Grant a retention period of at least five years before any relinquishment.",
  "Declare the discovery commercial on the licensee's behalf and require a field development plan.",
  "Reclassify the quantities as Reserves in the national position."],
 "The quoted text reads: \"(15) Where a licensee declares a discovery of no interest under subsection (3) or (8), the Commission may require the relinquishment of the parcels that cover the structure of such discovery.\" (PIA s.78(15)). Retention follows a significant discovery. The Commission makes no commercial declaration for a licensee, and no Commission classification rule was read.")

q(0, "The Commission's release of 1 April 2026 gives Nigeria's 2P gas as at 1 January 2026. What total do its associated and non-associated figures make, and how does the course use the release?",
 "215.19 trillion cubic feet (100.21 plus 114.98), cited for its figures and its date only.",
 ["215.19 trillion cubic feet, quoted word for word with its citation, since a government release is public.",
  "114.98 trillion cubic feet, the non-associated figure alone, since associated gas is not counted.",
  "100.21 trillion cubic feet, the 1P gas, cited with the date the course read the release."],
 "The release prints 2P associated gas of 100.21 and non-associated gas of 114.98 trillion cubic feet, 215.19 in total. Its page reads all rights reserved, so the course cites the figures and the date only. Both kinds of gas are in the total, and every figure in it is 2P. In this course the figure is reported reserves, with its date and the Commission as reporter.")

q(1, "What did the course find when it looked for a gazetted NUPRC regulation on how reserves are booked or reported?",
 "None on the Commission's list read on 2026-09-27, so the course states no Nigerian booking rule.",
 ["The Commercial Regulations, 2025, which set the Nigerian booking rule the engine applies to each class.",
  "S.I. No. 37 of 2023, whose regulation 7 is the booking rule for a significant discovery.",
  "The 1 April 2026 release, which the Commission uses as its booking guideline."],
 "No gazetted regulation or guideline on booking or reporting reserves was on the list read on 2026-09-27, so the course teaches the PRMS classes and states no Nigerian booking rule. The Commercial Regulations, 2025 ask for a status report and are used by concept only. Regulation 7 of S.I. No. 37 of 2023 covers a declaration that does not meet the criteria, and the release is a statement of figures.")

q(3, "What does s.7(i) of the Petroleum Industry Act 2021 give the Commission among its functions?",
 "The evaluation of national reserves and policies for prudent reservoir management.",
 ["The classification of each licensee's projects into the PRMS classes.",
  "The approval of every licensee's 1P before it is reported to shareholders.",
  "The setting of a national price deck for the economic test of every project in the country."],
 "The quoted text reads: \"(i) undertake evaluation of national reserves and develop policies for prudent reservoir management practices ;\" (PIA s.7(i)). The quoted function concerns national reserves and reservoir management. None of the texts the course read gives the Commission the classification of each project, the approval of a company's 1P or a national price deck.")

q(0, "A learner rehearses the capstone's method on the Ekene field. Which pair of figures is the chance of commerciality of the prospect and of the lead?",
 "20.000000 and 10.500000 percent, Ekene Deep and Ekene Shallow.",
 ["25.000000 and 15.000000 percent, the chances of geologic discovery of the two.",
  "80.000000 and 70.000000 percent, the chances of development of the two.",
  "20.000000 and 20.000000 percent, since Ekene Deep and Ekene West share a figure."],
 "Each is the product of the stated chances: 25.000000 percent times 80.000000 percent for Ekene Deep, and 15.000000 percent times 70.000000 percent for Ekene Shallow. The chances of geologic discovery or of development alone are one factor each. Ekene West tight sand, EKN-5, is a discovered Contingent project whose 20.000000 percent is its chance of development, and it is no lead.")

emit(Q, '/root/cat-wip-prms/banks/ec11b_m06.json', expect_n=15)
finish()
