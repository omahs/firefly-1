<script lang="ts">
    import { selectedAccountIndex } from '@core/account'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { NftMedia, MediaPlaceholder } from 'shared/components'

    export let nftId: string
    export let size: 'small' | 'medium' | 'large' = 'medium'
    export let type = undefined

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId)
    $: nftType = nft?.parsedMetadata?.type
    $: parentType = nftType?.split('/')?.[0]

    let isLoaded = false
</script>

<div
    class="
        flex overflow-hidden flex-shrink-0 rounded-md items-center justify-center
        {isLoaded ? '' : 'bg-gray-500'}
        {size === 'small' && 'w-6 h-6'}
        {size === 'medium' && 'w-8 h-8'}
        {size === 'large' && 'w-10 h-10'}
    "
>
    {#if parentType === 'image'}
        <NftMedia {nftId} bind:isLoaded classes="min-w-full min-h-full object-cover">
            <div
                slot="placeholder"
                class="
                    w-full h-full 
                    {size === 'small' && 'p-1'}
                    {size === 'medium' && 'p-2'}
                    {size === 'large' && 'p-2'}
                "
            >
                <MediaPlaceholder type={type || nftType} iconOnly />
            </div>
        </NftMedia>
    {:else}
        <div
            class="
                w-full h-full 
                {size === 'small' && 'p-1'}
                {size === 'medium' && 'p-2'}
                {size === 'large' && 'p-2'}
            "
        >
            <MediaPlaceholder type={type || nftType} iconOnly />
        </div>
    {/if}
</div>
