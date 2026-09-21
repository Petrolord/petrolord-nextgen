import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Expert m01, The Comment Loop. Digest section 13 only, as the five
# lessons of m01 teach it. 15 questions.

q(2, "The peerReview engine groups some comment statuses as resolved, meaning nobody still has to act. Which statuses are in that group?",
 "\"Verified\", \"Closed\" and \"Withdrawn\".",
 ["\"Closed\" and \"Withdrawn\", the two statuses with no legal move out of them.",
  "\"Verified\", \"Closed\" and \"Rejected\", every status a reviewer or coordinator has set.",
  "\"Responded\", \"Verified\" and \"Closed\"."],
 "Resolved is wider than final. \"Verified\" is resolved because the reviewer has accepted the response, although the coordinator still has the move to \"Closed\" to make. \"Rejected\" waits on the author and \"Responded\" waits on the reviewer, so neither is resolved.")

q(0, "With six comment statuses there are 36 ordered pairs of a status and a status to move to. How many of those pairs does the engine hold as legal moves?",
 "7, which are exactly the entries of the legal-move table in the engine.",
 ["6, one legal move out of each of the six statuses.",
  "12, two legal moves out of each of the six statuses in turn.",
  "9, because \"Open\", \"Responded\" and \"Rejected\" have two exits each and \"Verified\" has three."],
 "\"Closed\" and \"Withdrawn\" have no exit at all. \"Open\" and \"Rejected\" each have two, \"Responded\" has two and \"Verified\" has one: 2 + 2 + 2 + 1 gives the 7 legal moves the course counts.")

q(3, "A comment is \"Open\". Which statuses may it legally move to next?",
 "\"Responded\", by the author, or \"Withdrawn\", by the reviewer.",
 ["\"Responded\" or \"Verified\", both by the reviewer who raised it.",
  "\"Responded\", \"Withdrawn\" or \"Closed\", the last by the coordinator.",
  "\"Withdrawn\" only, because the author answers from \"Rejected\"."],
 "The open comment waits on the author, whose move is \"Responded\". The reviewer may also take it back to \"Withdrawn\". Anything else is refused with \"An open comment can only go to Responded or Withdrawn.\"")

q(1, "In the comment loop, which role makes the move from \"Verified\" to \"Closed\"?",
 "The coordinator, who runs the review and records that the comment is finished.",
 ["The reviewer, as the last of the reviewer's own moves on the comment.",
  "The author, once the reviewer has accepted the author's response to it.",
  "Nobody, because a verified comment is already final."],
 "TRANSITION_ACTOR gives \"Closed\" to the coordinator. It is administrative: the reviewer has already accepted the response by verifying it, and closing records that the comment is finished with.")

q(1, "A comment reads \"Responded\" but carries no response text. A reviewer asks the engine to move it to \"Verified\". What comes back?",
 "A refusal: \"A comment cannot be verified before the author has responded to it.\"",
 ["The move is allowed, because \"Verified\" is a legal next status from \"Responded\".",
  "A refusal: \"A responded comment can only go to Verified or Rejected.\"",
  "A refusal: \"This comment is already responded.\""],
 "The status and the response text are two fields, and the move to \"Verified\" checks the text as well. Verifying is a judgement about a response, so a response has to exist before there is anything to verify.")

q(3, "A comment row arrives with no status at all, and somebody asks for it to be moved to \"Closed\". How does the engine answer?",
 "It treats the missing status as the start of the loop and refuses the shortcut, as it would for any comment still waiting on its author.",
 ["It reads the comment as finished and allows the move, since nothing is left to act on.",
  "It refuses with \"A closed comment is final.\", because a missing status is read as closed.",
  "It refuses with \"Sign in to act on this comment.\""],
 "The engine does not guess that a statusless comment is done. It treats the row as the start of the loop, where somebody still has to act, and the shortcut to \"Closed\" gets the sentence any open comment gets: \"An open comment can only go to Responded or Withdrawn.\"")

q(0, "A reviewer has just rejected the author's response to a comment. Where can that comment go from here?",
 "\"Responded\" or \"Withdrawn\".",
 ["\"Verified\" or \"Withdrawn\".",
  "\"Open\" or \"Responded\".",
  "None: \"Rejected\" is final."],
 "A rejected comment goes back to the author, who responds again, and the reviewer may still withdraw it. The loop turns until the reviewer verifies a response or withdraws the comment.")

q(2, "Which comment status is resolved and still has a legal move left?",
 "\"Verified\", which can still go to \"Closed\".",
 ["\"Withdrawn\", which a reviewer can still reopen to \"Open\" if the comment returns.",
  "\"Responded\", which the reviewer can still verify or reject.",
  "\"Closed\", which the coordinator can hand back."],
 "The resolved set is \"Verified\", \"Closed\" and \"Withdrawn\". The last two are final. \"Verified\" needs nobody to judge it any more, so it stops holding a review open, and the coordinator still has the step to \"Closed\".")

q(3, "A reviewer tries to move an \"Open\" comment straight to \"Verified\". Which sentence does the engine return?",
 "\"An open comment can only go to Responded or Withdrawn.\"",
 ["\"A comment cannot be verified before the author has responded to it.\"",
  "\"This comment is already open.\"",
  "\"The author of the work under review cannot verify a comment on it.\""],
 "The move is illegal from the current status, so the refusal lists the legal targets. Reading it, the reviewer learns that the author has to answer first. The no-response-text sentence belongs to a comment whose status already reads \"Responded\".")

q(0, "A coordinator asks the engine to move a \"Closed\" comment to \"Closed\" again. What is the answer?",
 "A refusal: \"This comment is already closed.\"",
 ["A refusal: \"A closed comment is final.\"",
  "The move is allowed, and the record is left exactly as it was before the request.",
  "A refusal: \"A verified comment can only go to Closed.\""],
 "A move to the status a comment already holds has its own family of sentences. Every other move out of \"Closed\" reads \"A closed comment is final.\", and the same-status request is the one exception in wording.")

q(1, "A \"Withdrawn\" comment is asked to move to \"Responded\". Which sentence comes back?",
 "\"A withdrawn comment is final.\"",
 ["\"A withdrawn comment can only go to Responded or Withdrawn.\"",
  "\"This comment is already withdrawn.\"",
  "\"An open comment can only go to Responded or Withdrawn.\""],
 "\"Withdrawn\" has no legal next status, so the refusal names no way forward because there is none. The same-status sentence is reserved for a move from \"Withdrawn\" to \"Withdrawn\".")

q(2, "The comment refusals fall into three families. Which family tells the user the comment has no legal move left at all, and why?",
 "Moves out of \"Closed\" or \"Withdrawn\", because a final status has no legal move to name.",
 ["Moves to the status a comment already holds, because nothing needed doing on the record.",
  "Moves illegal from the current status, since those sentences only say that the move is refused.",
  "Moves asked with nobody signed in, because no actor exists to be shown the way."],
 "Illegal moves list their legal targets, and same-status requests say the comment is already there. \"A closed comment is final.\" and \"A withdrawn comment is final.\" list nothing, because nothing is left.")

q(0, "A comment is \"Rejected\". On whom does it wait, and for what move?",
 "The author, who can answer the comment again by responding to it.",
 ["The reviewer, who has to verify the rejected response before the comment can move.",
  "The coordinator, who closes a rejected comment out.",
  "Nobody, since a rejection is the end of the loop."],
 "Of the three unresolved statuses, \"Open\" and \"Rejected\" wait on the author and \"Responded\" waits on the reviewer. The author's move from \"Rejected\" is \"Responded\", and each turn of the loop leaves a response behind it.")

q(3, "Both \"Closed\" and \"Withdrawn\" finish a comment. Which one records an answer that somebody accepted?",
 "\"Closed\", reached after the reviewer verified the author's response.",
 ["\"Withdrawn\", because the reviewer can only withdraw once satisfied.",
  "Both, since either one can only follow a response the reviewer accepted.",
  "Neither, since acceptance lives in the review stage."],
 "\"Withdrawn\" is reachable from \"Open\", before the author has answered, and from \"Rejected\", after the reviewer refused an answer. Only the full loop through \"Verified\" to \"Closed\" carries an accepted response.")

q(1, "u-kemi, an independent reviewer, asks to respond to C-02 on IK-01, which is already \"Verified\". What does the engine return?",
 "A refusal: \"A verified comment can only go to Closed.\"",
 ["The move is allowed, because u-kemi is independent of the work.",
  "A refusal: \"This comment is already verified.\"",
  "A refusal: \"The author of the work under review cannot review it.\""],
 "Independence answers who may take a reviewer's move. The legal-move table answers which moves exist, and it refuses this one whoever asks, because the only way out of \"Verified\" is \"Closed\".")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/advanced/asrca_m01.json', expect_n=15)
finish()
