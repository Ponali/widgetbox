# Introduction
WidgetBox is a widget environment abstraction layer utility program that allows Yoink packages to make widgets with ease of use, with all the necessary features built-in.

# Installing widgetbox
WidgetBox uses the ID `widgetbox`.
To install WidgetBox, run `yoink widgetbox` or `yoink -i widgetbox`.

# Using WidgetBox
## GUI
When WidgetBox first starts up, there's a "+" button on the bottom right corner.
Once clicked, it gives a list of all the available widgets. Clicking on one of these will make a widget on the top left corner of the desktop.

Widgets can be dragged around like a window header.

When a widget is hovered, a sidebar with two options comes up. One is a close button, and the other is a Configure button.

The close button does exactly what it says: it removes the widget.

The Configure button pops up a window with settings and an Apply button. The Apply button saves all the settings and reloads the widget to apply that setting.
## Built-in widgets
There is currently 1 widget: Clock.
### Clock
This widget is a digital clock, with features such as font changing, changing date format, etc.
The right side of the clock can be customised to basically anyone's need with elements being Seconds, Day of week, 12-hour mark, a customisable Date, and Year.
The Date can be customised to have a reversed order, to have a 2-digit-long year, or the full year.
Current fonts include the default system font, and a [7-segment font](https://torinak.com/font/7-segment).

# Making package file
The file structure used by this repository is made to be made by [yoink-package-maker](https://github.com/Ponali/yoink-package-maker).

Here is an example on how you can make a package:
```
git clone https://github.com/Ponali/yoink-package-maker.git
cd yoink-package-maker
git clone https://github.com/Ponali/widgetbox.git
npm install
node make.js widgetbox
```
