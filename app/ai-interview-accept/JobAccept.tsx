import { Button } from '@/components/ui/button'
import React from 'react'
import JobDetailsPage from './JobDetail'

function JobAccept() {
   
  return (
    <div>
          <header className="flex  rounded-lg bg-cyan-50 border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">

              <img
                src="/images/logo/company-logo.png"
                alt="Company Logo"
                className="w-28"
              />

            </div>
            <div className="flex items-center space-x-3">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTipsModal(true)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Quick Tips
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      <JobDetailsPage />
    </div>
  )
}

export default JobAccept