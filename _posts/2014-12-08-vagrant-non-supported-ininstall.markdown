---
layout: post
title:  "Installing Vagrant In Non-Supported Environments"
date:   2014-12-08 00:00:00
categories: ruby vagrant
---

Get sources:
{% highlight bash %}
git clone git@github.com:mitchellh/vagrant.git
cd vagrant
git checkout tags/v1.6.5
{% endhighlight %}

Install dependencies:
{% highlight bash %}
gem install bundler -v 1.6.9
bundle install
{% endhighlight %}

Patch Vagrant[1][2]:
{% highlight bash %}
diff --git a/bin/vagrant b/bin/vagrant
index 21630e1..39c6e46 100755
--- a/bin/vagrant
+++ b/bin/vagrant
@@ -164,11 +164,6 @@ begin
   logger.debug("Creating Vagrant environment")
   env = Vagrant::Environment.new(opts)
 
-  if !Vagrant.in_installer? && !Vagrant.very_quiet?
-    # If we're not in the installer, warn.
-    env.ui.warn(I18n.t("vagrant.general.not_in_installer") + "\n", prefix: false)
-  end
-
   begin
     # Execute the CLI interface, and exit with the proper error code
     exit_status = env.cli(argv)
diff --git a/lib/vagrant/bundler.rb b/lib/vagrant/bundler.rb
index 05867da..bc4a216 100644
--- a/lib/vagrant/bundler.rb
+++ b/lib/vagrant/bundler.rb
@@ -18,8 +18,7 @@ module Vagrant
     end
 
     def initialize
-      @enabled = true if ENV["VAGRANT_INSTALLER_ENV"] ||
-        ENV["VAGRANT_FORCE_BUNDLER"]
+      @enabled = true
       @enabled  = !::Bundler::SharedHelpers.in_bundle? if !@enabled
       @monitor  = Monitor.new

---
{% endhighlight %}

Test and install:
{% highlight bash %}
rake test:unit
rake install
{% endhighlight %}

[1]: Without this patch Vagrant will give the following warning:
{% highlight bash %}
$ vagrant status
You appear to be running Vagrant outside of the official installers.
Note that the installers are what ensure that Vagrant has all required
dependencies, and Vagrant assumes that these dependencies exist. By
running outside of the installer environment, Vagrant may not function
properly. To remove this warning, install Vagrant using one of the
official packages from vagrantup.com.
{% endhighlight %}

[2]: Without this patch Vagrant will give the following error:
{% highlight bash %}
$ vagrant plugin install vagrant-aws
Installing the 'vagrant-aws' plugin. This can take a few minutes...
Vagrant's built-in bundler management mechanism is disabled because
Vagrant is running in an external bundler environment. In these
cases, plugin management does not work with Vagrant. To install
plugins, use your own Gemfile. To load plugins, either put the
plugins in the `plugins` group in your Gemfile or manually require
them in a Vagrantfile.
{% endhighlight %}
