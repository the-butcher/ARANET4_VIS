import { ColorUtil } from "./ColorUtil";

/**
 * implementation of hsv color
 */
export class Color {

    static readonly INDEX_H: number = 0;
    static readonly INDEX_S: number = 1;
    static readonly INDEX_V: number = 2;

    static readonly INDEX_R: number = 0;
    static readonly INDEX_G: number = 1;
    static readonly INDEX_B: number = 2;

    readonly hsv: number[];
    readonly rgb: number[];
    private hex: string | undefined;

    constructor(h: number, s: number, v: number) {
        this.hsv = [h, s, v];
        this.rgb = [0, 0, 0];
        ColorUtil.hsvToRgb(this.hsv, this.rgb);
    }

    getHsv(): number[] {
        return this.hsv;
    }

    brighter(): Color {
        return new Color(this.hsv[0], this.hsv[1], Math.min(1, this.hsv[2] * 1.25));
    }

    darker(steps: number): Color {
        const color: Color = new Color(this.hsv[0], this.hsv[1], Math.min(1, this.hsv[2] / Math.pow(1.25, steps)));
        return color;
    }

    getHex(): string {
        if (!this.hex) {
            this.hex = this.getHexRgb(this.rgb);
        }
        return this.hex!;
    }

    getRgb(): number[] {
        return this.rgb;
    }

    /**
     * get an html compatible hex string from an rgb number array
     * i.e. '#FFCC00'
     * @param rgb
     * @returns
     */
    getHexRgb(rgb: number[]): string {
        return "#" + this.getHexChannel(rgb[Color.INDEX_R]) + this.getHexChannel(rgb[Color.INDEX_G]) + this.getHexChannel(rgb[Color.INDEX_B]);
    }

    /**
     * get a hex string from a normalized (0-1) channel value
     * i.e. 'FF'
     * @param channel
     */
    getHexChannel(channel: number): string {
        const hex = Number(Math.floor(channel * 255)).toString(16);
        if (hex.length < 2) {
            return "0" + hex;
        } else {
            return hex.substring(0, 2);
        }
    };

}