---
title: "ICFP Contest 2017: Team paiv"
tags: [icfpcontest, icfpc, programming, contest]
date: "2017-08-09 00:02"
thumbnail: true
---

Graph *punting* competition.

Contest site: [https://icfpcontest2017.github.io/][ICFPSITE]

# Team results

The team: me only

* [code][CODES]


Ranks:

*to be posted*


# Task

The task was a kind of multi-player board game with partially hidden state.
On your turn, you claim edges of a graph, trying to make longer *roads* from
a few specific nodes, and preventing opponents from doing so.

Sample map:

<img src="{% include page_assets %}/sample.gif" style="width:100px">

Additional rules make it more fun:

* you have a limited number of tokens to share an already claimed edge
* you can pass and then use passed turns to make several claims in single turn
* you can promise to make a path to a node before game starts, and gain points when
you fulfill your promise

Links:

* [full task description][PROBLEM]
* [map viewer][MAPVIEWER]


# Lightning 24 hours submission

Lightning submission was a random trails player with a preference to grab rivers attached to mines. Spent considerate time on unbuffered I/O, interprocess streams and changes to offline protocol.


# Final submission

Lightning was fully in Python, but then I decided to compensate my poor algorithmic skills with C/C++ performance. So there goes another day rewriting random player in C/C++, where I spent considerate time parsing JSON.

Day three started with adopting splurges extension. Then I had score tracked throughout the game, so could choose from best moves.

After a sleep brake (timezones), added support for options extension. Then a rush final stretch for monte-carlo-esque player, with final half-hour bug chase. (Have used 15 minutes into added time, thank you orgs).


# Post-event

## Visualizer

After competition was over, I finally had time for visualizer.

```
imbotnot> I have trod the misty trails of graphviz and imagemagick, and now I'm back, a wise man
imbotnot> Though my time is nigh, and my sanity has gone
imbotnot> I can do magic
```

[<img src="{% include page_assets %}/boston-cut.png" style="width:40pt">]({% include page_assets %}/boston.gif)


## Server

...and then I decided to build a server too.

Server runs on Node.js:

```
usage: puntd.js [-h] [-b HOST] [-p PORT] [-m MAP] [-n PLAYERS] [-f] [-o] [-s]
                [-th HANDSHAKE] [-ts SETUP] [-tm MOVE]
```

I strived to make it full-featured, close to spec:

- [x] futures
- [x] splurges
- [x] options
- [x] timeouts
- [x] zombies

It still lacks testing though.


## Notes to self

* visualizer better be early
* prototyping is good, but there is no time to switch languages
* stat competition, choose best ai, local server would have helped
* take a step back and think strategies


# Competition

I made a list of teams I can find on the internets here:

* [teams][TEAMS]


# Codes

* [code][CODES]


[CODES]: https://github.com/paiv/icfpc2017
[ICFPSITE]: https://icfpcontest2017.github.io/
[PROBLEM]: https://icfpcontest2017.github.io/problem/
[MAPVIEWER]: http://punter.inf.ed.ac.uk/graph-viewer/?map=/maps/lambda.json
[TEAMS]: https://github.com/paiv/icfpc2017/blob/master/notes/teams.txt
[ADDSOME]: https://github.com/paiv/icfpc2017/issues
