import { useWaitForTransaction } from 'wagmi'
import { useEffect } from 'react'

import { Response } from '@/store/responses'
import { Loader } from 'lucide-react'
import {Web3} from 'web3';
import ReactJson from 'react-json-view'

export default function ReadResponse({ response }: { response: Response }) {
  const { data, isLoading } = useWaitForTransaction({ hash: response.txHash })

  const decodeLogs = (logs:any, abi: any) => {
        let web3 = new Web3();
        const events = abi.filter((el) => {
            return el.type == 'event';
        }).map((el) => {
            const topic0 = web3.utils.keccak256(el.name + '(' + el.inputs.map((input) => {
                return input.type;
            }).join(',') + ')');
            return {
                ...el,
                topic0
            }
        });
        return logs.map((log) => {
            const event = events.find((el) => {
                return el.topic0 == log.topics[0];
            });
            if (!event) {
                return {};
            }
            const decoded = web3.eth.abi.decodeLog(
                event.inputs,
                log.data,
                log.topics.slice(1)
            );
            return {
                name: event.name,
                address: log.address,
                ...decoded
            }
        }).filter(log => log.address);
    }

  useEffect(() => {
    if(data) {
      let decodedLogs = decodeLogs(data?.logs, response.generalAbi)
      data.decodedLogs = decodedLogs
    }
  }, [data])

  return (
    <div className="hover:bg-muted/60 p-2 rounded">
      <span className="text-primary flex items-center">
        {isLoading && <Loader className="h-4 w-4 animate-spin" />}
        TRANSACTED TO {response.functionName} at [ChainID={response.chainId} {response.address}]
      </span>
      {response.error ? <p className="text-red-500">Error: {response.error.message}</p> :  <p className="underline">tx: {response.txHash}</p>}
     
      {!isLoading && data && (
        <ReactJson src={data} />
      )}
    </div>
  )
}
