/* eslint-disable no-loop-func */
import 'moment/locale/de';

import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";

import { useEffect, useRef } from "react";
import { ObjectUtil } from '../util/ObjectUtil';
import { ThemeUtil } from '../util/ThemeUtil';

export type IRecordSK = {
    linkA: number;
    linkB: string; // color hex string
    instA: number;
    instB: number;
}
export type IDataPropsSk = {
    uuid: string;
    records: IRecordSK[];
}

const StepComponentChartSankey = (props: IDataPropsSk) => {

    const { uuid, records } = { ...props };

    const chartRef = useRef<am4charts.SankeyDiagram>();

    const handleExportToPng = () => {
        if (chartRef.current) {
            chartRef.current.exporting.backgroundColor = am4core.color(ThemeUtil.COLOR_CHART_BG);
            chartRef.current.exporting.export("png");
        } else {
            console.log('chart is not defined');
        }
    }

    useEffect(() => {
        console.debug('✨ building chart sankey component');
        document.addEventListener('keyup', e => {
            if (e.key === 'x') {
                handleExportToPng();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        console.debug(`⚙ updating chart component (records)`, records);

        if (chartRef.current) {
            chartRef.current.dispose();
        }
        chartRef.current = am4core.create(uuid, am4charts.SankeyDiagram);

        chartRef.current.paddingLeft = 0;
        chartRef.current.paddingRight = 0;

        chartRef.current.minNodeSize = 0.0001;
        chartRef.current.nodeAlign = "bottom";
        chartRef.current.dataFields.fromName = "linkA";
        chartRef.current.dataFields.toName = "linkB";
        chartRef.current.dataFields.value = "value";
        chartRef.current.dataFields.color = "color";

        chartRef.current.orientation = "vertical";
        chartRef.current.sortBy = 'none';

        let nodeTemplate = chartRef.current.nodes.template;
        nodeTemplate.nameLabel.disabled = true;
        nodeTemplate.clickable = false;
        nodeTemplate.draggable = false;
        nodeTemplate.fillOpacity = 0.75;
        nodeTemplate.strokeOpacity = 0.0;

        let linkTemplate = chartRef.current.links.template;
        linkTemplate.colorMode = 'gradient';
        linkTemplate.fillOpacity = 0.75;

        linkTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        linkTemplate.showSystemTooltip = true;
        linkTemplate.tooltipText = "";
        linkTemplate.propertyFields.zIndex = "zIndex";
        linkTemplate.tension = 0.5;

        linkTemplate.strokeWidth = 0.20;
        linkTemplate.strokeOpacity = 0.75;

        chartRef.current.nodePadding = 0.0;

        const chartData: any[] = [];
        records.forEach(record => {
            chartData.push({
                linkA: record.linkA,
                linkB: record.linkB,
                color: am4core.color(record.linkB),
                value: record.instB - record.instA
            });
        });

        // console.log('chartData', chartData);
        chartRef.current.data = chartData;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [records]);

    return (
        <>
            <div>
                <div id={uuid} style={{
                    width: '400px',
                    height: '10vw',
                    flexGrow: '1',
                    position: 'absolute',
                }} />
            </div>
        </>
    );

}

export default StepComponentChartSankey;