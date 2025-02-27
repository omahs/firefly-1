<script lang="ts">
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { isSoftwareProfile } from '@core/profile'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { Button } from '@ui'
    import { ButtonVariant, Error, HTMLButtonType, PasswordInput, Text, TextType } from 'shared/components'

    export let onSuccess: () => unknown

    let password: string
    let error: string
    let isBusy = false

    async function handleDeleteClick(): Promise<void> {
        error = null
        isBusy = true
        await deleteStrongholdAccount(password)
        isBusy = false
    }

    async function deleteStrongholdAccount(password: string): Promise<void> {
        try {
            if ($isSoftwareProfile) {
                await setStrongholdPassword(password)
            }
            await deleteAccount($selectedAccount?.index)
            onSuccess && onSuccess()
        } catch (err) {
            error = err.error
            handleError(err)
        }
    }
</script>

<form on:submit|preventDefault={handleDeleteClick} class="flex w-full flex-col space-y-4">
    {#if $isSoftwareProfile}
        <Text type={TextType.p} secondary>{localize('popups.deleteAccount.typePassword')}</Text>
        <PasswordInput
            classes="w-full mb-3"
            bind:value={password}
            showRevealToggle
            placeholder={localize('general.password')}
            autofocus
            submitHandler={handleDeleteClick}
            disabled={isBusy}
        />
    {/if}
    {#if error}
        <Error {error} />
    {/if}
    <Button
        variant={ButtonVariant.Warning}
        classes="w-full"
        type={HTMLButtonType.Submit}
        disabled={(!password && $isSoftwareProfile) || isBusy}
        {isBusy}
    >
        {localize('actions.deleteAccount')}
    </Button>
</form>
