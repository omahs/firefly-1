<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        FoundryActivity,
        getActivityTileTitle,
        getAssetFromPersistedAssets,
        getFormattedAmountFromActivity,
        IPersistedAsset,
        selectedAccountAssets,
    } from '@core/wallet'
    import { AssetIcon, ActivityTileContent } from 'shared/components'

    export let activity: FoundryActivity

    let asset: IPersistedAsset
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(activity.assetId))
    $: action = localize(getActivityTileTitle(activity))
    $: amount = getFormattedAmountFromActivity(activity)
    $: formattedAsset = {
        text: amount,
        color: 'blue-700',
    }
</script>

<ActivityTileContent {action} subject={localize('general.internalTransaction')} {formattedAsset}>
    <AssetIcon slot="icon" {asset} showVerifiedBadgeOnly />
</ActivityTileContent>
