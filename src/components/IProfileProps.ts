// export const PROFILE_KEYS: { [K: string]: string } = {
//     'A': 'UI_PROPS_4',
//     'B': 'UI_PROPS_5',
//     'C': 'UI_PROPS_6'
// };

export interface IProfileDef {
    sProp: string;
    icon0: JSX.Element;
    icon1: JSX.Element;
}

export interface IProfileProps {
    profileId: number;
    handleProfileIdUpdate: (profileId: number) => void;
}