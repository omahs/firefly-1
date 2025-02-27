<script lang="ts">
    import Big from 'big.js'
    import { onMount } from 'svelte'

    import { localize, parseCurrency } from '@core/i18n'
    import { IOTA_UNIT_MAP } from '@core/utils'
    import {
        convertToRawAmount,
        formatTokenAmountDefault,
        IAsset,
        ITokenMetadata,
        newTransactionDetails,
        NewTransactionType,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { AmountInput, Button, HR, Text } from '@ui'

    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { getAssetById } from '@core/wallet'
    import { TokenUnitSwapper, TokenWithMax } from '../../../../../components'
    import { sendRouter } from '../../../../../lib/routers'

    let amount: string
    let rawAmount: string
    let asset: IAsset
    let unit: string
    let tokenMetadata: ITokenMetadata

    let error: string = null
    let amountInputElement: HTMLInputElement

    let allowedDecimals = 0
    $: if (!asset?.metadata?.useMetricPrefix) {
        if (unit === asset?.metadata.unit) {
            allowedDecimals = Math.min(asset?.metadata.decimals, 18)
        } else if (unit === asset?.metadata?.subunit) {
            allowedDecimals = 0
        }
    } else if (asset?.metadata?.useMetricPrefix) {
        allowedDecimals = IOTA_UNIT_MAP?.[unit?.substring(0, 1)] ?? 0
    }

    $: bigAmount = convertToRawAmount(amount, asset?.metadata, unit)
    $: (amount, unit), validate()
    $: marketAmount = getMarketAmountFromAssetValue(bigAmount, asset)

    onMount(() => {
        if ($newTransactionDetails?.type === NewTransactionType.TokenTransfer) {
            const storedRawAmount = $newTransactionDetails?.rawAmount
            asset = getAssetById($newTransactionDetails.assetId)
            tokenMetadata = asset?.metadata
            unit = $newTransactionDetails.unit ?? tokenMetadata?.unit
            amount = storedRawAmount
                ? formatTokenAmountDefault(Number(storedRawAmount), asset?.metadata, unit, false)
                : ''
        }
        amountInputElement.focus()
    })

    function validate(allowZeroOrNull = false): void {
        const amountAsFloat = parseCurrency(amount)
        const isAmountZeroOrNull = !Number(amountAsFloat)
        // Zero value transactions can still contain metadata/tags
        if (allowZeroOrNull && isAmountZeroOrNull) {
            error = null
        } else if (isAmountZeroOrNull) {
            error = localize('error.send.amountInvalidFormat')
        } else if (
            (unit === asset?.metadata?.subunit ||
                (unit === asset?.metadata?.unit && asset?.metadata?.decimals === 0)) &&
            Number.parseInt(amount, 10).toString() !== amount
        ) {
            error = localize('error.send.amountNoFloat')
        } else if (bigAmount.gt(Big(asset?.balance?.available))) {
            error = localize('error.send.amountTooHigh')
        } else if (bigAmount.lte(Big(0))) {
            error = localize('error.send.amountZero')
        } else if (!bigAmount.mod(1).eq(Big(0))) {
            error = localize('error.send.amountSmallerThanSubunit')
        } else {
            error = null
        }

        if (!error) {
            rawAmount = bigAmount.toString()
        }
    }

    function toggleUnit(newUnit: string): void {
        unit = newUnit
        amountInputElement.focus()
    }

    function onClickAvailableBalance(): void {
        const isRawAmount = asset?.metadata?.decimals && asset?.metadata?.unit
        if (isRawAmount) {
            const parsedAmount = formatTokenAmountDefault(asset?.balance?.available, asset?.metadata, unit)
            amount = parsedAmount
            unit = asset?.metadata?.unit
            return
        }
        amount = asset?.balance.available.toString() ?? '0'
        unit = asset?.metadata?.unit
    }

    function onContinueClick(): void {
        updateNewTransactionDetails({
            type: $newTransactionDetails.type,
            rawAmount,
            unit,
        })
        $sendRouter.next()
    }
</script>

<div class="w-full overflow-y-auto flex flex-col flex-auto h-1 justify-between">
    <div class="flex-1 flex flex-col space-y-2 items-center justify-center">
        <div class="flex flex-row items-center justify-center relative">
            <div class="flex flex-row items-center space-x-2 px-28" on:click={() => amountInputElement.focus()}>
                <AmountInput
                    bind:inputElement={amountInputElement}
                    bind:amount
                    hasFocus={false}
                    maxDecimals={allowedDecimals}
                    isInteger={allowedDecimals === 0}
                    clearBackground
                    clearPadding
                    clearBorder
                    inputType="number"
                />
                <p class="font-600 text-gray-800 dark:text-white text-24 leading-140">{unit}</p>
            </div>
            <div class="absolute right-0">
                <TokenUnitSwapper {tokenMetadata} selectedUnit={unit} onClick={toggleUnit} />
            </div>
        </div>
        <Text color="gray-600" darkColor="gray-500" fontSize="xs">{formatCurrency(marketAmount) ?? ''}</Text>
    </div>
    <div class="flex flex-col space-y-8 w-full">
        {#if $newTransactionDetails?.type === NewTransactionType.TokenTransfer}
            <HR overrideColor classes="border-gray-200 dark:border-gray-700" />
            <TokenWithMax {asset} onMaxClick={onClickAvailableBalance} />
        {/if}
        <Button onClick={onContinueClick} disabled={!!error} classes="w-full">
            {error ?? localize('actions.continue')}
        </Button>
    </div>
</div>
