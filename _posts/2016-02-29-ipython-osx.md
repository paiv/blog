---
title: HOWTO: Setting up IPython on OSX
tags: osx, macports, python, numpy, scipy, matplotlib, ipython, jupyter, notebooks, anaconda
date: 2016-02-29 11:15:00 +0200
---

TLDR; either use [Anaconda] [CONDA-FOLLOWUP], or an older matplotlib.

I'm taking Stanford's [CS231n] class, and needed a scientific computing environment in python:

* NumPy
* SciPy
* matplotlib
* IPython notebooks (IPython is now [Jupyter])

I have Python 2.7 installed through [Macports], along with [pip] and [virtualenv].

First, I switched to a clean virtual environment and pip-installed the libs:

```shell
virtualenv .env
source .env/bin/activate
pip install numpy scipy pillow matplotlib
```

But matplotlib won't start:

```
>>> import matplotlib.pyplot as plt
RuntimeError: Python is not installed as a framework. ... see 'Working with Matplotlib in Virtual environments' in the Matplotlib FAQ
```

There are workarounds:

* [matplotlib FAQ] [MPLFAQ] suggests a wrapper script with proper environment variables for python
* [switch to Qt backend] [SO-BACKEND]
* ditch Macports, install [Anaconda]
* [use older matplotlib] [OLDLIB-COMMENT]

After playing for a while with first three options, I found that installing older matplotlibs works just fine.

```shell
pip uninstall matplotlib
pip install matplotlib==1.4.3
```

Now I can move on to notebooks:

```shell
pip install notebook
jupiter notebook
```

... opens http://127.0.0.1:8888


* [follow-up: Anaconda] [CONDA-FOLLOWUP]


[CS231n]: http://cs231n.github.io/ "CS231n: Convolutional Neural Networks for Visual Recognition"
[JUPYTER]: https://jupyter.org/
[CONDA-FOLLOWUP]: {{site.baseurl}}{% post_url 2016-02-29-anaconda %} "Followup: Setting up Anaconda"
[ANACONDA]: https://www.continuum.io/downloads
[MACPORTS]: https://www.macports.org/
[PIP]: https://pypi.python.org/pypi/pip
[VIRTUALENV]: https://pypi.python.org/pypi/virtualenv
[MPLFAQ]: http://matplotlib.org/faq/virtualenv_faq.html "Working with Matplotlib in Virtual environments"
[SO-BACKEND]: http://stackoverflow.com/a/33180744
[OLDLIB-COMMENT]: http://www.pyimagesearch.com/2015/08/24/resolved-matplotlib-figures-not-showing-up-or-displaying/#comment-388489
