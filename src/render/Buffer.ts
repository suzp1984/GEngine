import { BufferUsage } from "../core/WebGPUConstant";
class Buffer {
	public gpuBuffer: GPUBuffer;
	device: GPUDevice;
	usage: number;
	data: ArrayBufferView;
	size: number;
	constructor(
		label: string,
		device: GPUDevice,
		usage: GPUBufferUsageFlags,
		data: ArrayBufferView | null,
		size?: number
	) {
		this.device = device;
		this.usage = usage;
		this.data = data;
		this.size = size != undefined ? (size + 3) & ~3 : (data.byteLength + 3) & ~3; // 4 bytes alignments (because of the upload which requires this)
		this.gpuBuffer = device.createBuffer({
			label: label || "",
			size: this.size,
			usage
		});
		if (data) this.setSubData(0, data, this.size);
	}
	static create(
		label: string,
		device: GPUDevice,
		usage: GPUBufferUsageFlags,
		data: ArrayBufferView | null,
		size?: number
	) {
		return new Buffer(label, device, usage, data, size);
	}
	static createVertexBuffer(label: string, device: GPUDevice, data: ArrayBufferView): Buffer {
		return new Buffer(label, device, BufferUsage.Vertex | BufferUsage.CopyDst, data, data.byteLength);
	}

	static createIndexBuffer(label: string, device: GPUDevice, data: ArrayBufferView): Buffer {
		return new Buffer(label, device, BufferUsage.Index | BufferUsage.CopyDst, data);
	}

	static createUniformBuffer(label: string, device: GPUDevice, size: number, usage?: BufferUsage): Buffer {
		return new Buffer(label, device, usage, null, size);
	}

	static createStorageBuffer(label: string, device: GPUDevice, size: number, usage = BufferUsage.Storage): Buffer {
		return new Buffer(label, device, usage, null, size);
	}
	// https://github.com/gpuweb/gpuweb/blob/main/design/BufferOperations.md
	public setSubData(offset: number, data: ArrayBufferView, size?: number): void {
		const srcArrayBuffer = data.buffer;
		const byteCount = size ?? srcArrayBuffer.byteLength;
		const srcBuffer = this.device.createBuffer({
			mappedAtCreation: true,
			size: byteCount,
			usage: GPUBufferUsage.COPY_SRC
		});
		const arrayBuffer = srcBuffer.getMappedRange();

		new Uint16Array(arrayBuffer).set(new Uint16Array(srcArrayBuffer)); // memcpy
		srcBuffer.unmap();

		this.copyToBuffer(srcBuffer, offset, byteCount);

		srcBuffer.destroy();
	}

	public copyToBuffer(srcBuffer: GPUBuffer, offset: number, byteCount: number): void {
		const commandEncoder = this.device.createCommandEncoder();
		commandEncoder.copyBufferToBuffer(srcBuffer, 0, this.gpuBuffer, offset, byteCount);
		this.device.queue.submit([commandEncoder.finish()]);
	}

	public copyToTexture(
		bytesPerRow: number,
		rowsPerImage: number,
		destination: GPUImageCopyTexture,
		extent: GPUExtent3D
	): void {
		const commandEncoder = this.device.createCommandEncoder();
		commandEncoder.copyBufferToTexture(
			{
				buffer: this.gpuBuffer,
				bytesPerRow,
				rowsPerImage
			},
			destination,
			extent
		);
		this.device.queue.submit([commandEncoder.finish()]);
	}

	public destroy(): void {
		this.gpuBuffer.destroy();
	}
}

export default Buffer;
