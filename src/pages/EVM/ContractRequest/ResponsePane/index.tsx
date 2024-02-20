import { Button } from '@/components/ui/button'

import { useResponseStore } from '@/store/responses'

import ReadResponse from './ReadResponse'
import WriteResponse from './WriteResponse'

export default function ResponsePane() {
  const { responses, clearResponses } = useResponseStore()

  return (
    <div className="h-full rounded-lg p-4 text-sm font-mono">
      <div className="flex justify-between items-center mb-2">
        <div className="text-md underline">Response</div>
        <Button variant="outline" onClick={clearResponses}>
          Clear
        </Button>
      </div>
      <div className="h-full overflow-y-auto">
        {responses.length === 0 && <div className="text-center text-gray-500">No responses to display.</div>}
        {responses.map((response) => {
          switch (response.type) {
            case 'READ':
              return <ReadResponse response={response} clearResponses={clearResponses}/>
            case 'WRITE':
              return <WriteResponse response={response} />
            default:
              return <></>
          }
        })}
      </div>
    </div>
  )
}
