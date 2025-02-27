<script lang="ts">
    import { onMount } from 'svelte'
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        OnboardingRoute,
        onboardingRoute,
        profileRecoveryRouter,
        ProfileSetupRoute,
        profileSetupRoute,
    } from '@core/router'
    import { updateOnboardingProfile } from '@contexts/onboarding'

    function onContinueClick(): void {
        $profileRecoveryRouter.next()
    }

    function onBackClick(): void {
        $profileRecoveryRouter.reset()
        profileSetupRoute.set(ProfileSetupRoute.SetupRecovered)
        onboardingRoute.set(OnboardingRoute.ProfileSetup)
    }

    onMount(() => {
        updateOnboardingProfile({ hasInitialisedProfileManager: true })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="leftpane__content">
        <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5 pt-10 relative">
            <div class="flex items-center justify-center bg-green-500 rounded-2xl absolute -top-5 w-12 h-12 check-glow">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type="h2" classes="mb-5 text-center"
                >{localize('views.onboarding.profileRecovery.success.title')}</Text
            >
            <Text type="p" secondary classes="mb-2">{localize('views.onboarding.profileRecovery.success.body')}</Text>
        </div>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={onContinueClick}>{localize('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="success-desktop" />
    </div>
</OnboardingLayout>

<style type="text/scss">
    .check-glow {
        box-shadow: 0px 4px 8px rgba(97, 232, 132, 0.3); // shadow-color only available in tailwind v3 and theme color is not accepted by the rgba sass function
    }
</style>
