---
title: "A Few Useful Things to Know about Machine Learning"
tags: [machine learning, ml, stats, data science]
date: "2016-03-04 22:09:00 +0200"
---

Every once in a while I open this paper by prof. Pedro Domingos to review what I know in the machine learning field.

[[PDF] A Few Useful Things to Know about Machine Learning][LINK]

#### Twelve key lessons

that machine learning researchers and practitioners have learned.

1. Learning = Representation + Evaluation + Optimization
1. It's generalization that counts
1. Data alone is not enough
1. Overfitting has many faces; bias (wrong thing), variance (random things)
1. Intuition fails in high dimensions
1. Theoretical guarantees are not what they seem (they are for algorithm design)
1. Feature engineering is the key
1. More data beats cleverer algorithm (but hits scalability problem; try simple algorithms first)
1. Learn many models, not just one (model ensembles: bagging, stacking)
1. Simplicity does not imply accuracy
1. Representable does not imply learnable
1. Correlation does not imply causation (observational data vs experimental, predictive variables are not under control)


#### Representation

* Instances
  * k-nearest neighbor
  * support vector machines
* Hyperplanes
  * naive Bayes
  * logistic regression
* Decision trees
* Sets of rules
  * propositional rules
  * logic programs
* Neural networks
* Graphical models
  * Bayesian networks
  * conditional random fields

#### Evaluation

* accuracy/error rate
* precision and recall
* squared error
* likelihood
* posterior probability
* information gain
* K-L divergence
* cost/utility
* margin

#### Optimization

* Combinatorial optimization
  * greedy search
  * beam search
  * branch-and-bound
* Continuous optimization
  * Unconstrained
    * gradient descent
    * conjugate gradient
    * quasi-Newton methods
  * Constrained
    * linear programming
    * quadratic programming


[LINK]: http://homes.cs.washington.edu/~pedrod/papers/cacm12.pdf
