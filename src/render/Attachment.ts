import { AttachmentOptions } from "../core/WebGPUTypes";
import Texture from "./Texture";

class Attachment {
	public op: GPULoadOp = "clear";
	public storeOp: GPUStoreOp = "store";

	public texture?: Texture;
	public resolveTarget?: Texture;
	public textureView?: () => GPUTextureView;
	public readOnly?: boolean;

	constructor(public value: GPUColorDict | GPUColor | number, options?: AttachmentOptions) {
		Object.assign(this, options);
	}
}

export default Attachment;
