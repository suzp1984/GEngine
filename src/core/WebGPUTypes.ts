import Uniform from "./core/Uniform";
import BindGroupLayout from "./core/BindGroupLayout.js";
import { BindGroupEntity } from "../render/BindGroupEntity.js";

export interface ContextState {
  device: GPUDevice;
  glslang: {
    compileGLSL: (source: string, type: string) => string;
  };
  debug: boolean;
  error: boolean;
}

export interface ContextOptions {
  canvas?: HTMLCanvasElement;
  context?: GPUCanvasContext;
  pixelRatio?: number;
}

export interface BindGroupLayoutEntry extends GPUBindGroupLayoutEntry {
  name: string;
  uniforms?: Uniform[];
  members?: (Variable | Struct)[];
  dimension?: GPUTextureDimension;
  qualifiers?: GLSLTypeQualifiers;
  samplerType?: GLSLSamplerType | GLSLShadowSamplerType;
}

export interface BindGroupOptions extends GPUBindGroupDescriptor {
  resources: GPUBindingResource[];
}

export type ShaderStageName = "vertex" | "fragment" | "compute";

export type ShaderStageNameObjectKeys = {
  [key in ShaderStageName]?: string;
};
export type ShaderStageBodyName = "vertexBody" | "fragmentBody" | "computeBody";
export type ShaderStageBodyNameObjectKeys = {
  [key in ShaderStageBodyName]?: string;
};

export type PipelineVertexBufferIns = {
  stepMode: GPUVertexStepMode;
  attributes: Attribute[];
};
export interface AttachmentOptions {
  op?: GPUStoreOp;
  view?: GPUTextureView;
  resolveTarget?: GPUTextureView;
}

export type PassType = "render" | "compute";

export type GPUBindingType =
  | GPUBufferBindingType
  | GPUSamplerBindingType
  | GPUTextureSampleType
  | GPUStorageTextureAccess;

export type BindGroupLayoutEntryType={
    binding:number;
    visibility:GPUShaderStageFlags;
    uniforms?:any[]
    buffer?:GPUBufferBindingLayout;
    sampler?:GPUSamplerBindingLayout ;
    texture?:GPUTextureBindingLayout ;
    storageTexture?: GPUStorageTextureBindingLayout ;
    externalTexture?:GPUExternalTextureBindingLayout ;
}
export type BufferResourceType={
  buffer:GPUBufferBindingType,
  offset:number,
  size:number
}
export type samplerBindEntityResourceType={
  resource:GPUSampler
}
export type textureBindEntityResourceType={
  resource:GPUTextureView
}
export type BindGroupEntityResourceType=BufferResourceType|samplerBindEntityResourceType|textureBindEntityResourceType
export type BindGroupEntityOptions={
  binding:number,
  resource:GPUBindingResource
}
export type BindGroupCacheOptions={
    device:GPUDevice,
    label:string,
    layout:GPUBindGroupLayout,
    entires:GPUBindGroupEntry[],
    index?:number
}

export default null;
