# ARANET4_VIS

This is a utility web app offering the possibility to export specific portions of Aranet4 co2 data. Markers can be added to the chart to indicate areas of interest.

Please visit the live app at [https://the-butchers.at/aranet4_vis/](https://the-butchers.at/aranet4_vis/)

Please refer to the instructions below to get started.

## 1) Import CSV Data

Start by exporting CSV data from your Aranet4 device. Find and press the export CSV icon in your Aranet App. Export the CSV file to a location of your choice, then import the CSV file into this app by pressing the button shown in the image or dragging the file onto the button.

![CSV dropzone](screens/screen_01.png)

When the import succeeds, the data contained in the CSV file will display in the web app. By default, a maximum of the last 7 days is shown. The overall range of data shown in the chart can be specified with the "chart display range" setting by picking "min (incl)" and "max (incl)" settings suitable for your needs.

![data after importing](screens/screen_02.png)

## 2) Specify chart display ranges

You can now limit the daily times of data that you want to include in your chart. Please configure one or more time ranges to include. You can also limit data to specific weekdays, i.e. when you want to show specific hours of workdays or schoodays only.

![Alt text](screens/screen_03.png)

Once configured, the data in your chart will be broken into distinct sections of data.

![Alt text](screens/screen_04.png)

## 3) Specify chart marker ranges

Create chart markers to indicate sections of interest within your data. As with display ranges you can choose weekdays for marker ranges. Combining display range weekdays and marker range weekdays give the possibility to create a flexible set of chart data being included.

![Alt text](screens/screen_05.png)

Markers will show in the chart for better readability.

![Alt text](screens/screen_06.png)

## 4) Change chart options

Adapt chart options as suitable. You can choose to display the background gradient display of the chart, or change the display of the curve. If required, any dates can be hidden in the chart.

## 5) Export chart

Use the "EXPORT TO PNG" button or the keyboard shortcur "X" to export your chart as image.