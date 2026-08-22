import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { District } from '../../types';

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center); }, [center, map]);
  return null;
}

export default function HotspotMap({ districts, onDistrictSelect }: { districts: District[], onDistrictSelect: (id: number) => void }) {
  const getColor = (tier: string) => {
    if (tier === 'Critical') return '#ef4444';
    if (tier === 'High') return '#f59e0b';
    if (tier === 'Medium') return '#0ea5e9';
    return '#10b981';
  };

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
      <MapContainer center={[19.5, 75.5]} zoom={6} className="w-full h-full" zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {districts.map(d => (
          <CircleMarker
            key={d.id}
            center={[d.latitude, d.longitude]}
            radius={Math.max(5, Math.min(d.complaint_count / 10, 20))}
            pathOptions={{ color: getColor(d.priority_tier), fillColor: getColor(d.priority_tier), fillOpacity: 0.6 }}
            eventHandlers={{ click: () => onDistrictSelect(d.id) }}
          >
            <Popup className="rounded-lg shadow-sm">
              <div className="p-1 min-w-[150px]">
                <h4 className="font-bold text-sm mb-1">{d.name}</h4>
                <p className="text-xs text-slate-600 mb-1">Score: {d.priority_score.toFixed(1)}/100</p>
                <button 
                  onClick={() => onDistrictSelect(d.id)}
                  className="mt-2 w-full text-center text-xs bg-primary text-white py-1 rounded hover:bg-sky-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm border border-slate-200 z-[400] text-xs font-medium space-y-2">
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-redCritical mr-2"/> Critical</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amberAlert mr-2"/> High</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-primary mr-2"/> Medium</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-greenPositive mr-2"/> Low</div>
      </div>
    </div>
  );
}
