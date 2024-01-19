export class InterpolatedValue {

    private readonly outMin: number;
    private readonly outMax: number;
    private readonly valMin: number;
    private readonly valMax: number;
    private readonly gamma: number;

    constructor(outMin: number, outMax: number, valMin: number, valMax: number, gamma: number) {
        this.outMin = outMin;
        this.outMax = outMax;
        this.valMin = valMin;
        this.valMax = valMax;
        this.gamma = gamma;
    }

    getOutMin(): number {
        return this.outMin;
    }

    getOutMax(): number {
        return this.outMax;
    }

    getValMin(): number {
        return this.valMin;
    }

    getValMax(): number {
        return this.valMax;
    }

    getOut(val: number): number {
        if (val <= this.valMin) {
            return this.outMin;
        } else if (val >= this.valMax) {
            return this.outMax;
        } else {
            const fraction: number = Math.pow((val - this.valMin) / (this.valMax - this.valMin), this.gamma);
            //return Math.round((this.outMin + (this.outMax - this.outMin) * fraction) * 20) / 20;
            return Math.round((this.outMin + (this.outMax - this.outMin) * fraction) * 100) / 100;
        }
    }

}