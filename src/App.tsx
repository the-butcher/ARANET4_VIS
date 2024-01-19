import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IChartOptions, ITimeSpan, ITimeSpanNamed, IUiProps } from "./components/IUiProps";
import UiComponent from "./components/UiComponent";
import { StorageUtil } from "./util/StorageUtil";
import { ThemeUtil } from "./util/ThemeUtil";
import { TimeUtil } from "./util/TimeUtil";
import { IProfileDef, IProfileProps } from "./components/IProfileProps";

import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone';
import Filter1Icon from '@mui/icons-material/Filter1';

import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone';
import Filter2Icon from '@mui/icons-material/Filter2';

import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone';
import Filter3Icon from '@mui/icons-material/Filter3';

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
        ...update
      },
      handleRecordUpdate,
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
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
      handleRecordUpdate,
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
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
  const handleRecordUpdate = (updates: Pick<IUiProps, 'name' | 'type' | 'records'>) => {

    console.debug('📞 handling record update', updates);

    const instantMinData = updates.records[0].instant;
    const instantMaxData = updates.records[updates.records.length - 1].instant;

    let instantMaxUser = TimeUtil.toInstantMaxUser(updates.records[updates.records.length - 1].instant);
    let instantMinUser = Math.max(TimeUtil.toInstantMinUser(updates.records[updates.records.length - 1].instant) - TimeUtil.MILLISECONDS_PER____DAY * 6, TimeUtil.toInstantMinUser(updates.records[0].instant));

    uiPropsRef.current = {
      ...uiPropsRef.current,
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
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
    }
    setUiProps(uiPropsRef.current);

  }

  const handleTimeSpanUserUpdate = (timeSpanUser: ITimeSpan) => {

    console.debug('📞 handling time span user update', timeSpanUser);

    uiPropsRef.current = {
      ...uiPropsRef.current,
      timeSpanUser,
      handleRecordUpdate,
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
    }
    setUiProps(uiPropsRef.current);

  }

  const handleProfileIdUpdate = (profileId: number) => {

    profilePropsRef.current = {
      ...profilePropsRef.current,
      profileId,
      handleProfileIdUpdate
    }
    setProfileProps(profilePropsRef.current);
  }

  const emptyUiProps = (): IUiProps => {
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
        stpColorVal: 4
      },
      handleRecordUpdate,
      handleTimeSpanUserUpdate,
      handleTimeSpanUpdate,
      handleChartOptionsUpdate
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



    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveStorageKey = () => {
    return PROFILE_DEFS[profileProps.profileId].sProp;
  }

  useEffect(() => {

    console.debug(`⚙ updating app component (profileProps)`, profileProps);

    const storageKey = resolveStorageKey();
    const loadedProps = StorageUtil.loadProps(storageKey);
    if (loadedProps) {

      const timeSpans = loadedProps.timeSpans;
      timeSpans.sort((a, b) => a.instantMin - b.instantMin);
      timeSpans.forEach(timeSpan => {
        if (!timeSpan.pattType) {
          timeSpan.pattType = timeSpan.spanType === 'display' ? 'HL' : 'FW'
        }
      });
      if (!loadedProps.chartOptions.minColorVal) {
        loadedProps.chartOptions.minColorVal = 400;
      }
      if (!loadedProps.chartOptions.maxColorVal) {
        loadedProps.chartOptions.maxColorVal = 1400;
      }
      if (!loadedProps.chartOptions.stpColorVal) {
        loadedProps.chartOptions.stpColorVal = 10;
      }
      uiPropsRef.current = loadedProps;
      uiPropsRef.current = {
        ...loadedProps,
        timeSpans: timeSpans,
        handleRecordUpdate,
        handleTimeSpanUserUpdate,
        handleTimeSpanUpdate,
        handleChartOptionsUpdate
      }
      setUiProps(uiPropsRef.current);

    } else {
      uiPropsRef.current = emptyUiProps();
      setUiProps(uiPropsRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileProps]);

  useEffect(() => {

    console.debug(`⚙ updating app component (props)`, uiProps);
    if (uiProps.records.length > 0) {
      const storageKey = resolveStorageKey();
      StorageUtil.storeUiProps(storageKey, uiProps);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiProps]);

  return (
    <ThemeProvider theme={ThemeUtil.getTheme()} >
      <CssBaseline />
      <UiComponent {...{ ...uiProps, ...profileProps }} />
    </ThemeProvider>
  );

}

export default App;