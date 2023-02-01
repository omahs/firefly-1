<script lang="ts">
    import { Drawer, Text, FontWeight, Button, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile'
    import { ActivityFilter, AssetFilter } from '@core/wallet/interfaces'
    import { IProposalFilter } from '@contexts/governance/interfaces'

    type Filter = ActivityFilter | AssetFilter | IProposalFilter

    export let drawer: Drawer = undefined
    export let filter: Filter
    export let isChanged: boolean
    export let onSetFilters: () => void
    export let onClose: () => void

    function clear(): void {
        for (const key in filter) {
            filter[key].active = false
            filter[key].value = undefined
        }
        onSetFilters()
    }

    function confirm(): void {
        onSetFilters()
        drawer?.close()
    }

    $: $activeProfileId, clear()
</script>

<Drawer
    bind:this={drawer}
    on:close={onClose}
>
    <div>
        <div class="flex flex-row items-center justify-between bg-gray-50 dark:bg-transparent px-4 py-2 rounded-t-xl">
            <Button outline size={ButtonSize.Small} onClick={clear}>{localize('actions.clear')}</Button>
            <Text fontWeight={FontWeight.semibold} fontSize="14" classes="text-center flex grow-1"
                >{localize('filters.title')}</Text
            >
            <Button disabled={!isChanged} size={ButtonSize.Small} onClick={confirm}>{localize('actions.apply')}</Button>
        </div>
        <div>
            <slot />
        </div>
    </div>
</Drawer>
