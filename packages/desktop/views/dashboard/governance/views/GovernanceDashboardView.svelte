<script lang="ts">
    import {
        Pane,
        Proposals,
        ProposalsDetails,
        VotingPower,
        Spinner,
        Illustration,
        Text,
        FontWeight,
        Button,
    } from '@ui'
    import { openPopup } from '@auxiliary/popup'
    import { selectedAccountIndex } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { registeredEventIds } from '@contexts/governance/stores'
    import { createProposals } from '@contexts/governance/utils'

    let promise = createProposals()
    $: $selectedAccountIndex, $registeredEventIds, (promise = createProposals())

    function handleAddProposal(): void {
        openPopup({
            type: 'addProposal',
        })
    }
</script>

<div class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-6 bg-gray-50 dark:bg-gray-900">
    <div class="w-1/3 flex flex-col space-y-4">
        <Pane classes="p-6 h-fit">
            <VotingPower />
        </Pane>
        <Pane classes="p-6 h-fit">
            <ProposalsDetails />
        </Pane>
    </div>
    <span class="block w-0.5 h-full bg-gray-200 dark:bg-gray-800" />
    <div class="w-2/3">
        {#await promise}
            <Spinner busy classes="w-full h-full items-center justify-center opacity-25 h-20" width={80} height={80} />
        {:then proposals}
            {#if proposals.length}
                <Proposals {proposals} />
            {:else}
                <div class="w-full h-full flex flex-col items-center justify-center">
                    <Illustration illustration="empty-collectibles" width="134" height="134" />
                    <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500" classes="mt-8"
                        >{localize('views.governance.proposals.emptyTitle')}</Text
                    >
                    <Button onClick={handleAddProposal} classes="mt-8">{localize('actions.addProposal')}</Button>
                </div>
            {/if}
        {/await}
    </div>
</div>
