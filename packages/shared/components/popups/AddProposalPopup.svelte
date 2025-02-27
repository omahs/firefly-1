<script lang="ts">
    import type { Auth } from '@iota/wallet'
    import { Button, NodeInput, TextInput, Text, TextType } from 'shared/components'
    import { HTMLButtonType } from 'shared/components/enums'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { registerParticipationEvent } from '@contexts/governance/actions'
    import { showAppNotification } from '@auxiliary/notification/actions'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'
    import { truncateString } from '@core/utils/string'

    export let eventId: string
    export let nodeUrl: string

    let eventIdError: string
    let nodeInput: NodeInput
    let nodeInputError: string

    let isBusy = false

    $: disabled = !eventId || !nodeUrl || isBusy

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            await Promise.all([validateEventId(), nodeInput?.validate()])
            await registerParticipationWrapper()
            isBusy = false
        } catch (err) {
            isBusy = false
            const isAuthenticationError = err?.error?.match(/(username)|(password)|(jwt)/g)?.length > 0
            const isEventError = err?.error?.match(/(the requested data)|(was not found)/)?.length > 0
            const isNodeError = err?.error?.match(/(failed to lookup address information)|(dns error)/)?.length > 0
            if (isAuthenticationError) {
                openNodeAuthRequiredPopup()
            } else if (isEventError) {
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('error.governance.unableToAddProposal.long', {
                        values: { proposalId: truncateString(eventId) },
                    }),
                })
            } else if (isNodeError) {
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('error.node.dns'),
                })
            } else if (!nodeInputError && !eventIdError) {
                handleError(err)
            }
        }
    }

    function openNodeAuthRequiredPopup(): void {
        openPopup({
            type: 'nodeAuthRequired',
            props: { onSubmit: registerParticipationWrapper },
        })
    }

    async function registerParticipationWrapper(auth?: Auth): Promise<void> {
        await registerParticipationEvent(eventId, [{ url: nodeUrl, auth }])
        showAppNotification({
            type: 'success',
            message: localize('views.governance.proposals.successAdd'),
            alert: true,
        })
        closePopup()
    }

    async function validateEventId(): Promise<void> {
        const startsWith0x = eventId?.substring(0, 2) === '0x'
        if (!startsWith0x) {
            eventIdError = localize('error.eventId.doesNotStartWith0x')
            return Promise.reject(eventIdError)
        }

        const hexLength = eventId?.substring(2)?.length
        const has64Length = hexLength === 64
        if (!has64Length) {
            eventIdError = localize('error.eventId.insufficientLength')
            return Promise.reject(eventIdError)
        }
    }
</script>

<form id="add-proposal" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h3} classes="mb-6">{localize('popups.addProposal.title')}</Text>
    <Text fontSize="15">{localize('popups.addProposal.body')}</Text>
    <div class="flex flex-col w-full space-y-4 mt-4">
        <TextInput
            bind:value={eventId}
            bind:error={eventIdError}
            placeholder={localize('views.governance.details.proposalInformation.eventId')}
            label={localize('views.governance.details.proposalInformation.eventId')}
        />
        <NodeInput bind:this={nodeInput} bind:nodeUrl bind:error={nodeInputError} />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button type={HTMLButtonType.Submit} {disabled} {isBusy} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
