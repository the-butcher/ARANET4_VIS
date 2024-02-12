import moment from 'moment';
import 'moment/locale/de';

import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";

import { useEffect, useRef } from "react";
import { ThemeUtil } from "../util/ThemeUtil";
import { IDataProps } from "./IUiProps";
import { TimeUtil } from '../util/TimeUtil';
import { adaptV4Theme } from '@mui/material';

const CHART_DIV_ID_DETAIL = 'chartdivdetail';

const StepComponentChartOverview = (props: IDataProps) => {

    const { timeSpanData, timeSpanUser, records } = { ...props };

    const chartRef = useRef<am4charts.XYChart>();

    useEffect(() => {

        if (chartRef.current) {
            chartRef.current.dispose();
        }

        console.debug(`⚙ updating chart component overview (timeSpanUser, records)`, timeSpanUser, records);

        chartRef.current = am4core.create(CHART_DIV_ID_DETAIL, am4charts.XYChart);

        chartRef.current.paddingTop = 1;
        chartRef.current.paddingLeft = 0;
        chartRef.current.paddingBottom = 0;
        chartRef.current.paddingRight = 0;

        chartRef.current.dateFormatter.dateFormat = "yyyy-MM-dd";
        chartRef.current.zoomOutButton.disabled = true;

        const valueAxisCo2 = chartRef.current.yAxes.push(new am4charts.ValueAxis());
        valueAxisCo2.renderer.labels.template.disabled = true;
        valueAxisCo2.renderer.grid.template.disabled = false;
        valueAxisCo2.renderer.grid.template.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        valueAxisCo2.renderer.disabled = true;
        valueAxisCo2.tooltip!.disabled = true;

        const dateAxis = chartRef.current!.xAxes.push(new am4charts.DateAxis());

        dateAxis.renderer.grid.template.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        dateAxis.renderer.labels.template.disabled = false;
        dateAxis.gridIntervals.setAll([
            { timeUnit: "day", count: 1 },
            { timeUnit: "week", count: 1 },
            { timeUnit: "month", count: 1 },
        ]);
        dateAxis.baseInterval = { timeUnit: "minute", count: 1 };

        dateAxis.renderer.grid.template.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        dateAxis.renderer.labels.template.visible = true;
        dateAxis.renderer.labels.template.fill = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        dateAxis.renderer.labels.template.adapter.add('text', (value, target) => {
            if (target.dataItem.dates.date) {
                return moment(target.dataItem.dates.date).format('DD.MM.yyyy');
            } else {
                return value;
            }
        });
        dateAxis.renderer.minGridDistance = 60;
        dateAxis.min = TimeUtil.toInstantMinUser(timeSpanData.instantMin);
        dateAxis.max = TimeUtil.toInstantMaxUser(timeSpanData.instantMax);

        const seriesCo2 = chartRef.current!.series.push(new am4charts.LineSeries());
        seriesCo2.visible = true;
        seriesCo2.name = '#';
        seriesCo2.xAxis = dateAxis;
        seriesCo2.yAxis = valueAxisCo2;
        seriesCo2.dataFields.dateX = "date";
        seriesCo2.dataFields.valueY = "co2";
        seriesCo2.propertyFields.stroke = 'color';

        seriesCo2.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        seriesCo2.strokeWidth = 1;
        seriesCo2.strokeLinecap = 'round';
        seriesCo2.strokeLinejoin = 'round';

        let chartData: any[] = [];
        let black = am4core.color('rgba(0, 0, 0, 1.0)');
        let white = am4core.color('rgba(0, 0, 0, 0.0)');
        let color = white;
        let incr = Math.max(1, Math.floor(records.length / window.innerWidth));
        let incl: boolean;
        for (let i = 0; i < records.length - 1; i++) {
            if (records[i + 1].instant - records[i].instant > TimeUtil.MILLISECONDS_PER_MINUTE * 15) {
                color = white;
                incl = true;
            } else {
                incl = i % incr === 0 || color === white; // first segment after a white must be included
                color = black;
            }
            if (incl) {
                chartData.push({
                    date: new Date(records[i].instant),
                    co2: records[i].co2,
                    instant: records[i].instant,
                    color
                })
            }
        }

        const axisRange = dateAxis.axisRanges.create();
        axisRange.value = new Date(timeSpanUser.instantMin).getTime();
        axisRange.endValue = new Date(timeSpanUser.instantMax).getTime();
        axisRange.label.inside = true;

        axisRange.axisFill.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);

        // var pattern = new am4core.LinePattern();
        // pattern.width = 7;
        // pattern.height = 7;
        // pattern.strokeWidth = 1;
        // pattern.stroke = am4core.color(ThemeUtil.COLOR_CHART_FONT);
        // pattern.rotation = -45;

        axisRange.axisFill.fill = am4core.color('#1976d2'); // pattern;
        axisRange.axisFill.fillOpacity = 0.2;
        axisRange.axisFill.strokeOpacity = 0.2;

        axisRange.grid.strokeOpacity = 0.0;
        axisRange.label.visible = false;

        seriesCo2.data = chartData;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpanUser, records,]);

    return (
        <>
            <div>
                <div id={CHART_DIV_ID_DETAIL} style={{
                    width: '100%',
                    height: '100px',
                    flexGrow: '1'
                }} />
            </div>
        </>
    );

}

export default StepComponentChartOverview;