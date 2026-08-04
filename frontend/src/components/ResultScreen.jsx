import React from 'react'
import OfficeFinder from './OfficeFinder'

export default function ResultScreen({ result, userAnswers, threshold, onCheckAgain }) {
  // Extract district directly from userAnswers passed by App.jsx
  const selectedDistrict = userAnswers?.district || result?.district || ""

  const isEligible = result?.isEligible ?? false

  return (
    <div className="result-screen-container max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 my-6">
      
      {/* 1. Status Banner */}
      <div className={`p-5 rounded-lg text-center mb-6 border ${
        isEligible 
          ? 'bg-green-50 text-green-900 border-green-200' 
          : 'bg-amber-50 text-amber-900 border-amber-200'
      }`}>
        <h2 className="text-2xl font-bold">
          {isEligible ? "Eligible for Default Bail" : "Not Currently Eligible"}
        </h2>
        
        {result?.message && (
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            {result.message}
          </p>
        )}
      </div>

      {/* 2. Office Finder & Map Section (Person 3) */}
      <div className="office-section mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          Nearest Legal Aid Office
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Visit your District Legal Services Authority (DLSA) for free legal support.
        </p>

        {/* Pass the exact district selected by user */}
        <OfficeFinder selectedDistrict={selectedDistrict} />
      </div>

      {/* 3. Check Again Button */}
      {onCheckAgain && (
        <div className="mt-8 text-center">
          <button
            onClick={onCheckAgain}
            className="btn btn-primary px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg shadow-sm transition duration-150"
          >
            Check another case
          </button>
        </div>
      )}
    </div>
  )
}