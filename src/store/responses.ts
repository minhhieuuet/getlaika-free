import { create } from 'zustand'

export interface Response {
  type: 'WRITE' | 'READ'
  functionName: string
  chainId: number
  address: `0x${string}`
  result?: any
  txHash?: `0x${string}`
  error?: Error,
  //@ts-ignore
  abi?: any
}

export const useResponseStore = create<{
  responses: Response[]
  pushResponse: (response: Response) => void
  clearResponses: () => void
}>((set) => ({
  responses: [],
  pushResponse: (response) => set((state) => ({ responses: [...state.responses, response] })),
  clearResponses: () => set(() => ({ responses: [] })),
}))
