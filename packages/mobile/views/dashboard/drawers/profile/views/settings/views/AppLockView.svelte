<script lang="ts">
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { IDropdownChoice } from '@core/utils'
    import { Radio, Text, TextType } from 'shared/components'

    let selectedLockTimeout: number = $activeProfile?.settings?.lockScreenTimeoutInMinutes
    $: selectedLockTimeout, updateActiveProfileSettings({ lockScreenTimeoutInMinutes: selectedLockTimeout })

    function lockScreenTimeoutOptions(): IDropdownChoice[] {
        return [1, 5, 10, 30, 60].map((time) => ({
            value: time,
            label: assignTimeoutOptionLabel(time),
        }))
    }

    function assignTimeoutOptionLabel(timeInMinutes: number): string {
        if (timeInMinutes >= 60) {
            return localize('times.hour', { values: { time: timeInMinutes / 60 } })
        }
        return localize('times.minute', { values: { time: timeInMinutes } })
    }
</script>

<div class="flex flex-col space-y-4 h-full">
    <Text type={TextType.p} secondary>{localize('views.settings.appLock.description')}</Text>
    {#each lockScreenTimeoutOptions() as option}
        <Radio value={option.value} bind:group={selectedLockTimeout} label={option.label} classes="p-2" />
    {/each}
</div>
