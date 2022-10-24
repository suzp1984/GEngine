import { Light } from "./Light";

export class SpotLight extends Light{
    distance: number;
    _angle: number;
    _penumbra: number;
    decay: number;
    coneCos: number;
    penumbraCos: number;
    constructor(color, intensity, distance = 0, angle = Math.PI / 3, penumbra = 0, decay = 1){
        super(color, intensity);
        this.distance=distance;
        this._angle=angle;
        this._penumbra=penumbra;
        this.decay=decay;
        this.updateConeCosOrPenumbraCos()
    }
    get angle(){
        return this._angle;
    }
    set angle(value){
       this._angle=value;
       this.updateConeCosOrPenumbraCos()
    }
    get penumbra(){
        return this._penumbra;
    }
    set penumbra(value){
        this._penumbra=value;
        this.updateConeCosOrPenumbraCos()
    }
    private updateConeCosOrPenumbraCos(){
        this.coneCos= Math.cos( this.angle );
        this.penumbraCos= Math.cos( this.angle * ( 1 - this.penumbra ) );
    } 
}
//uniform
// color: {},
// position: {},
// direction: {},
// distance: {},
// coneCos: {},
// penumbraCos: {},
// decay: {}