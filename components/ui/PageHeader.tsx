import Link from "next/link";
import { Plus } from "lucide-react";
import React from "react";
import Can from "../auth/Can";

interface PageHeaderProps {
  title: string;
  description: string;
  addLink?: string;
  addLabel?: string;
  addButtonClassName?: string;
  addButtonIcon?: React.ReactNode;
  extraActions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string; active?: boolean }[];
  can?: string;
}

export default function PageHeader({ 
  title, 
  description, 
  addLink, 
  addLabel, 
  addButtonClassName = "bg-[#0f172a] hover:bg-gray-800 text-white",
  addButtonIcon,
  extraActions,
  breadcrumbs ,
  can
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="text-right flex items-center gap-2">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span className={`${crumb.active ? "text-primary font-bold" : ""}`}>
                    {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                  </span>
                  {index < breadcrumbs.length - 1 && <span>&lt;</span>}
                </React.Fragment>
              ))}
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        {extraActions}
        {addLink && addLabel && (
          <Can permission={can}>
          <Link href={addLink} className={`${addButtonClassName} px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center`}>
            {addLabel}
            {addButtonIcon ? addButtonIcon : <Plus className="w-4 h-4 ml-2" />}
          </Link>
          </Can>
        )}
      </div>
    </div>
  );
}
