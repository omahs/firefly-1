<script lang="ts">
    import { EnterPinView, SelectProfileView, LoadProfileView } from './views'
    import { loginRoute, LoginRoute } from '../../lib/routers'
</script>

{#if $loginRoute === LoginRoute.SelectProfile}
    <SelectProfileView />
{:else if $loginRoute === LoginRoute.EnterPin}
    <EnterPinView />
{:else if $loginRoute === LoginRoute.LoadProfile}
    <LoadProfileView />
{/if}
