import Attachment from "../render/Attachment";
import Context from "../render/Context";
import Pass from "./Pass";
import RenderTarget from "../render/RenderTarget";
import Camera from "../camera/Camera";
import { BaseShadow } from "../light/shadows/BaseShadow";
import { FrameState } from "../core/FrameState";
import ShaderMaterial from "../material/ShaderMaterial";
import getVertFrag from "../shader/Shaders";
import Texture from "../render/Texture";
import { CommandSubType } from "../core/WebGPUConstant";
import RenderQueue from "../core/RenderQueue";
import { PointLight } from "../light/PointLight";
import { Light } from "../light/Light";
export class ShadowPass extends Pass {
	public shadowMaterial: ShaderMaterial;
	_testTexture: Texture;
	constructor(context: Context) {
		super(context);
		this.init(context);
	}
	render(frameState: FrameState, camera?: Camera) {
		const { renderQueue, context } = frameState;
		const lights = context.lightManger.getAllLights();
		if (lights.length === 0) return;

		for (let i = 0; i < lights.length; i++) {
			const light: PointLight | Light = lights[i];
			const shadow = light.shadow;
			if (!shadow) continue;
			// this._testTexture = context.lightManger._testTexture
			this.beforeRender({ shadow });
			if (shadow.type == "pointLightShadow" && light instanceof PointLight) {
				for (let i = 0; i < shadow.viewports.length; i++) {
					// this.beforeRender({ shadow });
					const viewport = shadow.viewports[i];
					const viewportSize = shadow.viewportSize;
					shadow.currentViewportIndex = i;
					shadow.update(light);
					// light.forceUpdate = true;
					context.setViewPort(
						viewport.x * viewportSize.x,
						viewport.y * viewportSize.y,
						viewportSize.x,
						viewportSize.y
					);
					context.setScissorTest(
						viewport.x * viewportSize.x,
						viewport.y * viewportSize.y,
						viewportSize.x,
						viewportSize.y
					);
					this.subRender(renderQueue, shadow);
					// super.afterRender();
				}
			} else {
				this.beforeRender({ shadow });
				context.setViewPort(0, 0, shadow.shadowMapSize.x, shadow.shadowMapSize.y);
				context.setScissorTest(0, 0, shadow.shadowMapSize.x, shadow.shadowMapSize.y);
				this.subRender(renderQueue, shadow);
				// super.afterRender();
			}
		}
		super.afterRender();
		context.lightManger.updateLightShadow();
		context.resetViewPortToFullCanvas();
	}

	subRender(renderQueue: RenderQueue, shadow: BaseShadow) {
		renderQueue.sort();
		// renderQueue.preRender(shadow.camera, this.context, this.passRenderEncoder);
		renderQueue.transparentRender(
			shadow.camera,
			this.context,
			this.passRenderEncoder,
			this.shadowMaterial,
			CommandSubType.Shadow
		);
		renderQueue.opaqueRender(
			shadow.camera,
			this.context,
			this.passRenderEncoder,
			this.shadowMaterial,
			CommandSubType.Shadow
		);
	}

	// getDepthTexture(): Texture {
	// 	return this._testTexture;
	// }
	beforeRender(options: { shadow: BaseShadow }) {
		const { shadow } = options;
		this.setRenderTarget(shadow);
		super.beforeRender();
	}

	private setRenderTarget(shadow: BaseShadow) {
		this.renderTarget.depthAttachment.texture = shadow.getShadowMapTexture();
	}

	private init(context: Context) {
		this.createRenderTarget(context);
		this.createShadowMaterial();
	}
	private createRenderTarget(context: Context) {
		const depthAttachment = new Attachment(1.0, { texture: undefined });
		this.renderTarget = new RenderTarget("render", [], depthAttachment);
	}

	private createShadowMaterial() {
		const shadowMapShaderFunction = (defines = {}) => {
			const finalDefines = Object.assign(
				{
					selfBinding: 0,
					cameraBinding: 0,
					positionLocation: 0
				},
				defines
			);
			return getVertFrag("shadowMap", finalDefines).vert;
		};

		this.shadowMaterial = new ShaderMaterial({
			type: "shadowMaterial",
			uniforms: {
				modelMatrix: { type: "mat4", value: null }
			},
			vert: shadowMapShaderFunction,
			frag: undefined,
			light: true //TODO:先true，false有显示bug
		});
	}
}
