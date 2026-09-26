import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Associate m02, Licences, Leases and Terrains.
# Sources: the licences, leases, terrains and conversion rows with their
# verbatim texts; the Ekene teaching cases; the refusals owned by this module
# (licence type, terrain, marginal field, lease status); the vocabulary.
# The one engine figure keyed here (the marginal field case's royalty rate) is
# re-run in /root/cat-wip-pia/scratch/bank-beginner/witness.mjs.

q(1, "Which three instruments does PIA s.70(1) create?",
 "A petroleum exploration licence, a petroleum prospecting licence and a petroleum mining lease.",
 ["An oil prospecting licence, an oil mining lease and a marginal field licence for small fields that produce under the Act.",
  "A petroleum exploration licence, an oil mining lease and a production sharing contract.",
  "A prospecting licence, a mining lease and a host community licence."],
 "Section 70(1)(a) to (c) names the petroleum exploration licence, the petroleum prospecting licence and the petroleum mining lease. The oil prospecting licence and oil mining lease are the older instruments a holder may convert; s.94(9) says no new marginal fields shall be declared; a production sharing contract is concept-only in this course; and no host community licence exists.")

q(3, "On what basis may a petroleum exploration licence be granted under PIA s.70(1)(a)?",
 "A non-exclusive basis.",
 ["An exclusive basis, with the right to win, work and dispose of crude oil, condensates and natural gas.",
  "An exclusive basis for appraisal drilling, lasting up to 10 years in deep offshore acreage.",
  "A production basis, holding a discovery until a lease is granted."],
 "The text reads: \"(a) petroleum exploration licence, which may be granted to qualified applicants to carry out petroleum exploration operations on a non-exclusive basis\". The exclusive right to win, work and dispose of production belongs to the petroleum mining lease (s.70(1)(c)); drilling exploration and appraisal wells belongs to the prospecting licence, whose deep offshore term is up to 10 years (s.77(2)); and the exploration licence holds no discovery.")

q(0, "How long may a petroleum mining lease run under PIA s.86(1)?",
 "For a maximum period of 20 years, a term that includes its development period.",
 ["Three years, renewable once for three more years.",
  "Not more than 10 years, the term of a frontier prospecting licence.",
  "18 months from the effective date, then until conversion ends."],
 "Section 86(1) reads that the lease \"shall be for a maximum period of 20 years, which term shall include the\" development period. Three years renewable for three is the exploration licence (s.71(3)); 10 years is the most a deep offshore or frontier prospecting licence may last (s.77(2)); 18 months is the conversion window of s.92(4), which says nothing about a lease's term.")

q(2, "What is the longest term PIA s.77(2) allows a petroleum prospecting licence for deep offshore and frontier acreage?",
 "Not more than 10 years: a five-year initial exploration period and an optional five-year extension.",
 ["A maximum of 20 years including the development period, the same as a mining lease under s.86(1) of the Act.",
  "Three years with one renewal of three more years if the prescribed conditions are met by the holder in time.",
  "Five years with no extension, after which the acreage is relinquished."],
 "The text reads: \"(2) A petroleum prospecting licence for deep offshore and frontier acreages shall be for a duration of not more than 10 years, comprising of an initial exploration period of five years and an optional extension period of five years.\" Twenty years is the mining lease (s.86(1)); three plus three is the exploration licence (s.71(3)); and the five-year extension is optional, so the term is not capped at five.")

q(2, "A case states pia_license_type \"OML\". What does the engine do with it?",
 "It refuses, in its own words: pia_license_type must be \"PML\" or \"PPL\"; got \"OML\".",
 ["It runs the case on the old royalty table and adds a note naming the Petroleum Profits Tax Act as the text that applies to it.",
  "It converts the lease to a petroleum mining lease on the s.267(a) terms and runs the case with a note about the conversion.",
  "It treats the licence as a PPL and runs the case with no message."],
 "The engine accepts pia_license_type \"PML\" or \"PPL\" only, and a licence type from before the Act is refused with that message, the engine's own words. It models converted and new-acreage terms only, so it neither runs an old royalty table nor performs a conversion itself (conversion is concept-only, and the lease status is a stated input), and it never substitutes another licence silently.")

q(0, "Which list gives exactly the pia_terrain values the engine accepts?",
 "\"onshore\", \"shallow_water\", \"deep_offshore\" and \"frontier\".",
 ["\"onshore\", \"offshore\" and \"frontier\".",
  "\"onshore\", \"shallow_water\" and \"marginal_field\".",
  "\"land\", \"swamp\", \"shallow_water\" and \"deep\"."],
 "The engine's exported PIA_TERRAINS reads \"onshore\", \"shallow_water\", \"deep_offshore\", \"frontier\". The value \"offshore\" is refused (the message names the four accepted strings back), \"marginal_field\" is refused because a marginal field is onshore or in shallow water, and the texts name no land or swamp terrain.")

q(3, "Why does the engine refuse pia_terrain \"marginal_field\"?",
 "A marginal field is onshore or in shallow water.",
 ["The Act abolished marginal fields in 2021, so any case that names one sits wholly outside the engine and the course.",
  "Marginal fields pay royalty only by price, which the terrain input has no way to express on its own.",
  "The engine needs a water depth to place a marginal field, and a marginal field case carries none."],
 "The refusal's first sentence reads: pia_terrain \"marginal_field\" is not a terrain under the Petroleum Industry Act 2021: a marginal field is onshore or in shallow water (PIA Seventh Schedule para 10(4); Petroleum Royalty Regulations 2022 r.13(2)). Producing marginal fields convert under s.94(1) and s.94(9) only stops new ones being declared; their royalty follows the terrain's tranches; and the engine never reads the water depth at all.")

q(1, "ekene_marginal_shallow_flag is a producing marginal field converted under s.94(1), in shallow water, at a 2026 daily rate of 20000.000000 bopd. Which liquids royalty rate does the engine return?",
 "0.093750, the shallow water tranche rate at that daily rate.",
 ["0.050000, the first tranche rate, which a producing marginal field keeps on every barrel it produces.",
  "12.5 percent, the terrain rate of shallow water, on the whole volume.",
  "0.106250, the onshore scale's rate at that daily rate."],
 "The flag pia_marginal_field_pre_2021 moves the hydrocarbon tax class and leaves the royalty on the terrain's tranches, so the engine returns 0.093750, the shallow water rate at 20000 bopd in the tranche table. The whole volume does not pay 5 percent or the flat 12.5 percent, and 0.106250 is the onshore rate at the same daily rate, where 15 percent enters above 10,000 bopd.")

q(0, "On a shallow water case, a learner changes pia_water_depth_m to a depth beyond the 200 metre line and runs it again. What moves?",
 "Nothing, since the engine carries the depth in the terms and never reads it; the terrain string decides.",
 ["The royalty, as the field is now deep offshore.",
  "The hydrocarbon tax, which the engine reads from the depth.",
  "Only the royalty by price, tied to water depth."],
 "The engine carries pia_water_depth_m and never reads it: the terrain string alone decides the royalty and the tax. The 200 metre line lives in the texts' description of the terrains, and a learner who wants deep offshore terms states pia_terrain \"deep_offshore\". The royalty by price reads the price and the terrain, and nothing reads the depth.")

q(2, "How does this course treat a field lying partly in shallow water and partly in deep offshore?",
 "As concept-only: para 10(7) sends it to a weighted average under the Regulations, which the engine does not model.",
 ["As a computed case, in which the engine splits the field by the stated water depth and blends the two terrain rates by itself.",
  "The engine charges the higher of the two terrain rates on the whole volume of the field.",
  "At the frontier rate of 7.5% until reclassified."],
 "Seventh Schedule para 10(7) says the weighted average royalty for such a field \"shall be calculated as per regulations\", and the Regulations set the method in r.14. The engine does not model a field in two terrains, so it is taught from its text and never graded on a number. The engine never reads a depth, applies no higher-of rule and does not move such a field to frontier terms.")

q(1, "Under PIA s.92(4), by when must a conversion contract be concluded?",
 "The earlier of 18 months from the effective date and the expiry of the oil mining lease.",
 ["The later of 18 months from the effective date and the expiry of the oil mining lease, whichever comes last.",
  "Ten years from the effective date, the longest prospecting term the Act allows for any acreage.",
  "Any date the holder chooses, since conversion is voluntary."],
 "The text reads: \"(4) A conversion contract shall be concluded at a date (“conversion date”) which is the earlier of: (a) 18 months from the effective date ; and (b) the expiration date of the oil mining lease\". It is the earlier of the two dates. Ten years is a prospecting licence term, and although s.92(1) makes conversion voluntary, the date by which it must happen is fixed by the text.")

q(3, "On conversion of an oil mining lease, what becomes of the areas selected under s.93(1)(d) and (e), those in development or regular commercial production?",
 "Petroleum mining leases on the s.267(a) fiscal terms.",
 ["They become petroleum prospecting licences, carried on the fiscal terms of s.267(b) for appraisal work.",
  "They are relinquished by the holder under s.93(4), and the acreage returns to the state for new licensing.",
  "Old oil mining lease terms, kept until that lease expires."],
 "PIA s.93(6)(b) reads that areas \"selected under subsection (1) (d) and (e), into petroleum mining leases, with fiscal terms as applicable under section 267 (a)\". Areas designated for appraisal or discovery work under s.93(6)(a) become prospecting licences on the s.267(b) terms, unselected areas are relinquished under s.93(4), and a converted area leaves the old lease terms behind.")

q(0, "A holder of an oil mining lease signs no conversion contract before the conversion date. What follows, and what does the engine do with such a lease?",
 "Its old terms continue under s.92(6); the engine models converted and new-acreage terms only, so the case is concept-only.",
 ["The Act applies from the conversion date, and the engine runs the lease with pia_lease_status \"new\".",
  "The lease is relinquished at once, and the engine refuses it.",
  "It pays tax at the new-lease stated rate."],
 "PIA s.92(6) keeps the terms that applied before the effective date, and s.303(1) keeps the Act away from such a holder until the licence or lease ends or expires; the Nigeria Tax Act 2025 carries petroleum profits tax for leases yet to convert in its own Part (s.90(1)). The engine models converted and new-acreage terms only, so an unconverted lease is not run at all: the engine neither treats it as new nor gives it a stated rate.")

q(1, "In this course's legislated words, what is a new lease?",
 "A petroleum mining lease granted out of new acreage, pia_lease_status \"new\".",
 ["Any lease signed in the last few years, whatever the acreage it covers and however it was granted.",
  "A petroleum mining lease converted from an oil mining lease after the Act came into force in 2021.",
  "A lease renewed under the Act, status \"renewed\"."],
 "The vocabulary fixes a new lease as a petroleum mining lease granted out of new acreage (engine pia_lease_status \"new\"). A lease converted from an oil mining lease is a converted lease, whatever its date, and the engine refuses \"renewed\" in its own words: pia_lease_status must be \"converted\" or \"new\"; got \"renewed\".")

q(3, "What does PIA s.94(9) say about marginal fields?",
 "No new marginal fields shall be declared.",
 ["Every marginal field must pay the frontier rate of royalty until it converts to a petroleum mining lease.",
  "Marginal fields form a fifth terrain with a royalty scale and a set of tranches of their own.",
  "Producing marginal fields keep their old terms indefinitely."],
 "The text reads: \"(9) No new marginal fields shall be declared under this Act.\" A producing marginal field must convert to a petroleum mining lease within 18 months (s.94(1)); it is onshore or in shallow water and pays that terrain's tranches, so there is no fifth terrain and no frontier rate for it, and it cannot keep its old terms indefinitely.")

emit(Q, '/root/cat-wip-pia/banks/ec7b_m02.json', expect_n=15)
finish()
