---
title: "Boolean Neuron"
tags: [machine learning, ml, neural networks, neuron]
date: "2016-03-29 18:10:02"
thumbnail: true
---
{% include mathjax.html %}

A playground of Boolean operations learned by a single neuron.

<script src="{% include page_assets %}/svg.js" type="text/javascript"></script>
<script id="neuronwidget" src="{% include page_assets %}/neuron-widget.js" type="text/javascript"></script>
<link rel="stylesheet" href="{% include page_assets %}/neuron-widget.css">


A neuron like this is a building block of [artificial neural networks][ANN]. In this simple form, it takes binary inputs (0 or 1), and produces binary output with a formula

$$ h(\vec{x})=S(w_0x_0+w_1x_1+w_2x_2) $$

$$ S(t)=\frac{1}{1+e^{-t}} $$

Where `S` is a [sigmoid function][SIGMOID]:

[<img src="{% include page_assets %}/sigmoid.png" />][SIGMOID]


`x₀` is always 1, and is used to apply "bias" weight `w₀`.


This simple neuron can learn basic Boolean operations:

| <img src="{% include page_assets %}/tt-and.png" width="45" class="tt" /> | AND |
| <img src="{% include page_assets %}/tt-or.png" width="45" class="tt" /> | OR |
| <img src="{% include page_assets %}/tt-not.png" width="45" class="tt" /> | NOT (on first input) |


Use the sliders to change weights, and train the neuron to these basic operations.


[ANN]: https://en.wikipedia.org/wiki/Artificial_neural_network
[SIGMOID]: https://en.wikipedia.org/wiki/Sigmoid_function
