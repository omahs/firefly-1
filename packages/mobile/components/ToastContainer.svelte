<script lang="ts">
    import { Alert, Toast } from 'shared/components'
    import { notifications } from '@auxiliary/notification'
    import { fade } from 'svelte/transition'

    $: toasts = $notifications.map((notification) => ({
        type: notification.type,
        alert: notification.alert,
        message: notification.message,
        subMessage: notification.subMessage,
        progress: notification.progress,
        actions: notification.actions.map((action, actionIndex) => ({
            ...action,
            onClick: () => action.callback(notification, actionIndex),
        })),
    }))
</script>

{#if toasts?.length > 0}
    <toast-container class="fixed top-0 flex flex-col z-10 w-full p-5">
        <ul class="space-y-2">
            {#each toasts as toast}
                <li in:fade|local={{ duration: 100 }} out:fade|local={{ duration: 100 }}>
                    {#if toast.alert}
                        <Alert type={toast.type} message={toast.message} />
                    {:else}
                        <Toast
                            type={toast.type}
                            message={toast.message}
                            subMessage={toast.subMessage}
                            progress={toast.progress}
                            actions={toast.actions}
                        />
                    {/if}
                </li>
            {/each}
        </ul>
    </toast-container>
{/if}
