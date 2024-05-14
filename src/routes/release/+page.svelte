<script lang="ts">
	import FilterableHeader from '$lib/components/unified/cells/FilterableHeader.svelte';
	import Header from '$lib/components/unified/cells/Header.svelte';
	import Product from '$lib/components/unified/cells/Product.svelte';
	import Table from '$lib/components/unified/table/Table.svelte';

	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { setContext } from 'svelte';

	import {
		products,
		productFilter,
		filteredProducts,
		productFeatures,
		releases
	} from '$lib/stores';
	import RoadMapCell from '$lib/components/unified/cells/RoadMapCell.svelte';

	let editable: Writable<boolean> = writable(false);
	setContext('editable', editable);

	$: sortedReleases = $releases.sort(
		(a, b) => new Date(a.general_availability).getTime() - new Date(b.general_availability).getTime()
	);
</script>

<div class="grow overflow-auto flex flex-col">
	<Table>
		<svelte:fragment slot="head">
			<!-- Product Header -->
			<FilterableHeader
				bind:filter={$productFilter}
				sortable={{ Products: products }}
				class="rounded-tl-lg"
			>
				Products
			</FilterableHeader>
			<!-- Release Headers -->
			{#each sortedReleases as release}
				<Header centered>
					<div
						class="tooltip tooltip-bottom"
						data-tip="{release.released ? 'Released' : 'Will be released'} on: {new Date(
							release.general_availability
						).toLocaleDateString()}"
					>
						{release.name}
					</div>
				</Header>
			{/each}
		</svelte:fragment>
		<svelte:fragment>
			{#each $filteredProducts as product}
				<tr>
					<!-- Product Titles -->
					<Product {product} />
					<!-- Features -->
					{#each sortedReleases as release}
						<td class="text-center">
							<div class="flex flex-row justify-center">
								{#each $productFeatures.filter((pf) => pf.product_id === product.id && pf.release_id === release.id) as productFeature}
									<RoadMapCell {productFeature} {release} />
								{/each}
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</svelte:fragment>
	</Table>
</div>
