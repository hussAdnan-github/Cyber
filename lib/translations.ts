export const fieldTranslations: Record<string, string> = {
  id: "المعرف",
  username: "اسم المستخدم",
  email: "البريد الإلكتروني",
  first_name: "الاسم الأول",
  last_name: "الاسم الأخير",
  is_active: "نشط",
  is_staff: "حالة النطاق (Staff)",
  is_superuser: "مستخدم خارق",
  name: "الاسم",
  title: "العنوان",
  description: "الوصف",
  created_at: "تاريخ الإنشاء",
  updated_at: "تاريخ التحديث",
  phone: "رقم الهاتف",
  phone_number: "رقم الهاتف",
  address: "العنوان",
  city: "المدينة",
  country: "البلد",
  status: "الحالة",
  type: "النوع",
  role: "الدور",
  permissions: "الصلاحيات",
  groups: "المجموعات",
  nationality: "الجنسية",
  passport_number: "رقم الجواز",
  id_number: "رقم الهوية",
  number_id: "رقم الهوية",
  date_of_birth: "تاريخ الميلاد",
  gender: "الجنس",
  company_name: "اسم الشركة",
  line_name: "اسم الخط",
  trip_number: "رقم الرحلة",
  departure_time: "وقت المغادرة",
  arrival_time: "وقت الوصول",
  origin: "نقطة الانطلاق",
  destination: "الوجهة",
  price: "السعر",
  notes: "ملاحظات",
  center_name: "اسم المركز",
  place_name: "اسم المكان",
  owner_name: "اسم المالك",
  document_type: "نوع الوثيقة",
  reason: "السبب",
  date_added: "تاريخ الإضافة",
  evaluation: "التقييم",
  name_hotel: "اسم الفندق",
  name_person: "اسم النزيل",
  company: "الشركة",
  line: "الخط",
  // additional common fields
  image: "الصورة",
  file: "الملف",
  url: "الرابط",
  is_deleted: "محذوف",
  ip_address: "عنوان الـ IP",
  user_agent: "متصفح المستخدم",
  action: "الإجراء",
  target: "الهدف",
  details: "التفاصيل"
};

export function translateField(key: string): string {
  // Try to find the exact key, if not found try to format it a bit
  const lowered = key.toLowerCase();
  if (fieldTranslations[lowered]) {
    return fieldTranslations[lowered];
  }
  
  // Replace underscores with spaces and capitalize
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
