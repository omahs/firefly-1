<script lang="ts">
    import { onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileBackupRouter } from '@core/router'
    import { onboardingProfile, resetOnboardingProfileWithAlreadyStoredMnemonic } from '@contexts/onboarding'

    export let busy = false

    function handleContinueClick(): void {
        $profileBackupRouter.next()
    }

    function handleBackClick(): void {
        $profileBackupRouter.previous()
    }

    onMount(() => {
        if ($onboardingProfile?.hasStoredMnemonic) {
            void resetOnboardingProfileWithAlreadyStoredMnemonic()
        }
    })
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileBackup.backupMnemonic.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.onboarding.profileBackup.backupMnemonic.body1')}</Text>
        <Text type="p" secondary classes="mb-4">{localize('views.onboarding.profileBackup.backupMnemonic.body2')}</Text>
        <Text type="p" secondary highlighted classes="mb-4 font-bold"
            >{localize('views.onboarding.profileBackup.backupMnemonic.body3')}</Text
        >
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={handleContinueClick}>{localize('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="backup-desktop" />
    </div>
</OnboardingLayout>
