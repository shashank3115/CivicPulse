import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { apiClient } from '../api/client';
import { Complaint, District } from '../types';
import ComplaintTable from '../components/complaints/ComplaintTable';
import ComplaintDetail from '../components/complaints/ComplaintDetail';
import AddComplaintModal from '../components/complaints/AddComplaintModal';

export default function CitizenFeedbackPage({ onDistrictSelect }: { onDistrictSelect: (id: number) => void }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [compRes, distRes] = await Promise.all([
      apiClient.getComplaints(),
      apiClient.getDistricts()
    ]);
    setComplaints(compRes);
    setDistricts(distRes);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-textMain">Citizen Feedback Database</h2>
          <p className="text-sm text-textSecondary">Raw, unfiltered, multilingual reports from citizens.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ingest Report
        </button>
      </div>

      <div className="flex-1 bg-cardBg rounded-xl shadow-sm border border-borderLight overflow-hidden flex flex-col min-h-0">
        <ComplaintTable complaints={complaints} onComplaintClick={setSelectedComplaint} loading={loading} />
      </div>

      {selectedComplaint && (
        <ComplaintDetail complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
      )}

      {isModalOpen && (
        <AddComplaintModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={loadData}
          districts={districts}
        />
      )}
    </div>
  );
}
