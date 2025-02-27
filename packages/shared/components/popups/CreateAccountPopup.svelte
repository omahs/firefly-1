<script lang="ts">
    import { Button, ColorPicker, Input, Text } from 'shared/components'
    import { getTrimmedLength } from '@core/utils'
    import { localize } from '@core/i18n'
    import { closePopup, updatePopupProps } from '@auxiliary/popup'
    import { checkActiveProfileAuth } from '@core/profile'
    import { getRandomAccountColor, tryCreateAdditionalAccount, validateAccountName } from '@core/account'
    import { onMount } from 'svelte'
    import { handleError } from '@core/error/handlers/handleError'

    export let accountAlias = ''
    export let color = getRandomAccountColor()
    export let error: string
    export let isBusy = false

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: accountAlias, (error = null)
    $: trimmedAccountAlias = accountAlias.trim()

    async function handleCreateClick(): Promise<void> {
        try {
            if (!trimmedAccountAlias) {
                return
            }
            isBusy = true
            error = null
            await validateAccountName(trimmedAccountAlias)
            updatePopupProps({ accountAlias, color, error, isBusy })
            await checkActiveProfileAuth(_create, { stronghold: true, ledger: true })
            isBusy = false
        } catch (err) {
            error = err.error
            handleError(err)
            isBusy = false
        }
    }

    function handleCancelClick(): void {
        isBusy = false
        closePopup()
    }

    async function _create(): Promise<void> {
        if (trimmedAccountAlias && color) {
            try {
                await tryCreateAdditionalAccount(trimmedAccountAlias, color.toString())
                closePopup()
            } catch (err) {
                isBusy = false
            }
        }
    }

    onMount(async () => {
        isBusy = true
        try {
            await _onMount()
        } catch (err) {
            error = err.error
            handleError(err)
        }
        isBusy = false
    })
</script>

<div class="flex flex-col h-full justify-between">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{localize('general.addAWallet')}</Text>
        </div>
        <div class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
                submitHandler={handleCreateClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} classes="mb-4" />
        </div>
    </div>
    <div class="flex flex-row justify-between px-2">
        <Button outline classes="-mx-2 w-1/2" onClick={handleCancelClick} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!getTrimmedLength(accountAlias) || isBusy}
            classes="-mx-2 w-1/2"
            onClick={handleCreateClick}
            {isBusy}
            busyMessage={localize('general.creating')}
        >
            {localize('actions.create')}
        </Button>
    </div>
</div>
