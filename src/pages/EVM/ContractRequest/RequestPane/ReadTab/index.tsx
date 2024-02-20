import { useMemo, useState } from 'react'
import { Address } from 'viem'

import { EVMABIMethod, EVMContract } from '@/store/collections'

import ReadMethod from './ReadMethod'
import { Input } from '@/components/ui/input'

export default function ReadTab({ smartContract }: { smartContract: EVMContract }) {
  const [searchKey, setSearchKey] = useState('')
  const readableMethods = useMemo(() => {
    const address = smartContract.contract?.address as Address
    const methods: EVMABIMethod[] = smartContract.contract?.abi && JSON.parse(smartContract.contract.abi)
    if (!address || !methods) {
      return []
    }
    const infoMethods = methods.filter(
      (method) => method.inputs?.length > 0 && (method.stateMutability === 'view' || method.stateMutability === 'pure'),
    )

    return infoMethods
      .filter((method) => method.name.toLowerCase().includes(searchKey))
      .map((method) => {
        return {
          address,
          abi: infoMethods.filter((method) => method.name.toLowerCase().includes(searchKey)),
          functionName: method.name,
        }
      })
  }, [smartContract.contract.abi, smartContract.contract.address, searchKey])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase()
    setSearchKey(search)
  }

  return (
    <div className="flex flex-col w-full gap-2">
      {readableMethods.length === 0 && (
        <div className="text-center underline my-2">
          <p>No readable methods found for this contract.</p>
          <p>Please use another tab to interact with the contract.</p>
        </div>
      )}
      <Input placeholder="Search here" style={{ width: '300px', marginLeft: '5px' }} onChange={handleSearch}></Input>
      {readableMethods.map((method, idx) => {
        return (
          <ReadMethod
            key={searchKey + method.functionName + idx}
            chainId={smartContract.chainId}
            contractAddress={method.address}
            functionName={method.functionName}
            abi={method.abi[idx]}
          />
        )
      })}
    </div>
  )
}
