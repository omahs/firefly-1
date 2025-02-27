<script lang="ts">
    import { selectedAccountIndex } from '@core/account'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts, rewriteIpfsUri } from '@core/nfts'
    import { MediaDisplay } from 'shared/components'
    import MediaPlaceholder from './MediaPlaceholder.svelte'

    export let nftId: string
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let classes: string = ''
    export let error: string = ''
    export let warning: string = ''
    export let translationSuffix: string = 'long'
    export let isLoaded = false

    const bgColor = 'gray-200'
    const darkBgColor = 'gray-700'

    let hasError = false

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId)
    $: url = composeUrl(nft?.parsedMetadata?.uri)

    $: nftId, resetProps()

    function resetProps(): void {
        isLoaded = false
        hasError = false
    }

    function composeUrl(targetUrl: string): string {
        if (!targetUrl) {
            return undefined
        }

        const url = new URL(targetUrl)
        let newUrl

        switch (url.protocol) {
            case 'http:':
                newUrl = targetUrl.replace('http:', 'https:')
                break
            case 'https:':
                newUrl = targetUrl
                break
            case 'ipfs:':
                newUrl = rewriteIpfsUri(targetUrl)
                break
            default:
                error = localize('error.nft.unsupportedUrl.' + translationSuffix)
                return undefined
        }

        if (nft?.parsedMetadata?.issuerName === 'Soonaverse') {
            return newUrl + '/' + nft?.parsedMetadata?.name
        } else {
            return newUrl
        }
    }

    function handleLoadingError(err): void {
        hasError = true
        error = localize(err + translationSuffix)
    }

    function handleWarning(warn): void {
        hasError = true
        warning = localize(warn + translationSuffix)
    }

    function handleOnLoad(): void {
        isLoaded = true
    }
</script>

{#if !url || hasError}
    <slot name="placeholder">
        <MediaPlaceholder type={nft?.parsedMetadata?.type} {bgColor} {darkBgColor} />
    </slot>
{:else}
    <MediaDisplay
        src={url}
        expectedType={nft.parsedMetadata.type}
        alt={`Media display for ${nft.name}`}
        classes="hidden {classes}"
        onLoad={handleOnLoad}
        onError={handleLoadingError}
        onWarning={handleWarning}
    />

    {#if !isLoaded}
        <slot name="placeholder">
            <MediaPlaceholder type={nft?.parsedMetadata?.type} {bgColor} {darkBgColor} classes="animate-pulse" />
        </slot>
    {:else}
        <MediaDisplay
            src={url}
            expectedType={nft.parsedMetadata.type}
            alt={`Media display for ${nft.name}`}
            {autoplay}
            {controls}
            {loop}
            {muted}
            {classes}
            onError={handleLoadingError}
            onWarning={handleWarning}
        />
    {/if}
{/if}
