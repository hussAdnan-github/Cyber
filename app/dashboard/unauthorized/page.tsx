export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-20">
      <div className="bg-red-50 text-red-600 p-8 rounded-xl max-w-md text-center border border-red-100 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">غير مصرح لك بالوصول</h1>
        <p className="text-gray-700">
          ليس لديك الصلاحيات الكافية لعرض هذه الصفحة. يرجى التواصل مع مسؤول النظام إذا كنت تعتقد أن هذا خطأ.
        </p>
      </div>
    </div>
  );
}
