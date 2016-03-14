---
title: "Installing scientific Python on OSX"
tags: [osx, macports, python, numpy, scipy, matplotlib, ipython, jupyter, notebooks, anaconda]
date: "2016-02-29 09:15:02"
---

TLDR; either use [Anaconda][CONDA-FOLLOWUP] (better performance), or an older matplotlib.

I'm taking Stanford's [CS231n] class, and needed a scientific computing environment in Python:

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

* [matplotlib FAQ][MPLFAQ] suggests a wrapper script with proper environment variables for python
* [switch to Qt backend][SO-BACKEND]
* ditch Macports, install [Anaconda]
* [use older matplotlib][OLDLIB-COMMENT]

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


But when compared against [Anaconda setup][CONDA-FOLLOWUP], matrix multiplication was roughly five times slower. The difference comes from linear algebra backend used:

```python
import numpy as np
np.show_config()
```

This setup is using Apple's Accelerate framework, and Anaconda is based on [Intel's MKL][MKL]. If you need better performance, you have to [rebuild NumPy with MKL][RMCGIBBO], or just install Anaconda.

* [Followup: Installing Anaconda][CONDA-FOLLOWUP]


[CS231n]: http://cs231n.github.io/ "CS231n: Convolutional Neural Networks for Visual Recognition"
[JUPYTER]: https://jupyter.org/
[CONDA-FOLLOWUP]: {{site.baseurl}}{% post_url 2016-02-29-anaconda %} "Followup: Installing Anaconda"
[ANACONDA]: https://www.continuum.io/downloads
[MKL]: https://software.intel.com/en-us/intel-mkl "Intel Math Kernel Library"
[MACPORTS]: https://www.macports.org/
[PIP]: https://pypi.python.org/pypi/pip
[VIRTUALENV]: https://pypi.python.org/pypi/virtualenv
[MPLFAQ]: http://matplotlib.org/faq/virtualenv_faq.html "Working with Matplotlib in Virtual environments"
[SO-BACKEND]: http://stackoverflow.com/a/33180744
[OLDLIB-COMMENT]: http://www.pyimagesearch.com/2015/08/24/resolved-matplotlib-figures-not-showing-up-or-displaying/#comment-388489
[RMCGIBBO]: https://gist.github.com/rmcgibbo/4950848 "Scientific Python From Source"
