<script lang="ts">
    import { IAsset } from '@core/wallet'
    import { tokenRoute, TokenRoute, tokenRouter } from '../../../../lib/routers'
    import { TokenInformation } from './views'
    import { TokenAction } from '../../../../lib/contexts/dashboard'

    export let asset: IAsset

    function onVerify(): void {
        $tokenRouter.next({ action: TokenAction.Verify })
    }
    function onSkip(): void {
        $tokenRouter.next({ action: TokenAction.Skip })
    }
    function onSend(): void {
        $tokenRouter.next({ action: TokenAction.Send })
    }
</script>

{#if $tokenRoute === TokenRoute.Info}
    <TokenInformation {asset} {onVerify} {onSkip} {onSend} />
{/if}
