import {
    AccountActionsRouter,
    accountActionsRouter,
    AccountSwitcherRouter,
    accountSwitcherRouter,
    ActivityRouter,
    activityRouter,
    appRouter,
    AppRouter,
    AppSetupRouter,
    appSetupRouter,
    dashboardRouter,
    DashboardRouter,
    LoginRouter,
    loginRouter,
    NetworkConfigurationSettingsRouter,
    networkConfigurationSettingsRouter,
    NetworkSetupRouter,
    networkSetupRouter,
    onboardingRouter,
    OnboardingRouter,
    ProfileBackupRouter,
    profileBackupRouter,
    ProfileRecoveryRouter,
    profileRecoveryRouter,
    ProfileRouter,
    profileRouter,
    ProfileSetupRouter,
    profileSetupRouter,
    SendRouter,
    sendRouter,
    ShimmerClaimingRouter,
    shimmerClaimingRouter,
    SettingsRouter,
    settingsRouter,
    storageProtectionSetupRouter,
    StorageProtectionSetupRouter,
    strongholdSetupRouter,
    StrongholdSetupRouter,
    TokenRouter,
    tokenRouter,
} from '../routers'

export function initialiseRouters(): void {
    /**
     * CAUTION: It is important that subrouters are initialized
     * AFTER the base routers, since each subrouter relies on the
     * its parent router's store during construction.
     */
    initialiseBaseRouters()
    initialiseSubrouters()
}

export function initialiseOnboardingRouters(): void {
    initialiseBaseOnboardingRouters()
    initialiseOnboardingSubrouters()
}

function initialiseBaseRouters(): void {
    appRouter.set(new AppRouter())
    initialiseBaseOnboardingRouters()
    initialiseBaseDashboardRouters()
}

function initialiseBaseOnboardingRouters(): void {
    onboardingRouter.set(new OnboardingRouter())
}

function initialiseBaseDashboardRouters(): void {
    dashboardRouter.set(new DashboardRouter())
}

function initialiseSubrouters(): void {
    loginRouter.set(new LoginRouter())
    initialiseOnboardingSubrouters()
    initialiseDashboardSubrouters()
    initialiseSettingsSubrouters()
}

function initialiseOnboardingSubrouters(): void {
    appSetupRouter.set(new AppSetupRouter())
    networkSetupRouter.set(new NetworkSetupRouter())
    strongholdSetupRouter.set(new StrongholdSetupRouter())
    profileBackupRouter.set(new ProfileBackupRouter())
    profileRecoveryRouter.set(new ProfileRecoveryRouter())
    profileSetupRouter.set(new ProfileSetupRouter())
    shimmerClaimingRouter.set(new ShimmerClaimingRouter())
    storageProtectionSetupRouter.set(new StorageProtectionSetupRouter())
}

function initialiseDashboardSubrouters(): void {
    accountSwitcherRouter.set(new AccountSwitcherRouter())
    accountActionsRouter.set(new AccountActionsRouter())
    activityRouter.set(new ActivityRouter())
    sendRouter.set(new SendRouter())
    tokenRouter.set(new TokenRouter())
    profileRouter.set(new ProfileRouter())
    settingsRouter.set(new SettingsRouter())
}

function initialiseSettingsSubrouters(): void {
    networkConfigurationSettingsRouter.set(new NetworkConfigurationSettingsRouter())
}
