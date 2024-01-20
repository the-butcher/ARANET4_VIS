import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IProfileDef, IProfileProps } from "./components/IProfileProps";
import { IChartOptions, IDataProps, ITimeSpan, ITimeSpanNamed, IUiProps } from "./components/IUiProps";
import UiComponent from "./components/UiComponent";
import { StorageUtil } from "./util/StorageUtil";
import { ThemeUtil } from "./util/ThemeUtil";
import { TimeUtil } from "./util/TimeUtil";

import Filter1Icon from '@mui/icons-material/Filter1';
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone';

import Filter2Icon from '@mui/icons-material/Filter2';
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone';

import Filter3Icon from '@mui/icons-material/Filter3';
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone';
import { ObjectUtil } from "./util/ObjectUtil";

export const PROFILE_DEFS: IProfileDef[] = [
  {
    sProp: 'UI_PROPS_4',
    icon0: <Filter1Icon color="secondary" />,
    icon1: <Filter1TwoToneIcon color="primary" />,
  },
  {
    sProp: 'UI_PROPS_5',
    icon0: <Filter2Icon color="secondary" />,
    icon1: <Filter2TwoToneIcon color="primary" />,
  },
  {
    sProp: 'UI_PROPS_6',
    icon0: <Filter3Icon color="secondary" />,
    icon1: <Filter3TwoToneIcon color="primary" />,
  }
]

const App = () => {

  const handleChartOptionsUpdate = (update: Partial<IChartOptions>) => {

    uiPropsRef.current = {
      ...uiPropsRef.current,
      chartOptions: {
        ...uiPropsRef.current.chartOptions,
        ...update,
        handleChartOptionsUpdate
      },
      handleTimeSpanUpdate
    }
    setUiProps(uiPropsRef.current);

  }

  const handleTimeSpanUpdate = (timeSpan: ITimeSpanNamed) => {

    console.debug('📞 handling time span', timeSpan);

    // find any existing timespan with that uuid
    const timeSpans = uiPropsRef.current.timeSpans.filter(t => t.uuid !== timeSpan.uuid);
    if (timeSpan.instantMin !== Number.NEGATIVE_INFINITY && timeSpan.instantMax !== Number.NEGATIVE_INFINITY) {
      timeSpans.push(timeSpan);
    };
    timeSpans.sort((a, b) => a.instantMin - b.instantMin);
    uiPropsRef.current = {
      ...uiPropsRef.current,
      timeSpans: timeSpans,
      chartOptions: {
        ...uiPropsRef.current.chartOptions,
        handleChartOptionsUpdate
      },
      handleTimeSpanUpdate
    }
    setUiProps(uiPropsRef.current);

  }

  /**
   * handle loading of a new file
   * tries to move a previous user time range (like a school day) to the last possible location in the data
   *
   * @param name
   * @param records
   */
  const handleRecordUpdate = (updates: Pick<IDataProps, 'name' | 'type' | 'records'>) => {

    console.debug('📞 handling record update', updates);

    const instantMinData = updates.records[0].instant;
    const instantMaxData = updates.records[updates.records.length - 1].instant;

    let instantMaxUser = TimeUtil.toInstantMaxUser(updates.records[updates.records.length - 1].instant);
    let instantMinUser = Math.max(TimeUtil.toInstantMinUser(updates.records[updates.records.length - 1].instant) - TimeUtil.MILLISECONDS_PER____DAY * 6, TimeUtil.toInstantMinUser(updates.records[0].instant));

    uiPropsRef.current = {
      ...uiPropsRef.current,
      chartOptions: {
        ...uiPropsRef.current.chartOptions,
        handleChartOptionsUpdate
      },
      handleTimeSpanUpdate
    };
    setUiProps(uiPropsRef.current);

    dataPropsRef.current = {
      ...dataPropsRef.current,
      ...updates,
      timeSpanData: {
        instantMin: instantMinData,
        instantMax: instantMaxData
      },
      timeSpanUser: {
        instantMin: instantMinUser,
        instantMax: instantMaxUser
      },
      handleRecordUpdate,
      handleTimeSpanUserUpdate
    };
    setDataProps(dataPropsRef.current);

  }

  const handleTimeSpanUserUpdate = (timeSpanUser: ITimeSpan) => {

    console.debug('📞 handling time span user update', timeSpanUser);

    dataPropsRef.current = {
      ...dataPropsRef.current,
      timeSpanUser,
      handleRecordUpdate,
      handleTimeSpanUserUpdate
    }
    setDataProps(dataPropsRef.current);

  }

  const handleProfileIdUpdate = (profileId: number) => {

    profilePropsRef.current = {
      ...profilePropsRef.current,
      profileId,
      handleProfileIdUpdate
    }
    setProfileProps(profilePropsRef.current);
  }

  const emptyDataProps = (): IDataProps => {
    return {
      name: '',
      type: 'Unknown',
      records: [],
      timeSpanData: {
        instantMin: Date.now(),
        instantMax: Date.now(),
      },
      timeSpanUser: {
        instantMin: Date.now(),
        instantMax: Date.now(),
      },
      handleRecordUpdate,
      handleTimeSpanUserUpdate
    }
  }

  const dataPropsRef = useRef<IDataProps>(emptyDataProps());
  const [dataProps, setDataProps] = useState<IDataProps>(dataPropsRef.current);

  const emptyUiProps = (): IUiProps => {
    return {
      timeSpans: [],
      chartOptions: {
        title: 'CO₂ Measurements',
        showGradientFill: true,
        showGradientStroke: true,
        showLegend: true,
        strokeWidth: 3,
        fontSize: 20,
        showDates: true,
        minColorVal: 600,
        maxColorVal: 1400,
        stpColorVal: 4,
        handleChartOptionsUpdate
      },
      handleTimeSpanUpdate
    }
  }

  const uiPropsRef = useRef<IUiProps>(emptyUiProps());
  const [uiProps, setUiProps] = useState<IUiProps>(uiPropsRef.current);

  const profilePropsRef = useRef<IProfileProps>({
    profileId: 0,
    handleProfileIdUpdate
  });
  const [profileProps, setProfileProps] = useState<IProfileProps>(profilePropsRef.current);

  /**
   * no-arg useEffect - called when the component builds
   */
  useEffect(() => {

    console.debug('✨ building app component');

    const storageKey = StorageUtil.DATA_PROPS_ID;
    const loadedDataProps = StorageUtil.loadDataProps(storageKey);
    if (loadedDataProps) {
      dataPropsRef.current = loadedDataProps;
      dataPropsRef.current = {
        ...loadedDataProps,
        handleRecordUpdate,
        handleTimeSpanUserUpdate
      }
      setDataProps(dataPropsRef.current);

    } else {
      dataPropsRef.current = emptyDataProps();
      setDataProps(dataPropsRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveStorageKey = () => {
    return PROFILE_DEFS[profileProps.profileId].sProp;
  }

  /**
   * runs when the app loads or the profile is switched -> uiProps need to be rebuilt
   */
  useEffect(() => {

    console.debug(`⚙ updating app component (profileProps)`, profileProps);

    const storageKey = resolveStorageKey();
    const loadedUiProps = StorageUtil.loadUiProps(storageKey);
    if (loadedUiProps) {
      const timeSpans = loadedUiProps.timeSpans;
      timeSpans.sort((a, b) => a.instantMin - b.instantMin);
      timeSpans.forEach(timeSpan => {
        if (!timeSpan.pattType) {
          timeSpan.pattType = timeSpan.spanType === 'display' ? 'HL' : 'FW'
        }
      });

      if (!loadedUiProps.chartOptions.minColorVal) {
        loadedUiProps.chartOptions.minColorVal = 400;
      }
      if (!loadedUiProps.chartOptions.maxColorVal) {
        loadedUiProps.chartOptions.maxColorVal = 1400;
      }
      if (!loadedUiProps.chartOptions.stpColorVal) {
        loadedUiProps.chartOptions.stpColorVal = 10;
      }
      uiPropsRef.current = loadedUiProps;
      uiPropsRef.current = {
        ...loadedUiProps,
        timeSpans: timeSpans,
        chartOptions: {
          ...uiPropsRef.current.chartOptions,
          handleChartOptionsUpdate
        },
        handleTimeSpanUpdate
      }
      setUiProps(uiPropsRef.current);

    } else {
      uiPropsRef.current = emptyUiProps();
      setUiProps(uiPropsRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileProps]);

  useEffect(() => {
    console.debug(`⚙ updating app component (uiProps)`, uiProps);
    if (!ObjectUtil.isEqual(uiProps, emptyUiProps())) {
      StorageUtil.storeUiProps(resolveStorageKey(), uiProps);
    } else {
      // console.warn('clear ui props', uiProps);
      // StorageUtil.clearUiProps(resolveStorageKey());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiProps]);

  useEffect(() => {
    console.debug(`⚙ updating app component (dataProps)`, dataProps);
    StorageUtil.storeDataProps(StorageUtil.DATA_PROPS_ID, dataProps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProps]);

  return (
    <ThemeProvider theme={ThemeUtil.getTheme()} >
      <CssBaseline />
      <UiComponent {...{ ...uiProps, ...dataProps, ...profileProps }} />
    </ThemeProvider>
  );

}

export default App;