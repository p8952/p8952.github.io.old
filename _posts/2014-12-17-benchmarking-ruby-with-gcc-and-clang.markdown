---
layout: post
title:  "Benchmarking Ruby with GCC (4.4, 4.7, 4.8, 4.9) and Clang (3.2, 3.3, 3.4, 3.5)"
date:   2014-12-12 00:00:00
categories: ruby
---

<script language="javascript" type="text/javascript" src="/res/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/res/js/jquery.flot.min.js"></script>
<script language="javascript" type="text/javascript" src="/res/js/jquery.flot.axislabels.js"></script>
<script language="javascript" type="text/javascript" src="/res/js/jquery.flot.tickrotor.js"></script>
<script language="javascript" type="text/javascript" src="/res/js/jquery.flot.navigate.js"></script>
<script language="javascript" type="text/javascript" src="/res/js/graph-total.js"></script>
<script language="javascript" type="text/javascript" src="/res/js/graph-percent.js"></script>

This note is partially inspired by [Braulio Bhavamitra's comments about Ruby
being faster when compiled with Clang rather than GCC][1] and partially by
[Brendan Gregg's comments about compiler optimization during his Flame Graphs
talk at USENIX LISA13][2] (0:33:30).

In short I wanted to look at what kind of performance we are leaving on the
table by not taking advantage of 1) The newest compiler versions & 2) The
most aggressive compiler optimizations. This is especially perniant to those of
us deploying applications on PaaS infrastructure where we often have zero
control over such things. Does the cost-benefit analysis still work out the same
when you take into account a 10/20/30% performance hit?

All tests were run on AWS from an m3.medium EC2 instance and the AMI used was
a modified copy of one of my weekly generated [Gentoo Linux AMIs][3]. The
version of Ruby was 2.1 while the tests themselves are from [Antonio Cangiano's
Ruby Benchmark Suite][4]. The tooling used to run them is [available on my
GitHub][5] if you want to try this out for yourself.

The full test suite was run for each of the following compiler variants, O3 was
not used with Clang since it only adds a single additional flag:

* GCC 4.4 with O2 - Ships with Ubuntu 10.04 (Lucid) & RHEL/CentOS 6
* GCC 4.4 with O3
* GCC 4.7 with O2 - Ships with Debian 7 (Wheezy) & Ubuntu 12.04 (Precise)
* GCC 4.7 with O3
* GCC 4.8 with O2 - Ships with RHEL/CentOS 7
* GCC 4.8 with O3
* GCC 4.9 with O2 - Ships with Debian 8 (Jessie) & Ubuntu 14.04 (Trusty)
* GCC 4.9 with O3
* Clang 3.2 with O2
* Clang 3.3 with O2
* Clang 3.4 with O2
* Clang 3.5 with O2

Each variant was then given a number of points per test based on it's ranking,
0 points to the variant which performed the best, 1 to the second best, and so
on until 11 points were given to the variant which performed the worst.

These scores were then added up per variant and plotted onto a bar graph to try
and visualize performance per variant.

<center>
	<h4>Performance per variant (Lower is better)</h4>
	<small class="pull-right"><a href="/res/misc/raw_data.csv">Raw Data</a></small>
</center>
<div class="graph-total-container">
	<div class="graph-total-plot" id="graph-total-plot"></div>
	<p class="graph-total-options" id="graph-total-options"></p>
</div>

A few interesting things jumped out to me from this data:

1. Your choice of compiler does have a non-negligible affect on the performance
of your runtime environment.

2. Modern versions of GCC (4.7 & 4.8) and Clang (3.2 & 3.3) have very similar
performance.

3. Clang 3.4 seems to suffer from some performance regressions in this context.

4. The latest version of GCC (4.9) is ahead by a clear margin.

5. All O3 variants expect GCC 4.8 performed worse than their O2 counterparts.
This is not that unusual and very often using O3 will degrade performance or
even break an application all together. However the default Makefile shipped
with Ruby 1.9.3 and above uses O3, which appears to hurt performance.

Of course the standard disclaimers apply. Benchmarking correctly is hard, you
may not see the same results in your specific environment, do not immediately
recompile everything in prod using GCC 4.9, ect.

#### Update:

Lots of people asked to see the raw data plotted as well as the relative
performance, so here it is. For each test the average score for all varients was
calculated as this was named as the baseline and marked as 0. Then for each
test/varient a percentage was calculated showing how much faster/slower it was
than the baseline.

For example on test eight GCC 4.9 O2 was 7% faster than the baseline while
Clang 3.5 was 2% faster than the baseline. From this we can infer that GCC 4.9
O2 was 5% faster than Clang 3.5 in that test.

Since this makes the graph very cluttered it is best that you only select a few
varients at once, you can also pan and zoom.

<center>
	<h4>Percentage faster/slower than baseline (Lower is better)</h4>
	<small class="pull-right"><a href="/res/misc/raw_data.csv">Raw Data</a></small>
</center>
<div class="graph-percent-container">
	<div class="graph-percent-plot" id="graph-percent-plot"></div>
	<p class="graph-percent-options" id="graph-percent-options"></p>
</div>

[1]: http://cirandas.net/brauliobo/blog/ruby-compiled-with-clang-is-8-faster-than-with-gcc-4.9-and-44-faster-than-with-gcc-4.7.2
[2]: https://www.usenix.org/conference/lisa13/technical-sessions/plenary/gregg
[3]: https://p8952.info/projects.html
[4]: https://github.com/acangiano/ruby-benchmark-suite
[5]: https://github.com/p8952/ruby-compiler-benchmark
