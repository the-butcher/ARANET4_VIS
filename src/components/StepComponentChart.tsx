import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import { Fab } from "@mui/material";
import { useEffect, useRef } from "react";
import { ColorUtil } from "../util/ColorUtil";
import { ObjectUtil } from "../util/ObjectUtil";
import { ThemeUtil } from "../util/ThemeUtil";
import { TimeUtil } from "../util/TimeUtil";
import { INDICES_OF_DAYS, ITimeSpan, IUiProps } from "./IUiProps";

const CHART_DIV_ID = 'chartdiv';

const StepComponentChart = (props: IUiProps) => {

    const { timeSpanUser, records, timeSpans, chartOptions } = { ...props };

    const chartRef = useRef<am4charts.XYChart>();

    const handleExportToPng = () => {
        if (chartRef.current) {
            chartRef.current.exporting.backgroundColor = am4core.color(ThemeUtil.COLOR_CHART_BG);
            chartRef.current.exporting.export("png");
        } else {
            console.log('chart is not defined');
        }
    }

    useEffect(() => {
        console.debug('✨ building chart component');
        document.addEventListener('keyup', e => {
            if (e.key === 'x') {
                handleExportToPng();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        if (chartRef.current) {
            chartRef.current.dispose();
        }

        const fontSize = chartOptions.fontSize / devicePixelRatio;
        const fontFamily = 'Courier Prime Sans';

        console.debug(`⚙ updating chart component (timeSpanUserr, records, timeSpans)`, timeSpanUser, records, timeSpans);

        chartRef.current = am4core.create(CHART_DIV_ID, am4charts.XYChart);
        chartRef.current.dateFormatter.dateFormat = "yyyy-MM-dd";
        chartRef.current.zoomOutButton.disabled = true;
        chartRef.current.exporting.adapter.add('filePrefix', (value, target) => {
            return {
                filePrefix: ObjectUtil.createDownloadName()
            };
        });

        let title = chartRef.current.titles.create();
        title.text = `${chartOptions.title} ${TimeUtil.formatCategoryDateFull(timeSpanUser.instantMin)} -> ${TimeUtil.formatCategoryDateFull(timeSpanUser.instantMax)} `;
        title.fontFamily = fontFamily;
        title.fontSize = fontSize;
        title.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        title.marginBottom = 12 / window.devicePixelRatio;

        let dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
        // dateAxis.skipEmptyPeriods = true;

        dateAxis.renderer.grid.template.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        dateAxis.renderer.labels.template.visible = true;
        dateAxis.renderer.labels.template.rotation = -90;
        dateAxis.renderer.labels.template.verticalCenter = 'middle';
        dateAxis.renderer.labels.template.fontFamily = fontFamily;
        dateAxis.renderer.labels.template.fontSize = fontSize;
        dateAxis.renderer.labels.template.paddingRight = 16 / window.devicePixelRatio;
        dateAxis.renderer.labels.template.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);

        dateAxis.gridIntervals.setAll([
            { timeUnit: "minute", count: 15 },
            { timeUnit: "hour", count: 1 },
            { timeUnit: "hour", count: 3 },
            { timeUnit: "hour", count: 6 },
            { timeUnit: "day", count: 1 },
            { timeUnit: "week", count: 1 }
        ]);
        dateAxis.baseInterval = { timeUnit: "minute", count: 1 };
        dateAxis.dateFormatter = new am4core.DateFormatter();

        dateAxis.dateFormats.setKey("hour", "HH:mm");
        dateAxis.dateFormats.setKey("day", "dd.MM.yyyy");
        dateAxis.tooltip!.label.rotation = -90;
        dateAxis.tooltip!.label.horizontalCenter = 'right';
        dateAxis.tooltip!.label.verticalCenter = 'middle';

        dateAxis.tooltip!.background.fill = am4core.color(ThemeUtil.COLOR_CHART_BG);
        dateAxis.tooltip!.background.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        dateAxis.tooltip!.label.fontFamily = fontFamily;
        dateAxis.tooltip!.label.fontSize = fontSize;
        dateAxis.tooltip!.label.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);

        const valueAxisCo2 = chartRef.current.yAxes.push(new am4charts.ValueAxis());
        valueAxisCo2.extraMax = 0.001;
        valueAxisCo2.renderer.grid.template.disabled = false;
        valueAxisCo2.renderer.grid.template.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        valueAxisCo2.renderer.disabled = false;
        valueAxisCo2.renderer.labels.template.fontFamily = fontFamily;
        valueAxisCo2.renderer.labels.template.fontSize = fontSize;
        valueAxisCo2.renderer.labels.template.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        valueAxisCo2.renderer.labels.template.adapter.add('text', (value, target) => {
            if (value) {
                const numval = parseInt(value.replace(',', ''));
                return numval.toLocaleString();
            }
            return value;
        });

        valueAxisCo2.exportable = true;
        valueAxisCo2.min = 0;
        // valueAxisCo2.max = 2000; // TODO :: configurable or by date
        // valueAxisCo2.strictMinMax = true;
        valueAxisCo2.title.text = "CO₂ ppm";
        valueAxisCo2.title.fontFamily = fontFamily;
        valueAxisCo2.title.fontSize = fontSize;
        valueAxisCo2.title.exportable = true;
        valueAxisCo2.title.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        valueAxisCo2.tooltip!.disabled = true;

        let seriesCo2 = chartRef.current.series.push(new am4charts.LineSeries());
        seriesCo2.visible = true;
        seriesCo2.name = '#';
        seriesCo2.dataFields.dateX = "date";
        seriesCo2.dataFields.valueY = "co2";
        seriesCo2.yAxis = valueAxisCo2;

        seriesCo2.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        seriesCo2.strokeWidth = chartOptions.strokeWidth / window.devicePixelRatio;
        seriesCo2.strokeLinecap = 'round';
        seriesCo2.strokeLinejoin = 'round';
        if (chartOptions.showGradientStroke) {
            seriesCo2.propertyFields.stroke = 'color';
        }

        seriesCo2.adapter.add('tooltipText', (value, target) => {
            const tooltipDataItemDataContext: any = target.tooltipDataItem.dataContext;
            if (tooltipDataItemDataContext) {
                const co2: number = tooltipDataItemDataContext['co2'];
                return `${co2.toLocaleString()} ppm`;
            } else {
                return value;
            }
        });

        seriesCo2.tooltipText = "{co2} ppm";
        seriesCo2.tooltip!.getFillFromObject = false;
        seriesCo2.tooltip!.getStrokeFromObject = false;
        seriesCo2.tooltip!.background.fill = am4core.color(ThemeUtil.COLOR_CHART_BG);
        seriesCo2.tooltip!.background.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        seriesCo2.tooltip!.label.fontFamily = fontFamily;
        seriesCo2.tooltip!.label.fontSize = fontSize;
        seriesCo2.tooltip!.label.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);

        chartRef.current.cursor = new am4charts.XYCursor();
        chartRef.current.cursor.xAxis = dateAxis;
        chartRef.current.cursor.showTooltipOn = 'always';
        chartRef.current.cursor.exportable = true;
        chartRef.current.cursor.lineX.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        chartRef.current.cursor.lineY.disabled = true;
        chartRef.current.cursor.behavior = 'none';

        const midnightMin = TimeUtil.toMidnightInstant(timeSpanUser.instantMin);
        const midnightMax = TimeUtil.toMidnightInstant(timeSpanUser.instantMax) + TimeUtil.MILLISECONDS_PER____DAY;

        const dataRanges: ITimeSpan[] = [];
        for (let midnight = midnightMin; midnight <= midnightMax; midnight += TimeUtil.MILLISECONDS_PER____DAY) {

            timeSpans.filter(t => t.spanType === 'display').forEach(dispSpan => {
                const instantMin = midnight + dispSpan.instantMin;
                const instantMax = midnight + dispSpan.instantMax;
                if (instantMax > timeSpanUser.instantMin && instantMin < timeSpanUser.instantMax) {
                    const dayOfWeek = INDICES_OF_DAYS[new Date(instantMin).getDay()];
                    if (dispSpan.days.find(d => d === dayOfWeek)) {
                        dataRanges.push({
                            instantMin,
                            instantMax
                        });
                    }
                }
            });

        }

        // filter by time
        let filteredRecords = records.filter(r => {
            return r.instant >= timeSpanUser.instantMin && r.instant <= timeSpanUser.instantMax && dataRanges.find(d => r.instant >= d.instantMin && r.instant <= d.instantMax);
        });
        // remove every second entry until record count is manageable
        while (filteredRecords.length > window.innerWidth) {
            let count = 0;
            filteredRecords = filteredRecords.filter(r => count++ % 2 === 0);
        }
        // add colors
        const chartData = filteredRecords.map(r => {
            return {
                date: new Date(r.instant),
                co2: r.co2,
                color: am4core.color(ColorUtil.getColorFromCo2(r.co2))
            }
        });
        const co2Max = Math.max(...chartData.map(o => o.co2));

        const createDateRange = (instant1: number, instant2: number, text: string, opacity: number) => {

            const axisRange = dateAxis.axisRanges.create();
            axisRange.value = instant1;
            axisRange.endValue = instant2;
            axisRange.label.inside = true;

            var pattern = new am4core.LinePattern();
            pattern.width = 7;
            pattern.height = 7;
            pattern.strokeWidth = 1;
            pattern.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
            pattern.rotation = 45;

            axisRange.axisFill.fill = pattern;
            axisRange.axisFill.fillOpacity = opacity;
            // axisRange.axisFill.fill = am4core.color('#999999');

            axisRange.axisFill.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
            axisRange.axisFill.strokeOpacity = opacity;
            axisRange.grid.strokeOpacity = 0.0;

            if (instant1 === instant2) {
                axisRange.grid.strokeOpacity = opacity * 2; // left axis border
            }

            axisRange.label.visible = false;

            const axisRangeBullet = new am4charts.Bullet();
            const axisRangeLabel = axisRangeBullet.createChild(am4core.Label);
            axisRangeLabel.dy = -10 / window.devicePixelRatio;
            axisRangeLabel.rotation = -90;
            axisRangeLabel.text = text;
            axisRangeLabel.strokeOpacity = opacity;
            axisRangeLabel.fillOpacity = 1.00;
            axisRangeLabel.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);
            axisRangeLabel.fontFamily = fontFamily;
            axisRangeLabel.fontSize = fontSize;

            axisRangeBullet.adapter.add('x', (value, target) => {
                const axisEndPoint = dateAxis.dateToPoint(new Date(instant2));
                return axisEndPoint.x - fontSize * 1.5;
            });

            axisRange.bullet = axisRangeBullet;

        }

        const createValueRange = (value1: number, value2: number, text: string, patternColor: string) => {

            const valueRange1 = valueAxisCo2.axisRanges.create();
            valueRange1.value = value1;
            valueRange1.endValue = value2;

            var pattern = new am4core.LinePattern();
            pattern.width = 5;
            pattern.height = 5;
            pattern.strokeWidth = 1;
            pattern.stroke = am4core.color(patternColor);
            pattern.rotation = 45;

            valueRange1.axisFill.fill = am4core.color(patternColor); // pattern;
            valueRange1.axisFill.fillOpacity = chartOptions.showGradientStroke ? 0.2 : 0.6; // opacity;
            valueRange1.axisFill.stroke = am4core.color('#000000');
            valueRange1.axisFill.strokeOpacity = 0.0;
            valueRange1.grid.strokeOpacity = 0.0;

            const valueRange2 = valueAxisCo2.axisRanges.create();
            valueRange2.axisFill.stroke = am4core.color(patternColor);
            valueRange2.axisFill.strokeOpacity = 0.0;
            valueRange2.value = value2;
            valueRange2.endValue = value2;
            valueRange2.grid.strokeWidth = 0;
            valueRange2.grid.strokeOpacity = 0;

        }

        if (chartOptions.showGradientFill) {
            for (let co2 = 0; co2 <= co2Max + 600; co2 += 100) {
                createValueRange(co2, co2 + 100, '', ColorUtil.getColorFromCo2(co2 + 50));
            }
        }


        for (let midnight = midnightMin; midnight <= midnightMax; midnight += TimeUtil.MILLISECONDS_PER____DAY) {

            timeSpans.filter(t => t.spanType === 'markers').forEach(markSpan => {

                const rangeMin = midnight + markSpan.instantMin;
                const rangeMax = midnight + markSpan.instantMax;
                if (rangeMin < timeSpanUser.instantMax && dataRanges.find(d => rangeMax >= d.instantMin && rangeMin <= d.instantMax)) {
                    createDateRange(rangeMin, rangeMax, markSpan.title, 0.20);
                }

            });

        }

        seriesCo2.data = chartData;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpanUser, records, timeSpans, chartOptions]);

    return (
        <>
            <div>
                <div id={CHART_DIV_ID} style={{
                    width: '100%',
                    height: '50vw',
                    flexGrow: '1'
                }} />
                <Fab
                    variant='extended'
                    color="primary"
                    aria-label="add"
                    sx={{
                        right: 20,
                        bottom: 20,
                        left: 'auto',
                        position: 'fixed',
                    }}
                    onClick={handleExportToPng}
                >
                    <AddAPhotoIcon sx={{ paddingRight: '4px' }} />
                    <span style={{ paddingTop: '4px' }}>EXPORT TO PNG [X]</span>
                </Fab>
            </div>
        </>
    );

}

export default StepComponentChart;