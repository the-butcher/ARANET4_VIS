import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IChartOptions, IRecord, ITimeSpan, ITimeSpanNamed, IUiProps } from "./components/IUiProps";
import UiComponent from "./components/UiComponent";
import { StorageUtil } from "./util/StorageUtil";
import { ThemeUtil } from "./util/ThemeUtil";

const App = () => {

  const handleChartOptionsUpdate = (update: Partial<IChartOptions>) => {

    propsRef.current = {
      ...propsRef.current,
      chartOptions: {
        ...propsRef.current.chartOptions,
        ...update
      },
      handleRecordUpdate,
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
    }
    setProps(propsRef.current);

  }

  const handleTimeSpanUpdate = (timeSpan: ITimeSpanNamed) => {

    console.debug('📞 handling time span', timeSpan);

    // find any existing timespan with that uuid
    const timeSpans = propsRef.current.timeSpans.filter(t => t.uuid !== timeSpan.uuid);
    if (timeSpan.instantMin >= 0 && timeSpan.instantMax >= 0) {
      timeSpans.push(timeSpan);
    };
    timeSpans.sort((a, b) => a.instantMin - b.instantMin);
    propsRef.current = {
      ...propsRef.current,
      timeSpans,
      handleRecordUpdate,
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
    }
    setProps(propsRef.current);

  }

  /**
   * handle loading of a new file
   * tries to move a previous user time range (like a school day) to the last possible location in the data
   *
   * @param name
   * @param records
   */
  const handleRecordUpdate = (name: string, records: IRecord[]) => {

    console.debug('📞 handling record update', name, records);

    const instantMinData = records[0].instant;
    const instantMaxData = records[records.length - 1].instant;

    let instantMinUser = records[0].instant;
    let instantMaxUser = records[records.length - 1].instant;

    // if the user time span still overlaps with the data
    if (propsRef.current.timeSpanUser.instantMin >= instantMinData && propsRef.current.timeSpanUser.instantMax <= instantMaxData) {
      instantMinUser = propsRef.current.timeSpanUser.instantMin;
      instantMaxUser = propsRef.current.timeSpanUser.instantMax;
    }

    propsRef.current = {
      ...propsRef.current,
      name,
      records,
      timeSpanData: {
        instantMin: instantMinData,
        instantMax: instantMaxData
      },
      timeSpanUser: {
        instantMin: instantMinUser,
        instantMax: instantMaxUser
      },
      handleRecordUpdate,
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
    }
    setProps(propsRef.current);

  }

  const handleTimeSpanUserUpdate = (timeSpanUser: ITimeSpan) => {

    console.debug('📞 handling time span user update', timeSpanUser);

    propsRef.current = {
      ...propsRef.current,
      timeSpanUser,
      handleRecordUpdate,
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
    }
    setProps(propsRef.current);

  }

  const propsRef = useRef<IUiProps>({
    name: '',
    records: [],
    timeSpanData: {
      instantMin: Date.now(),
      instantMax: Date.now(),
    },
    timeSpanUser: {
      instantMin: Date.now(),
      instantMax: Date.now(),
    },
    timeSpans: [],
    chartOptions: {
      title: 'CO₂ Measurements',
      showGradientFill: true,
      showGradientStroke: true,
      strokeWidth: 3,
      fontSize: 20
    },
    handleRecordUpdate,
    handleTimeSpanUserUpdate,
    handleTimeSpanUpdate,
    handleChartOptionsUpdate
  });
  const [props, setProps] = useState<IUiProps>(propsRef.current);

  /**
   * no-arg useEffect - called when the component builds
   */
  useEffect(() => {

    console.debug('✨ building app component');

    const loadedProps = StorageUtil.loadProps();
    if (loadedProps) {
      const timeSpans = loadedProps.timeSpans;
      timeSpans.sort((a, b) => a.instantMin - b.instantMin);
      propsRef.current = loadedProps;
      propsRef.current = {
        ...loadedProps,
        timeSpans,
        handleRecordUpdate,
        handleTimeSpanUserUpdate,
        handleTimeSpanUpdate,
        handleChartOptionsUpdate
      }
      setProps(propsRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    console.debug(`⚙ updating app component (props)`, props);
    if (props.records.length > 0) {
      StorageUtil.storeUiProps(props);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <ThemeProvider theme={ThemeUtil.getTheme()} >
      <CssBaseline />
      <UiComponent {...props} />
    </ThemeProvider>
  );

}

export default App;