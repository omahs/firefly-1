<script lang="ts">
    import { CollectiblesDetailsView, CollectiblesGalleryView } from './views'
    import { selectedAccountIndex } from '@core/account/stores'
    import { collectiblesRoute, CollectiblesRoute, collectiblesRouter } from '@core/router'

    $: $selectedAccountIndex !== undefined && $collectiblesRouter.reset()
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $collectiblesRoute === CollectiblesRoute.Gallery}
        <CollectiblesGalleryView />
    {/if}
    {#if $collectiblesRoute === CollectiblesRoute.Details}
        <CollectiblesDetailsView />
    {/if}
</div>
