<script lang="ts">
    import {
        InclusionState,
        selectedAccountAssets,
        getAssetFromPersistedAssets,
        IPersistedAsset,
        Activity,
        ActivityType,
        NotVerifiedStatus,
        ActivityAsyncStatus,
    } from '@core/wallet'
    import { openPopup } from '@auxiliary/popup'
    import {
        ClickableTile,
        TransactionActivityTileContent,
        FoundryActivityTileContent,
        ConsolidationActivityTileContent,
        AliasActivityTileContent,
        TimelockActivityTileFooter,
        AsyncActivityTileFooter,
        NftActivityTileContent,
        GovernanceActivityTileContent,
    } from 'shared/components'

    export let activity: Activity

    let asset: IPersistedAsset
    $: $selectedAccountAssets,
        (asset =
            activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
                ? getAssetFromPersistedAssets(activity.assetId)
                : undefined)

    function handleTransactionClick(): void {
        if (asset?.verification?.status === NotVerifiedStatus.New) {
            openPopup({
                type: 'tokenInformation',
                overflow: true,
                props: {
                    activityId: activity.id,
                    asset,
                },
            })
        } else {
            openPopup({
                type: 'activityDetails',
                props: { activityId: activity.id },
            })
        }
    }
</script>

<ClickableTile
    onClick={handleTransactionClick}
    classes={activity.inclusionState === InclusionState.Pending ? 'opacity-80 animate-pulse' : ''}
>
    <activity-tile class="w-full flex flex-col space-y-4">
        <tile-content class="flex flex-row items-center text-left space-x-4">
            {#if activity.type === ActivityType.Basic}
                <TransactionActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Alias}
                <AliasActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Nft}
                <NftActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Governance}
                <GovernanceActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Consolidation}
                <ConsolidationActivityTileContent {activity} />
            {:else}
                <FoundryActivityTileContent {activity} />
            {/if}
        </tile-content>
        {#if activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked}
            <TimelockActivityTileFooter {activity} />
        {:else if activity.asyncData}
            <AsyncActivityTileFooter {activity} />
        {/if}
    </activity-tile>
</ClickableTile>
