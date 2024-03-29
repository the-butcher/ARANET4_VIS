import moment from 'moment';
import 'moment/locale/de';

import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import { Fab } from "@mui/material";
import { useEffect, useRef } from "react";
import { Color } from '../util/Color';
import { InterpolatedValue } from '../util/InterpolatedValue';
import { ObjectUtil } from "../util/ObjectUtil";
import { ThemeUtil } from "../util/ThemeUtil";
import { TimeUtil } from "../util/TimeUtil";
import { DAYS_OF_WEEK, IDataProps, INDICES_OF_DAYS, IRecord, IUiProps, PATT_TYPE } from "./IUiProps";


const CHART_DIV_ID_OVERVIEW = 'chartdivoverview';
interface IAxisAndSeries {
    axis: am4charts.DateAxis,
    series: am4charts.XYSeries
}
type ILinkFill = {
    text: string;
    fill: string;
    co2A: number;
    co2B: number;
}


const DISPLAY_SPAN_DEFAULT_ID = ObjectUtil.createId();

const StepComponentChartDetail = (props: IUiProps & IDataProps) => {

    const { timeSpanUser, records, timeSpans, chartOptions } = { ...props };

    // const [propsSK, setPropsSK] = useState<IDataPropsSk[]>([]);

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

        console.debug(`⚙ updating chart component (timeSpanUserr, records, timeSpans)`, timeSpanUser, records, timeSpans);

        if (chartRef.current) {
            chartRef.current.dispose();
        }

        const co2Step = (chartOptions.maxColorVal - chartOptions.minColorVal) / chartOptions.stpColorVal;

        const interpolatorH = new InterpolatedValue(0.33, -0.025, chartOptions.minColorVal, chartOptions.maxColorVal + co2Step, 1.0);
        const interpolatorS = new InterpolatedValue(1.00, 1.00, chartOptions.minColorVal, chartOptions.maxColorVal + co2Step, 1.0);
        const interpolatorV = new InterpolatedValue(0.80, 1.000, chartOptions.minColorVal, chartOptions.maxColorVal + co2Step, 1.0);

        const getColorFromCo2 = (co2: number): string => {
            return new Color(interpolatorH.getOut(co2), interpolatorS.getOut(co2), interpolatorV.getOut(co2) * 0.90).getHex();
        }

        const linkFills: ILinkFill[] = [];
        linkFills.push({
            fill: getColorFromCo2(chartOptions.minColorVal),
            text: `${Math.round(chartOptions.minColorVal).toLocaleString()}ppm`,
            co2A: 0,
            co2B: chartOptions.minColorVal
        });
        for (let i = 0; i < chartOptions.stpColorVal; i++) {
            const co2A = chartOptions.minColorVal + (i) * co2Step;
            const co2B = chartOptions.minColorVal + (i + 1) * co2Step;
            linkFills.push({
                fill: getColorFromCo2(co2B),
                text: `${Math.round(co2B).toLocaleString()}ppm`,
                co2A,
                co2B
            });
        }
        linkFills.push({
            fill: getColorFromCo2(10000),
            text: '',
            co2A: chartOptions.maxColorVal,
            co2B: 10000
        });

        // const _propsSK: IDataPropsSk[] = [];

        const fontSize = chartOptions.fontSize / devicePixelRatio;
        const fontFamily = 'Courier Prime Sans';

        const instantMinUser = timeSpanUser.instantMin;
        const instantMaxUser = timeSpanUser.instantMax;

        chartRef.current = am4core.create(CHART_DIV_ID_OVERVIEW, am4charts.XYChart);
        chartRef.current.bottomAxesContainer.layout = "horizontal";
        chartRef.current.bottomAxesContainer.reverseOrder = true;

        chartRef.current.dateFormatter.dateFormat = "yyyy-MM-dd";
        chartRef.current.zoomOutButton.disabled = true;
        chartRef.current.exporting.adapter.add('filePrefix', (value, target) => {
            return {
                filePrefix: ObjectUtil.createDownloadName()
            };
        });

        const title = chartRef.current.titles.create();
        if (chartOptions.showDates) {
            title.text = `${chartOptions.title} ${TimeUtil.formatCategoryDateFull(instantMinUser)} -> ${TimeUtil.formatCategoryDateFull(instantMaxUser)}`;
        } else {
            title.text = `${chartOptions.title}`;
        }
        title.fontFamily = fontFamily;
        title.fontSize = fontSize;
        title.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        title.marginBottom = 12 / window.devicePixelRatio;

        const valueAxisCo2 = chartRef.current.yAxes.push(new am4charts.ValueAxis());
        valueAxisCo2.extraMax = 0.001;
        // valueAxisCo2.min = -1000;
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
        valueAxisCo2.title.text = "CO₂ ppm";
        valueAxisCo2.title.fontFamily = fontFamily;
        valueAxisCo2.title.fontSize = fontSize;
        valueAxisCo2.title.exportable = true;
        valueAxisCo2.title.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        valueAxisCo2.tooltip!.disabled = true;

        chartRef.current.cursor = new am4charts.XYCursor();
        chartRef.current.cursor.exportable = true;
        chartRef.current.cursor.lineX.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        chartRef.current.cursor.lineY.disabled = true;
        chartRef.current.cursor.behavior = 'none';

        // filter for display ranges and a create a default display range in case no display ranges have been defined yet
        const timeSpansDisplay = timeSpans.filter(t => t.spanType === 'display');
        if (timeSpansDisplay.length === 0) {
            timeSpansDisplay.push({
                uuid: DISPLAY_SPAN_DEFAULT_ID,
                title: '',
                instantMin: 0,
                instantMax: 86399000, // Date and time (GMT): Thursday, 1. January 1970 23:59:59
                spanType: 'display',
                pattType: 'HL',
                days: [
                    ...DAYS_OF_WEEK
                ]
            })
        }

        const co2MaxLocals: number[] = [];
        const axisAndSeriesArray: IAxisAndSeries[] = [];
        const instantsDayUser: number[] = [];
        for (let instantDayUser = instantMinUser; instantDayUser <= instantMaxUser; instantDayUser += TimeUtil.MILLISECONDS_PER____DAY) {
            instantsDayUser.push(instantDayUser);
        }
        for (let instantDayUserIndex = 0; instantDayUserIndex < instantsDayUser.length; instantDayUserIndex++) {

            const instantDayUser = instantsDayUser[instantDayUserIndex];

            timeSpansDisplay.forEach(timeSpanDisplay => {

                const instantMinDisplay = instantDayUser + timeSpanDisplay.instantMin;
                const instantMaxDisplay = instantDayUser + timeSpanDisplay.instantMax;

                // any overlap between display range and days selected?
                if (instantMaxDisplay >= instantMinUser && instantMinDisplay <= instantMaxUser) {

                    const dayOfWeek = INDICES_OF_DAYS[new Date(instantMinDisplay).getDay()];
                    if (timeSpanDisplay.days.find(d => d === dayOfWeek)) {

                        const extraHours = timeSpanDisplay.uuid === DISPLAY_SPAN_DEFAULT_ID ? 0 : 1;
                        const dateAxis = chartRef.current!.xAxes.push(new am4charts.DateAxis());
                        dateAxis.min = new Date(instantMinDisplay).getTime() - TimeUtil.MILLISECONDS_PER___HOUR * extraHours;
                        dateAxis.max = new Date(instantMaxDisplay).getTime() + TimeUtil.MILLISECONDS_PER___HOUR * extraHours;
                        dateAxis.strictMinMax = true;

                        dateAxis.paddingTop = 0;
                        dateAxis.paddingBottom = 0;
                        dateAxis.paddingLeft = 0;
                        dateAxis.paddingRight = 0;

                        dateAxis.renderer.grid.template.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
                        dateAxis.renderer.labels.template.visible = true;
                        dateAxis.renderer.labels.template.rotation = -90;
                        dateAxis.renderer.labels.template.verticalCenter = 'middle';
                        dateAxis.renderer.labels.template.fontFamily = fontFamily;
                        dateAxis.renderer.labels.template.fontSize = fontSize;
                        dateAxis.renderer.labels.template.paddingRight = 16 / window.devicePixelRatio;
                        dateAxis.renderer.labels.template.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);
                        dateAxis.renderer.labels.template.adapter.add('text', (value, target) => {
                            if (target.dataItem.dates.date) {
                                const date = target.dataItem.dates.date;
                                if (date.getTime() >= instantMinDisplay && date.getTime() <= instantMaxDisplay) {
                                    return moment(target.dataItem.dates.date).format('HH:mm');
                                } else {
                                    return '';
                                }
                            } else {
                                return value;
                            }
                        });
                        dateAxis.renderer.minGridDistance = 12;

                        dateAxis.gridIntervals.setAll([
                            // { timeUnit: "minute", count: 15 },
                            { timeUnit: "hour", count: 1 },
                            { timeUnit: "hour", count: 3 },
                            { timeUnit: "hour", count: 6 },
                            // { timeUnit: "hour", count: 12 },
                            // { timeUnit: "hour", count: 12 },
                            // { timeUnit: "hour", count: 24 },
                            // { timeUnit: "day", count: 1 },
                            // { timeUnit: "week", count: 1 }
                        ]);
                        dateAxis.baseInterval = { timeUnit: "minute", count: 1 };

                        // dateAxis.dateFormatter = new am4core.DateFormatter();

                        dateAxis.dateFormats.setKey("hour", "HH:mm");
                        dateAxis.dateFormats.setKey("day", "HH:mm");

                        dateAxis.tooltip!.label.rotation = -90;
                        dateAxis.tooltip!.label.horizontalCenter = 'right';
                        dateAxis.tooltip!.label.verticalCenter = 'middle';

                        dateAxis.tooltip!.background.fill = am4core.color(ThemeUtil.COLOR_CHART_BG);
                        dateAxis.tooltip!.background.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
                        dateAxis.tooltip!.label.fontFamily = fontFamily;
                        dateAxis.tooltip!.label.fontSize = fontSize;
                        dateAxis.tooltip!.label.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);

                        const seriesCo2 = chartRef.current!.series.push(new am4charts.LineSeries());
                        seriesCo2.visible = true;
                        seriesCo2.name = '#';
                        seriesCo2.xAxis = dateAxis;
                        seriesCo2.yAxis = valueAxisCo2;
                        seriesCo2.dataFields.dateX = "date";
                        seriesCo2.dataFields.valueY = "co2";

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
                                const date: Date = tooltipDataItemDataContext['date'];
                                if (chartOptions.showDates) {
                                    return `${co2.toLocaleString()} ppm\n${moment(date).format('DD.MM.yyyy, HH:mm')}`;
                                } else {
                                    return `${co2.toLocaleString()} ppm`;
                                }
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

                        axisAndSeriesArray.push({
                            axis: dateAxis,
                            series: seriesCo2
                        });

                        // filter by time
                        const filteredRecords: IRecord[] = [];
                        records.forEach(r => {
                            if (r.instant >= instantMinDisplay && r.instant <= instantMaxDisplay) {
                                filteredRecords.push(r);
                            }
                        });

                        // let fillLast: string = '';
                        // let instLast: number;
                        // let linkA = 0;

                        const chartDataXY: any[] = [];
                        // const recordsSK: IRecordSK[] = [];
                        // linkFills.forEach(linkFill => {
                        //     recordsSK.push({
                        //         linkA: linkA++,
                        //         linkB: linkFill.fill,
                        //         instA: 0,
                        //         instB: 0
                        //     });
                        // });

                        // let rA: IRecord;
                        let rB: IRecord;
                        for (let i = 0; i < filteredRecords.length; i++) {

                            rB = filteredRecords[i];

                            // if (fillLast !== '') {

                            //     rA = filteredRecords[i - 1];

                            //     // eslint-disable-next-line no-loop-func
                            //     const linkFill = linkFills.find(f => rB.co2 > f.co2A && rB.co2 <= f.co2B);
                            //     if (linkFill) {
                            //         if (linkFill!.fill !== fillLast || i === filteredRecords.length - 1) {

                            //             // as the value is leaving the previous range, close it
                            //             recordsSK.push({
                            //                 linkA: linkA++,
                            //                 linkB: fillLast!,
                            //                 instA: instLast!,
                            //                 instB: rA.instant
                            //             });

                            //             instLast = rA.instant;

                            //         }
                            //         fillLast = linkFill!.fill;
                            //     }

                            // } else {
                            //     instLast = rB.instant;
                            //     // eslint-disable-next-line no-loop-func
                            //     const linkFill = linkFills.find(f => rB.co2 > f.co2A && rB.co2 <= f.co2B);
                            //     if (linkFill) {
                            //         fillLast = linkFill.fill;
                            //     }
                            // }

                            chartDataXY.push({
                                date: new Date(rB.instant),
                                co2: rB.co2,
                                color: am4core.color(getColorFromCo2(rB.co2)),
                                instant: rB.instant
                            });

                        }

                        // console.log('chartDataSK', recordsSK);
                        co2MaxLocals.push(Math.max(...chartDataXY.map(o => o.co2)));

                        // const uuidSK = `sk_${ObjectUtil.createId()}`;
                        // _propsSK.push({
                        //     uuid: uuidSK,
                        //     records: recordsSK
                        // });

                        // seriesCo2.events.on('ready', () => {

                        //     const seriesContainer = seriesCo2.element?.node as SVGGElement;
                        //     const seriesBounds = seriesContainer.getBoundingClientRect();

                        //     setTimeout(() => {
                        //         const chartSKDiv = document.getElementById(uuidSK);
                        //         // console.log('chartSKDiv', uuidSK, chartSKDiv);
                        //         if (chartSKDiv) {
                        //             chartSKDiv.style.width = `${seriesBounds.width}px`;
                        //             chartSKDiv.style.left = `${seriesBounds.x}px`;
                        //             chartSKDiv.style.top = '1900px'; //'`${seriesBounds.y + seriesBounds.height + 1300}px`
                        //         }

                        //     }, 500);

                        // });

                        const createDateRange = (instant1: number, instant2: number, text: string, opacity: number, position: 'top' | 'bot', patt: PATT_TYPE) => {

                            const axisRange = dateAxis.axisRanges.create();
                            axisRange.value = new Date(instant1).getTime();
                            axisRange.endValue = new Date(instant2).getTime();
                            axisRange.label.inside = true;

                            axisRange.axisFill.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
                            if (patt !== 'HL') { // other than hollow

                                var pattern = new am4core.LinePattern();
                                pattern.width = 7;
                                pattern.height = 7;
                                pattern.strokeWidth = 1;
                                pattern.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
                                pattern.rotation = patt === 'FW' ? -45 : 45;

                                axisRange.axisFill.fill = pattern;
                                axisRange.axisFill.fillOpacity = opacity;
                                axisRange.axisFill.strokeOpacity = opacity;

                            } else {
                                axisRange.axisFill.fillOpacity = 0.0;
                                axisRange.axisFill.strokeOpacity = opacity * 2;
                                axisRange.axisFill.strokeWidth = chartOptions.strokeWidth / 2;
                            }
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
                            axisRangeLabel.fontSize = fontSize - 2;

                            axisRangeBullet.adapter.add('x', (value, target) => {
                                const axisEndPoint = dateAxis.dateToPoint(new Date(instant2));
                                return axisEndPoint.x - fontSize * 1.5;
                            });
                            if (position === 'top') {
                                axisRangeBullet.adapter.add('x', (value, target) => {
                                    const axisEndPoint = dateAxis.dateToPoint(new Date(instant1));
                                    return axisEndPoint.x;
                                });
                                axisRangeBullet.adapter.add('y', (value, target) => {
                                    const axisEndPoint = valueAxisCo2.positionToCoordinate(1);
                                    axisRangeLabel.measureElement();
                                    return axisEndPoint + axisRangeLabel.measuredHeight + fontSize * 1.0;
                                });
                            } else {
                                axisRangeBullet.adapter.add('x', (value, target) => {
                                    const axisEndPoint = dateAxis.dateToPoint(new Date(instant2));
                                    return axisEndPoint.x - fontSize * 1.25;
                                });
                            }

                            axisRange.bullet = axisRangeBullet;

                        }

                        timeSpans.filter(t => t.spanType === 'markers').forEach(timeSpanMarkers => {

                            if (timeSpanMarkers.days.find(d => d === dayOfWeek)) {

                                const rangeMin = instantDayUser + timeSpanMarkers.instantMin;
                                const rangeMax = instantDayUser + timeSpanMarkers.instantMax;
                                if (rangeMin < instantMaxDisplay) {
                                    createDateRange(rangeMin, rangeMax, timeSpanMarkers.title, 0.25, 'bot', timeSpanMarkers.pattType);
                                }

                            }

                        });

                        if (instantsDayUser.length <= 7) {
                            createDateRange(instantMinDisplay, instantMaxDisplay, chartOptions.showDates ? `${timeSpanDisplay.title} ${dayOfWeek}, ${TimeUtil.formatCategoryDateFull(instantDayUser)}` : `${timeSpanDisplay.title} ${dayOfWeek}`, 0.15, 'top', timeSpanDisplay.pattType);
                        }

                        seriesCo2.data = chartDataXY;

                    }

                }

            });

        }

        chartRef.current.cursor.events.on('cursorpositionchanged', e => {
            axisAndSeriesArray.forEach(axisAndSeries => {
                const axisPosition = axisAndSeries.axis.toAxisPosition(e.target.xPosition);
                const disabled = axisPosition < 0 || axisPosition > 1;
                axisAndSeries.axis.tooltip!.disabled = disabled;
                axisAndSeries.series.tooltip!.disabled = disabled;
            })
        });

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

        const showLegend = chartOptions.showLegend && (chartOptions.showGradientFill || chartOptions.showGradientStroke);
        const legendData: any[] = [];
        linkFills.forEach(linkFill => {
            if (showLegend && linkFill.text !== '') {
                legendData.push({
                    name: linkFill.text,
                    fill: linkFill.fill
                });
            }
            if (chartOptions.showGradientFill) {
                createValueRange(linkFill.co2A, linkFill.co2B, '', linkFill.fill);
            }
        });

        if (showLegend) {

            let legend = new am4charts.Legend();

            legend.markers.template.width = fontSize * 2;
            legend.markers.template.height = fontSize;
            legend.markers.template.marginRight = fontSize / 2;
            legend.labels.template.fontFamily = fontFamily;
            legend.labels.template.fontSize = fontSize;

            legend.parent = chartRef.current.chartContainer;
            legend.data = legendData;

        }

        // setPropsSK(_propsSK);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpanUser, records, timeSpans, chartOptions]);

    return (
        <>
            <div>
                <div id={CHART_DIV_ID_OVERVIEW} style={{
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
                {/* {
                    propsSK.map((value, index) => <StepComponentChartSankey key={value.uuid} {...value} />)
                } */}
            </div>
        </>
    );

}

export default StepComponentChartDetail;