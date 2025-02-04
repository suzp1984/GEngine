import {
	ShaderDefine,
	ShaderString,
	computeParams,
	renderParams,
	ShaderModule,
	ShaderSourceParams,
	ShaderFunc,
	ShaderLanguage,
	ShaderMainStage
} from "../core/WebGPUTypes";
import getVertFrag from "./Shaders";
import { WGSLParseDefines } from "./WGSLParseDefines";
export class ShaderSource {
	public compute: computeParams;
	public static glslang;
	public render: renderParams;
	public shaderId: string;
	public dirty: boolean;
	public defines?: ShaderDefine;
	private _uid: string;
	private _shaderModule: ShaderModule;
	private _shaderLanguage: ShaderLanguage;
	constructor(options: ShaderSourceParams) {
		this.shaderId = options.shaderId;
		this.defines = options.defines || {};
		this.render = options.render;
		this.compute = options.compute;
		this._shaderLanguage = options.language;
		this.dirty = true;
	}
	get uid() {
		this._uid = this.shaderId.concat(JSON.stringify(this.defines));
		return this._uid;
	}
	public setDefines(defines) {
		if (!defines) return;
		this.dirty = true;
		this.defines = Object.assign(this.defines, defines);
	}
	public getShaderModule(device: GPUDevice): ShaderModule {
		if (this.dirty) {
			const { vert, frag, compute } = this.getShaderStr() || {};
			const isGLSL = this._shaderLanguage == ShaderLanguage.GLSL;
			const vertGPUModule = vert
				? device.createShaderModule({
						code: isGLSL ? ShaderSource?.glslang.compileGLSL(vert, ShaderMainStage.VERT) : vert
				  })
				: undefined;
			const fragGPUModule = frag
				? device.createShaderModule({
						code: isGLSL ? ShaderSource?.glslang.compileGLSL(frag, ShaderMainStage.FRAG) : frag
				  })
				: undefined;
			const computeGPUModule = compute
				? device.createShaderModule({
						code: isGLSL ? ShaderSource?.glslang.compileGLSL(compute, ShaderMainStage.COMPUTE) : compute
				  })
				: undefined;
			this._shaderModule = {
				vert: vertGPUModule,
				frag: fragGPUModule,
				compute: computeGPUModule
			};
			this.dirty = false;
		}
		return this._shaderModule;
	}
	public destroy() {
		this.render = null;
		this.compute = null;
		this._shaderModule = null;
		this.defines = null;
	}
	private getShaderStr(): ShaderString {
		const { fragShader, vertShader } = this.render || {};
		const { computeShader } = this.compute || {};
		const source = getVertFrag(this.shaderId, this.defines);
		const vert =
			source?.vert ??
			WGSLParseDefines(vertShader instanceof Function ? (<ShaderFunc>vertShader)() : vertShader, this.defines);
		const frag =
			source?.frag ??
			WGSLParseDefines(fragShader instanceof Function ? (<ShaderFunc>fragShader)() : fragShader, this.defines);
		const compute = WGSLParseDefines(
			computeShader instanceof Function ? (computeShader as ShaderFunc)() : computeShader,
			this.defines
		);
		return {
			vert,
			frag,
			compute
		};
	}
	static replaceMain(source: string, renamedMain: string) {
		renamedMain = `void ${renamedMain}()`;
		return source.replace(/void\s+main\s*\(\s*(?:void)?\s*\)/g, renamedMain);
	}
}
