import { Response } from '@/store/responses'
import ReactJson from 'react-json-view'
import { useState, useEffect } from 'react'
export default function ReadResponse({ response }: { response: Response}) {
  const [responseDisplay, setResponseDisplay] = useState()
  useEffect(() => {
    // clearResponses()
    if(typeof response?.result == 'bigint') {
      response.result = {
        value: response.result.toString(),
      }
    }
    if (response.result) {
      if (typeof response.result == 'number' || typeof response.result == 'bigint') {
        response.result = {
          value: response.result.toString(),
        }
      }
      setResponseDisplay(response.result)
    }
  }, [response])
  return (
    <div className="hover:bg-muted/60 p-2 rounded">
      <p className="text-primary">
        CALLED TO {response.functionName} at [ChainID={response.chainId} {response.address}]
      </p>
      <pre className="whitespace-pre">
        <ReactJson src={responseDisplay ? responseDisplay : {}} />
      </pre>
    </div>
  )
}
