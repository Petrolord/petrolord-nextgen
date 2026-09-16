# Three refusals that are real answers

Three of the duty solver's refusals deserve reading as findings in their own right. Each one names where the fault actually is, and they do not all point at the same place: the first at the catalogue, the second at the machine against the station, the third at the question. Only one of the three carries figures back, and it is the one that needs to.

{{panel:fc-pump-explorer}}

## A curve that is not a head curve

Ask for the crossing of the rising point set with a system curve and the engine returns { error: "this curve does not fall with flow, so it is not a centrifugal head curve and its crossing with a system curve is not a duty point: check the catalogue points" }.

Two curves that are not both the right shape do still cross somewhere, and the engine could have solved for that crossing and returned a flow. It declines, because the flow would not mean anything. This is the droops flag of the previous module being read by the function whose answer the flag invalidates, and the message closes by pointing at the catalogue points, which is where the fault actually is.

## A pump that cannot start this system

Now raise the station's static head to 700.000000 ft and ask again. The engine returns { error: "the system needs more head at zero flow than the pump makes at shutoff: this pump cannot start this system" }.

It hands back what it judged on: a shutoff head of 540.203016 ft against a system static head of 700.000000 ft, a gap of 159.796984 ft.

This is a real engineering result and it has nothing to do with arithmetic. At zero flow the station already demands more head than the machine can produce, so the discharge valve opens and nothing moves. Read the evidence and you know both that the selection fails and by how much, which is the difference between being told no and being told how much bigger a machine has to be.

## A search that was told to stop too early

The third one is different in kind. Ask for the crossing with a search limit set below where the curves actually meet and the engine returns { error: "the curves do not cross below 200 gpm: raise the search limit or check the system curve" }.

Nothing is wrong with the pump and nothing is wrong with the station. The search was given a window that does not contain the answer, and the message offers both readings: raise the limit, or check whether the system curve you meant is the system curve you typed.

## Why the distinction matters

The first is a statement about the readings the curve was built from. The second is a statement about the machine and the station together. The third is a statement about how the question was asked, and a caller that treats all refusals alike will go looking for a bigger pump when the fix was a search limit.

## The mistake

Treating a refusal as a failure of the tool. Two of these three are answers a competent engineer would have wanted, delivered before any downstream number was computed on a duty point that does not exist.

## Exercise

Write the three messages and say for each whether it is about the catalogue, the machine against the station, or the question. Then say which of the three returns figures alongside its message, give the two figures it hands back and the gap between them.
