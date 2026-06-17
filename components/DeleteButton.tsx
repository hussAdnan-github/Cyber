"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface DeleteButtonProps {
  endpoint: string;
  id: number | string;
  onSuccess?: () => void;
}

export default function DeleteButton({ endpoint, id, onSuccess }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من أنك تريد حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await api.delete(`${endpoint}${id}/`);
      if (response.data.success || response.status === 204 || response.status === 200) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        alert(response.data.message || "حدث خطأ أثناء الحذف");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error?.message || "حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-1.5 text-red-600 hover:bg-red-50 rounded-md border border-red-100 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="حذف"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
