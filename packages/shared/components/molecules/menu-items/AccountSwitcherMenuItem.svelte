<script lang="ts">
    import { Text } from 'shared/components'
    import { AccountLabel } from 'shared/components/atoms'
    import { IAccountState, selectedAccount, setSelectedAccount } from '@core/account'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountBestMatch } from '@core/wallet'

    export let account: IAccountState
    export let onClick: () => unknown
    export let id: string = ''

    function handleAccountClick(accountIndex: number): void {
        setSelectedAccount(accountIndex)
        onClick && onClick()
    }
</script>

<button
    {id}
    on:click={() => handleAccountClick(account.index)}
    class="hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row justify-between p-4 rounded"
>
    <div class="flex flex-row items-center space-x-4">
        <AccountLabel selected={account.index === $selectedAccount?.index} {account} />
    </div>
    <Text classes={account.index === $selectedAccount?.index ? '' : 'opacity-50'} type="h5">
        {formatTokenAmountBestMatch(
            Number(account.balances.baseCoin.total),
            BASE_TOKEN[$activeProfile.networkProtocol]
        )}
    </Text>
</button>
