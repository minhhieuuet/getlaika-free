import { Send } from 'lucide-react'
import { useState } from 'react'
import { Address } from 'viem'
import { mainnet, useContractWrite, useSwitchNetwork } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EVMABIMethod, EVMABIMethodInputsOutputs, EVMABI } from '@/store/collections'
import { useResponseStore } from '@/store/responses'
import { ReloadIcon } from '@radix-ui/react-icons'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'

export default function WriteMethod({
  chainId,
  functionName,
  abi,
  contractAddress,
  generalAbi
}: {
  chainId?: number
  functionName: string
  abi: EVMABIMethod
  contractAddress: Address,
  generalAbi: EVMABI
}) {
  const [args, setArgs] = useState<Array<string>>(new Array(abi.inputs.length).fill(''))
  const [payableValue, setPayableValue] = useState<string>('')

  const { pushResponse } = useResponseStore()

  const { switchNetwork } = useSwitchNetwork()

  const { write, isLoading } = useContractWrite({
    address: contractAddress,
    abi: [abi],
    functionName: functionName,
    args,
    chainId: chainId ? chainId : mainnet.id,
    onSettled(data, error) {
      if (error) {
        return pushResponse({
          type: 'WRITE',
          functionName,
          chainId: chainId ? chainId : mainnet.id,
          address: contractAddress,
          error,
          abi: abi,
          generalAbi: generalAbi
        })
      }

      return pushResponse({
        type: 'WRITE',
        functionName,
        chainId: chainId ? chainId : mainnet.id,
        address: contractAddress,
        txHash: data && data.hash,
        abi: abi,
        generalAbi: generalAbi
      })
    },
  })

  const handleWriteClick = () => {
    if (abi.stateMutability == 'payable' && payableValue) {
      write({
        value: ethers.parseEther(payableValue),
      })
      return
    }
    write()
  }

  const handleSwitchNetwork = () => {
    switchNetwork?.(chainId)
  }

  return (
    <Card className="w-full rounded-none">
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle>{functionName}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form>
          <div className="grid items-center w-full gap-4">
            {abi && abi.stateMutability === 'payable' && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="value">Payable Value</Label>
                <Input
                  id="value"
                  placeholder="Value"
                  onChange={(e) => {
                    setPayableValue(e.target.value)
                  }}
                />
              </div>
            )}
            {abi &&
              abi.inputs &&
              abi.inputs.map((field: EVMABIMethodInputsOutputs, idx: number) => {
                const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                  const newArgs = [...args]
                  newArgs[idx] = event.target.value
                  setArgs(newArgs)
                }
                return (
                  <div key={`${field.type}-${field.name}-${idx}`} className="flex flex-col space-y-1.5">
                    <Label htmlFor={`readInput-${idx}`}>{`${field.type} ${field.name}`}</Label>
                    <Input
                      id={`readInput-${idx}`}
                      placeholder={field.type}
                      value={args[idx] || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                )
              })}
          </div>
        </form>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, mounted }) => {
            const ready = mounted
            const connected = ready && account && chain

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button size="sm" onClick={openConnectModal}>
                        Connect Wallet
                      </Button>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <Button size="sm" onClick={handleSwitchNetwork}>
                        Switch Network
                      </Button>
                    )
                  }

                  return (
                    <Button size="sm" onClick={handleWriteClick}>
                      {isLoading ? (
                        <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Write
                    </Button>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </CardFooter>
    </Card>
  )
}
