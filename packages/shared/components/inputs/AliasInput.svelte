<script lang="ts">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network/stores'
    import { validateBech32Address } from '@core/utils/crypto'
    import { ADDRESS_TYPE_ALIAS } from '@core/wallet/constants'
    import { convertHexAddressToBech32 } from '@core/wallet/utils'

    export let alias: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    const aliasOptions: IOption[] =
        $selectedAccount.balances?.aliases.map((hexAliasId, index) => {
            const aliasId = convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, hexAliasId)
            return { key: 'Alias ' + (index + 1), value: aliasId }
        }) ?? []

    let selected: IOption = aliasOptions.find((option) => option.value === alias)
    $: alias = selected?.value

    export async function validate(): Promise<void> {
        try {
            if (!alias) {
                throw new Error(localize('error.aliasMinting.aliasRequired'))
            }

            if (!aliasOptions.some((option) => option.value === alias)) {
                throw new Error(localize('error.aliasMinting.aliasNotInPossession'))
            }

            validateBech32Address($networkHrp, alias, ADDRESS_TYPE_ALIAS)
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
    }
</script>

<SelectorInput
    labelLocale="popups.nativeToken.property.alias"
    bind:selected
    bind:inputElement
    bind:modal
    options={aliasOptions}
    {error}
/>
