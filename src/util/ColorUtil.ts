import { Color } from "./Color";

/**
 * utility type for parsing / providing / converting colors between rgb and hsv
 *
 * @author h.fleischer
 * @since 10.10.2019
 */
export class ColorUtil {

    //initial tile color
    static readonly tileHsv: number[] = [0.27, 1, 0.75];

    /**
     * parses a hex string in the format '#RRGGBB'
     * @param hex
     */
    static parseHex(hex: string): Color {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        console.log('result', result);
        var rgb: number[] = [];
        if (result && result!.length > 3) {
            rgb[0] = parseInt(result![result!.length - 3], 16) / 255;
            rgb[1] = parseInt(result![result!.length - 2], 16) / 255;
            rgb[2] = parseInt(result![result!.length - 1], 16) / 255;
        } else {
            rgb[0] = 1;
            rgb[1] = 0;
            rgb[2] = 0;
        }
        var hsv: number[] = [0, 0, 0];
        ColorUtil.rgbToHsv(rgb, hsv);
        let color: Color = new Color(hsv[0], hsv[1], hsv[2]);
        //console.log('color', color);
        return color;
    }

    /**
     * convert a normalized (0-1) hsv (hue-saturation-value) color to a normalized (0-1) rgb (red-green-blue) color<br>
     * rather then returning a value this method stores the result in the given rgb parameter, this is to enable caller to re-use the same object and reduce allocation pressure during conversion<br>
     *
     * @param hsv the hsv "in" params
     * @param rgb the rgb "out" params
     */
    static hsvToRgb(hsv: number[], rgb: number[]): void {

        if (hsv[Color.INDEX_S] === 0) {

            rgb[Color.INDEX_R] = rgb[Color.INDEX_G] = rgb[Color.INDEX_B] = hsv[Color.INDEX_V];

        } else {

            let a: number = (hsv[Color.INDEX_H] - Math.floor(hsv[Color.INDEX_H])) * 6.0;
            let f: number = a - Math.floor(a);
            let p: number = hsv[Color.INDEX_V] * (1.0 - hsv[Color.INDEX_S]);
            let q: number = hsv[Color.INDEX_V] * (1.0 - hsv[Color.INDEX_S] * f);
            let t: number = hsv[Color.INDEX_V] * (1.0 - hsv[Color.INDEX_S] * (1.0 - f));

            switch (Math.floor(a)) {
                case 0:
                    rgb[Color.INDEX_R] = hsv[Color.INDEX_V];
                    rgb[Color.INDEX_G] = t;
                    rgb[Color.INDEX_B] = p;
                    break;
                case 1:
                    rgb[Color.INDEX_R] = q;
                    rgb[Color.INDEX_G] = hsv[Color.INDEX_V];
                    rgb[Color.INDEX_B] = p;
                    break;
                case 2:
                    rgb[Color.INDEX_R] = p;
                    rgb[Color.INDEX_G] = hsv[Color.INDEX_V];
                    rgb[Color.INDEX_B] = t;
                    break;
                case 3:
                    rgb[Color.INDEX_R] = p;
                    rgb[Color.INDEX_G] = q;
                    rgb[Color.INDEX_B] = hsv[Color.INDEX_V];
                    break;
                case 4:
                    rgb[Color.INDEX_R] = t;
                    rgb[Color.INDEX_G] = p;
                    rgb[Color.INDEX_B] = hsv[Color.INDEX_V];
                    break;
                case 5:
                    rgb[Color.INDEX_R] = hsv[Color.INDEX_V];
                    rgb[Color.INDEX_G] = p;
                    rgb[Color.INDEX_B] = q;
                    break;
            }

        }

    }

    static rgbToHsv(rgb: number[], hsv: number[]): void {

        let r_replace: number = rgb[Color.INDEX_R];
        let g_replace: number = rgb[Color.INDEX_G];
        let b_replace: number = rgb[Color.INDEX_B];

        let h: number;
        let s: number;
        let v: number;

        let cmax: number = r_replace > g_replace ? r_replace : g_replace;
        if (b_replace > cmax) {
            cmax = b_replace;
        }

        let cmin: number = r_replace < g_replace ? r_replace : g_replace;
        if (b_replace < cmin) {
            cmin = b_replace;
        }

        v = cmax;
        if (cmax !== 0) {
            s = (cmax - cmin) / cmax;
        } else {
            s = 0;
        }

        if (s === 0) {
            h = 0;
        } else {

            let rc: number = (cmax - r_replace) / (cmax - cmin);
            let gc: number = (cmax - g_replace) / (cmax - cmin);
            let bc: number = (cmax - b_replace) / (cmax - cmin);

            if (r_replace === cmax) {
                h = bc - gc;
            } else if (g_replace === cmax) {
                h = 2.0 + rc - bc;
            } else {
                h = 4.0 + gc - rc;
            }

            h = h / 6.0;
            if (h < 0) {
                h = h + 1.0;
            }

        }

        hsv[0] = h;
        hsv[1] = s;
        hsv[2] = v;

    }

}