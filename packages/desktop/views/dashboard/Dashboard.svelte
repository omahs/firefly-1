<script lang="ts">
    import { handleDeepLink } from '@auxiliary/deep-link'
    import { localize } from '@core/i18n'
    import { nodeInfo } from '@core/network'
    import {
        activeProfile,
        hasStrongholdLocked,
        isActiveLedgerProfile,
        logout,
        reflectLockedStronghold,
        saveActiveProfile,
    } from '@core/profile'
    import { appRouter, dashboardRoute } from '@core/router'
    import { Idle } from 'shared/components'
    import { stopPollingLedgerNanoStatus } from '@core/ledger'
    import { removeDisplayNotification, showAppNotification } from '@auxiliary/notification'
    import { Platform } from '@core/app'
    import { Developer } from './developer'
    import { Settings } from './settings'
    import { Wallet } from './wallet'
    import { onDestroy, onMount } from 'svelte'
    import Collectibles from './collectibles/Collectibles.svelte'
    import { Governance } from './governance'
    import Sidebar from './Sidebar.svelte'
    import TopNavigation from './TopNavigation.svelte'

    $: $activeProfile, saveActiveProfile()

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        collectibles: Collectibles,
        governance: Governance,
        developer: Developer,
    }

    let fundsSoonNotificationId
    let developerProfileNotificationId

    onMount(() => {
        Platform.onEvent('menu-logout', () => {
            void logout()
        })

        Platform.onEvent('deep-link-params', (data: string) => {
            handleDeepLinkRequest(data)
        })

        Platform.DeepLinkManager.checkDeepLinkRequestExists()

        if ($activeProfile?.isDeveloperProfile && !developerProfileNotificationId) {
            // Show developer profile warning
            developerProfileNotificationId = showAppNotification({
                type: 'warning',
                message: localize('indicators.developerProfileIndicator.warningText', {
                    values: { networkName: $nodeInfo?.protocol?.networkName },
                }),
            })
        }
    })

    onDestroy(() => {
        Platform.DeepLinkManager.clearDeepLinkRequest()
        Platform.removeListenersForEvent('deep-link-params')

        if (fundsSoonNotificationId) {
            removeDisplayNotification(fundsSoonNotificationId)
        }
        if (developerProfileNotificationId) {
            removeDisplayNotification(developerProfileNotificationId)
        }
        if ($isActiveLedgerProfile) {
            stopPollingLedgerNanoStatus()
        }
    })

    // TODO: handle deep link requests for new send form
    const handleDeepLinkRequest = (data: string): void => {
        if ($activeProfile?.hasLoadedAccounts) {
            handleDeepLink(data)
        }
    }

    $: $hasStrongholdLocked && reflectLockedStronghold()
</script>

<Idle />
<div class="dashboard-wrapper flex flex-col w-full h-full">
    <TopNavigation />
    <div class="flex flex-row flex-auto h-1">
        <Sidebar />
        <!-- Dashboard Pane -->
        <div class="flex flex-col h-full dashboard-w">
            <svelte:component this={tabs[$dashboardRoute]} on:next={$appRouter.next} />
        </div>
    </div>
</div>

<style type="text/scss">
    :global(:not(body.platform-win32)) .dashboard-wrapper {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }

    .dashboard-w {
        --sidebar-width: 4.5rem;
        width: calc(100vw - var(--sidebar-width));
    }
</style>
