import { Response } from '@/store/responses'
import ReactJson from 'react-json-view'
import { useState, useEffect } from 'react'
export default function ReadResponse({ response }: { response: Response }) {
  const [responseDisplay, setResponseDisplay] = useState<Response>({});
  useEffect(() => {
    let jsonResult:any = {};
    if (response.result) {
      for (let i = 0; i < response.abi.outputs.length; i++) {
        jsonResult[response.abi.outputs[i].name ? response.abi.outputs[i].name : response.abi.outputs[i].type] = response.result[i];
      }
    }
    setResponseDisplay(jsonResult);
  }, [response]);
  return (
    <div className="hover:bg-muted/60 p-2 rounded">
      <p className="text-primary">
        CALLED TO {response.functionName} at [ChainID={response.chainId} {response.address}]
      </p>
      <pre className="whitespace-pre"><ReactJson src={responseDisplay} /></pre>
    </div>
  )
}
