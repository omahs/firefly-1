<script lang="ts">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FoundryActivity, getAssetFromPersistedAssets, ITokenMetadata } from '@core/wallet'
    import { IKeyValueBoxList } from '@core/utils'

    export let activity: FoundryActivity

    let metadata: ITokenMetadata
    $: metadata = getAssetFromPersistedAssets(activity.assetId)?.metadata

    let detailsList: IKeyValueBoxList
    $: detailsList = {
        ...(metadata?.name && {
            tokenName: { data: metadata.name },
        }),
        ...(metadata?.unit && {
            unit: { data: metadata.unit },
        }),
        decimals: { data: String(metadata.decimals) },
        ...(metadata?.description && {
            description: { data: metadata.description },
        }),
        ...(metadata?.tickerSymbol && {
            tickerSymbol: { data: metadata.tickerSymbol },
        }),
        ...(metadata?.url && {
            url: { data: metadata.url, isCopyable: true },
        }),
        ...(metadata?.logo && {
            logo: { data: metadata.logo, isCopyable: true },
        }),
        ...(metadata?.logoUrl && {
            logoUrl: { data: metadata.logoUrl, isCopyable: true },
        }),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox
        keyText={localize(`popups.nativeToken.property.${key}`)}
        valueText={value.data}
        isCopyable={value.isCopyable}
    />
{/each}
