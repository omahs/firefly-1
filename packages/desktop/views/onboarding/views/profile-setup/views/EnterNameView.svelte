<script lang="ts">
    import { onMount } from 'svelte'
    import { Animation, Button, Input, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { formatProtocolName } from '@core/network'
    import { profiles, validateProfileName } from '@core/profile'
    import {
        OnboardingRoute,
        onboardingRouter,
        profileRecoveryRouter,
        ProfileSetupRoute,
        profileSetupRoute,
        profileSetupRouter,
    } from '@core/router'
    import { onboardingProfile, ProfileSetupType, updateOnboardingProfile } from '@contexts/onboarding'

    let error = ''
    let profileName = $onboardingProfile?.name ?? ''

    $: isProfileNameValid = profileName && profileName.trim()
    $: profileName, (error = '') // Error clears when profileName changes

    function onBackClick(): void {
        if ($onboardingProfile?.recoveryType) {
            updateOnboardingProfile({ type: null, recoveryType: null })
            $onboardingRouter.filterHistory(OnboardingRoute.ProfileRecovery)
            $profileRecoveryRouter.reset()
            profileSetupRoute.set(
                $onboardingProfile?.setupType === ProfileSetupType.Recovered
                    ? ProfileSetupRoute.SetupRecovered
                    : ProfileSetupRoute.SetupClaimed
            )
        } else {
            $profileSetupRouter.previous()
        }
        updateOnboardingProfile({ mustVisitProfileName: true })
    }

    function onContinueClick(): void {
        try {
            validateProfileName(profileName)
            updateOnboardingProfile({ name: profileName })
            $profileSetupRouter.next()
        } catch (err) {
            error = err.message
        }
    }

    onMount(() => {
        updateOnboardingProfile({ mustVisitProfileName: false })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.onboarding.profileSetup.enterName.title', {
                values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.onboarding.profileSetup.enterName.body1')}</Text>
        <Text type="p" secondary classes={$mobile ? 'mb-4' : 'mb-10'}>
            {localize(
                `views.onboarding.profileSetup.enterName.body2.${$profiles?.length === 0 ? 'first' : 'nonFirst'}`
            )}
            {localize('views.onboarding.profileSetup.enterName.addMore')}
        </Text>
        <Input
            {error}
            bind:value={profileName}
            placeholder={localize('views.onboarding.profileSetup.enterName.profileName')}
            classes="w-full mb-6"
            autofocus
            submitHandler={onContinueClick}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-col">
        <Button classes="w-full" disabled={!isProfileNameValid} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="profile-desktop" />
    </div>
</OnboardingLayout>
