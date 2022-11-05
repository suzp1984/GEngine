import { AmbientLight } from "../light/AmbientLight";
import { DirtectLight } from "../light/DirtectLight";
import { PointLight } from "../light/PointLight";
import { SpotLight } from "../light/SpotLight";
import Manger from "./Manger";
import { DirtectData, PointData, SpotData } from "../light/DataHelper";

export default class LightManger extends Manger{

    pointLights:PointLight[];

    spotLights:SpotLight[];

    dirtectLights:DirtectLight[];

    ambientLight:AmbientLight;

    ambientDirty:boolean;

    lightCountDirty:boolean;
    //ambient+lightCount
    commonLightBuffer:Float32Array;
    //pointLight
    pointLightsBuffer:Float32Array;

    spotLightsBuffer:Float32Array;

    dirtectLightsBuffer:Float32Array;
 
    ambient: Float32Array;

    lightCount: Uint32Array;

    pointDatas:WeakMap<PointLight,PointData>;

    spotDatas:WeakMap<SpotLight,SpotData>;

    dirtectDatas:WeakMap<DirtectLight,DirtectData>;

    totalByte:number;

    commonTatalByte:number;

    spotLightsByte:number;

    pointLightsByte:number;

    dirtectLightsByte:number;


    constructor(){
        super();
        this.spotLights=[];
        this.pointLights=[];
        this.dirtectLights=[];
        this.spotDatas=new WeakMap();
        this.pointDatas=new WeakMap();
        this.dirtectDatas=new WeakMap();
        this.ambientLight=undefined;
        this.totalByte=0;

    }
    update(){
        this.updateLight()
    }
    add(light){
        this.lightCountDirty=true;
        if (light.type=='ambient') {
            this.ambientLight=light;
        }else if(light.type=='dirtect'){
            this.dirtectLights.push(light);
        } else if(light.type=='point'){
            this.pointLights.push(light);
        }else if(light.type=='spot'){
            this.spotLights.push(light);
        }
    }
    remove(){}
    private updateLight(){
        if(this.lightCountDirty){
            this.initBuffer();
        }
        this.updateLightData();
  
    }
    private updateLightData(){
        this.updateSpotLight();
        this.updatePointLight();
        this.updateDirtectLight(); 
        this.updateAmbientLight();
        this.updateLightCount();  
    }
    private updateSpotLight(){
        this.spotLights.forEach((light)=>{
           const lightData=this.spotDatas.get(light);
           if(lightData)lightData.update();
        })
    }
    private updatePointLight(){
        this.pointLights.forEach((light)=>{
            const lightData=this.pointDatas.get(light);
            if(lightData)lightData.update();
         })
    }
    private updateAmbientLight(){
        if(this.ambientLight){
            this.ambient[0]=this.ambientLight.color.x;
            this.ambient[1]=this.ambientLight.color.y;
            this.ambient[2]=this.ambientLight.color.z;
        }      
    }
    private updateDirtectLight(){
        this.dirtectLights.forEach((light)=>{
            const lightData=this.dirtectDatas.get(light);
            if(lightData)lightData.update();
         })     
    }
    private updateLightCount(){
        if (this.lightCountDirty) {
            this.lightCount[0]=this.spotLights.length;
            this.lightCount[1]=this.pointLights.length;
            this.lightCount[2]=this.dirtectLights.length;
            this.lightCount[3]=this.ambient!=undefined?1:0; 
        }
    }
    private initBuffer(){
       // const ambientSize=this.ambientLight!=undefined?3:0;
       const ambientSize=3;
        const lightCount=4;
        const pointLightCount=this.pointLights.length||1;
        const spotLightCount=this.spotLights.length||1;
        const dirtectLightCount=this.dirtectLights.length||1;
        const pointLightCountSize=pointLightCount*PointData.size;
        const spotLightCountSize=spotLightCount*SpotData.size;
        const dirtectLightCountSize=dirtectLightCount*DirtectData.size;
        
        this.commonLightBuffer=new Float32Array(ambientSize+lightCount);
        this.spotLightsBuffer=new Float32Array(spotLightCountSize);
        this.pointLightsBuffer=new Float32Array(pointLightCountSize);
        this.dirtectLightsBuffer=new Float32Array(dirtectLightCountSize);

        //common
        this.commonTatalByte=0;     
        this.ambient=new Float32Array(this.commonLightBuffer.buffer,this.commonTatalByte,3);
        this.commonTatalByte+=12;  
        this.lightCount=new Uint32Array(this.commonLightBuffer.buffer,this.commonTatalByte,4);
        this.commonTatalByte+=16;
        //初始化聚光灯
        this.spotLights.forEach((spotLight,i)=>{
            this.spotDatas.set(spotLight,new SpotData(this.spotLightsBuffer,SpotData.byteSize*i,spotLight))
        });
        this.spotLightsByte=spotLightCount*SpotData.byteSize;
        //点光源
        this.pointLights.forEach((pointLight,i)=>{
           this.pointDatas.set(pointLight,new PointData(this.pointLightsBuffer,PointData.byteSize*i,pointLight))
        });      
        this.pointLightsByte=pointLightCount*PointData.byteSize;
        //方向光
        this.dirtectLights.forEach((dirtect,i)=>{
            this.dirtectDatas.set(dirtect,new DirtectData(this.dirtectLightsBuffer,DirtectData.byteSize*i,dirtect))
        });
        this.dirtectLightsByte=dirtectLightCount*DirtectData.byteSize;
        
    }
    
}