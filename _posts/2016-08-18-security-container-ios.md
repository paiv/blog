---
title: "Security Container iOS"
tags: [ios, swift, containers, controllers, mvvm]
date: "2016-08-18 00:00"
thumbnail: true
---

Login screen UI pattern, and introduction to container view controllers.


# When is Login shown

Let's review when we show a Login screen:

* first, when app is started for the first time, to obtain authentication token
* second, when authentication token expired

In the first case, Login screen appears in a linear flow of navigation, Login – to Main.

In the second case, Login disrupts current user flow, and it could happen at any time.

Note that when you disrupt user flow, you should decide wether to save draft changes of user data, or discard it. Here I discard the changes for simplicity and security.


# Ad-hoc modals

When I need login screen in an app, the quick and dirty way is to show modal Login view controller on top of current view. After successful login, user is back to main flow.

The problem with modal Login is that presenting view controller is still in memory. Which potentially means sensitive data, and not finished tasks.


# Navigation editing

If the app has `UINavigationController` at the root, you might consider adding Login screen as its root view controller. Then when you need to disrupt user flow with Login, just do a `popToRootViewController`.

There is also an option to dynamically edit its `viewControllers`, when you want to put something in the middle of navigation flow.

# Container view controllers

If the app has more complex containment beyond single `UINavigationController`, it becomes problematic to introduce navigation controller as a root container just for the sake of login flow.

You might consider other containers, but here I suggest implementing a custom one.

Let's put our custom container at the root, and we have all the freedom to show Login screen at any moment:

<a href="{% include page_assets %}/diagram.png"><img src="{% include page_assets %}/diagram.png" width="300" /></a>

Follow Apple's guide here: [Implementing a Container View Controller][CONTAINERS]

Here is my implementation based on this guide: [security-container-ios][SECCON]

Try `DemoApp`, and look at its storyboard for sample usage.

Similar to standard containers, I have `securityContainer` optional property on any `UIViewController` in view hierarchy. On which I can invoke `securityLock` to present Login at any moment in the app, which also pops current views out of memory.

## Some details

First thing to notice, there is no way for developer to have built-in relationship segue, like the ones on standard containers. You have to rely on a custom segue:

<img src="{% include page_assets %}/segue-popup.png" />

Then, there is a problem of custom transition animation. Here I tried to mimic `UINavigationController` push and pop.


# Conclusion

In the end, container code is not that hard, and it gives you full control of user flow.

Source code: [security-container-ios][SECCON]


[CONTAINERS]: https://developer.apple.com/library/ios/featuredarticles/ViewControllerPGforiPhoneOS/ImplementingaContainerViewController.html
[SECCON]: https://github.com/paiv/security-container-ios
