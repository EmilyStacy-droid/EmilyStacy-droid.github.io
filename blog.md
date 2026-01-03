---
layout: default
title: Blog
---

# Blog & Insights
*A collection of my thoughts on learning science, engineering, and data.*

<ul class="posts">
  {% for post in site.posts %}
    <li>
      <span style="color: #666; font-family: monospace;">{{ post.date | date: "%b %d, %Y" }}</span> 
      — 
      <a href="{{ site.baseurl }}{{ post.url }}" style="font-weight: bold;">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>