<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import AddButton from '$lib/components/ui/AddButton.svelte';
	import DeleteButton from '$lib/components/ui/DeleteButton.svelte';
	import InfoButton from '$lib/components/ui/InfoButton.svelte';
	import HoverNote from '$lib/components/ui/HoverNote.svelte';

	import { productFeatures, products, releases, showUnreleasedProductFeatures } from '$lib/stores';

	import { info, danger } from '$lib/util/alert';

	import ProductFeatureModal from '$lib/components/ui/ProductFeatureModal.svelte';
	import ImplementationIcon from '$lib/components/ui/ImplementationIcon.svelte';
	import ProductFeatureInput from '$lib/components/ui/ProductFeatureInput.svelte';

	import type { Feature, Product, ProductFeature } from '$lib/prisma';
	import { MinusIcon, InfoIcon } from 'svelte-feather-icons';

	import Data from './Data.svelte';

	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	let editable: Writable<boolean> = getContext('editable');

	export let product: Product = undefined;
	export let feature: Feature = undefined;
	export let productFeature: ProductFeature = undefined;

	$: release = productFeature && $releases.find((r) => r.id === productFeature.release_id);

	const addProductFeature = async (e: CustomEvent) => {
		const res = await fetch('/api/product_features.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				product_id: product.id,
				feature_id: feature.id,
				implementation_status: e.detail.status,
				release_id: e.detail.release
			})
		});

		if (res.ok) {
			const json = await res.json();
			info(`Added product feature #${json.id}: ${json.product_id} ${json.feature_id}`);
			$productFeatures = [...$productFeatures, json];
			$products = [...$products]; // forces rerendering of the table
			endAdding();
		} else {
			const { code, message } = await res.json();
			danger(`${code}: ${message}`);
		}
	};

	const deleteProductFeature = async () => {
		const res = await fetch(`/api/product_features/${productFeature.id}.json`, {
			method: 'DELETE'
		});

		if (res.ok) {
			$productFeatures = [...$productFeatures.filter((pf) => pf.id !== productFeature.id)];
			$products = [...$products]; // forces rerendering of the table
			info(
				`Deleted product feature #${productFeature.id}: ${productFeature.product_id} ${productFeature.feature_id}`
			);
		} else {
			const { code, message } = await res.json();
			danger(`${code}: ${message}`);
		}
	};

	const updateProductFeature = async (e: CustomEvent) => {
		const res = await fetch(`/api/product_features/${productFeature.id}.json`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				implementation_status: e.detail.status,
				release_id: e.detail.release
			})
		});

		if (res.ok) {
			editMode = false;
			productFeature.implementation_status = e.detail.status;
			productFeature.release_id = e.detail.release;
			const json = await res.json();
			info(`Updated product feature #${json.id}: ${json.product_id} ${json.feature_id}`);
		} else {
			const { code, message } = await res.json();
			danger(`${code}: ${message}`);
		}
	};

	let adding: boolean = false;
	const startAdding = () => (adding = true);
	const endAdding = () => (adding = false);

	let editMode: boolean = false;
	const toggleEditMode = () => (editMode = !editMode);

	const handleClick = () => ($editable ? toggleEditMode() : showInfo());

	let modal: boolean = false;
	const showInfo = () => (modal = true);
	const hideInfo = () => (modal = false);
</script>

{#if adding}
	<th>
		<div class="w-72">
			<ProductFeatureInput on:submit={addProductFeature} on:cancel={endAdding} />
		</div>
	</th>
{:else if editMode}
	<th use:clickOutside on:clickoutside={toggleEditMode}>
		<div class="w-72">
			<ProductFeatureInput
				on:submit={updateProductFeature}
				on:cancel={toggleEditMode}
				release={productFeature.release_id}
				status={productFeature.implementation_status}
			/>
		</div>
	</th>
{:else if productFeature && ($showUnreleasedProductFeatures || release?.released)}
	<Data menu={$editable} centered>
		<div
			class="flex flex-row gap-2 items-center justify-center {$editable
				? 'cursor-cell'
				: 'cursor-pointer'}"
			on:click={handleClick}
		>
			<ImplementationIcon
				status={productFeature.implementation_status}
				released={release?.released}
			/>
		</div>
		<div class="flex flex-row justify-center gap-1" slot="menu">
			<InfoButton on:click={showInfo} />
			<DeleteButton on:click={deleteProductFeature} />
		</div>
		<svelte:fragment slot="note">
			<HoverNote note={productFeature.note}>
				<svelte:fragment slot="pre">
					<span class="font-bold">
						{release?.name || 'No Release'}
					</span>
					{#if release}
						{#if release.general_availability}
							{release.released ? 'was' : 'will be'}
							released on {new Date(release.general_availability).toLocaleDateString()}
						{:else}
							is {release.released ? 'released' : 'not yet released'}
						{/if}
					{/if}
				</svelte:fragment>
			</HoverNote>
		</svelte:fragment>
		<svelte:fragment slot="post">
			{#if productFeature.note}
				<InfoIcon size="16" class="text-base opacity-25 group-hover:opacity-100" />
			{/if}
		</svelte:fragment>
	</Data>
{:else if product && feature && !release}
	<Data centered>
		{#if $editable}
			<AddButton on:click={startAdding} tip="add product feature" />
		{:else}
			<div
				class="flex flex-row gap-2 items-center justify-center cursor-pointer"
				on:click={showInfo}
			>
				<ImplementationIcon status={'NOT_AVAILABLE'} released={false} />
			</div>
		{/if}
	</Data>
{:else}
	<Data centered>
		<MinusIcon size="16" class="mx-auto text-base-300" />
	</Data>
{/if}

{#if modal}
	<ProductFeatureModal {product} {feature} {productFeature} on:close={hideInfo} />
{/if}
