<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import Modal from './Modal.svelte';
	import { translateStore } from '$lib/strings';

	export let isOpen = false;
	export let url = '';

	let canvasEl: HTMLCanvasElement;
	let qrError = '';

	async function generateQR() {
		if (!canvasEl || !url) return;
		try {
			await QRCode.toCanvas(canvasEl, url, {
				width: 256,
				margin: 2
			});
			qrError = '';
		} catch (err) {
			console.error('QR code generation failed:', err);
			qrError = 'Failed to generate QR code.';
		}
	}

	async function saveQR() {
		if (!canvasEl) return;
		const blob = await new Promise<Blob | null>((resolve) =>
			canvasEl.toBlob(resolve, 'image/png')
		);
		if (!blob) return;
		const file = new File([blob], 'qr-code.png', { type: 'image/png' });
		if (navigator.canShare?.({ files: [file] })) {
			// Mobile: native share sheet → "Save Image" / "Save to Photos"
			await navigator.share({ files: [file], title: 'QR Code' });
		} else {
			// Desktop: trigger a file download
			const objectUrl = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = objectUrl;
			a.download = 'qr-code.png';
			a.click();
			URL.revokeObjectURL(objectUrl);
		}
	}

	$: if (isOpen && canvasEl && url) {
		generateQR();
	}

	onMount(() => {
		if (isOpen && url) generateQR();
	});
</script>

<Modal
	{isOpen}
	title={$translateStore('qr_code')}
	size="small"
	on:close
>
	<div class="qr-content">
		{#if qrError}
			<p class="qr-error">{qrError}</p>
		{/if}
		<canvas bind:this={canvasEl}></canvas>
		<p class="qr-url">{url}</p>
		<button type="button" class="save-btn" on:click={saveQR}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 3h14v2H5v-2z"/>
			</svg>
			{$translateStore('qr_save')}
		</button>
	</div>
</Modal>

<style>
	.qr-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 0;
	}

	canvas {
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
	}

	.qr-url {
		font-size: 0.75rem;
		color: #6b7280;
		word-break: break-all;
		text-align: center;
		max-width: 256px;
	}

	.qr-error {
		color: #ef4444;
		font-size: 0.875rem;
	}

	.save-btn {
		width: 100%;
		max-width: 256px;
		padding: 0.625rem 1rem;
		border: none;
		border-radius: 0.5rem;
		background-color: #3b82f6;
		color: #fff;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		transition: background-color 0.15s ease;
	}

	.save-btn svg {
		width: 1.1rem;
		height: 1.1rem;
		flex-shrink: 0;
	}

	.save-btn:hover {
		background-color: #2563eb;
	}
</style>
