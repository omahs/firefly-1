<script lang="ts">
    import { BaseError } from '@core/error'
    import { localize } from '@core/i18n'
    import { setMintTokenDetails, mintTokenDetails } from '@core/wallet'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import {
        Button,
        Error,
        NumberInput,
        Text,
        TextInput,
        OptionalInput,
        FontWeight,
        AliasInput,
    } from 'shared/components'
    import { onMount } from 'svelte'
    import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants/max-supported-decimals.constants'
    import { handleError } from '@core/error/handlers/handleError'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let {
        name: tokenName,
        totalSupply,
        circulatingSupply,
        decimals,
        symbol,
        description,
        url,
        logoUrl,
        aliasId,
    } = $mintTokenDetails

    let nameError: string = ''
    $: tokenName, (nameError = '')
    let totalSupplyError: string
    $: totalSupply, (totalSupplyError = '')
    let circulatingSupplyError: string
    $: circulatingSupply, (circulatingSupplyError = '')
    let symbolError: string
    $: symbol, (symbolError = '')
    let aliasIdError: string
    $: aliasId, (aliasIdError = '')

    let error: BaseError
    let decimalsInput: OptionalInput
    let aliasInput: AliasInput

    function handleCancel(): void {
        closePopup()
    }

    async function handleContinue(): Promise<void> {
        const valid = await validate()
        if (valid) {
            setMintTokenDetails({
                name: tokenName,
                totalSupply,
                circulatingSupply,
                decimals,
                symbol,
                description,
                url,
                logoUrl,
                aliasId,
            })
            openPopup({
                type: 'mintNativeTokenConfirmation',
                overflow: true,
            })
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([
                isNameValid(),
                aliasInput.validate(),
                isTotalSupplyValid(),
                isCirculatingSupplyValid(),
                decimalsInput?.validate(isDecimalsValid()),
                isSymbolValid(),
            ])
            return true
        } catch (err) {
            console.error('Error: ', err)
            return false
        }
    }

    function isNameValid(): Promise<void> {
        if (!tokenName) {
            nameError = 'Name is required'
            return Promise.reject(nameError)
        } else {
            return Promise.resolve()
        }
    }

    function isTotalSupplyValid(): Promise<void> {
        if (totalSupply.toString().length < 1) {
            totalSupplyError = 'Total supply is required'
            return Promise.reject(totalSupplyError)
        } else if (Number(totalSupply) < 1) {
            totalSupplyError = 'Total supply must be greater than 0'
            return Promise.reject(totalSupplyError)
        } else {
            return Promise.resolve()
        }
    }

    function isCirculatingSupplyValid(): Promise<void> {
        if (circulatingSupply.toString().length < 1) {
            circulatingSupplyError = 'Circulating supply is required'
            return Promise.reject(circulatingSupplyError)
        } else if (Number(circulatingSupply) < 1) {
            circulatingSupplyError = 'Circulating supply must be greater than 0'
            return Promise.reject(circulatingSupplyError)
        } else if (Number(circulatingSupply) > Number(totalSupply)) {
            circulatingSupplyError = 'Circulating supply must be less than or equal to the total supply'
            return Promise.reject(circulatingSupplyError)
        } else {
            return Promise.resolve()
        }
    }

    function isDecimalsValid(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (decimals.toString().length < 1) {
                reject('Decimals is required')
            } else if (Number(decimals) < 0) {
                reject('Decimals must be greater than or equal to 0')
            } else {
                resolve()
            }
        })
    }

    function isSymbolValid(): Promise<void> {
        if (!symbol) {
            symbolError = 'Symbol is required'
            return Promise.reject()
        } else {
            return Promise.resolve()
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.nativeToken.formTitle')}
    </Text>

    <div class="space-y-4 max-h-100 scrollable-y flex-1">
        <AliasInput bind:this={aliasInput} bind:alias={aliasId} bind:error={aliasIdError} />
        <TextInput
            bind:value={tokenName}
            label={localize('popups.nativeToken.property.tokenName')}
            placeholder={localize('popups.nativeToken.property.tokenName')}
            error={nameError}
        />
        <TextInput
            bind:value={symbol}
            label={localize('popups.nativeToken.property.symbol')}
            placeholder={localize('popups.nativeToken.property.symbol')}
            maxlength={5}
            error={symbolError}
        />
        <NumberInput
            bind:value={totalSupply}
            isInteger
            label={localize('popups.nativeToken.property.totalSupply')}
            placeholder={localize('popups.nativeToken.property.totalSupply')}
            error={totalSupplyError}
        />
        <NumberInput
            bind:value={circulatingSupply}
            isInteger
            label={localize('popups.nativeToken.property.circulatingSupply')}
            placeholder={localize('popups.nativeToken.property.circulatingSupply')}
            error={circulatingSupplyError}
        />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            <OptionalInput
                bind:this={decimalsInput}
                bind:value={decimals}
                inputType="number"
                isInteger
                maxlength={MAX_SUPPORTED_DECIMALS}
                label={localize('popups.nativeToken.property.decimals')}
                description={localize('tooltips.mintNativeToken.decimals')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={description}
                label={localize('popups.nativeToken.property.description')}
                description={localize('tooltips.mintNativeToken.description')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={url}
                label={localize('popups.nativeToken.property.url')}
                description={localize('tooltips.mintNativeToken.url')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={logoUrl}
                label={localize('popups.nativeToken.property.logoUrl')}
                description={localize('tooltips.mintNativeToken.logoUrl')}
                fontSize="14"
            />
        </optional-inputs>
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" onClick={handleCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={handleContinue}>
            {localize('actions.continue')}
        </Button>
    </div>
</div>
