"use client";

import { useState } from "react";

import { ClientBodyMeasurementDetailPanel } from "@/features/clients/components/detail/client-body-measurement-detail-panel";
import { ClientBodyMeasurementListPanel } from "@/features/clients/components/detail/client-body-measurement-list-panel";
import type { MeasurementFieldKey } from "@/features/clients/lib/measurement-fields";
import type { ClientMeasurement } from "@/features/clients/types/measurement";

export function ClientBodyMeasurementsTab({ measurements }: { measurements: ClientMeasurement[] }) {
  const [selectedKey, setSelectedKey] = useState<MeasurementFieldKey>("weight");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      <ClientBodyMeasurementListPanel selectedKey={selectedKey} onSelect={setSelectedKey} />
      <ClientBodyMeasurementDetailPanel selectedKey={selectedKey} measurements={measurements} />
    </div>
  );
}
