<script lang="ts">
    import { Text, ProposalCard, Filter, SearchInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeight } from './enums'
    import { IProposal } from '@contexts/governance/interfaces'
    import { proposalFilter, sortProposals } from '@contexts/governance'
    import { isVisibleProposal } from '@contexts/governance/utils/isVisibleProposal'

    export let proposals: IProposal[] = []

    let searchTerm = ''

    $: visibleProposals = proposals
        .filter((proposal) => isVisibleProposal(proposal, $proposalFilter))
        .filter((proposal) => {
            if (!searchTerm) {
                return true
            } else if (
                proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proposal.id.includes(searchTerm.toLowerCase())
            ) {
                return true
            }
            return false
        })
        .sort((a, b) => (a.id < b.id ? -1 : 1))
    $: sortedProposals = sortProposals(visibleProposals, $proposalFilter)
</script>

<proposals-container class="flex flex-col h-full">
    <header-container class="flex justify-between items-center mb-4 h-9">
        <Text fontSize="14" fontWeight={FontWeight.semibold}>
            {localize('views.governance.proposals.title')}
        </Text>
        <div class="flex flex-row space-x-2 items-center">
            <SearchInput bind:value={searchTerm} />
            <Filter filterStore={proposalFilter} />
        </div>
    </header-container>
    <ul class="grid grid-cols-2 auto-rows-min gap-6 flex-1 overflow-y-scroll">
        {#each sortedProposals as proposal}
            <ProposalCard {proposal} />
        {/each}
    </ul>
</proposals-container>
