<script lang="ts">
    import { Icon, Text } from 'shared/components'

    export let label = undefined
    export let checked = false
    export let classes = ''
    export let disabled = false
    export let round = false
    export let small = false
    export let keepSameColor = false
    export let onClick: (..._: any[]) => void = () => {}

    $: isSecondaryColor = !keepSameColor && (!checked || disabled)
</script>

<button
    data-label="checkbox-input"
    class="flex items-center text-left cursor-pointer {classes}"
    type="button"
    {disabled}
    on:click={() => {
        checked = !checked
        onClick && onClick()
    }}
>
    <Icon
        icon={checked ? `checkbox${round ? '-round' : ''}` : `checkbox-unchecked${round ? '-round' : ''}`}
        width={small ? '16px' : undefined}
        height={small ? '16px' : undefined}
        classes={`${label ? 'mr-3' : ''} ${checked ? 'active' : ''}`}
    />
    {#if label}
        <Text type="p" secondary={isSecondaryColor}>{label}</Text>
    {/if}
</button>

<style type="text/scss">
    button {
        @apply border-gray-500;
        :global(svg:not(.active) path) {
            fill: none;
            @apply text-gray-500;
            @apply stroke-current;
        }
        :global(svg.active path) {
            @apply text-blue-500;
            @apply fill-current;
        }
        &:hover,
        &:focus {
            :global(svg path) {
                @apply text-blue-500;
            }
        }

        &:disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
    }
</style>
