<script lang="ts">
    import { localize } from '@core/i18n'
    import { refreshAccountAssetsForActiveProfile } from '@core/wallet'
    import { showAppNotification } from '@auxiliary/notification'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'

    function refreshTokenMetadata(): void {
        refreshAccountAssetsForActiveProfile(true)
        showAppNotification({
            type: 'success',
            message: localize('notifications.refreshTokenMetadata.success'),
            alert: true,
        })
        closePopup()
    }

    function handleRefreshTokenMetadata(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('actions.refreshTokenMetadata'),
                hint: localize('general.refreshTokenMetadataHint'),
                warning: true,
                confirmText: localize('actions.reset'),
                onConfirm: refreshTokenMetadata,
            },
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.refreshTokenMetadata')}
    secondaryText={localize('general.refreshTokenMetadataDescription')}
    onClick={handleRefreshTokenMetadata}
/>
