<script lang="ts">
    import { sumBalanceForAccounts } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile, visibleActiveAccounts } from '@core/profile'
    import { formatTokenAmountBestMatch } from '@core/wallet'

    import features from '@features/features'
    import { AccountSwitcherMenuItem } from '../../../../../../mobile/components'
    import { HR, Icon, Text, TextType } from '@ui'

    export let onSwitch: () => unknown = () => {}
    export let onAddClick: () => unknown = () => {}

    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)
</script>

<div class="flex-auto flex flex-col overflow-x-hidden w-full">
    <account-list class="accounts flex flex-col scrollable-y">
        {#each $visibleActiveAccounts as account}
            <AccountSwitcherMenuItem id="account-{account.index}" {account} onClick={onSwitch} />
        {/each}
    </account-list>
    <HR />
    <div class="flex flex-row-reverse h-16">
        <Text classes="opacity-50 m-auto w-full text-right" type={TextType.h5}>
            {localize('general.total', {
                values: {
                    balance: formatTokenAmountBestMatch(totalBalance, BASE_TOKEN[$activeProfile.networkProtocol]),
                },
            })}
        </Text>
        {#if features?.dashboard?.createAccount?.enabled}
            <button class="h-full" on:click={onAddClick}>
                <div class="flex flex-row items-center space-x-4">
                    <Icon icon="plus" height="12" width="12" classes="text-blue-500" />
                    <Text highlighted type={TextType.h5} classes="whitespace-nowrap"
                        >{localize('general.addAWallet')}</Text
                    >
                </div>
            </button>
        {/if}
    </div>
</div>
