import DataBuffer from '../core/DataBuffer';
import Matrix2 from '../math/Matrix2';
import Matrix3 from '../math/Matrix3';
import Matrix4 from '../math/Matrix4';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
import Vector4 from '../math/Vector4';
export class Uniform<T> {
    _value: T;
    name: string;
    value: T;
    offset: number;
    dataBuffer: DataBuffer;
    size: number;

    constructor(uniformName:string, dataBuffer:DataBuffer, offset:number,cb:Function) {
        this.name = uniformName;
        this.offset=offset;
        this.dataBuffer=dataBuffer;
    }
    set(){}
}

export class UniformVec extends Uniform<number>{
    _value:number;
    name: string;
    value: number;
    offset: number;
    dataBuffer: DataBuffer;
    size: number;

    constructor(uniformName:string, dataBuffer:DataBuffer, offset:number,cb:Function) {
        super(uniformName,dataBuffer,offset,cb);
        this.value = undefined;
        this._value = undefined;
        this.size=4;
    }
    set () {
        if (this.value !== this._value) {
          this._value = this.value;
          this.dataBuffer.setData(this);
        }
      };
}
export class UniformFloatVec2 extends Uniform<Vector2>{
    constructor(uniformName:string, dataBuffer:DataBuffer, offset:number,cb:Function) {
        super(uniformName,dataBuffer,offset,cb);
        this.value = undefined;
        this._value = undefined;
        this.size=8;
    }
    set () {
        const v = this.value;
        if (!Vector2.equals(v, this._value)) {
            Vector2.clone(v, this._value);
          this.dataBuffer.setData(this);
        }
      };
}
export class UniformFloatVec3 extends Uniform<Vector3>{
    constructor(uniformName:string, dataBuffer:DataBuffer, offset:number,cb:Function) {
        super(uniformName,dataBuffer,offset,cb);
        this.value = undefined;
        this._value = undefined;
        this.size=12;
    }
    set () {
        const v = this.value;
        if (!Vector3.equals(v, this._value)) {
            Vector3.clone(v, this._value);
          this.dataBuffer.setData(this);
        }
      };
}
export class UniformFloatVec4 extends Uniform<Vector4>{
    constructor(uniformName:string, dataBuffer:DataBuffer, offset:number,cb:Function) {
        super(uniformName,dataBuffer,offset,cb);
        this.value = undefined;
        this._value = undefined;
        this.size=16;
    }
    set () {
        const v = this.value;
        if (!Vector4.equals(v, this._value)) {
            Vector4.clone(v, this._value);
          this.dataBuffer.setData(this);
        }
      };
}

export class UniformMat2 extends Uniform<Matrix2>{
    constructor(uniformName:string, dataBuffer:DataBuffer, offset:number,cb:Function) {
        super(uniformName,dataBuffer,offset,cb);
        this.value = undefined;
        this._value = undefined;
        this.size=12;
    }
    set () {
        const v = this.value;
        if (!Matrix2.equals(v, this._value)) {
            Matrix2.clone(v, this._value);
          this.dataBuffer.setData(this);
        }
      };
}
export class UniformMat3 extends Uniform<Matrix3>{
    constructor(uniformName:string, dataBuffer:DataBuffer, offset:number,cb:Function) {
        super(uniformName,dataBuffer,offset,cb);
        this.value = undefined;
        this._value = undefined;
        this.size=36;
    }
    set () {
        const v = this.value;
        if (!Matrix3.equals(v, this._value)) {
            Matrix3.clone(v, this._value);
          this.dataBuffer.setData(this);
        }
      };
}
export class UniformMat4 extends Uniform<Matrix4>{
    constructor(uniformName:string, dataBuffer:DataBuffer, offset:number,cb:Function) {
        super(uniformName,dataBuffer,offset,cb);
        this.value = undefined;
        this._value = undefined;
        this.size=36;
    }
    set () {
        const v = this.value;
        if (!Matrix4.equals(v, this._value)) {
            Matrix4.clone(v, this._value);
          this.dataBuffer.setData(this);
        }
      };
}