<script lang="ts">
    import { appRoute, AppRoute } from '@core/router'

    export let route: AppRoute
</script>

{#if $appRoute === route}
    <slot />
{/if}
