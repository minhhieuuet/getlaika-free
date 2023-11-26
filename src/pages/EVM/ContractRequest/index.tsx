import { Allotment, LayoutPriority } from 'allotment'
import { UUID } from 'crypto'
import { X } from 'lucide-react'
import { useMemo } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EVMContract, useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'
import { findItemInCollections } from '@/utils/collections'

import ContractAddress from './ContractAddress'

export default function ContractRequest() {
  const { collections } = useEVMCollectionStore()
  const { tabs, activeTabId, setActiveTab, removeTab, clearTabs } = useEVMTabStore()

  const smartContract = useMemo(() => {
    return findItemInCollections(collections, activeTabId as UUID) as EVMContract
  }, [activeTabId, collections])

  return (
    <Allotment vertical proportionalLayout={false}>
      <Allotment.Pane minSize={48} maxSize={48} priority={LayoutPriority.Low} className="flex">
        {tabs.map((tab) => {
          const found = findItemInCollections(collections, tab)
          if (found === undefined) {
            removeTab(tab)
          }

          const name = found?.name
          const isActive = activeTabId === tab

          return (
            <Button
              key={tab}
              className={cn(
                'h-auto text-secondary-foreground bg-background hover:bg-background rounded-none w-52 justify-between group border-r',
                isActive && 'bg-muted hover:bg-muted',
              )}
              onClick={() => setActiveTab(tab)}
            >
              <small className="py-2 text-sm font-medium leading-none truncate">{name}</small>
              <span
                className={cn(
                  buttonVariants(),
                  'hidden text-secondary-foreground w-8 h-8 p-2 focus-visible:ring-0 group-hover:block bg-background hover:bg-muted',
                  isActive && 'block bg-muted hover:bg-background',
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  removeTab(tab)
                }}
              >
                <X className="w-4 h-4" />
              </span>
            </Button>
          )
        })}
        <Button variant="ghost" className="h-auto rounded-none" onClick={clearTabs}>
          <small className="py-2 text-sm font-medium leading-none truncate">Close All Tabs</small>
        </Button>
      </Allotment.Pane>
      <Allotment.Pane minSize={100} maxSize={100} priority={LayoutPriority.High} className="p-4">
        <ContractAddress id={smartContract?.id} address={smartContract?.contract.address || ''} />
      </Allotment.Pane>
      <Allotment.Pane minSize={0} priority={LayoutPriority.High} className="p-4">
        <div className="flex flex-col"></div>
      </Allotment.Pane>
      <Allotment.Pane minSize={256} preferredSize={256} priority={LayoutPriority.Low} snap>
        {' '}
      </Allotment.Pane>
    </Allotment>
  )
}
