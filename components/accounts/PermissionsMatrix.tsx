"use client";

import React, { useMemo } from 'react';

export interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

interface PermissionsMatrixProps {
  permissions: Permission[];
  selectedIds: number[];
  onChange?: (selectedIds: number[]) => void;
  readOnly?: boolean;
}

const CONTENT_TYPE_MAP: Record<number, string> = {
  1: "سجل التدقيق (Audit Logs)",
  2: "الأدوار (Roles)",
  3: "الصلاحيات (Permissions)",
  4: "الحسابات (Accounts)",
  5: "أنواع المحتوى (Content Types)",
  6: "الجلسات (Sessions)",
  7: "التوكن (Token)",
  8: "توكن بروكسي (Token Proxy)",
  9: "القائمة السوداء (Blacklist)",
  10: "المراكز الأمنية (Security Centers)",
  11: "المستندات (Documents)",
  12: "الجنسيات (Nationalities)",
  13: "الملاك (Owners)",
  14: "الأماكن (Places)",
  15: "المرافقون (Companions)",
  16: "الفنادق (Hotels)",
  17: "الضيوف (Guests)",
  18: "خطوط السفر (Travel Lines)",
  19: "شركات السفر (Travel Companies)",
  20: "المسافرون (Travelers)",
  21: "الرحلات (Trips)",
  22: "الإشعارات (Notifications)",
};

// Toggle switch component for nice styling
function ToggleSwitch({ 
  checked, 
  onChange, 
  disabled = false 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`relative inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );
}

export default function PermissionsMatrix({ permissions, selectedIds, onChange, readOnly = false }: PermissionsMatrixProps) {
  // IDs of content types to exclude from the matrix
  const EXCLUDED_CONTENT_TYPES = [1, 5, 6, 7, 8];

  // Group permissions by content_type
  const groupedData = useMemo(() => {
    const groups: Record<number, {
      name: string;
      permissions: {
        view?: Permission;
        add?: Permission;
        change?: Permission;
        delete?: Permission;
        other: Permission[];
      };
    }> = {};

    permissions.forEach(p => {
      const cId = p.content_type;
      
      // Skip excluded content types
      if (EXCLUDED_CONTENT_TYPES.includes(cId)) return;

      if (!groups[cId]) {
        groups[cId] = {
          name: CONTENT_TYPE_MAP[cId] || `قسم ${cId}`,
          permissions: { other: [] }
        };
      }

      const codename = p.codename.toLowerCase();
      if (codename.startsWith('view_')) {
        groups[cId].permissions.view = p;
      } else if (codename.startsWith('add_')) {
        groups[cId].permissions.add = p;
      } else if (codename.startsWith('change_')) {
        groups[cId].permissions.change = p;
      } else if (codename.startsWith('delete_')) {
        groups[cId].permissions.delete = p;
      } else {
        groups[cId].permissions.other.push(p);
      }
    });

    // Convert to array and sort (maybe sort by ID or keep original order)
    return Object.entries(groups)
      .map(([id, data]) => ({ id: Number(id), ...data }))
      .sort((a, b) => a.id - b.id);
  }, [permissions]);

  const handleToggle = (permId: number, checked: boolean) => {
    if (readOnly || !onChange) return;
    if (checked) {
      onChange([...selectedIds, permId]);
    } else {
      onChange(selectedIds.filter(id => id !== permId));
    }
  };

  const handleToggleRow = (rowPerms: (Permission | undefined)[], checked: boolean) => {
    if (readOnly || !onChange) return;
    const validIds = rowPerms.filter(Boolean).map(p => p!.id);
    if (checked) {
      const newIds = new Set([...selectedIds, ...validIds]);
      onChange(Array.from(newIds));
    } else {
      onChange(selectedIds.filter(id => !validIds.includes(id)));
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">القسم / الوحدة</th>
              <th className="px-6 py-4 text-center">عرض</th>
              <th className="px-6 py-4 text-center">إضافة</th>
              <th className="px-6 py-4 text-center">تعديل</th>
              <th className="px-6 py-4 text-center">حذف</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {groupedData.map(group => {
              const { view, add, change, delete: del } = group.permissions;
              const rowPerms = [view, add, change, del];
              const availablePermsCount = rowPerms.filter(Boolean).length;
              if (availablePermsCount === 0) return null; // hide if no standard actions
              
              const isAllChecked = rowPerms.filter(Boolean).every(p => selectedIds.includes(p!.id));

              return (
                <tr key={group.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800 border-l border-gray-50">
                    <div className="flex items-center gap-3">
                      {!readOnly && (
                        <ToggleSwitch 
                          checked={isAllChecked} 
                          onChange={(c) => handleToggleRow(rowPerms, c)}
                          disabled={readOnly}
                        />
                      )}
                      {group.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {view ? (
                      <ToggleSwitch 
                        checked={selectedIds.includes(view.id)} 
                        onChange={(c) => handleToggle(view.id, c)} 
                        disabled={readOnly}
                      />
                    ) : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {add ? (
                      <ToggleSwitch 
                        checked={selectedIds.includes(add.id)} 
                        onChange={(c) => handleToggle(add.id, c)} 
                        disabled={readOnly}
                      />
                    ) : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {change ? (
                      <ToggleSwitch 
                        checked={selectedIds.includes(change.id)} 
                        onChange={(c) => handleToggle(change.id, c)} 
                        disabled={readOnly}
                      />
                    ) : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {del ? (
                      <ToggleSwitch 
                        checked={selectedIds.includes(del.id)} 
                        onChange={(c) => handleToggle(del.id, c)} 
                        disabled={readOnly}
                      />
                    ) : <span className="text-gray-300">-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
