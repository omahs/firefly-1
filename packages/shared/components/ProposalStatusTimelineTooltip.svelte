<script lang="ts">
    import { formatDate, localize } from '@core/i18n'
    import { networkStatus } from '@core/network'
    import { DATE_FORMAT, milestoneToDate } from '@core/utils'
    import { Position, Text, TextType, Tooltip } from 'shared/components'
    import { ProposalStatus } from '@contexts/governance/enums'

    export let milestones: Record<ProposalStatus, number>
    export let status: ProposalStatus
    export let anchor: HTMLElement
    export let position: Position = Position.Right

    let eventProgress: number
    switch (status) {
        case ProposalStatus.Upcoming:
            eventProgress = 0
            break
        case ProposalStatus.Commencing:
            eventProgress = 1
            break
        case ProposalStatus.Holding:
            eventProgress = 2
            break
        case ProposalStatus.Ended:
            eventProgress = 3
            break
        default:
            break
    }
</script>

<Tooltip {anchor} {position}>
    <ul class="space-y-3 text-left">
        {#each Object.keys(ProposalStatus) as status, index}
            <li class="grid grid-rows-2 relative" class:active={eventProgress >= index}>
                <Text
                    overrideColor={eventProgress < index}
                    classes={eventProgress < index ? 'text-gray-400 dark:text-gray-700' : ''}
                >
                    {formatDate(
                        milestoneToDate($networkStatus.currentMilestone, milestones[ProposalStatus[status]]),
                        DATE_FORMAT
                    )}
                </Text>
                <Text
                    type={TextType.h5}
                    overrideColor={eventProgress < index}
                    classes={eventProgress < index ? 'text-gray-400 dark:text-gray-700' : ''}
                >
                    {localize(`views.governance.statusTimeline.${ProposalStatus[status]}`)}
                </Text>
            </li>
        {/each}
    </ul>
</Tooltip>

<style lang="scss">
    li {
        grid-template-columns: min-content 1fr;
        &::before {
            @apply justify-self-start;
            @apply mr-4;
            @apply row-span-2;
            @apply self-center;
            @apply text-2xl;
            @apply text-gray-400;
            content: '●';
        }
        &.active::before {
            @apply text-blue-400;
        }
        &:not(:first-child)::after {
            @apply absolute;
            @apply block;
            @apply border;
            @apply border-gray-300;
            @apply border-solid;
            @apply bottom-4;
            content: '';
            height: 130%;
            left: 0.38em;
            z-index: -1;
        }
    }
</style>
