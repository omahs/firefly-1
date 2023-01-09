<script lang="typescript">
    import { MimeType, ParentMimeType } from '@core/nfts'

    export let Media: HTMLImageElement | HTMLVideoElement = undefined
    export let filePath: string
    export let isLoaded: boolean
    export let expectedType: MimeType
    export let classes: string = ''
    export let alt = ''
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false

    const type: string = convertMimeTypeToHtmlTag(expectedType)
    $: isLoaded && muteVideo()

    function muteVideo() {
        if (muted && Media instanceof HTMLVideoElement) {
            Media.muted = true
        }
    }

    function startPlaying() {
        if (!autoplay && Media instanceof HTMLVideoElement) {
            Media.play()
        }
    }

    function stopPlaying() {
        if (!autoplay && Media instanceof HTMLVideoElement) {
            Media.pause()
        }
    }

    function convertMimeTypeToHtmlTag(mimeType: MimeType): string {
        const parentMimeType = mimeType?.split('/', 1)?.[0]
        switch (parentMimeType) {
            case ParentMimeType.Image:
                return 'img'
            case ParentMimeType.Video:
                return 'video'
            default:
                return undefined
        }
    }
</script>

{#key isLoaded}
    <svelte:element
        this={type}
        bind:this={Media}
        src="build/{filePath}"
        {alt}
        autoplay={autoplay ? true : undefined}
        controls={controls ? true : undefined}
        loop={loop ? true : undefined}
        muted
        class={classes}
        preload="metadata"
        on:mouseenter={startPlaying}
        on:mouseleave={stopPlaying}
    />
{/key}
