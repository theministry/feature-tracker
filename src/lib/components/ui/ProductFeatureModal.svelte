<script lang="ts">
	import { marked } from 'marked';
	import Modal from './Modal.svelte';
	import Cell from '../crud/cells/Cell.svelte';
	import { InfoIcon, EditIcon, XCircleIcon, SaveIcon } from 'svelte-feather-icons';
	import ImplementationIcon from '$lib/components/ui/ImplementationIcon.svelte';

	import { getContext, createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { info, danger } from '$lib/util/alert';

	import { productFeatures, releases } from '$lib/stores';
	import type { Feature, Product, ProductFeature } from '@prisma/client';

	const dispatch = createEventDispatcher();
	let editable: Writable<boolean> = getContext('editable');
	let editMode: boolean = $editable;

	export let product: Product;
	export let feature: Feature;
	export let productFeature: ProductFeature = undefined;

	$: release = productFeature && $releases.find((r) => r.id === productFeature.release_id);

	let toggleEditMode = () => (editMode = !editMode);

	let save = async () => {
		const res = await fetch(`/api/product_features/${productFeature.id}.json`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(productFeature)
		});

		if (res.status === 200) {
			const patchedProductFeature: ProductFeature = await res.json();
			info('Patched Product Feature #' + patchedProductFeature.id);
			$productFeatures = [
				...$productFeatures.map((obj) =>
					obj.id == patchedProductFeature.id ? patchedProductFeature : obj
				)
			];
			return dispatch('close');
		} else {
			danger(`${res.status}: ${res.statusText}`);
		}
	};

	$: title = productFeature
		? productFeature.implementation_status == 'NOT_AVAILABLE'
			? 'N/A'
			: productFeature.id
		: 'N/A';
</script>

<Modal on:close>
	<svelte:fragment slot="title">
		<InfoIcon size="18" class="mr-2 my-auto" />
		<h3 class="font-bold my-auto">
			Details: Product Feature #{title}
		</h3>
	</svelte:fragment>
	<main class="flex flex-col gap-2">
		{#if editMode}
			<table class="table table-compact no-hover">
				<tr>
					<td>Product:</td>
					<Cell type="product_id" bind:value={productFeature.product_id} />
				</tr>
				<tr>
					<td>Feature:</td>
					<Cell type="feature_id" bind:value={productFeature.feature_id} />
				</tr>
				{#if productFeature}
					<tr>
						<td>Status:</td>
						<Cell type="implementation_status" bind:value={productFeature.implementation_status} />
					</tr>
					<tr>
						<td>Release:</td>
						<Cell type="release_id" bind:value={productFeature.release_id} />
					</tr>
					<tr>
						<td>Note:</td>
						<Cell type="note" bind:value={productFeature.note} />
					</tr>
				{/if}
			</table>
		{:else}
			<table class="inline-table table-compact no-hover">
				<tr>
					<td>Product:</td>
					<td>{product.name}</td>
				</tr>
				<tr>
					<td>Feature:</td>
					<td>{feature.name}</td>
				</tr>
				{#if productFeature}
					<tr>
						<td> Status: </td>
						<td>
							<div class="flex flex-row">
								<ImplementationIcon
									class="mr-2"
									status={productFeature.implementation_status}
									released={release.released}
								/>
								{productFeature.implementation_status}
							</div>
						</td>
					</tr>
					<tr>
						<td>Release:</td>
						<td
							>{release?.name || 'No release'} ({release?.released ? 'released' : 'unreleased'})</td
						>
					</tr>
					{#if release?.general_availability}
						<tr>
							<td>{release.released ? 'Released on:' : 'Expected release date:'}</td>
							<td>{new Date(release.general_availability).toLocaleDateString()}</td>
						</tr>
					{/if}
					{#if productFeature.note}
						<tr>
							<td>Note:</td>
							<td />
						</tr>
						<tr>
							<td colspan="2">
								<div
									class="prose whitespace-normal prose-h1:text-lg prose-h2:text-sm bg-base-100 p-2 rounded-md max-h-72 overflow-y-auto"
								>
									{@html marked.parse(productFeature.note)}
								</div>
							</td>
						</tr>
					{/if}
				{:else}
					<tr>
						<td> Status: </td>
						<td>
							<div class="flex flex-row justify-center">
								<ImplementationIcon
									class="mr-2"
									status={'NOT_AVAILABLE'}
									released={release.released}
								/>
								{'NOT_AVAILABLE'}
							</div>
						</td>
					</tr>
				{/if}
			</table>
		{/if}
		{#if $editable}
			<div class="flex flex-row justify-end mt-4">
				{#if editMode}
					<button class="btn btn-sm btn-circle btn-ghost" on:click={save}>
						<SaveIcon size="16" />
					</button>
					<button class="btn btn-sm btn-circle btn-ghost" on:click={toggleEditMode}>
						<XCircleIcon size="16" />
					</button>
				{:else}
					<button class="btn btn-sm btn-circle btn-ghost" on:click={toggleEditMode}>
						<EditIcon size="16" />
					</button>
				{/if}
			</div>
		{/if}
	</main>
</Modal>

<style>
	/* Unset the table hover style applied by DaisyUI */
	:global(table.no-hover td) {
		background-color: unset !important;
	}
</style>
