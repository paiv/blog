---
title: About
layout: page
---

<style>
img.avatar {
  width: 4em;
  height: 4em;
  border-radius: 2em;
  float: left;
  margin-right: 1em;
}
ul.h {
  list-style: none;
}
ul.h li:before {
  content: "❤️   ";
  font-size: xx-small;
}
</style>

<p>
  <a href="{{ site.baseurl }}/assets/img/paiv.jpg" title="Avatar image">
    <img class="avatar" src="{{ site.baseurl }}/assets/img/paiv.jpg" alt="Avatar" />
  </a>
</p>

<p>
  Hello. My name is Pavlo Ivashkov. I'm a programmer from Ukraine.
</p>

<p>
  Welcome to my (mostly software) engineering blog.
</p>

<ul>
  <li>github:
    <a href="https://github.com/{{ site.github_username }}">{{ site.github_username | escape }}</a>
  </li>
  <li>stack overflow:
    <a href="https://stackoverflow.com/story/{{ site.stackoverflow_username }}">{{ site.stackoverflow_username | escape }}</a>
  </li>
  <li>twitter:
    <a href="https://twitter.com/{{ site.twitter_username }}">{{ site.twitter_username | escape }}</a>
  </li>
</ul>

<div>Support my projects by donating via</div>
<ul class="h">
  <li><a href="https://www.paypal.com/donate/?hosted_button_id=4BQ2Y97YUMM7L" target="_blank">PayPal</a></li>
  <li><a href="https://www.patreon.com/paiv" target="_blank">Patreon</a></li>
</ul>
